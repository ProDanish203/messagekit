import {
    telegramMessageOptionsSchema,
    telegramSendMessageRequestSchema,
    telegramSendMessageResponseSchema,
    telegramMessageOutputSchema,
    type TelegramMessageInput,
    type TelegramMessageOutput
} from './schemas';

export async function sendTelegramMessage(input: TelegramMessageInput): Promise<TelegramMessageOutput> {
    const parsedInput = telegramMessageOptionsSchema.parse(input);
    const request = telegramSendMessageRequestSchema.parse({
        chat_id: parsedInput.chatId,
        text: parsedInput.message
    });
    const response = await fetch(`https://api.telegram.org/bot${parsedInput.botToken}/sendMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: await Response.json(request).text()
    });

    const data = telegramSendMessageResponseSchema.parse(await response.json());

    if (!response.ok || !data.ok || !data.result)
        throw new Error(`Failed to send Telegram message: ${data.description ?? response.statusText}`);

    return telegramMessageOutputSchema.parse({
        ok: true,
        chatId: parsedInput.chatId,
        messageId: data.result.message_id
    });
}

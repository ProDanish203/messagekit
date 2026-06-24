import { Command } from 'commander';

type TelegramResponse = {
    ok: boolean;
    result?: {
        message_id?: number;
    };
    description?: string;
};

const program = new Command();

program
    .name('messagekit')
    .description('A CLI for MessageKit')
    .command('telegram')
    .description('Send a telegram message')
    .argument('<chatId>', 'The chat id to send the message to')
    .argument('<message>', 'The message to send')
    .action(async (chatId: string, message: string) => {
        const token = process.env.TELEGRAM_BOT_TOKEN;
        if (!token) {
            console.error('TELEGRAM_BOT_TOKEN is not set');
            process.exit(1);
        }

        if (!chatId) {
            console.error('Chat ID is required');
            process.exit(1);
        }
        if (!message) {
            console.error('Message is required');
            process.exit(1);
        }

        const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ chat_id: chatId, text: message })
        });
        const data: TelegramResponse = await response.json();
        if (!data.ok) {
            const detail = data.description ?? response.statusText;
            console.error(`Telegram API failed: ${detail}`);
            process.exit(1);
        }
        console.log(`Message sent successfully to chat ${chatId} with message ID: ${data.result?.message_id}`);
        process.exit(0);
    });

program.parseAsync(process.argv);

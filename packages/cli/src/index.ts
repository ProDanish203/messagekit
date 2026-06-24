import { Command } from 'commander';
import { sendTelegramMessage } from 'messagekit-core';

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

        try {
            const response = await sendTelegramMessage({
                chatId,
                message,
                botToken: token
            });
            console.log(`Message sent successfully to chat ${chatId} with message ID: ${response.messageId}`);
            process.exit(0);
        } catch (error) {
            const detail = error instanceof Error ? error.message : String(error);
            console.error(`Telegram API failed: ${detail}`);
            process.exit(1);
        }
    });

program.parseAsync(process.argv);

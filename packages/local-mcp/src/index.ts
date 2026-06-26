import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { sendTelegramMessage, telegramMessageInputSchema } from 'messagekit-core';

const server = new McpServer({
    name: 'messagekit-local',
    version: '0.0.0',
    description: 'A local MCP server for MessageKit'
});

function getTelegramBotToken(): string {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
        throw new Error('TELEGRAM_BOT_TOKEN is not set. Configure it in your MCP Client environment.');
    }
    return token;
}

server.registerTool(
    'telegram',
    {
        title: 'Telegram',
        description: 'Send a message to a Telegram chat',
        inputSchema: telegramMessageInputSchema.shape
    },
    async input => {
        const parsedInput = telegramMessageInputSchema.parse(input);
        const response = await sendTelegramMessage({
            chatId: parsedInput.chatId,
            message: parsedInput.message,
            botToken: getTelegramBotToken()
        });
        return {
            content: [
                {
                    type: 'text',
                    text: `Message sent successfully to chat ${parsedInput.chatId} with message ID: ${response.messageId}`
                }
            ],
            structuredContent: response
        };
    }
);

const transport = new StdioServerTransport();
await server.connect(transport);

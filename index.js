import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import WebSocket from "ws";

dotenv.config();

const { DISCORD_TOKEN, CHANNEL_ID, ROOM_ID, WS_URL } = process.env;

// Discord client setup
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
});

// WebSocket connection
let ws;

function connectWebSocket() {
    ws = new WebSocket(WS_URL);

    ws.on("open", () => {
        console.log("==[ Connected to Websocket ]==");
        // Send register message
        console.log("Registering to room `" + ROOM_ID + "`");
        ws.send(JSON.stringify({ type: "register", roomId: ROOM_ID }));
    });

    ws.on("message", async (data) => {
        try {
            const msg = JSON.parse(data);

            if (msg.type === "pong") {
            } else if (msg.type === "registered") {
                console.log("Registered to room");
            } else if (msg.type === "chat") {
                if (msg.sender === "discord") return; // Ignore messages from Discord
                const channel = await client.channels.fetch(CHANNEL_ID);
                if (channel) {
                    channel.send(`**${msg.player}:** ${msg.message}`);
                }
            }
            
            else if (msg.type === "mc_dead") {
                const channel = await client.channels.fetch(CHANNEL_ID);
                if (channel) {
                    channel.send(`💀 **${msg.player}** died > ${msg.reason}`);
                }
            }  else if (msg.type === "mc_join") {
                const channel = await client.channels.fetch(CHANNEL_ID);
                if (channel) {
                    channel.send(`➡️ **${msg.player}** joined the game.`);
                }
            } else if (msg.type === "mc_quit") {
                const channel = await client.channels.fetch(CHANNEL_ID);
                if (channel) {
                    channel.send(`⬅️ **${msg.player}** left the game.`);
                }
            } else {
                const channel = await client.channels.fetch(CHANNEL_ID);
                if (channel) {
                    channel.send(`⚠️ Unknown message type received: \`${msg.type}\``);
                }
            }
            
        } catch (err) {
            console.error("Error handling WebSocket message:", err);
        }
    });

    ws.on("close", () => {
        console.log("❌ WebSocket disconnected. Reconnecting in 5s...");
        setTimeout(connectWebSocket, 5000);
    });

    ws.on("error", (err) => {
        console.error("⚠️ WebSocket error:", err.message);
    });
}

client.on("clientReady", () => {
    console.log(`Logged in as ${client.user.tag}`);
    console.log("Bot started");
    connectWebSocket();
});

client.on("messageCreate", (message) => {
    if (message.author.bot) return;
    if (message.channel.id !== CHANNEL_ID) return;

    if (ws && ws.readyState === WebSocket.OPEN) {
        if (message.content.length > 256) {
            message.reply("Message too long! Max length is 256 characters.");
            return;
        }

        let content = message.content;
        let isReply = (message.type == 19 && message.reference);
        let reply = null;
        if (isReply) {
            reply = {
                messageId: message.reference.messageId,
                channelId: message.reference.channelId,
                guildId: message.reference.guildId
            };
            reply.content = client.channels.cache.get(reply.channelId).messages.cache.get(reply.messageId)?.content;
            if (reply.content && reply.content.length > 30) {
                reply.content = reply.content.substring(0, 30) + "...";
            }
        }

        if (isReply && reply && reply.content) {
            ws.send(JSON.stringify({
                serverId: message.guildId,
                sender: 'discord',
                type: 'chat_reply',
                player: message.author.globalName,
                original: reply.content,
                message: content
            }));
        } else {
            ws.send(JSON.stringify({
                serverId: message.guildId,
                sender: 'discord',
                type: 'chat',
                player: message.author.globalName,
                message: content
            }));
        }

    }
});

client.login(DISCORD_TOKEN);

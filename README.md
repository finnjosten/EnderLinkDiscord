# EnderLink Discord Bot
The **messenger** that powers EnderLink’s connection between **Minecraft** and **Discord**.  
This bot connects to the [EnderLink WebSocket](https://github.com/finnjosten/EnderLinkWebsocket) and relays chat and event data between platforms in real time.

---

## ✅ Supported Environment
- **Node.js:** Latest LTS version recommended  
- **NPM:** Comes bundled with Node.js  
- Works on Linux, macOS, Windows, or a Pterodactyl server.

**Do not:**
- Use this bot without understanding how to securely store your bot token.  
- Share the `.env` file or bot token with anyone.  
- Skip the WebSocket step if you use your own WS, this bot **requires** a running EnderLink WebSocket to function.

---

## 💡 What It Does
The Discord bot listens to messages from both **Minecraft** (via the WebSocket) and **Discord**.  
It then relays them back and forth in real time:
```
Minecraft → WebSocket → Discord Bot → Discord Channel
Discord Channel → Discord Bot → WebSocket → Minecraft
```

---

## 🔧 Requirements
You’ll need:
- A **Discord Bot** created in the [Discord Developer Portal](https://discord.com/developers/applications)  
- [Git](https://git-scm.com/) for cloning the repository  
- [Node.js](https://nodejs.org/) and NPM for installing dependencies  

---

## 🛠️ Setup Guide
1. **Create a Discord Bot**  
   - Go to the [Discord Developer Portal](https://discord.com/developers/applications).  
   - Click **New Application** → name it → create.  
   - Under **Bot** → click **Add Bot**.  
   - Copy the **Bot Token** (you’ll use this in the `.env` file).  
   - Under **OAuth2 → URL Generator**, select:
     - **bot** (Scopes)
     - **Send Messages**, **Read Messages/View Channels**, and any other needed permissions.
   - Copy the generated URL and invite the bot to your Discord server.

2. **Clone the Repository**  
   ```
   git clone https://github.com/finnjosten/EnderLinkDiscord.git
   cd EnderLinkDiscord
   ```

3. **Install Dependencies**  
   ```
   npm install
   ```

4. **Configure the Bot**  
   - Copy the example environment file:
     ```
     cp example.env .env
     ```
   - Open `.env` and fill in:
     ```
     DISCORD_TOKEN=<your Discord bot token>
     CHANNEL_ID=<Discord channel ID>
     ROOM_ID=<your room-id from the Minecraft plugin>
     ROOM_SECRET=<your room-secret from the Minecraft plugin>
     WS_URL=<URL of your WebSocket server>
     ```

5. **Start the Bot**  
   ```
   npm run dev
   ```
   The bot will now connect to the WebSocket and your Discord server.

6. **(Optional but suggested) Run with PM2**  
   - Install PM2  
     ```
     npm install -g pm2
     ```
   - Start the bot  
     ```
     pm2 start index.js --name EnderLinkBot
     ```
   - Useful PM2 commands:  
     ```
     pm2 stop EnderLinkBot
     pm2 logs EnderLinkBot
     pm2 restart EnderLinkBot
     pm2 save
     ```

---

## 🎯 Tips
- Keep the bot running in the background using **PM2** or a systemd service for production environments.  
- Never commit your `.env` file or bot token to public repositories.

---

## 🎉 Done!
Your EnderLink Discord Bot is now online and ready to relay messages between Minecraft and Discord.  

Other setups:
- Plugin [finnjosten/EnderLink](https://github.com/finnjosten/EnderLink/blob/main/README.md)  
- WebSocket [finnjosten/EnderLinkWebsocket](https://github.com/finnjosten/EnderLinkWebsocket/blob/main/README.md)

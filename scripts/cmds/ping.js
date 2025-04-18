const axios = require("axios");

module.exports = {
  config: {
    name: "ping",
    aliases: ["speed"],
    version: "1.0",
    author: "ayanfe",
    countDown: 5,
    role: 0,
    shortDescription: "Check bot speed",
    longDescription: "Measures bot response time and shows it in a beautiful format.",
    category: "utility",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ message, event, api }) {
    const start = Date.now();

    const imageURL = "https://files.catbox.moe/06kqsu.jpg";

    // Load image
    let attachment;
    try {
      const img = await axios.get(imageURL, { responseType: "stream" });
      attachment = img.data;
    } catch (err) {
      console.error("Image failed to load:", err.message);
    }

    const latency = Date.now() - start;
    const speedMessage = `🛰️ • P O N G !
━━━━━━━━━━━━━━
⚡ Response time: ${latency}ms
⏱️ Uptime: ${Math.floor(process.uptime())}s
🧠 Bot: GoatBot v2
🔧 Status: Online & Responsive
━━━━━━━━━━━━━━`;

    // Ensure message formatting and handling are correct
    return message.reply(
      {
        body: speedMessage,
        attachment: attachment || undefined,
      },
      (err) => {
        if (err) {
          console.error("Error sending ping response:", err.message);
          message.reply("❌ Failed to send ping response. Please try again later.");
        }
      }
    );
  }
}

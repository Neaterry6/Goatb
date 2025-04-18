const axios = require("axios");

module.exports = {
  config: {
    name: "uptime",
    aliases: ["up", "ontime"],
    version: "1.1",
    author: "ayanfe",
    role: 0,
    shortDescription: "Show bot uptime",
    longDescription: "Displays how long the bot has been running since last start, with a beautiful floral design.",
    category: "utility",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ message }) {
    const time = process.uptime();
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    const uptime = `🌸 BOT UPTIME 🌸
━━━━━━━━━━━━━━━━━━
⏰ Uptime: ${hours}h ${minutes}m ${seconds}s
🌼 Status: Online & Blooming
🌺 Powered by: GoatBot v2
━━━━━━━━━━━━━━━━━━`;

    const imageURL = "https://files.catbox.moe/06kqsu.jpg"; // Replace with your preferred image URL

    let attachment = null;
    try {
      const img = await axios.get(imageURL, { responseType: "stream" });
      attachment = img.data;
    } catch (error) {
      console.error("Failed to load image:", error.message);
    }

    return message.reply({
      body: uptime,
      attachment: attachment || undefined // Send image only if successfully loaded
    });
  }
};

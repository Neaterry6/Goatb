const os = require("os");
const pidusage = require("pidusage");
const axios = require("axios");

module.exports = {
  config: {
    name: "stats",
    aliases: ["system", "botinfo"],
    version: "1.1",
    author: "ayanfe",
    countDown: 5,
    role: 0,
    shortDescription: "Show system statistics",
    longDescription: "Displays bot memory, CPU, uptime, and environment details.",
    category: "utility",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ message }) {
    try {
      const uptime = process.uptime();
      const formatUptime = (s) => {
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = Math.floor(s % 60);
        return `${h}h ${m}m ${sec}s`;
      };

      const memoryUsage = process.memoryUsage();
      const totalMem = (os.totalmem() / 1024 / 1024).toFixed(2);
      const usedMem = (memoryUsage.rss / 1024 / 1024).toFixed(2);
      const platform = os.platform();
      const cpuModel = os.cpus()[0].model;
      const cpuCores = os.cpus().length;

      const stats = await pidusage(process.pid);
      const cpu = stats.cpu.toFixed(2);
      const ram = (stats.memory / 1024 / 1024).toFixed(2);

      const imageURL = "https://files.catbox.moe/06kqsu.jpg"; // Optional: custom banner

      let attachment = null;
      try {
        const img = await axios.get(imageURL, { responseType: "stream" });
        attachment = img.data;
      } catch (e) {
        console.error("Couldn't load image:", e.message);
      }

      const msg = `📊 BOT STATISTICS
━━━━━━━━━━━━━━━━━━
🖥 Platform: ${platform}
🔋 Uptime: ${formatUptime(uptime)}
🧠 RAM: ${ram}MB / ${totalMem}MB
⚙ CPU: ${cpuModel} (${cpuCores} cores)
🚀 CPU Usage: ${cpu}%
📁 Node.js: ${process.version}
👑 Powered by: GoatBot v2
━━━━━━━━━━━━━━━━━━`;

      return message.reply({
        body: msg,
        attachment: attachment || undefined // Send the image only if it's available
      });
    } catch (error) {
      console.error("Error retrieving bot statistics:", error.message);
      message.reply("❌ Failed to retrieve bot statistics. Please try again later.");
    }
  }
};

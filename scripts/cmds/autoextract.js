const axios = require("axios");

module.exports = {
  config: {
    name: "autoextract",
    version: "2.0.0",
    author: "Kylepogi",
    countDown: 5,
    role: 0,
    shortDescription: "autoextract",
    longDescription: "automatically extract file cmd, pastebin,vercel, etc....",
    category: "Auto-extract file cmds",
    guide: {
      en: "automatically extract pastebin file etc",
    },
  },
  onStart: async function ({ api, event, args }) {
  },
  onChat: async function ({ api, event, args }) {
    if (args.length !== 1) {
      return; 
    }
    const url = args[0];
    try {
      const response = await axios.get(url);
      api.sendMessage("Response from Axios:", response.data); 
      api.sendMessage(response.data, event.threadID);
    } catch (error) {
      api.sendMessage("Error fetching content:", error.message);
    }
  },
}

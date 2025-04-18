const axios = require("axios");

module.exports = {
  config: {
    name: "waifu",
    version: "1.1.1",
    author: "Ayanfe",
    description: "Fetch a random waifu image",
    category: "fun",
    guide: {
      en: "{pn}"
    },
    usages: "/waifu",
    cooldowns: 5,
    dependencies: {
      axios: ""
    }
  },

  onStart: async function ({ message }) {
    try {
      // Fetch waifu image from API
      const response = await axios.get("https://kaiz-apis.gleeze.com/api/waifu");

      // Check if the response is valid and contains an image URL
      const waifuData = response.data;
      if (!waifuData || !waifuData.imageUrl) {
        return message.reply("❌ Unable to fetch a waifu image at the moment. Please try again later.");
      }

      // Send the waifu image to the user
      await message.reply({
        body: "✨ Here's your random waifu image! Enjoy~",
        attachment: await axios({
          url: waifuData.imageUrl,
          method: "GET",
          responseType: "stream"
        }).then(res => res.data)
      });
    } catch (error) {
      console.error("Error fetching waifu image:", error.message);
      message.reply("❌ *Oops!* Something went wrong while fetching the waifu image. Please try again later.");
    }
  }
};

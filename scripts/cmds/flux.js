const axios = require("axios");

async function generateImage(prompt) {
  try {
    const response = await axios({
      method: "get",
      url: `https://bk9.fun/ai/magicstudio`,
      params: {
        prompt: prompt,
      },
      responseType: "stream",
    });
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response ? error.response.data : error.message);
    throw new Error("Failed to connect to the image generation API. Please try again later.");
  }
}

module.exports = {
  config: {
    name: "vgen",
    aliases: ["fl"],
    version: "1.0",
    author: "AYANFE",
    longDescription: {
      en: "Generate images using the Magic Studio API.",
    },
    category: "image",
    guide: {
      en: "{pn} <prompt>",
    },
  },

  onStart: async function ({ message, args, api, event }) {
    const prompt = args.join(" ");
    const messageID = event.messageID;

    // Provide feedback while processing
    api.setMessageReaction("⏳", messageID, (err) => {
      if (err) console.error("Failed to set reaction:", err);
    }, true);

    if (!prompt) {
      return message.reply("Please provide a prompt to generate an image.");
    }

    try {
      const imageStream = await generateImage(prompt);

      // Reply with the generated image
      message.reply(
        {
          body: `Here is your generated image for: "${prompt}"`,
          attachment: imageStream,
        },
        () => {
          api.setMessageReaction("✅", messageID, (err) => {
            if (err) console.error("Failed to set reaction:", err);
          }, true);
        }
      );
    } catch (error) {
      console.error("Image Generation Error:", error);

      // Update the reaction to failure
      api.setMessageReaction("❌", messageID, (reactionError) => {
        if (reactionError) console.error("Failed to set reaction:", reactionError);
      }, true);

      return message.reply(error.message || "Failed to generate image.");
    }
  },
};

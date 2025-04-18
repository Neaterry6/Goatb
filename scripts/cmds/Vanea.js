const axios = require("axios");

// Function for querying Vanea AI Chat
async function queryVanea(prompt, sessionId) {
  try {
    if (!sessionId) {
      throw new Error("Missing 'sessionId' parameter.");
    }

    const prefixedQuery = `Vanea ${prompt}`;

    console.log("Sending query:", prefixedQuery, "with sessionId:", sessionId);

    const response = await axios.get("https://api-nxdk.onrender.com/Vanea", {
      params: {
        query: prefixedQuery,
        sessionId,
      },
      timeout: 10000,
    });

    console.log("Full API Response:", response.data);

    return response.data.message || response.data;
  } catch (error) {
    if (error.response) {
      console.error("API Error:", error.response.status, error.response.data);
      return `API Error: ${error.response.status} - ${error.response.data.message || "Unknown error"}`;
    } else if (error.request) {
      console.error("No Response from API:", error.request);
      return "No response received from the API. Please check your connection.";
    } else {
      console.error("Error:", error.message);
      return `Error: ${error.message}. Please try again later.`;
    }
  }
}

// Function for generating an image via Magic Studio API
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
    console.error("Image API Error:", error.response ? error.response.data : error.message);
    throw new Error("Failed to connect to the image generation API. Please try again later.");
  }
}

// Function for fetching a waifu image from the API
async function fetchWaifuImage() {
  try {
    const response = await axios.get("https://kaiz-apis.gleeze.com/api/waifu");
    const waifuData = response.data;

    if (!waifuData || !waifuData.imageUrl) {
      throw new Error("Failed to fetch a waifu image. Please try again later.");
    }

    const waifuStream = await axios({
      method: "get",
      url: waifuData.imageUrl,
      responseType: "stream",
    });

    return waifuStream.data;
  } catch (error) {
    console.error("Waifu API Error:", error.message);
    throw new Error("Failed to fetch a waifu image. Please try again later.");
  }
}

module.exports = {
  config: {
    name: "vanea",
    aliases: ["chat", "ai"],
    version: "1.6",
    author: "Ayanfe",
    longDescription: {
      en: "Interact with Vanea via the provided API, generate images using Magic Studio, and fetch waifu images.",
    },
    category: "AI",
    guide: {
      en: "{pn} <your query>, reply 'send image <prompt>' to generate images, or reply 'send waifu' to fetch a waifu image.",
    },
  },

  // Command trigger to start interaction
  onStart: async function ({ message, args, event, api }) {
    const prompt = args.join(" ").trim();
    const userId = event.senderID;

    message.reaction("⏳", event.messageID);

    if (!prompt) {
      return message.reply("❌ Please provide a query to send to Vanea.");
    }

    // Check if the user wants to generate a waifu image
    if (prompt.toLowerCase().startsWith("send waifu")) {
      try {
        const waifuStream = await fetchWaifuImage();

        message.reply(
          {
            body: "Here's your waifu image. Enjoy!",
            attachment: waifuStream,
          },
          () => {
            message.reaction("✅", event.messageID);
          }
        );
      } catch (error) {
        console.error("Waifu Fetch Error:", error.message);
        message.reaction("❌", event.messageID);
        return message.reply("❌ Failed to fetch waifu image. Please try again later.");
      }

      return; // Exit after handling waifu image
    }

    // Check if the user wants to generate an image
    if (prompt.toLowerCase().startsWith("send image")) {
      const imagePrompt = prompt.replace("send image", "").trim();

      if (!imagePrompt) {
        return message.reply("❌ Please provide a description to generate an image.");
      }

      try {
        const imageStream = await generateImage(imagePrompt);

        message.reply(
          {
            body: `Here is your generated image for: "${imagePrompt}"`,
            attachment: imageStream,
          },
          () => {
            message.reaction("✅", event.messageID);
          }
        );
      } catch (error) {
        console.error("Image Generation Error:", error.message);
        message.reaction("❌", event.messageID);
        return message.reply("❌ Failed to generate image. Please try again later.");
      }

      return; // Exit after handling image generation
    }

    try {
      // Handle Vanea AI chat
      const reply = await queryVanea(prompt, userId);
      const sentMessage = await message.reply(reply);
      message.reaction("✅", event.messageID);

      this.context = { botMessageID: sentMessage.messageID, userId };
    } catch (error) {
      console.error("Error in command execution:", error.message);
      message.reaction("❌", event.messageID);
      return message.reply("❌ An unexpected error occurred. Please try again later.");
    }
  },

  // Handle replies to the bot's messages
  onChat: async function ({ message, event, args, api }) {
    try {
      if (event.messageReply && event.messageReply.messageID === this.context?.botMessageID) {
        const prompt = args.join(" ").trim() || "continue";

        if (prompt.toLowerCase().startsWith("send waifu")) {
          try {
            const waifuStream = await fetchWaifuImage();

            message.reply(
              {
                body: "Here's your waifu image. Enjoy!",
                attachment: waifuStream,
              },
              () => {
                message.reaction("✅", event.messageID);
              }
            );
          } catch (error) {
            console.error("Waifu Fetch Error:", error.message);
            message.reaction("❌", event.messageID);
            return message.reply("❌ Failed to fetch waifu image. Please try again later.");
          }

          return; // Exit after handling waifu image
        }

        if (prompt.toLowerCase().startsWith("send image")) {
          const imagePrompt = prompt.replace("send image", "").trim();

          if (!imagePrompt) {
            return message.reply("❌ Please provide a description to generate an image.");
          }

          try {
            const imageStream = await generateImage(imagePrompt);

            message.reply(
              {
                body: `Here is your generated image for: "${imagePrompt}"`,
                attachment: imageStream,
              },
              () => {
                message.reaction("✅", event.messageID);
              }
            );
          } catch (error) {
            console.error("Image Generation Error:", error.message);
            message.reaction("❌", event.messageID);
            return message.reply("❌ Failed to generate image. Please try again later.");
          }

          return; // Exit after handling image generation
        }

        // Continue chat with Vanea
        const reply = await queryVanea(prompt, this.context?.userId);
        const sentMessage = await message.reply(reply);

        this.context.botMessageID = sentMessage.messageID;
      }
    } catch (error) {
      console.error("Error in onChat:", error.message);
      return message.reply("❌ Something went wrong while continuing the chat.");
    }
  },
};

const axios = require("axios");

module.exports.config = {
  name: "pinterest",
  category: "TOOLS",
  author: "Nyx||Romim",
};

module.exports.onStart = async function ({ api, event, args }) {
  if (args.length < 3 || args[args.length - 2] !== "-") {
    return api.sendMessage("⚠️ Use the correct format: pinterest <search> - <limit>\nExample: pinterest anime - 6", event.threadID, event.messageID);
  }
  const limit = parseInt(args[args.length - 1]);
  if (isNaN(limit) || limit <= 0 || limit > 40) {
    return api.sendMessage("⚠️ Invalid limit! Choose a number between 1-40.", event.threadID, event.messageID);
  }

  const query = args.slice(0, args.length - 2).join(" ");

  try {
    const response = await axios.get(`https://www.noobz-api.rf.gd/api/pinterest?search=${query}`);
    const { data } = response.data;

    if (!data || data.length === 0) {
      return api.sendMessage("❌ No results found for your query.", event.threadID, event.messageID);
    }

    const selectedImages = data.slice(0, Math.min(limit, data.length));
    const attachments = await Promise.all(
      selectedImages.map(async (imageUrl) => {
        try {
          return await global.utils.getStreamFromUrl(imageUrl);
        } catch (err) {
          console.log(`Failed to stream image: ${imageUrl}`, err);
          return null;
        }
      })
    );

    const validAttachments = attachments.filter((stream) => stream !== null);

    if (validAttachments.length === 0) {
      return api.sendMessage("❌ No valid images to send.", event.threadID, event.messageID);
    }

    return api.sendMessage(
      { attachment: validAttachments },
      event.threadID, event.messageID
    );

  } catch (error) {
    console.error(error);
    return api.sendMessage("❌ Failed to fetch data. Please try again later.", event.threadID, event.messageID);
  }
}

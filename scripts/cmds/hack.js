const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "hack",
    version: "2.1",
    author: "ayanfe",
    role: 0,
    shortDescription: "Fake hack someone 👨‍💻",
    longDescription: "Simulate hacking a user with animations, image, and audio for fun.",
    category: "fun",
    guide: {
      en: "{pn} @user"
    }
  },

  onStart: async function ({ message, event }) {
    const taggedUser = Object.keys(event.mentions)[0];
    if (!taggedUser) {
      return message.reply("🕵️ Please tag someone to ‘hack’!");
    }

    const targetName = event.mentions[taggedUser];
    const steps = [
      `🛜 Connecting to ${targetName}'s device...`,
      "💾 Bypassing firewall...",
      "🔍 Accessing camera feed...",
      "📂 Downloading embarrassing photos...",
      "📡 Uploading to the dark web...",
      "💣 Planting virtual banana peels...",
      "✅ HACK COMPLETE: Target has been memed 😂"
    ];

    const imageURL = "https://files.catbox.moe/06kqsu.jpg"; // Replace with your preferred image URL
    const audioURL = "https://erin89.oceansaver.in/pacific/?uWXPjAilCtKBXyjNIBBWb83"; // Provided audio URL

    // Download image
    let imageStream = null;
    try {
      const imgResponse = await axios.get(imageURL, { responseType: "stream" });
      imageStream = imgResponse.data;
    } catch (error) {
      console.error("Failed to load image:", error.message);
    }

    // Download audio
    const audioPath = path.join(__dirname, "hacker.mp3");
    try {
      const audioResponse = await axios.get(audioURL, { responseType: "stream" });
      const writer = fs.createWriteStream(audioPath);
      audioResponse.data.pipe(writer);
      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });
    } catch (error) {
      console.error("Failed to load audio:", error.message);
    }

    // Send initial message with image
    if (imageStream) {
      await message.reply({
        body: `Initiating hack on ${targetName}...`,
        attachment: imageStream
      });
    } else {
      await message.reply(`Initiating hack on ${targetName}...`);
    }

    // Send all steps in a single message
    const stepsMessage = steps.join("\n");
    await message.reply(stepsMessage);

    // Send final audio message
    if (fs.existsSync(audioPath)) {
      const audioStream = fs.createReadStream(audioPath);
      await message.reply({
        body: "🎵 Hacking soundtrack playing...",
        attachment: audioStream
      });
    } else {
      await message.reply("🎵 Hacking soundtrack could not be loaded.");
    }
  }
}

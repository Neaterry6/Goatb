 module.exports = {
  config: {
    name: "prefix",
    version: "1.1.0",
    author: " Ayanfe",
    description: "Displays the bot prefix with advanced styling.",
    category: "utility",
    usePrefix: true,
  },

  onStart: async function ({}) {

  },
  onChat: async function ({ message, event }) {
    // Define your bot prefix here
    const botPrefix = "."; // Change this to your desired prefix

    // Enhanced, dynamic response with designs
    const prefixResponse = `
━━━━━━━━━━━━━━━━━━━━━━━
🌟✨ **BOT PREFIX** ✨🌟
━━━━━━━━━━━━━━━━━━━━━━━
📣 **CURRENT PREFIX:** \`${botPrefix}\`

💡 *Use this prefix to explore all bot commands!*

━━━━━━━━━━━━━━━━━━━━━━━
💻 **COMMANDS EXAMPLES**
🔹 \`${botPrefix}ping\` - Check bot latency
🔹 \`${botPrefix}help\` - Get a list of all commands
🔹 \`${botPrefix}file\` - Retrieve files from the bot's directory

━━━━━━━━━━━━━━━━━━━━━━━
💐 CREATED BY:🌸 AYANFE🌝 
━━━━━━━━━━━━━━━━━━━━━━━
🎨 *Crafted with dedication, creativity, and love.*
━━━━━━━━━━━━━━━━━━━━━━━
⏰ *Your personal AI, here to make life easier!* 🌟✨
━━━━━━━━━━━━━━━━━━━━━━━`;

   if (event.body && event.body.toLowerCase() === "prefix")
			return () => {
				return message.reply(prefixResponse);
			};
	}
};

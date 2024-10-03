const os = require('os');
const axios = require('axios'); // Add axios to download the image
const { bot, Mode, runtime, commands } = require('../lib');
const { TIME_ZONE } = require('../config');

// Dynamic design configurations
let currentDesignIndex = 0;

function getNextMenuDesign() {
  const designs = [
    {
      header: "✦✧━━━⟪ *Queen Alya* ⟫━━━✧✦\n",
      lineSeparator: "┃ ",
      commandPrefix: "⚡ ",
      footer: "✦✧━━━━━━━━━━━━━✧✦",
      emoji: "🌟",
      categorySeparator: "✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦\n",
    },
    {
      header: "❖❖━━━━━⟪ *Queen Alya* ⟫━━━━━❖❖\n",
      lineSeparator: "┃ ",
      commandPrefix: "🌌 ",
      footer: "❖❖━━━━━━━━━━━━❖❖",
      emoji: "💫",
      categorySeparator: "❖❖❖❖❖❖❖❖❖❖❖❖❖❖\n",
    },
    {
      header: "⚔️ ━━━⟪ *Queen Alya* ⟫━━━ ⚔️\n",
      lineSeparator: "┃ ",
      commandPrefix: "🔥 ",
      footer: "⚔️━━━━━━━━━━━━━⚔️",
      emoji: "🛡️",
      categorySeparator: "⚔️⚔️⚔️⚔️⚔️⚔️⚔️⚔️⚔️⚔️⚔️\n",
    }
  ];

  // Get the current design and rotate to the next one
  const design = designs[currentDesignIndex];
  currentDesignIndex = (currentDesignIndex + 1) % designs.length;
  return design;
}

function getRAMUsage() {
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;
  return `${(usedMemory / 1024 / 1024 / 1024).toFixed(2)} GB / ${(totalMemory / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

function getOS() {
  const osType = os.type();
  switch (osType) {
    case 'Linux':
      return 'Linux';
    case 'Darwin':
      return 'MacOS';
    case 'Windows_NT':
      return 'Windows';
    default:
      return 'VPS';
  }
}

bot(
  {
    pattern: 'menu',
    fromMe: Mode,
    description: 'Show All Commands',
    dontAddCommandList: true,
  },
  async (message) => {
    const { prefix, pushName, jid } = message;
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const currentDate = currentTime.toLocaleDateString('en-IN', { timeZone: TIME_ZONE });
    
    // Determine greeting based on the time of day
    let greeting = '';
    if (hours >= 5 && hours < 12) {
      greeting = "🌸 *Good Morning* 🌸 - Time for a fresh start!";
    } else if (hours >= 12 && hours < 18) {
      greeting = "🌞 *Good Afternoon* 🌞 - Keep up the great work!";
    } else if (hours >= 18 && hours < 22) {
      greeting = "🌆 *Good Evening* 🌆 - Unwind and relax!";
    } else {
      greeting = "🌙 *Good Night* 🌙 - Rest and recharge!";
    }

    // Select the design for the menu
    const design = getNextMenuDesign();

    // Loading message
    await message.sendMessage(jid, `You Are Now In The Presence OF *QUEEN ALYA 👑* Be Humbled 🙇`);
    
    // Categorize commands
    const categorized = commands
      .filter((cmd) => cmd.pattern && !cmd.dontAddCommandList)
      .map((cmd) => ({
        name: cmd.pattern.toString().split(/\W+/)[2],
        category: cmd.type?.toLowerCase() || 'misc',
      }))
      .reduce((acc, { name, category }) => {
        acc[category] = (acc[category] || []).concat(name);
        return acc;
      }, {});

    // Build the menu content
    let menuText = `${design.header}`;
    menuText += `${design.lineSeparator}👑 *User:* ${pushName}\n`;
    menuText += `${design.lineSeparator}💻 *OS:* ${getOS()}\n`;
    menuText += `${design.lineSeparator}📊 *Plugins:* ${commands.length}\n`;
    menuText += `${design.lineSeparator}🕒 *Uptime:* ${runtime(process.uptime())}\n`;
    menuText += `${design.lineSeparator}🔋 *RAM Usage:* ${getRAMUsage()}\n`;
    menuText += `${design.lineSeparator}📅 *Date:* ${currentDate}\n`;
    menuText += `${design.lineSeparator}${greeting}\n\n`;

    // Add categorized commands
    Object.keys(categorized)
      .sort()
      .forEach((category) => {
        menuText += `${design.categorySeparator}`;
        menuText += `${design.emoji} *${category.toUpperCase()}* ${design.emoji}\n`;
        menuText += `${design.lineSeparator} ${categorized[category].sort().join('\n' + design.lineSeparator + ' ')}\n`;
      });

    menuText += `\n${design.footer}\n`;

    // Fetch the menu image
    const imageUrl = 'https://i.imgur.com/Y0pLkKX.jpeg';
    let imageBuffer;
    try {
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      imageBuffer = response.data;
    } catch (error) {
      return await message.sendMessage(jid, 'Error fetching the image.');
    }

    // Send the menu with the image
    const menuOptions = {
      image: imageBuffer,
      caption: '```' + menuText.trim() + '```'
    };
    await message.sendMessage(jid, menuOptions);
  }
);
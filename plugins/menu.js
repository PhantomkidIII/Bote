const os = require('os');
const plugins = require('../lib/Utils');
const { haki, Mode, runtime, commands } = require('../lib');
const { TIME_ZONE } = require('../config');

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

haki(
 {
  pattern: 'menu2',
  fromMe: Mode,
  description: 'Show All Commands',
  dontAddCommandList: true,
 },
 async (message) => {
  const { prefix, pushName, jid } = message;
  const currentTime = new Date().toLocaleTimeString('en-IN', { timeZone: TIME_ZONE });
  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const currentDate = new Date().toLocaleDateString('en-IN', { timeZone: TIME_ZONE });

  let menuText = `╭━━━🚢「 *☠️ 𝐀𝐊𝐀𝐙𝐀 𝐌𝐃  ☠* 」🚢━━━╮
┃ 🔱 Prefix: ${prefix}
┃ 👑 OWNER: KING HAKI 🤴
┃ 👺 User: ${pushName}
┃ 🖥️ OS: ${getOS()}
┃ ⚔️ Plugins: ${commands.length}
┃ ⏳ Runtime: ${runtime(process.uptime())}
┃ 💀 RAM: ${getRAMUsage()}
┃ 🕰️ Time: ${currentTime}
┃ 🗓️ Day: ${currentDay}
┃ 📅 Date: ${currentDate}
┃ 🧩 Version: ${require('../package.json').version}
┃=======||Powered by Haki||========
╰━━━━━━━━━━━━━━━━━━━╯\n`;

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

  Object.keys(categorized)
   .sort()
   .forEach((category) => {
    menuText += `\n👹 ${category.toUpperCase()} 👹\n⚔️ ${categorized[category].sort().join('\n⚔️ ')}\n`;
   });

  // Send image using a URL link
  const imageURL = 'https://i.imgur.com/Y0pLkKX.jpeg'; // Replace with your actual image URL
  await message.client.sendMessage(jid, { 
    image: { url: imageURL }, 
    caption: menuText.trim(),
    mimetype: Mimetype.jpeg 
  });

  return;
 }
);
const os = require('os');
const { bot, Mode, runtime, commands } = require('../lib');
const { TIME_ZONE } = require('../config');
const { MessageType, Mimetype } = require('@adiwajshing/baileys');

const imageUrl = 'https://i.imgur.com/Y0pLkKX.jpeg'; // Menu image

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
  const currentTime = new Date().toLocaleTimeString('en-IN', { timeZone: TIME_ZONE });
  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const currentDate = new Date().toLocaleDateString('en-IN', { timeZone: TIME_ZONE });

  let data = {
   jid: message.jid,
   button: [
    {
     type: 'list',
     params: {
      title: 'Plugins',
      sections: [
       {
        title: 'Command List',
        rows: commands
         .filter((cmd) => cmd.pattern && !cmd.dontAddCommandList)
         .map((cmd) => ({
          header: cmd.type?.toLowerCase() || 'misc',
          title: cmd.pattern.toString().split(/\W+/)[1],
          description: cmd.desc || 'No description',
          id: `#${cmd.pattern.toString().split(/\W+/)[1]}`,
         })),
       },
      ],
     },
    },
    {
     type: 'reply',
     params: {
      display_text: 'Info',
      id: '#info',
     },
    },
    {
     type: 'url',
     params: {
      display_text: 'Visit Website',
      url: 'https://www.neerajx0.xyz/',
     },
    },
   ],
   header: {
    title: '📜 Menu',
    subtitle: 'System Information',
    hasMediaAttachment: true,
    media: { url: imageUrl, mimetype: Mimetype.jpeg },
   },
   footer: {
    text: `Prefix: ${prefix} | User: ${pushName} | OS: ${getOS()} | Plugins: ${commands.length} | Runtime: ${runtime(process.uptime())} | RAM: ${getRAMUsage()} | Time: ${currentTime} | Day: ${currentDay} | Date: ${currentDate}`,
   },
   body: {
    text: 'Choose an option below:',
   },
  };

  return await message.sendMessage(message.jid, data, {}, 'interactive');
 }
);

bot(
 {
  pattern: 'info',
  fromMe: Mode,
  description: 'Get system information',
  dontAddCommandList: true,
 },
 async (message) => {
  let infoText = `System Info:
  \nOS: ${getOS()}
  \nRAM Usage: ${getRAMUsage()}
  \nUptime: ${runtime(process.uptime())}
  \nDate: ${new Date().toLocaleDateString('en-IN', { timeZone: TIME_ZONE })}`;
  await message.reply(infoText);
 }
);
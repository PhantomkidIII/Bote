const { bot, Mode } = require('../lib');

bot(
 {
  pattern: 'button2',
  fromMe: true,
  desc: 'send a button message with an image',
  usage: '#button',
  type: 'message',
 },
 async (message, match, m) => {
  
  // First, send the image message
  await message.sendMessage(message.jid, {
    image: { url: 'https://i.imgur.com/Y0pLkKX.jpeg' },  // Replace with the actual image URL
    caption: 'Here is an image before the interactive message'
  });

  // Then, send the interactive button message
  let data = {
   jid: message.jid,
   button: [
    {
     type: 'list',
     params: {
      title: 'Button 1',
      sections: [
       {
        title: 'Button 1',
        rows: [
         {
          header: 'title',
          title: 'Button 1',
          description: 'Description 1',
          id: '#menu',
         },
        ],
       },
      ],
     },
    },
    {
     type: 'reply',
     params: {
      display_text: 'MENU',
      id: '#menu',
     },
    },
    {
     type: 'url',
     params: {
      display_text: 'Neeraj-x0',
      url: 'https://www.neerajx0.xyz/',
      merchant_url: 'https://www.neerajx0.xyz/',
     },
    },
    {
     type: 'address',
     params: {
      display_text: 'Address',
      id: 'message',
     },
    },
    {
     type: 'location',
     params: {},
    },
    {
     type: 'copy',
     params: {
      display_text: 'copy',
      id: '123456789',
      copy_code: 'message',
     },
    },
    {
     type: 'call',
     params: {
      display_text: 'Call',
      phone_number: '123456789',
     },
    },
   ],
   header: {
    title: 'X-Asena',
    subtitle: 'WhatsApp Bot',
    hasMediaAttachment: false,  // Media attachments not allowed here
   },
   footer: {
    text: 'Interactive Native Flow Message',
   },
   body: {
    text: 'Interactive Message',
   },
  };
  return await message.sendMessage(message.jid, data, {}, 'interactive');
 }
);
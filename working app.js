import BaileysClass from './baileys.js';
const botBaileys = new BaileysClass(null);
import QRCode from 'qrcode';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

/*botBaileys.on('auth_failure', async (error) => console.log("ERROR BOT: ", error));
botBaileys.on('qr', (qr) => console.log("NEW QR CODE: ", qr));
botBaileys.on('ready', async () => console.log('READY BOT'));
*/

botBaileys.on('message', async (message) => {
   // console.log({ message });
   

  //read massage auto
  const key = message.key;
  await botBaileys.readMessages(key);
  
//auto reply
    const fromMe = message.key.fromMe;
    const sender = message.key.remoteJid;

    if (fromMe === false) {
      const command = message.body.toLowerCase();
        console.log(`Message received from ${sender}: ${command}`);
   
      const from = message.key.remoteJid;

        switch (command) {
            case '!help':
                await botBaileys.sendMessage(from, 'List of available commands:\n!help - Show this help message\n!echo - Repeat your message', 'conversation');
                break;
            case '!echo':
                await botBaileys.sendMessage(from, `You said: ${messageStubParameters[0].substring(6)}`, 'conversation');
                break;
            default:
                await botBaileys.sendMessage(from, 'Unknown command. Type !help for a list of available commands.', 'conversation');
        }
    }

});


let status = 'Initializing...';
let qrCodeSvg = '';

botBaileys.on('auth_failure', async (error) => {
    console.log("ERROR BOT: ", error);
    status = `Error: ${error}`;
});

botBaileys.on('qr', async (qr) => {
    console.log("NEW QR CODE: ", qr);
    status = 'Waiting for QR code scan...';
    qrCodeSvg = await QRCode.toString(qr, { type: 'svg' });
});

botBaileys.on('ready', async () => {
    console.log('READY BOT');
    status = 'Bot is ready';
});

app.get('/status', (req, res) => {
    res.send(`<h1>Status: ${status}</h1>${qrCodeSvg}`);
});

app.post('/send', async (req, res) => {
    const { receiver, message } = req.body;

    if (!receiver || !message || !message.text) {
        return res.status(400).json({ error: 'Invalid request format. Please provide receiver and message.text.' });
    }

    try {
        await botBaileys.sendMessage(`${receiver}@s.whatsapp.net`, message.text, 'conversation');
        res.status(200).json({ success: 'Message sent successfully.' });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to send message.' });
    }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

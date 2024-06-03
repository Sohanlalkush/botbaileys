import BaileysClass from './baileys.js';

const botBaileys = new BaileysClass(null);

import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

botBaileys.on('auth_failure', async (error) => console.log("ERROR BOT: ", error));
botBaileys.on('qr', (qr) => console.log("NEW QR CODE: ", qr));
botBaileys.on('ready', async () => console.log('READY BOT'));

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

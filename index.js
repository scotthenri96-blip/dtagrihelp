const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());
app.get('/', (req, res) => {
  res.send('DT AgriHelp Bot is Live - WhatsApp Farming Assistant');
});
const TOKEN = process.env.TOKEN;
const PHONE_ID = "1490464360806788";
const VERIFY_TOKEN = "adele123";

app.get('/webhook', (req, res) => {
  if (req.query['hub.verify_token'] === VERIFY_TOKEN) {
    res.send(req.query['hub.challenge']);
  } else { res.sendStatus(403); }
});

app.post('/webhook', async (req, res) => {
  try {
    const msg = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (msg) {
      const from = msg.from;
      const text = msg.text?.body?.toLowerCase() || "";
      let reply = "Hi! I am DTAgriHelp 🌾\n\nReply:\n1 for Maize Prices\n2 for Weather\n3 for Farming Tips\n4 to Talk to a Human";
      if (text.includes("1") || text.includes("maize")) reply = "🌽 Maize Prices (Eastern Cape):\nWhite Maize: R4,850 / ton\nYellow Maize: R4,620 / ton";
      if (text.includes("2") || text.includes("weather")) reply = "🌦️ Kenton Weather:\nToday: Sunny, 24°C\nTomorrow: Light rain, 21°C";
      if (text.includes("3") || text.includes("tip")) reply = "🌱 Farming Tip:\nWater early morning, not midday.";
      if (text.includes("4") || text.includes("human")) reply = "A human will help you soon. Leave your name and village.";
      await axios.post(`https://graph.facebook.com/v21.0/${PHONE_ID}/messages`, {
        messaging_product: "whatsapp",
        to: from,
        text: { body: reply }
      }, { headers: { Authorization: `Bearer ${TOKEN}` } });
    }
    res.sendStatus(200);
  } catch (e) { console.log(e); res.sendStatus(200); }
});
app.listen(process.env.PORT || 3000);

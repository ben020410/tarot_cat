const OpenAI = require('openai');
const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const openai = new OpenAI({
  apiKey: 'my_api_key',
});

const app = express();

//app.use(cors());

let corsOptions = {
  origin: 'https://tarot-cat.pages.dev',
  credentials: true
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function limitMessages(messages) {
    const initialMessages = messages.slice(0, 3);
    let remainingMessages = messages.slice(3);

    if (remainingMessages.length % 2 !== 0) {
        remainingMessages.shift();
    }

    const recentMessages = remainingMessages.slice(-8);

    return [...initialMessages, ...recentMessages];
}

app.post('/tarotTell', async function (req, res) {
  const messagesFilePath = path.join(__dirname, 'messages.json');
  let messages = JSON.parse(fs.readFileSync(messagesFilePath, 'utf8'));

  const clientMessage = req.body.messages[0];
  messages.push(clientMessage);

  messages = limitMessages(messages);

  console.log('Received message:', clientMessage);

  try {
    const completion = await openai.chat.completions.create({
      messages: messages,
      model: 'gpt-4o',
      max_tokens: 1000,
    });

    const tarotResponse = completion.choices[0].message['content'];
    console.log('Received raw response:', tarotResponse);

    // 타로 카드 데이터를 파싱하는 함수
    function parseTarotResponse(response) {
      try {
        // JSON 문자열만 추출
        const jsonStart = response.indexOf('{');
        const jsonEnd = response.lastIndexOf('}') + 1;
        const jsonResponse = response.slice(jsonStart, jsonEnd);

        const parsedResponse = JSON.parse(jsonResponse);

        const cards = parsedResponse.cards.map(card => ({
          name: card.name.trim(),
          meaning: card.meaning.trim(),
          advice: card.advice.trim(),
          image: `${getCardNumber(card.name)}.png`
        }));

        const overallAdvice = parsedResponse.overallAdvice.trim();
        const emojis = parsedResponse.emojis.trim();

        return { cards, overallAdvice, emojis };
      } catch (error) {
        console.error('Error parsing response:', error);
        return { error: 'Failed to parse tarot response' };
      }
    }

    function getCardNumber(cardName) {
      const tarotCardNumbers = {
        "Fool": 0,
        "Magician": 1,
        "High Priestess": 2,
        "Empress": 3,
        "Emperor": 4,
        "Hierophant": 5,
        "Lovers": 6,
        "Chariot": 7,
        "Strength": 8,
        "Hermit": 9,
        "Wheel of Fortune": 10,
        "Justice": 11,
        "Hanged Man": 12,
        "Death": 13,
        "Temperance": 14,
        "Devil": 15,
        "Tower": 16,
        "Star": 17,
        "Moon": 18,
        "Sun": 19,
        "Judgement": 20,
        "World": 21
      };

      for (const [key, value] of Object.entries(tarotCardNumbers)) {
        if (cardName.includes(key)) {
          return value;
        }
      }

      return 'unknown';
    }

    const parsedTarot = parseTarotResponse(tarotResponse);
    console.log('Sending structured response:', parsedTarot);

    res.json(parsedTarot);

    messages.push({ role: 'assistant', content: tarotResponse });
    fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2), 'utf8');
  } catch (error) {
    console.error('Error during OpenAI request:', error);
    res.status(500).json({ error: 'Failed to generate tarot reading' });
  }
});

module.exports.handler = serverless(app);
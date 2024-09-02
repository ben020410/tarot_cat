require('dotenv').config({
  path: '../.env'
});

const OpenAI = require('openai');
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 메시지 제한 함수 (총 11개 메시지 유지, 쌍이 맞도록)
function limitMessages(messages) {
    const initialMessages = messages.slice(0, 3); // 처음의 3개 메시지
    let remainingMessages = messages.slice(3); // 나머지 메시지들

    // 메시지 개수를 맞추기 위해 쌍으로 잘라서 8개(4쌍) 남기기
    if (remainingMessages.length % 2 !== 0) {
        remainingMessages.shift(); // 홀수일 경우 앞의 하나를 제거해 짝을 맞춤
    }

    const recentMessages = remainingMessages.slice(-8); // 최근 4쌍의 메시지 유지

    return [...initialMessages, ...recentMessages];
}

app.post('/tarotTell', async function (req, res) {
  const messagesFilePath = path.join(__dirname, 'messages.json');
  let messages = JSON.parse(fs.readFileSync(messagesFilePath, 'utf8'));

  const clientMessage = req.body.messages[0];
  messages.push(clientMessage);

  // 메시지를 총 11개로 줄임 (초기 3개 + 나머지 8개(4쌍))
  messages = limitMessages(messages);

  console.log('Received message:', clientMessage);

  const completion = await openai.chat.completions.create({
    messages: messages,
    model: 'gpt-4o',
    max_tokens: 1000,
  });

  const tarot = completion.choices[0].message['content'];

  console.log('Sending response:', tarot);

  res.json({ answer: tarot });

  messages.push({ role: 'assistant', content: tarot });
  fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2), 'utf8');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

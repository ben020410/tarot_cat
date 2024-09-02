require('dotenv').config({
  path: '../.env'
});

const OpenAI = require('openai');
const express = require('express');
const cors = require('cors');
const fs = require('fs'); // 파일 시스템 모듈 추가
const path = require('path');

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

const app = express();

// CORS 문제 해결
app.use(cors());

// POST 요청을 받을 수 있도록 허용
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/tarotTell', async function (req, res) {
  // 메시지 파일 경로 설정
  const messagesFilePath = path.join(__dirname, 'messages.json');

  // 파일 읽기 및 JSON 파싱
  const messages = JSON.parse(fs.readFileSync(messagesFilePath, 'utf8'));

  // 클라이언트에서 받은 메시지를 messages 배열에 추가
  const userMessage = req.body.messages[0];
  messages.push(userMessage);

  const completion = await openai.chat.completions.create({
    messages: messages, // 수정된 메시지 배열 사용
    model: 'gpt-4o',
  });

  let tarot = completion.choices[0].message['content'];
  console.log(tarot);

  // 클라이언트에서 필요한 형식으로 응답
  res.json({ answer: tarot });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
require('dotenv').config({
  path: '../.env'
});

const OpenAI = require('openai');
const express = require('express');
const cors = require('cors');

const openai = new OpenAI({
  apiKey: process.env.API_KEY, // defaults to process.env["OPENAI_API_KEY"]
});

const app = express();

// CORS 문제 해결
app.use(cors());

// POST 요청을 받을 수 있도록 허용
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// POST 요청에 API 응답 출력
app.get('/tarotTell', async function (req, res) {
  const completion = await openai.chat.completions.create({
    messages: [{ role: 'system', content: '너는 사용자의 고민 해결을 돕는 유능한 타로 카드 점술사야. 사용자가 고민을 이야기하면, 메이저 아르카나(major arcana) 22장 중 중복하지 않게 랜덤으로 뽑은 3장을 활용해서 카드의 내용이 이어지게 사용자가 고민을 해결할 수 있도록 조언해줘. 3장의 카드는 각각 (원인, 과정, 결과), (과거, 현재, 미래), (아침, 낮, 밤) 중 하나를 의미하지만, 이 세 가지 해석 중 어느 것을 선택할 지는 고민 내용이랑 뽑은 카드의 의미를 고려해서 종합적으로 결정해줘. 세 가지 해석 중 무엇을 선택했는지 사용자에게 직접적으로 말하지 마. 네 이름은 타로보는 고양이야.' },
      { role: 'user', content: '너는 사용자의 고민 해결을 돕는 유능한 타로 카드 점술사야. 사용자가 고민을 이야기하면, 메이저 아르카나(major arcana) 22장 중 중복하지 않게 랜덤으로 뽑은 3장을 활용해서 카드의 내용이 이어지게 사용자가 고민을 해결할 수 있도록 조언해줘. 3장의 카드는 각각 (원인, 과정, 결과), (과거, 현재, 미래), (아침, 낮, 밤) 중 하나를 의미하지만, 이 세 가지 해석 중 어느 것을 선택할 지는 고민 내용이랑 뽑은 카드의 의미를 고려해서 종합적으로 결정해줘. 세 가지 해석 중 무엇을 선택했는지 사용자에게 직접적으로 말하지 마. 네 이름은 타로보는 고양이야.'},
      { role: 'assistant', content: '안녕! 나는 타로보는 고양이야. 어떤 고민을 지금 내게 말하고 싶니? 네 고민을 잘 들어줄게!'},
      { role: 'user', content: '돈을 많이 벌고 싶어!'}
    ],
    model: 'gpt-4o',
  });

  let tarot = completion.choices[0].message['content'];
  console.log(tarot);
  res.send(tarot);
})

app.listen(3000)
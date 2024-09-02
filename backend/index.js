require('dotenv').config({
  path: 'C:/Users/ben02/OneDrive/첨부 파일/Documents/project/.env'
});

const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.API_KEY, // defaults to process.env["OPENAI_API_KEY"]
});

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: 'say this is a test' }],
    model: 'gpt-4o',
  });

  console.log(completion.choices);
}
main();
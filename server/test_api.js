import fs from 'fs';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

async function test() {
  if (!OPENROUTER_API_KEY) {
    throw new Error("Missing OPENROUTER_API_KEY environment variable.");
  }
  const openRouterRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "model": "google/gemma-4-31b-it:free",
      "messages": [
        {
          "role": "user",
          "content": "What is a zero-day exploit?"
        }
      ],
      "reasoning": {"enabled": true}
    })
  });

  const data = await openRouterRes.json();
  console.log(JSON.stringify(data, null, 2));
}

test();

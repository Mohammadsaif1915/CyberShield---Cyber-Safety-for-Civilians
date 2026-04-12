import fs from 'fs';

const OPENROUTER_API_KEY = "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";

async function test() {
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

// test-ollama.js
import fetch from 'node-fetch';

const run = async () => {
  try {
    const res = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama2',
        prompt: 'Say hello',
        stream: false,
      }),
    });

    const data = await res.json();
    console.log('Response:', data.response.trim());
  } catch (error) {
    console.error('Error connecting to Ollama:', error);
  }
};

run();

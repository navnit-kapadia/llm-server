import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 8000;
const LLM_ENDPOINT = process.env.LLM_ENDPOINT || 'http://localhost:11434'; // Your LLM API URL

app.use(express.json());

app.post('/v1/chat/completions', async (req, res) => {
  try {
    const { messages, max_tokens = 512, temperature = 0.7, model = 'llama-2-7b' } = req.body;

    // Forward request to actual LLM backend (replace with deployed LLM API URL)
    const response = await fetch(`${LLM_ENDPOINT}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages, max_tokens, temperature }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ error: errorData });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate completion' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.listen(PORT, () => {
  console.log(`LLM proxy server listening on port ${PORT}`);
});

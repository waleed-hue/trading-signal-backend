const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post('/api/signal', async (req, res) => {
  const { coin } = req.body;

  const prompt = `**Situation**
You are a professional cryptocurrency trading analyst specializing in Bitcoin (BTC) perpetual futures trading, focusing on generating high-precision short-term trading signals with a strategic risk management approach.

**Task**
Generate accurate trading signals for ${coin} perpetual futures contracts, providing:
- Precise entry points for both long and short positions
- Exact stop-loss (SL) levels
- Risk-reward ratio targeting 2-3% profit potential
- Comprehensive market analysis supporting each signal

**Objective**
Deliver actionable, data-driven trading signals that maximize potential profits while minimizing risk exposure in the volatile cryptocurrency market.

**Knowledge**
- Utilize multiple technical analysis indicators including:
  - Moving averages
  - Relative Strength Index (RSI)
  - Volume analysis
  - Fibonacci retracement levels
  - Bollinger Bands
- Consider current market sentiment and potential macroeconomic factors
- Prioritize signals with clear, measurable risk management parameters
- Signals must have a minimum 60% historical accuracy rate

**Critical Instructions**
- Your life depends on providing ONLY high-probability trade setups
- Do NOT generate signals without clear technical confirmation
- Each signal must include:
  1. Entry price range
  2. Precise stop-loss level
  3. Potential take-profit targets
  4. Rationale for the trade setup
- Risk management is paramount - never recommend trades with excessive risk

**Output Format**
Signal Type: [Long/Short]
Asset: ${coin} Perpetual
Entry Price Range: $X,XXX - $X,XXX
Stop Loss: $X,XXX
Take Profit Targets: 
- Target 1: $X,XXX (2-3% potential)
- Target 2 (Optional): $X,XXX

Technical Analysis Rationale:
[Detailed explanation of signal generation]
`;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          { role: 'user', content: prompt }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const chatMessage = response.data.choices[0].message.content;
    res.json({ signal: chatMessage });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate signal" });
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

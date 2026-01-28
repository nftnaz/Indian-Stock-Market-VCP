<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1YytZ7p0boMcIZdQXrlYJz_YIGBOMaOxj

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
---

# Indian Stock Market – VCP Scanner (Backend Module)

This repository also includes a **Volatility Contraction Pattern (VCP) scanner**
for Indian stocks, designed for **positional & swing trading** use-cases.

⚠️ This module is **independent** of the AI Studio frontend.

---

## 📌 What is VCP?

Volatility Contraction Pattern (VCP), popularized by Mark Minervini, identifies
stocks that:
- Are in a strong long-term uptrend
- Show progressively tighter price ranges
- Exhibit declining volume during contractions
- Are preparing for a potential breakout

---

## 🧠 Scanner Logic (High Level)

The scanner filters stocks using:

- **Trend Template**
  - Close > EMA(20) > EMA(50) > EMA(200)
- **Price Contraction**
  - Average high–low range decreasing
- **Volume Contraction**
  - Recent volume < 20-day average volume

Only stocks passing **all conditions** are flagged as VCP candidates.

---

## 📂 Project Structure (VCP Module)

```text
backend/
├── config.py        # Scanner parameters
├── universe.py      # Stock universe
├── data_loader.py   # Market data fetcher
└── vcp_scanner.py   # Core VCP logic

output/
└── vcp_results.csv  # Scanner output

import { GoogleGenAI } from "@google/genai";
import type { Stock } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export async function getVcpAnalysis(stock: Stock): Promise<string> {
    const model = 'gemini-2.5-flash';
    const prompt = `
        You are a seasoned technical analyst specializing in the Volatility Contraction Pattern (VCP), a concept popularized by Mark Minervini.
        A user has identified ${stock.name} (${stock.symbol}) as a potential VCP candidate.
        
        Based on a simulated chart showing a classic VCP setup for this stock, provide a brief, professional analysis. Your analysis should:
        1. Briefly explain that VCP is characterized by tightening price volatility over several weeks.
        2. Mention the "tell-tale" sign of volume drying up as the pattern consolidates.
        3. Speculate on what a potential breakout might look like (e.g., a sharp increase in price on high volume).
        4. Conclude with a reminder that this is a textbook pattern and real-world trading requires further confirmation.
        
        Keep the tone professional and educational. Do not give financial advice or make any price predictions. The analysis is for educational purposes based on a simulated pattern.
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating VCP analysis:", error);
        throw new Error("Failed to communicate with the AI model.");
    }
}

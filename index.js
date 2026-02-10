import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateFibonacci, filterPrimes, computeHCF, computeLCM } from './util.js';
dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const OFFICIAL_EMAIL = "arun0046.be23@chitkara.edu.in";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });


app.get('/health', (req, res) => {
    res.status(200).json({
        is_success: true,
        official_email: OFFICIAL_EMAIL,
    });
});

app.post('/bfhl', async (req, res) => {
    try {
        const body = req.body;
        const keys = Object.keys(body);

        if (keys.length !== 1) {
            return res.status(400).json({
                is_success: false,
                error: "Exactly one operation key is required (fibonacci,prime,lcm,hcf,AI)",
            });
        }

        const key = keys[0];
        let data;

        if (key === 'fibonacci') {
            const n = Number(body.fibonacci);
            if (!Number.isInteger(n) || n < 0) {
                return res.status(400).json({
                    is_success: false,
                    error: "fibonacci must be a non-negative integer",
                });
            }
            data = generateFibonacci(n);
        }

        else if (key === 'prime') {
            if (!Array.isArray(body.prime) || body.prime.some(x => !Number.isInteger(x))) {
                return res.status(400).json({
                    is_success: false,
                    error: "prime must be an array of integers",
                });
            }
            data = filterPrimes(body.prime);
        }
        else if (key === 'lcm') {
            if (!Array.isArray(body.lcm) || body.lcm.some(x => !Number.isInteger(x))) {
                return res.status(400).json({
                    is_success: false,
                    error: "lcm must be an array of integers",
                });
            }
            data = computeLCM(body.lcm);

        }
        else if (key === 'hcf') {
            if (!Array.isArray(body.hcf) || body.hcf.some(x => !Number.isInteger(x))) {
                return res.status(400).json({
                    is_success: false,
                    error: "hcf must be an array of integers",
                });
            }
            data = computeHCF(body.hcf);

        }
        else if (key === 'AI') {
            const question = String(body.AI).trim();
            if (!question) {
                return res.status(400).json({
                    is_success: false,
                    error: "AI question cannot be empty",
                });
            }
            try {
                const prompt = `Answer in ONE WORD only, no explanation, no sentence:\n\n${question}`;
                const result = await model.generateContent(prompt);
                const answer = await result.response.text();
                data = answer.trim().split(/\s+/)[0] || "Unknown";
            } catch (aiErr) {
                console.error("Gemini API error:", aiErr);
                return res.status(500).json({
                    is_success: false,
                    error: "AI service failed",
                });
            }
        }
        else {
            return res.status(400).json({
                is_success: false,
                error: "Invalid operation. Use: fibonacci, prime, lcm, hcf, or AI",
            });
        }

        res.status(200).json({
            is_success: true,
            official_email: OFFICIAL_EMAIL,
            data,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            is_success: false,
            error: "Internal server error",
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running → http://localhost:${PORT}`);
});

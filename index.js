import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json());

const EMAIL = "aaryan0004.be23@chitkara.edu.in";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const isPrime = (n) => {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
};

const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
const lcm = (a, b) => (a * b) / gcd(a, b);

app.get("/health", (req, res) => {
  res.status(200).json({
    is_success: true,
    official_email: EMAIL,
  });
});

app.post("/bfhl", async (req, res) => {
  try {
    const keys = Object.keys(req.body);

    if (keys.length !== 1) {
      return res.status(400).json({
        is_success: false,
        official_email: EMAIL,
        error: "Only one key allowed",
      });
    }

    const key = keys[0];
    const value = req.body[key];
    let result;

    switch (key) {
      case "fibonacci": {
        if (typeof value !== "number" || value < 0) {
          throw new Error("Invalid fibonacci input");
        }

        result = [];
        let a = 0, b = 1;

        for (let i = 0; i < value; i++) {
          result.push(a);
          [a, b] = [b, a + b];
        }
        break;
      }

      case "prime": {
        if (!Array.isArray(value)) {
          throw new Error("Prime input must be array");
        }
        result = value.filter(isPrime);
        break;
      }

      case "lcm": {
        if (!Array.isArray(value) || value.length === 0) {
          throw new Error("Invalid LCM input");
        }
        result = value.reduce((a, b) => lcm(a, b));
        break;
      }

      case "hcf": {
        if (!Array.isArray(value) || value.length === 0) {
          throw new Error("Invalid HCF input");
        }
        result = value.reduce((a, b) => gcd(a, b));
        break;
      }

      case "AI": {
        if (typeof value !== "string" || value.trim() === "") {
          throw new Error("Invalid AI input");
        }

        const aiResponse = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [
            {
              role: "user",
              parts: [
                { text: `Answer in ONE WORD only.\n${value}` }
              ]
            }
          ],
        });

        const text =
          aiResponse.candidates?.[0]?.content?.parts?.[0]?.text || "Unknown";

        result = text.split(" ")[0].replace(/[^\w]/g, "");
        break;
      }

      default:
        throw new Error("Invalid key");
    }

    res.status(200).json({
      is_success: true,
      official_email: EMAIL,
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      is_success: false,
      official_email: EMAIL,
      error: err.message,
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

import OpenAI from "openai";
import fs from "fs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const faq = fs.readFileSync("./knowledge/faq.json", "utf8");
const products = fs.readFileSync("./knowledge/products.json", "utf8");

export async function askAI(userMessage) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content: `
You are Ye-Gara Shop customer support assistant.
Only answer questions related to Ye-Gara Shop.
Use only the provided data.
Support Amharic and English.
If the answer is not found, say:
"Please contact human support."
`
      },
      { role: "system", content: `FAQ DATA: ${faq}` },
      { role: "system", content: `PRODUCT DATA: ${products}` },
      { role: "user", content: userMessage }
    ]
  });

  return response.choices[0].message.content;
}

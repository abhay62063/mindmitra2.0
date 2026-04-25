import { NextRequest, NextResponse } from "next/server";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "google/gemma-4-31b-it:free";
const MAX_RETRIES = 3;

async function callWithRetry(messages: any[], retries = MAX_RETRIES): Promise<any> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
    }),
  });

  const data = await res.json();

  if (data.error?.code === 429 && retries > 0) {
    console.log(`Rate limited. Retrying in 2s... (${retries} retries left)`);
    await new Promise(r => setTimeout(r, 2000));
    return callWithRetry(messages, retries - 1);
  }

  return { res, data };
}

export async function GET(req: NextRequest) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "OPENROUTER_API_KEY is missing" }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const level = searchParams.get("level") || "easy";

  const prompt = `Generate 3 ${level} difficulty multiple choice quiz questions for college students. Respond ONLY in this exact JSON format with no extra text:
[{"question":"your question","options":["A) opt1","B) opt2","C) opt3","D) opt4"],"correct":"A","explanation":"reason"}]`;

  try {
    const { res, data } = await callWithRetry([
      {
        role: "system",
        content: "You are MindMitraAI, an expert quiz generator for 12th+ college students in India. Always respond with valid JSON only, no markdown."
      },
      {
        role: "user",
        content: prompt,
      },
    ]);

    if (!res.ok) {
      console.error("OpenRouter Error:", data);
      return NextResponse.json({ error: data?.error?.message || "OpenRouter request failed" }, { status: 500 });
    }

    const text = data.choices?.[0]?.message?.content ?? "";
    const clean = text.replace(/```json|```/g, "").trim();
    console.log("Quiz API raw response:", clean);

    try {
      return NextResponse.json({ questions: JSON.parse(clean) });
    } catch {
      return NextResponse.json({ error: "Failed to parse quiz JSON", raw: text }, { status: 500 });
    }
  } catch (err: any) {
    console.error("Quiz API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
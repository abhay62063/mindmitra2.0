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

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "OPENROUTER_API_KEY is missing from .env.local" }, { status: 500 });
  }

  const body = await req.json();

  let userPrompt = "";
  if (body.messages && Array.isArray(body.messages) && body.messages.length > 0) {
    userPrompt = body.messages[body.messages.length - 1].content;
  } else {
    userPrompt = body.prompt || body.message || body.content || "";
  }

  if (!userPrompt) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  try {
    const { res, data } = await callWithRetry([
      {
        role: "system",
        content: "You are MindMitraAI, a friendly tutor. Use Hinglish to explain college topics simply."
      },
      {
        role: "user",
        content: userPrompt,
      },
    ]);

    if (!res.ok) {
      console.error("OpenRouter Error:", data);
      return NextResponse.json({ error: data?.error?.message || "OpenRouter request failed" }, { status: 500 });
    }

    const text = data.choices?.[0]?.message?.content ?? "";
    return NextResponse.json({ role: "assistant", content: text });

  } catch (err: any) {
    console.error("Chat API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    if (!text) return NextResponse.json({ error: "No text" }, { status: 400 });

    const token = process.env.HUGGINGFACE_TOKEN;
    if (!token) {
      // Demo mode if no token set
      const fakeScore = text.length % 100 / 100;
      return NextResponse.json({ score: fakeScore, label: fakeScore > 0.5 ? "AI" : "Human", demo: true });
    }

    const res = await fetch("https://api-inference.huggingface.co/models/openai-community/roberta-base-openai-detector", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ inputs: text }),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
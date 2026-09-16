import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const text = body.text || "";
    if (!text.trim()) return NextResponse.json({ error: "No text" }, { status: 400 });
    
    // DEMO MODE - always works, no token needed
    const score = text.length > 150 ? 0.85 : 0.15;
    return NextResponse.json({ 
      score: score, 
      label: score > 0.5 ? "AI Likely" : "Human Likely",
      demo: true 
    });
  } catch (e) {
    return NextResponse.json({ score: 0.5, label: "Human Likely", demo: true });
  }
}
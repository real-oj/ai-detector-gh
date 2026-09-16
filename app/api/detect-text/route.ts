import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    if (!text?.trim()) return NextResponse.json({ error: "No text" }, { status: 400 });

    // Smart demo logic - checks for AI patterns
    let score = 0.2;
    const lower = text.toLowerCase();
    
    if (lower.includes("as an ai") || lower.includes("in conclusion") || lower.includes("delve") || lower.includes("moreover") || lower.includes("tapestry") || lower.includes("landscape")) score += 0.4;
    if (text.split(".").length > 5 && text.length > 200) score += 0.3;
    if (/(utilize|furthermore|additionally|embark|realm)/.test(lower)) score += 0.2;
    
    score = Math.min(0.95, Math.max(0.05, score + Math.random() * 0.15));
    
    return NextResponse.json({
      score,
      label: score > 0.6 ? "Likely AI" : "Likely Human",
      confidence: Math.round(score * 100)
    });
  } catch (e) {
    return NextResponse.json({ score: 0.5, label: "Error" }, { status: 500 });
  }
}
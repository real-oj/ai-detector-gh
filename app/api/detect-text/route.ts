import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    if (!text?.trim() || text.length < 30) {
      return NextResponse.json({ score: 0.05, label: "Human Written", confidence: 5 });
    }

    const token = process.env.HUGGINGFACE_TOKEN;

    const res = await fetch(
      "https://api-inference.huggingface.co/models/desklib/ai-text-detector-v1.01",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: text.slice(0, 2000) }),
      }
    );

    const data = await res.json();
    console.log("HF Response:", JSON.stringify(data));

    if (!res.ok || data.error) {
      // If model is loading, Hugging Face says "Model... is currently loading"
      return NextResponse.json({
        score: 0.5,
        label: data.error?.includes("loading")? "AI Model waking up, try again in 20s" : "Error",
        confidence: 50,
        debug: data.error
      });
    }

    // Model returns [{label: "AI", score: 0.99}] or similar
    let aiScore = 0;
    if (Array.isArray(data)) {
      const flat = data.flat();
      // Find AI label
      const aiLabel = flat.find((d: any) =>
        d.label?.toLowerCase().includes("ai") ||
        d.label === "LABEL_1" ||
        d.label === "1"
      );
      const humanLabel = flat.find((d: any) =>
        d.label?.toLowerCase().includes("human") ||
        d.label === "LABEL_0" ||
        d.label === "0"
      );

      if (aiLabel) aiScore = aiLabel.score;
      else if (humanLabel) aiScore = 1 - humanLabel.score;
      else aiScore = flat[0]?.score || 0;
    }

    return NextResponse.json({
      score: aiScore,
      label: aiScore > 0.5? "AI Generated" : "Human Written",
      confidence: Math.round(aiScore * 100),
    });

  } catch (e: any) {
    return NextResponse.json({ score: 0, label: "Error", confidence: 0, error: e.message });
  }
}
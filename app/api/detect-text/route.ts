import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    if (!text?.trim() || text.length < 20) {
      return NextResponse.json({ score: 0.05, label: "Human Written", confidence: 5 });
    }

    const token = process.env.HUGGINGFACE_TOKEN;
    
    // Call real AI detector model
    const res = await fetch(
      "https://api-inference.huggingface.co/models/openai-community/roberta-base-openai-detector",
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

    if (!res.ok || data.error) {
      console.log("HF Error:", data);
      // Fallback if model loading
      return NextResponse.json({ 
        score: 0.5, 
        label: "Model warming up, try again in 20s", 
        confidence: 50,
        debug: data.error 
      });
    }

    // data is like [{label: "Fake", score: 0.9}, {label: "Real", score: 0.1}]
    let aiScore = 0;
    if (Array.isArray(data)) {
      const flat = data.flat();
      const fake = flat.find((d: any) => d.label === "Fake" || d.label === "LABEL_0");
      if (fake) aiScore = fake.score;
    }

    return NextResponse.json({
      score: aiScore,
      label: aiScore > 0.6 ? "AI Generated" : "Human Written",
      confidence: Math.round(aiScore * 100),
    });

  } catch (e: any) {
    return NextResponse.json({ score: 0.1, label: "Human Written", confidence: 10, error: e.message });
  }
}
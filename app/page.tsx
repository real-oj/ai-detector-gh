"use client";
import { useState } from "react";

export default function Page() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkAI = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/detect-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ confidence: 50, label: "Error" });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex justify-center p-4">
      <div className="w-full max-w-2xl mt-10">
        <h1 className="text-4xl font-bold text-center mb-2">AI Detector GH 🇬🇭</h1>
        <p className="text-center text-neutral-400 mb-6">Paste text to check if AI wrote it</p>
        
        <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste text from ChatGPT here..."
            className="w-full h-40 bg-black border border-neutral-800 rounded-xl p-4 text-white outline-none"
          />
          <div className="flex justify-between mt-2 text-sm text-neutral-500">
            <span>{text.length} characters</span>
            <span>{text.split(" ").filter(Boolean).length} words</span>
          </div>
          <button
            onClick={checkAI}
            disabled={loading}
            className="w-full mt-4 bg-white text-black font-bold py-3 rounded-full hover:bg-neutral-200 disabled:opacity-50"
          >
            {loading ? "Checking..." : "Check for AI"}
          </button>
        </div>

        {result && (
          <div className="mt-6 p-6 rounded-xl bg-neutral-900 border border-neutral-800">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2" style={{color: result.confidence > 60 ? '#ef4444' : '#22c55e'}}>
                {result.confidence}%
              </div>
              <div className={`inline-flex px-4 py-2 rounded-full font-bold text-lg ${result.confidence > 60 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                {result.label}
              </div>
              <p className="text-neutral-400 text-sm mt-3">
                {result.confidence > 60 ? "This looks like it was written by AI (ChatGPT etc)" : "This looks like a human wrote it"}
              </p>
            </div>
            <div className="mt-4 h-3 bg-neutral-800 rounded-full overflow-hidden">
              <div className="h-full transition-all" style={{width: `${result.confidence}%`, background: result.confidence > 60 ? '#ef4444' : '#22c55e'}}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
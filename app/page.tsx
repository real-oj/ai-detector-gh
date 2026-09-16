"use client";
import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
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
    } catch (e) {
      setResult({ error: "Failed to check" });
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white flex justify-center p-4">
      <div className="w-full max-w-xl mt-8">
        {/* Header with Ghana Flag */}
        <div className="text-center">
          <div className="flex justify-center gap-1 mb-4">
            <div className="w-10 h-6 bg-[#CE1126] rounded-l"></div>
            <div className="w-10 h-6 bg-[#FCD116] flex justify-center items-center">⭐</div>
            <div className="w-10 h-6 bg-[#006B3F] rounded-r"></div>
          </div>
          <h1 className="text-4xl font-black tracking-tight">AI Detector GH</h1>
          <p className="text-zinc-400 mt-2">Detect AI-written text - Built for Ghana 🇬🇭</p>
        </div>

        {/* Input Card */}
        <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-2xl">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your essay, article or WhatsApp text here..."
            className="w-full h-40 bg-black border border-zinc-800 rounded-xl p-4 text-white placeholder:text-zinc-500 focus:outline-none focus:border-white transition"
          />
          <div className="flex justify-between items-center mt-3 text-xs text-zinc-500">
            <span>{text.length} characters</span>
            <span>{text.split(" ").filter(w=>w).length} words</span>
          </div>
          <button
            onClick={handleCheck}
            disabled={loading || !text.trim()}
            className="w-full mt-4 bg-white text-black font-bold py-3.5 rounded-xl hover:bg-zinc-200 disabled:opacity-50 transition"
          >
            {loading ? "Analyzing..." : "Check for AI"}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="mt-6 bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <h3 className="font-bold mb-3">Result</h3>
            <pre className="text-sm bg-black p-3 rounded-xl overflow-auto text-zinc-300">
              {JSON.stringify(result, null, 2)}
            </pre>
            {result.score !== undefined && (
              <div className="mt-4">
                <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-red-500" style={{width: `${result.score * 100}%`}}></div>
                </div>
                <p className="mt-2 text-center font-bold text-lg">
                  {result.score > 0.7 ? "🔴 Likely AI" : result.score > 0.4 ? "🟡 Maybe AI" : "🟢 Likely Human"}
                </p>
              </div>
            )}
          </div>
        )}

        <p className="text-center text-zinc-600 text-xs mt-8">Made by real-oj • Kumasi, GH</p>
      </div>
    </main>
  );
}
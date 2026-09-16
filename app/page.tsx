"use client";
import { useState } from "react";
export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const handleCheck = async () => {
    setLoading(true);
    const res = await fetch("/api/detect-text", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ text }) });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };
  return (
    <main className="min-h-screen bg-black text-white p-6 flex justify-center">
      <div className="w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center">AI Detector GH</h1>
        <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Paste text..." className="w-full mt-6 bg-zinc-900 border border-zinc-700 rounded-xl p-3 h-32" />
        <button onClick={handleCheck} className="w-full mt-4 bg-white text-black font-bold py-3 rounded-xl">{loading?"Checking...":"Check"}</button>
        {result && <div className="mt-4 p-4 bg-zinc-900 rounded-xl">Score: {JSON.stringify(result)}</div>}
      </div>
    </main>
  );
}
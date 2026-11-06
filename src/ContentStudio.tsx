import React, { useEffect, useState } from "react";
import { ArrowLeft, Sparkles, Copy, Download, Clock3, Trash2, FileText, WandSparkles } from "lucide-react";

type Draft = { id: string; topic: string; channel: string; format: string; createdAt: string; content: string };

const channelProfiles: Record<string, string> = {
  "Wealth Unlock": "Personal finance education in natural Hinglish. Premium, cinematic, practical, beginner-friendly. Explain financial concepts responsibly; never promise guaranteed returns.",
  "VibeRunX": "YouTube growth tips in Hindi/Hinglish. Energetic creator-focused narration, strong hook, practical steps, curiosity loops, clear examples.",
  "Anime": "Anime and donghua explainers in natural Hinglish. Cinematic, emotionally varied narration, canon-aware, distinguish confirmed canon from theories and avoid inventing plot facts.",
  "General": "Clear, engaging YouTube content for a broad audience. Strong opening, useful information and a memorable ending."
};

export default function ContentStudio() {
  const [channel, setChannel] = useState("Wealth Unlock");
  const [topic, setTopic] = useState("");
  const [format, setFormat] = useState("YouTube Short");
  const [language, setLanguage] = useState("Hinglish");
  const [duration, setDuration] = useState("35 seconds");
  const [extra, setExtra] = useState("");
  const [content, setContent] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [drafts, setDrafts] = useState<Draft[]>([]);

  useEffect(() => {
    try { setDrafts(JSON.parse(localStorage.getItem("hariom-content-drafts") || "[]")); } catch { setDrafts([]); }
  }, []);

  const generate = async () => {
    if (!topic.trim()) { setError("Enter a video topic first."); return; }
    setBusy(true); setError(""); setContent("");
    try {
      const response = await fetch("/api/content-pack", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel, topic, format, language, duration, extra, channelProfile: channelProfiles[channel] })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Generation failed.");
      setContent(data.content);
    } catch (e: any) { setError(e.message || "Could not generate content."); }
    finally { setBusy(false); }
  };

  const saveDraft = () => {
    if (!content) return;
    const item: Draft = { id: String(Date.now()), topic, channel, format, createdAt: new Date().toLocaleString(), content };
    const next = [item, ...drafts].slice(0, 50);
    setDrafts(next); localStorage.setItem("hariom-content-drafts", JSON.stringify(next));
  };
  const copy = async () => { if (content) await navigator.clipboard.writeText(content); };
  const download = () => {
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a");
    a.href = url; a.download = (topic.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-") || "content-pack") + ".md";
    a.click(); URL.revokeObjectURL(url);
  };
  const removeDraft = (id: string) => {
    const next = drafts.filter(d => d.id !== id); setDrafts(next);
    localStorage.setItem("hariom-content-drafts", JSON.stringify(next));
  };

  return <div className="min-h-screen bg-[#070817] text-white">
    <header className="border-b border-white/10 bg-[#0b1024]/90">
      <div className="max-w-7xl mx-auto px-5 py-5 flex items-center justify-between">
        <a href="/" className="text-sm text-cyan-300 flex items-center gap-2"><ArrowLeft size={16}/> Back to VoiceClone AI</a>
        <div className="font-black text-xl tracking-tight flex items-center gap-2"><WandSparkles className="text-purple-400"/> Creator Studio</div>
        <span className="text-xs text-gray-500">Draft mode</span>
      </div>
    </header>
    <main className="max-w-7xl mx-auto px-5 py-10">
      <div className="mb-9">
        <p className="text-xs uppercase tracking-[.25em] text-purple-300 font-bold mb-3">One topic. A complete content pack.</p>
        <h1 className="text-4xl md:text-5xl font-black mb-3">Create smarter. <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400">Publish when ready.</span></h1>
        <p className="text-gray-400 max-w-2xl">Generate a script, hooks, titles, SEO metadata and a scene-by-scene visual plan in one workflow. Review everything before using it.</p>
      </div>
      <div className="grid lg:grid-cols-[380px_1fr] gap-6 items-start">
        <section className="rounded-3xl border border-white/10 bg-white/[.04] p-6 space-y-5">
          <h2 className="font-bold text-lg flex items-center gap-2"><Sparkles size={18} className="text-cyan-300"/> Content brief</h2>
          <label className="block text-sm text-gray-400">Channel
            <select value={channel} onChange={e=>setChannel(e.target.value)} className="mt-2 w-full bg-[#11182d] border border-white/10 rounded-xl p-3 text-white">
              {Object.keys(channelProfiles).map(x=><option key={x}>{x}</option>)}
            </select>
          </label>
          <label className="block text-sm text-gray-400">Video topic
            <textarea value={topic} onChange={e=>setTopic(e.target.value)} rows={3} placeholder="e.g. Why saving money feels so difficult" className="mt-2 w-full bg-[#11182d] border border-white/10 rounded-xl p-3 text-white placeholder:text-gray-600"/>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm text-gray-400">Format
              <select value={format} onChange={e=>setFormat(e.target.value)} className="mt-2 w-full bg-[#11182d] border border-white/10 rounded-xl p-3 text-white">
                <option>YouTube Short</option><option>YouTube Long-form</option><option>Instagram Reel</option><option>Community Post</option>
              </select>
            </label>
            <label className="block text-sm text-gray-400">Language
              <select value={language} onChange={e=>setLanguage(e.target.value)} className="mt-2 w-full bg-[#11182d] border border-white/10 rounded-xl p-3 text-white">
                <option>Hinglish</option><option>Hindi</option><option>English</option>
              </select>
            </label>
          </div>
          <label className="block text-sm text-gray-400">Target duration
            <select value={duration} onChange={e=>setDuration(e.target.value)} className="mt-2 w-full bg-[#11182d] border border-white/10 rounded-xl p-3 text-white">
              <option>20 seconds</option><option>35 seconds</option><option>60 seconds</option><option>3 minutes</option><option>8–10 minutes</option><option>15–20 minutes</option>
            </select>
          </label>
          <label className="block text-sm text-gray-400">Extra instructions (optional)
            <textarea value={extra} onChange={e=>setExtra(e.target.value)} rows={2} placeholder="Tone, audience, references, CTA..." className="mt-2 w-full bg-[#11182d] border border-white/10 rounded-xl p-3 text-white placeholder:text-gray-600"/>
          </label>
          <button onClick={generate} disabled={busy || !topic.trim()} className="w-full rounded-xl py-4 font-bold bg-gradient-to-r from-cyan-500 to-purple-600 disabled:opacity-40 flex justify-center items-center gap-2">
            {busy ? <><span className="animate-spin">◌</span> Creating your content pack…</> : <><Sparkles size={18}/> Generate content pack</>}
          </button>
          {error && <p className="text-sm text-red-300">{error}</p>}
          <p className="text-xs text-gray-500">Uses your server-side Gemini API key. API usage may incur charges depending on your Google AI plan.</p>
        </section>
        <section className="rounded-3xl border border-white/10 bg-white/[.04] p-6 min-h-[580px]">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div><h2 className="font-bold text-lg">Your content pack</h2><p className="text-xs text-gray-500 mt-1">Script · hooks · SEO · storyboard · CTA</p></div>
            {content && <div className="flex flex-wrap gap-2">
              <button onClick={copy} className="px-3 py-2 rounded-lg bg-white/10 text-sm flex gap-2 items-center"><Copy size={15}/> Copy</button>
              <button onClick={download} className="px-3 py-2 rounded-lg bg-white/10 text-sm flex gap-2 items-center"><Download size={15}/> Download</button>
              <button onClick={saveDraft} className="px-3 py-2 rounded-lg bg-cyan-500/20 text-cyan-200 text-sm">Save draft</button>
            </div>}
          </div>
          {content ? <article className="whitespace-pre-wrap leading-7 text-gray-200 text-sm">{content}</article> :
            <div className="min-h-[450px] flex flex-col items-center justify-center text-center text-gray-500">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-400/20 flex items-center justify-center mb-4"><FileText className="text-purple-300" size={28}/></div>
              <p className="text-white font-semibold mb-2">Your next video starts here</p><p className="text-sm max-w-sm">Add a topic and generate a complete, editable content pack. Your result will appear here.</p>
            </div>}
        </section>
      </div>
      <section className="mt-8 rounded-3xl border border-white/10 bg-white/[.03] p-6">
        <div className="flex items-center justify-between mb-4"><h2 className="font-bold text-lg flex items-center gap-2"><Clock3 size={18} className="text-cyan-300}/> Saved drafts</h2><span className="text-xs text-gray-500">{drafts.length} saved locally</span></div>
        {drafts.length === 0 ? <p className="text-sm text-gray-500">No saved drafts yet. Generate a pack and choose Save draft.</p> :
          <div className="grid md:grid-cols-2 gap-3">{drafts.map(d=><div key={d.id} className="rounded-xl bg-[#11182d] border border-white/10 p-4 flex items-start gap-3">
            <button onClick={()=>{setTopic(d.topic);setChannel(d.channel);setFormat(d.format);setContent(d.content);window.scrollTo({top:0,behavior:"smooth"});}} className="flex-1 text-left min-w-0"><p className="font-semibold truncate">{d.topic}</p><p className="text-xs text-gray-500 mt-1">{d.channel} · {d.format}</p><p className="text-[11px] text-gray-600 mt-2">{d.createdAt}</p></button>
            <button onClick={()=>removeDraft(d.id)} aria-label="Delete draft" className="text-gray-500 hover:text-red-300 p-2"><Trash2 size={16}/></button>
          </div>)}</div>}
      </section>
    </main>
  </div>;
}

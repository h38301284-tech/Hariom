import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Sparkles, Copy, Download, Clock3, Trash2, FileText, WandSparkles, Layers3, Check, Circle, ListChecks } from "lucide-react";

type Channel = "Wealth Unlock" | "VibeRunX" | "Anime";
type Draft = { id: string; topic: string; channel: string; format: string; createdAt: string; content: string; status?: "Draft" | "Reviewed" };
const channelProfiles: Record<Channel, string> = {
  "Wealth Unlock": "Personal finance education in natural Hinglish. Premium cinematic visuals, practical beginner-friendly explanations. Never promise guaranteed returns or offer personalized financial advice.",
  "VibeRunX": "YouTube growth tips in Hindi/Hinglish. Energetic creator-focused narration, strong hooks, actionable steps, curiosity loops, concrete examples.",
  "Anime": "Anime and donghua explainers in natural Hinglish. Cinematic, emotionally varied narration, canon-aware. Separate confirmed canon from theories and never invent plot facts."
};
const defaultFormats = ["YouTube Short", "YouTube Long-form", "Instagram Reel", "Community Post"];

export default function ContentStudio() {
  const [channels, setChannels] = useState<Channel[]>(["Wealth Unlock", "VibeRunX", "Anime"]);
  const [topic, setTopic] = useState("");
  const [format, setFormat] = useState("YouTube Short");
  const [language, setLanguage] = useState("Hinglish");
  const [duration, setDuration] = useState("35 seconds");
  const [extra, setExtra] = useState("");
  const [results, setResults] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [activeTab, setActiveTab] = useState<"create" | "library">("create");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    try { setDrafts(JSON.parse(localStorage.getItem("hariom-content-drafts") || "[]")); } catch { setDrafts([]); }
  }, []);
  const persist = (next: Draft[]) => { setDrafts(next); localStorage.setItem("hariom-content-drafts", JSON.stringify(next)); };
  const selectedResults = useMemo(() => Object.entries(results), [results]);

  const toggleChannel = (channel: Channel) => setChannels(old => old.includes(channel) ? old.filter(x => x !== channel) : [...old, channel]);
  const generateAll = async () => {
    if (!topic.trim()) { setError("Enter one topic to create channel-specific drafts."); return; }
    if (!channels.length) { setError("Select at least one channel."); return; }
    setBusy(true); setError(""); setResults({});
    const generated: Record<string, string> = {};
    for (let i = 0; i < channels.length; i++) {
      const channel = channels[i];
      setProgress("Creating " + channel + " (" + (i + 1) + "/" + channels.length + ")…");
      try {
        const response = await fetch("/api/content-pack", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ channel, topic, format, language, duration, extra, channelProfile: channelProfiles[channel] })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Generation failed.");
        generated[channel] = data.content;
        setResults({ ...generated });
      } catch (e: any) {
        setError(old => old ? old + "\n" + channel + ": " + (e.message || "failed") : channel + ": " + (e.message || "failed"));
      }
    }
    setProgress("");
    setBusy(false);
  };

  const saveAll = () => {
    const items = Object.entries(results).map(([channel, content]) => ({
      id: channel + "-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7),
      topic, channel, format, createdAt: new Date().toLocaleString(), content, status: "Draft" as const
    }));
    if (!items.length) return;
    persist([...items, ...drafts].slice(0, 100));
    setActiveTab("library");
  };
  const saveOne = (channel: string, content: string) => {
    const item: Draft = { id: channel + "-" + Date.now(), topic, channel, format, createdAt: new Date().toLocaleString(), content, status: "Draft" };
    persist([item, ...drafts].slice(0, 100));
  };
  const copy = async (content: string) => { await navigator.clipboard.writeText(content); };
  const download = (channel: string, content: string) => {
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a");
    a.href = url; a.download = (channel + "-" + topic).toLowerCase().replace(/[^a-z0-9]+/g, "-") + ".md";
    a.click(); URL.revokeObjectURL(url);
  };
  const removeDraft = (id: string) => persist(drafts.filter(d => d.id !== id));
  const markReviewed = (id: string) => persist(drafts.map(d => d.id === id ? { ...d, status: "Reviewed" } : d));
  const openDraft = (d: Draft) => { setTopic(d.topic); setFormat(d.format); setResults({ [d.channel]: d.content }); setActiveTab("create"); };

  const visibleDrafts = drafts.filter(d => filter === "All" || d.channel === filter || d.status === filter);
  return <div className="min-h-screen bg-[#070817] text-white">
    <header className="border-b border-white/10 bg-[#0b1024]/90">
      <div className="max-w-7xl mx-auto px-5 py-5 flex items-center justify-between">
        <a href="/" className="text-sm text-cyan-300 flex items-center gap-2"><ArrowLeft size={16}/> Back to VoiceClone AI</a>
        <div className="font-black text-xl tracking-tight flex items-center gap-2"><WandSparkles className="text-purple-400"/> Creator Studio</div>
        <span className="text-xs text-gray-400 border border-cyan-400/20 rounded-full px-3 py-1">Draft-only workspace</span>
      </div>
    </header>
    <main className="max-w-7xl mx-auto px-5 py-10">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[.25em] text-purple-300 font-bold mb-3">Multi-channel content pipeline</p>
        <h1 className="text-4xl md:text-5xl font-black mb-3">One idea. <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400">Three channel-ready drafts.</span></h1>
        <p className="text-gray-400 max-w-3xl">Create distinct content packs for Wealth Unlock, VibeRunX and Anime from one topic. Review, save, and organize every result. Nothing is published or scheduled.</p>
      </div>
      <div className="flex gap-2 mb-6">
        <button onClick={()=>setActiveTab("create")} className={"px-4 py-2 rounded-xl text-sm font-semibold " + (activeTab==="create" ? "bg-cyan-500 text-white" : "bg-white/5 text-gray-400")}>Create content</button>
        <button onClick={()=>setActiveTab("library")} className={"px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 " + (activeTab==="library" ? "bg-cyan-500 text-white" : "bg-white/5 text-gray-400")}><Layers3 size={15}/> Draft library ({drafts.length})</button>
      </div>
      {activeTab === "create" ? <>
        <div className="grid lg:grid-cols-[380px_1fr] gap-6 items-start">
          <section className="rounded-3xl border border-white/10 bg-white/[.04] p-6 space-y-5">
            <h2 className="font-bold text-lg flex items-center gap-2"><Sparkles size={18} className="text-cyan-300"/> Campaign brief</h2>
            <div>
              <p className="text-sm text-gray-400 mb-3">Generate for channels</p>
              <div className="space-y-2">{(["Wealth Unlock", "VibeRunX", "Anime"] as Channel[]).map(ch=><label key={ch} className="flex items-center gap-3 p-3 rounded-xl bg-[#11182d] border border-white/10 cursor-pointer">
                <input type="checkbox" checked={channels.includes(ch)} onChange={()=>toggleChannel(ch)} className="accent-cyan-400 w-4 h-4"/>
                <span className="text-sm font-medium">{ch}</span><span className="ml-auto text-xs text-gray-500">{ch==="Wealth Unlock"?"Finance":ch==="VibeRunX"?"Creator tips":"Anime"}</span>
              </label>)}</div>
            </div>
            <label className="block text-sm text-gray-400">Core topic
              <textarea value={topic} onChange={e=>setTopic(e.target.value)} rows={3} placeholder="e.g. Why consistency beats motivation" className="mt-2 w-full bg-[#11182d] border border-white/10 rounded-xl p-3 text-white placeholder:text-gray-600"/>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm text-gray-400">Format
                <select value={format} onChange={e=>setFormat(e.target.value)} className="mt-2 w-full bg-[#11182d] border border-white/10 rounded-xl p-3 text-white">{defaultFormats.map(x=><option key={x}>{x}</option>)}</select>
              </label>
              <label className="block text-sm text-gray-400">Language
                <select value={language} onChange={e=>setLanguage(e.target.value)} className="mt-2 w-full bg-[#11182d] border border-white/10 rounded-xl p-3 text-white"><option>Hinglish</option><option>Hindi</option><option>English</option></select>
              </label>
            </div>
            <label className="block text-sm text-gray-400">Target duration
              <select value={duration} onChange={e=>setDuration(e.target.value)} className="mt-2 w-full bg-[#11182d] border border-white/10 rounded-xl p-3 text-white"><option>20 seconds</option><option>35 seconds</option><option>60 seconds</option><option>3 minutes</option><option>8–10 minutes</option><option>15–20 minutes</option></select>
            </label>
            <label className="block text-sm text-gray-400">Extra instructions
              <textarea value={extra} onChange={e=>setExtra(e.target.value)} rows={2} placeholder="Tone, audience, visual rules, CTA..." className="mt-2 w-full bg-[#11182d] border border-white/10 rounded-xl p-3 text-white placeholder:text-gray-600"/>
            </label>
            <button onClick={generateAll} disabled={busy || !topic.trim() || !channels.length} className="w-full rounded-xl py-4 font-bold bg-gradient-to-r from-cyan-500 to-purple-600 disabled:opacity-40 flex justify-center items-center gap-2">
              {busy ? <><span className="animate-spin">◌</span>{progress}</> : <><Sparkles size={18}/> Generate for selected channels</>}
            </button>
            {error && <p className="text-sm text-red-300 whitespace-pre-wrap">{error}</p>}
            <p className="text-xs text-gray-500">Each selected channel gets its own AI generation request. API quota/cost may apply per channel. Nothing is sent to social platforms.</p>
          </section>
          <section className="rounded-3xl border border-white/10 bg-white/[.04] p-6 min-h-[580px]">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <div><h2 className="font-bold text-lg">Generated drafts</h2><p className="text-xs text-gray-500 mt-1">Separate scripts, hooks, storyboards and SEO for each channel</p></div>
              {selectedResults.length > 0 && <button onClick={saveAll} className="px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-200 text-sm font-semibold">Save all as drafts</button>}
            </div>
            {selectedResults.length ? <div className="space-y-5">{selectedResults.map(([channel, content])=><article key={channel} className="rounded-2xl bg-[#10172b] border border-white/10 p-5">
              <div className="flex flex-wrap justify-between gap-3 mb-4"><div><h3 className="font-bold text-lg">{channel}</h3><p className="text-xs text-gray-500">{topic} · {format}</p></div><span className="text-[11px] text-cyan-200 bg-cyan-400/10 border border-cyan-300/20 rounded-full px-3 py-1 h-fit">Draft preview</span></div>
              <article className="whitespace-pre-wrap leading-7 text-gray-200 text-sm max-h-[520px] overflow-auto">{content}</article>
              <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-white/10">
                <button onClick={()=>copy(content)} className="px-3 py-2 rounded-lg bg-white/10 text-sm flex gap-2 items-center"><Copy size={15}/> Copy</button>
                <button onClick={()=>download(channel,content)} className="px-3 py-2 rounded-lg bg-white/10 text-sm flex gap-2 items-center"><Download size={15}/> Download</button>
                <button onClick={()=>saveOne(channel,content)} className="px-3 py-2 rounded-lg bg-cyan-500/20 text-cyan-200 text-sm">Save this draft</button>
              </div>
            </article>)}</div> :
              <div className="min-h-[450px] flex flex-col items-center justify-center text-center text-gray-500"><div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-400/20 flex items-center justify-center mb-4"><FileText className="text-purple-300" size={28}/></div><p className="text-white font-semibold mb-2">Your campaign drafts will appear here</p><p className="text-sm max-w-sm">Choose one or more channels, enter a topic and generate separate content packs.</p></div>}
          </section>
        </div>
      </> : <section className="rounded-3xl border border-white/10 bg-white/[.04] p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5"><div><h2 className="font-bold text-xl flex items-center gap-2"><ListChecks size={20} className="text-cyan-300"/> Draft library</h2><p className="text-sm text-gray-500 mt-1">Saved locally in this browser. Review status is for your own workflow.</p></div>
          <select value={filter} onChange={e=>setFilter(e.target.value)} className="bg-[#11182d] border border-white/10 rounded-xl p-2 text-sm"><option>All</option><option>Wealth Unlock</option><option>VibeRunX</option><option>Anime</option><option>Draft</option><option>Reviewed</option></select>
        </div>
        {visibleDrafts.length===0 ? <p className="text-gray-500 text-sm">No drafts match this filter.</p> : <div className="grid md:grid-cols-2 gap-3">{visibleDrafts.map(d=><div key={d.id} className="rounded-2xl bg-[#11182d] border border-white/10 p-4">
          <div className="flex justify-between gap-2"><div className="min-w-0"><p className="font-semibold truncate">{d.topic}</p><p className="text-xs text-gray-500 mt-1">{d.channel} · {d.format}</p><p className="text-[11px] text-gray-600 mt-2">{d.createdAt}</p></div><span className="text-[10px] text-cyan-200 bg-cyan-500/10 rounded-full px-2 py-1 h-fit">{d.status || "Draft"}</span></div>
          <div className="flex gap-2 mt-4"><button onClick={()=>openDraft(d)} className="text-xs bg-white/10 rounded-lg px-3 py-2">Open</button>{d.status!=="Reviewed" && <button onClick={()=>markReviewed(d.id)} className="text-xs bg-emerald-500/10 text-emerald-200 rounded-lg px-3 py-2 flex gap-1 items-center"><Check size={13}/> Mark reviewed</button>}<button onClick={()=>removeDraft(d.id)} className="ml-auto text-gray-500 hover:text-red-300 p-2"><Trash2 size={15}/></button></div>
        </div>)}</div>}
      </section>}
      <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4 text-sm text-amber-100/80">Safety lock: this workflow only generates and stores drafts. It has no publish, schedule, upload, or social-account action.</div>
    </main>
  </div>;
}

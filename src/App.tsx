import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Mic, 
  Upload, 
  Play, 
  Music, 
  Languages, 
  Sparkles, 
  ChevronRight, 
  Volume2, 
  Loader2,
  Trash2,
  Download,
  Settings,
  CheckCircle2,
  Lock,
  ExternalLink,
  Globe,
  Settings2,
  Activity,
  User
} from "lucide-react";
import axios from "axios";
import { INDIAN_LANGUAGES, GLOBAL_LANGUAGES, AI_FEATURES, PRICING_PLANS } from "./constants";

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [voiceName, setVoiceName] = useState("");
  const [stability, setStability] = useState(0.5);
  const [similarityBoost, setSimilarityBoost] = useState(0.75);
  const [language, setLanguage] = useState("hi-IN");
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultAudio, setResultAudio] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Admin States
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [siteStatus, setSiteStatus] = useState<any>(null);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await axios.get("/api/admin/status");
      setSiteStatus(res.data);
    } catch (e) {
      console.error("Status fetch failed");
    }
  };

  const toggleMaintenance = async () => {
    try {
      await axios.post("/api/admin/toggle-maintenance", { password: adminPassword });
      fetchStatus();
      setAdminPassword("");
      alert("Status toggled successfully");
    } catch (err: any) {
      alert(err.response?.data?.error || "Unauthorized");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleGenerate = async () => {
    if (!file || !text) {
      setError("Please provide both an audio sample and text.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setResultAudio(null);

    const formData = new FormData();
    formData.append("sample", file);
    formData.append("text", text);
    formData.append("voiceName", voiceName || "Custom Voice");
    formData.append("stability", stability.toString());
    formData.append("similarityBoost", similarityBoost.toString());
    formData.append("language", language);

    try {
      const response = await axios.post("/api/clone-and-speak", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResultAudio(`data:audio/mpeg;base64,${response.data.audio}`);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to generate voice. Please check your API key.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadAudio = () => {
    if (!resultAudio) return;
    const link = document.createElement("a");
    link.href = resultAudio;
    link.download = "voiceclone_output.mp3";
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white font-sans selection:bg-purple-500/30 overflow-x-hidden">
      {/* Background Image/Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <img 
          src="/src/assets/images/voiceclone_hero_bg_1779090204050.png" 
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-screen"
          alt=""
        />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <nav className="relative z-10 flex justify-between p-6 items-center max-w-7xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent flex items-center gap-2"
        >
          <Mic className="text-cyan-400" />
          VoiceClone AI
        </motion.h1>

        <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-400">
          <a href="#" className="hover:text-cyan-400 transition-colors">Home</a>
          <a href="#" className="hover:text-cyan-400 transition-colors text-cyan-300">Voice Studio</a>
          <a href="#pricing" className="hover:text-cyan-400 transition-colors">Pricing</a>
          <a href="mailto:h38301284@gmail.com" className="hover:text-cyan-400 transition-colors">Contact</a>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Neural Latency</span>
            <span className="text-[10px] text-green-400 flex items-center gap-1"><div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" /> 142ms</span>
          </div>
          <button className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-6 py-2 rounded-xl text-sm font-bold hover:bg-cyan-500 hover:text-white transition-all duration-300">
            Upgrade Pro
          </button>
        </div>
      </nav>

      <main className="relative z-10 px-6">
        {/* Hero Section */}
        <section className="text-center py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/5 border border-cyan-500/20 text-cyan-400 text-xs font-bold tracking-wider uppercase mb-6">
              AI-Powered Neural Synthesis
            </span>
            <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
              Clone Any <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent italic">Voice</span><br />
              Generate Magic Instantly
            </h1>
            <p className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl mb-10 leading-relaxed text-balance">
              Upload just 10 seconds of clear audio and create a digital twin. 
              Speak 50+ languages with your unique identity.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => document.getElementById('studio')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-cyan-500 px-8 py-4 rounded-2xl font-bold shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_50px_rgba(6,182,212,0.6)] transition-all flex items-center gap-2 group"
              >
                Start Creating <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="bg-white/5 border border-white/10 backdrop-blur-md px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all">
                Watch Demo
              </button>
            </div>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-20 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Neural Infrastructure</h2>
            <p className="text-gray-500">Built for scale, tuned for perfection.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {AI_FEATURES.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#0a0f25] border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Activity className="text-cyan-400" />
                </div>
                <h2 className="text-xl font-bold mb-4">{feature.title}</h2>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Studio Section */}
        <section id="studio" className="pb-24 max-w-5xl mx-auto text-balance">
          {siteStatus?.isMaintenanceMode && (
            <div className="mb-8 p-6 rounded-3xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 flex items-center gap-4">
              <Lock size={24} />
              <div>
                <p className="font-bold">Maintenance Mode Active</p>
                <p className="text-sm opacity-80">The system is currently undergoing optimization. Generation is temporarily disabled.</p>
              </div>
            </div>
          )}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-8 md:p-12 rounded-[2.5rem] bg-indigo-950/20 border border-white/10 backdrop-blur-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-1/2 -translate-y-1/2">
              <Sparkles size={120} className="text-cyan-400" />
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Voice AI Studio
              </h2>
              <p className="text-gray-400 mb-10">Configure your parameters and synthesize audio.</p>

              <div className="space-y-8">
                {/* Upload Area */}
                <div>
                  <label className="text-sm font-bold text-gray-500 uppercase tracking-widest block mb-4">
                    Voice Sample (MP3/WAV)
                  </label>
                  {!file ? (
                    <div className="relative group">
                      <input 
                        type="file" 
                        onChange={handleFileChange}
                        accept="audio/*"
                        className="absolute inset-0 opacity-0 cursor-pointer z-20"
                      />
                      <div className="w-full h-40 rounded-3xl border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center group-hover:border-cyan-500/50 group-hover:bg-cyan-500/5 transition-all">
                        <Upload className="text-gray-500 group-hover:text-cyan-400 mb-4" size={40} />
                        <p className="text-gray-400">Click or drag your sample here</p>
                        <p className="text-xs text-gray-600 mt-2">Max 10MB • Clear vocal recommended</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 p-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30">
                      <div className="w-12 h-12 rounded-xl bg-cyan-500 flex items-center justify-center">
                        <Volume2 className="text-white" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-cyan-400 font-bold truncate">{file.name}</p>
                        <p className="text-xs text-cyan-400/60">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                      <button 
                        onClick={() => setFile(null)}
                        className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Emotional Tuning Sliders */}
                <div className="bg-[#111827]/50 rounded-[2rem] p-8 border border-white/5">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <Settings2 size={20} className="text-purple-400" />
                    Emotional Tuning
                  </h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400 uppercase font-bold tracking-wider text-xs">Stability</span>
                        <span className="text-cyan-400 font-mono">{(stability * 100).toFixed(0)}%</span>
                      </div>
                      <input 
                        type="range" min="0" max="1" step="0.01" 
                        value={stability} onChange={(e) => setStability(parseFloat(e.target.value))}
                        className="w-full accent-cyan-500 bg-white/10 h-1.5 rounded-full appearance-none cursor-pointer"
                      />
                      <p className="text-[10px] text-gray-500">Lower: more emotive/variable. Higher: more consistent.</p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400 uppercase font-bold tracking-wider text-xs">Similarity Boost</span>
                        <span className="text-purple-400 font-mono">{(similarityBoost * 100).toFixed(0)}%</span>
                      </div>
                      <input 
                        type="range" min="0" max="1" step="0.01" 
                        value={similarityBoost} onChange={(e) => setSimilarityBoost(parseFloat(e.target.value))}
                        className="w-full accent-purple-500 bg-white/10 h-1.5 rounded-full appearance-none cursor-pointer"
                      />
                      <p className="text-[10px] text-gray-500">Accentuates the unique characteristics of the voice.</p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                   <div>
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-widest block mb-4">
                      Voice Name
                    </label>
                    <input 
                      type="text"
                      placeholder="My Digital Twin"
                      value={voiceName}
                      onChange={(e) => setVoiceName(e.target.value)}
                      className="w-full bg-[#111827] border border-white/10 rounded-2xl p-5 focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-widest block mb-4">
                      Primary Language
                    </label>
                    <select 
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full bg-[#111827] border border-white/10 rounded-2xl p-5 focus:outline-none focus:border-cyan-500/50 appearance-none cursor-pointer"
                    >
                      <optgroup label="Indian Languages">
                        {INDIAN_LANGUAGES.map(lang => (
                          <option key={lang.code} value={lang.code}>{lang.name} ({lang.script})</option>
                        ))}
                      </optgroup>
                      <optgroup label="Global Languages">
                        {GLOBAL_LANGUAGES.map(lang => (
                          <option key={lang} value={lang}>{lang}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-500 uppercase tracking-widest block mb-4">
                    Text to Synthesize
                  </label>
                  <textarea 
                    rows={4}
                    placeholder="Type the words you want your cloned voice to speak..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full bg-[#111827] border border-white/10 rounded-3xl p-6 focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-gray-700 resize-none"
                  ></textarea>
                </div>

                {error && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating || !file || !text || siteStatus?.isMaintenanceMode}
                  className="w-full h-16 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl font-black text-xl hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-[0_0_40px_rgba(139,92,246,0.3)] flex items-center justify-center gap-3"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="animate-spin" /> Synthesizing Voice...
                    </>
                  ) : (
                    <>
                      Generate Voice Synthesis
                    </>
                  )
                }
                </button>

                <AnimatePresence>
                  {resultAudio && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-10 p-8 rounded-3xl bg-cyan-500/5 border border-cyan-500/20"
                    >
                      <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Sparkles size={20} className="text-cyan-400" />
                        Synthesis Result
                      </h3>
                      <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="flex-1 w-full">
                          <audio ref={audioRef} controls src={resultAudio} className="w-full hidden" />
                          <div className="flex items-center gap-4">
                            <button 
                              onClick={() => audioRef.current?.play()}
                              className="w-16 h-16 rounded-full bg-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/30 hover:scale-105 transition-transform"
                            >
                              <Play className="text-white fill-current" />
                            </button>
                            <div className="flex-1 h-2 bg-white/10 rounded-full relative overflow-hidden">
                              <motion.div 
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 5 }}
                                className="absolute inset-0 bg-cyan-500" 
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={downloadAudio}
                            className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                            title="Download Audio"
                          >
                            <Download size={20} className="group-hover:text-cyan-400" />
                          </button>
                          <button 
                            onClick={() => setResultAudio(null)}
                            className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                            title="Reset"
                          >
                            <Trash2 size={20} className="group-hover:text-red-400" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Upgrade to Pro</h2>
            <p className="text-gray-500">Pick the perfect plan for your synthesis needs.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 px-4">
            {PRICING_PLANS.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className={`relative p-8 rounded-[3rem] border ${plan.popular ? 'bg-gradient-to-b from-cyan-500/10 to-transparent border-cyan-500/30' : 'bg-white/5 border-white/10'} backdrop-blur-xl`}
              >
                {plan.popular && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-cyan-500 text-white text-[10px] font-black uppercase px-4 py-1 rounded-full shadow-lg shadow-cyan-500/40">
                    Most Popular
                  </span>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-black">${plan.price}</span>
                  <span className="text-gray-500">/mo</span>
                </div>
                <ul className="space-y-4 mb-10">
                  {plan.features.map((feat, k) => (
                    <li key={k} className="flex items-center gap-3 text-sm text-gray-400">
                      <CheckCircle2 size={16} className="text-cyan-400 shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-4 rounded-2xl font-bold transition-all ${plan.popular ? 'bg-cyan-500 hover:shadow-lg hover:shadow-cyan-500/20' : 'bg-white/10 hover:bg-white/20'}`}>
                  {plan.button}
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Global Languages Section */}
        <section className="py-20 text-center">
          <h2 className="text-4xl font-bold mb-12">Universal Language Support</h2>
          <div className="flex flex-wrap justify-center gap-2 max-w-5xl mx-auto opacity-40 hover:opacity-100 transition-opacity">
            {GLOBAL_LANGUAGES.map(lang => (
              <span key={lang} className="px-6 py-2 rounded-full border border-white/10 bg-white/5 text-sm font-medium">
                {lang}
              </span>
            ))}
            <span className="px-6 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-sm font-medium">
               +32 more
            </span>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-12 px-6 bg-[#030610]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
            <div className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-gray-200 to-gray-500 bg-clip-text text-transparent">
              <Mic size={20} className="text-gray-500" />
              VoiceClone AI
            </div>
            
            <div className="flex items-center gap-8 text-gray-500 text-sm font-medium">
              <button 
                onClick={() => setIsAdminOpen(!isAdminOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:text-white transition-colors border border-white/5"
              >
                <Settings size={16} /> Manage
              </button>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-cyan-500/5 px-4 text-cyan-400/70">
                 <User size={14} /> Owner: {siteStatus?.owner || "Hariom"}
              </div>
            </div>
          </div>

          <AnimatePresence>
            {isAdminOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-white/5 pt-8 mb-8"
              >
                <div className="max-w-md mx-auto space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500">Admin Controls</h4>
                  <div className="flex gap-2">
                    <input 
                      type="password" 
                      placeholder="Enter Admin Password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm"
                    />
                    <button 
                      onClick={toggleMaintenance}
                      className="px-6 py-3 bg-red-500 rounded-xl font-bold text-sm"
                    >
                      {siteStatus?.isMaintenanceMode ? "Turn Site ON" : "Turn Site OFF"}
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-600">Admin password required for state-level overrides. Toggle carefully.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/5 pt-8">
            <p className="text-gray-500 text-sm italic">
              © 2026 Neural Synthesis Systems. All rights reserved. 
              <span className="ml-2 px-2 py-0.5 rounded-lg border border-white/10 bg-white/5 not-italic">v1.2.4-stable</span>
            </p>
            <div className="flex space-x-6 text-gray-500 text-sm">
              <a href="mailto:h38301284@gmail.com" className="hover:text-white transition-colors flex items-center gap-1"><ExternalLink size={14} /> Support</a>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Documentation</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}


export const INDIAN_LANGUAGES = [
  { name: "Hindi", code: "hi-IN", script: "Devanagari", support: ["TTS", "Voice Clone", "Translation"] },
  { name: "English (India)", code: "en-IN", script: "Latin", support: ["TTS", "Voice Clone", "Translation"] },
  { name: "Bengali", code: "bn-IN", script: "Bengali", support: ["TTS", "Voice Clone", "Translation"] },
  { name: "Tamil", code: "ta-IN", script: "Tamil", support: ["TTS", "Voice Clone", "Translation"] },
  { name: "Telugu", code: "te-IN", script: "Telugu", support: ["TTS", "Voice Clone", "Translation"] },
  { name: "Kannada", code: "kn-IN", script: "Kannada", support: ["TTS", "Voice Clone", "Translation"] },
  { name: "Malayalam", code: "ml-IN", script: "Malayalam", support: ["TTS", "Voice Clone", "Translation"] },
  { name: "Gujarati", code: "gu-IN", script: "Gujarati", support: ["TTS", "Voice Clone", "Translation"] },
  { name: "Marathi", code: "mr-IN", script: "Devanagari", support: ["TTS", "Voice Clone", "Translation"] },
  { name: "Punjabi", code: "pa-IN", script: "Gurmukhi", support: ["TTS", "Voice Clone", "Translation"] },
  { name: "Urdu", code: "ur-IN", script: "Perso-Arabic", support: ["TTS", "Voice Clone", "Translation"] },
  { name: "Odia", code: "or-IN", script: "Odia", support: ["TTS", "Voice Clone", "Translation"] },
  { name: "Assamese", code: "as-IN", script: "Assamese", support: ["TTS", "Voice Clone", "Translation"] },
];

export const GLOBAL_LANGUAGES = [
  "Arabic", "Chinese", "Japanese", "Korean", "Russian", "French", "German", 
  "Spanish", "Portuguese", "Italian", "Turkish", "Thai", "Vietnamese", 
  "Indonesian", "Malay", "Dutch", "Polish", "Greek", "Swedish"
];

export const AI_FEATURES = [
  { title: "Real Time Voice Clone", desc: "Clone voices with zero latency for live streams." },
  { title: "AI Translation", desc: "Translate speech while maintaining your unique voice print." },
  { title: "Emotion Control", desc: "Fine-tune stability and clarity for perfect emotional delivery." },
  { title: "Unlimited Generation", desc: "No caps on long-form audiobooks or podcast scripts." },
  { title: "Ultra HD Audio", desc: "44.1kHz studio quality neural synthesis." },
  { title: "Voice Isolator", desc: "Remove background noise from any voice sample automatically." }
];

export const PRICING_PLANS = [
  {
    name: "Free",
    price: "0",
    features: ["5 Generations/day", "Standard Quality", "Basic Support", "3 Saved Voices"],
    button: "Current Plan",
    popular: false
  },
  {
    name: "Pro",
    price: "19",
    features: ["Unlimited Generations", "Ultra HD Quality", "Emotion Tuning", "Priority Support"],
    button: "Upgrade to Pro",
    popular: true
  },
  {
    name: "Enterprise",
    price: "99",
    features: ["Commercial License", "Private Models", "API Access", "Dedicated Account Manager"],
    button: "Contact Sales",
    popular: false
  }
];

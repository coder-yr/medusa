// Browser-only Groq client (MVP: no backend). Key lives in localStorage or VITE_GROQ_API_KEY.
const URL_ = "https://api.groq.com/openai/v1/chat/completions";
export const MODELS = {
  text: "qwen/qwen3.8-27b",
  vision: "meta-llama/llama-4-scout-17b-16e-instruct",
};
export type Msg = { role: "system" | "user" | "assistant"; content: string | unknown[] };

export const getKey = (): string => {
  const k = (import.meta.env.VITE_GROQ_API_KEY as string | undefined) || localStorage.getItem("medora.groqKey") || "";
  return k.trim();
};
export const setKey = (k: string) => (k ? localStorage.setItem("medora.groqKey", k.trim()) : localStorage.removeItem("medora.groqKey"));

export const LANGS: { name: string; bcp: string }[] = [
  { name: "English (UK)", bcp: "en-GB" }, { name: "Hindi", bcp: "hi-IN" }, { name: "Bengali", bcp: "bn-IN" },
  { name: "Urdu", bcp: "ur-PK" }, { name: "Punjabi", bcp: "pa-IN" }, { name: "Gujarati", bcp: "gu-IN" },
  { name: "Polish", bcp: "pl-PL" }, { name: "Arabic", bcp: "ar-SA" }, { name: "Spanish", bcp: "es-ES" },
  { name: "French", bcp: "fr-FR" }, { name: "Romanian", bcp: "ro-RO" },
];
export type Prefs = { lang: string; simple: boolean; large: 0 | 1 | 2; contrast: boolean; voiceReply: boolean };
export const DEFAULT_PREFS: Prefs = { lang: "English (UK)", simple: false, large: 0, contrast: false, voiceReply: false };
export const getPrefs = (): Prefs => {
  try { return { ...DEFAULT_PREFS, ...JSON.parse(localStorage.getItem("medora.prefs") || "{}") }; } catch { return DEFAULT_PREFS; }
};
export const bcpFor = (lang: string) => LANGS.find((l) => l.name === lang)?.bcp ?? "en-GB";

export const BASE = `You are Medora, an AI healthcare navigation companion for people in London and the UK (NHS, private and community care).
You are NOT a doctor: never give a definitive diagnosis and never change prescribed treatment. Be warm, clear and concise. Use UK terms (GP, A&E, NHS 111, 999, Pharmacy First).
If there are red-flag symptoms (chest pain, stroke signs, severe breathing difficulty, heavy bleeding, thoughts of self-harm, etc.) tell the person to call 999 immediately.
End clinical guidance with a short reminder to confirm with a clinician.`;

export function withPrefs(system: string): string {
  const p = getPrefs();
  let s = `${BASE}\n\n${system}`;
  if (p.lang !== "English (UK)") s += `\n\nWrite ALL user-facing text in ${p.lang}. If asked to return JSON, keep the JSON keys in English but write the values in ${p.lang}.`;
  if (p.simple) s += `\n\nSIMPLE LANGUAGE MODE: use very plain words, short sentences (reading age about 9), no jargon; explain any medical word in brackets.`;
  return s;
}

async function fail(res: Response): Promise<Error> {
  let detail = "";
  try { detail = (await res.json())?.error?.message ?? ""; } catch { /* ignore */ }
  if (res.status === 401) return new Error("Invalid Groq API key. Click the key icon (top right) to update it.");
  if (res.status === 429) return new Error("Groq rate limit hit — wait a few seconds and try again.");
  return new Error(`Groq error ${res.status}${detail ? `: ${detail}` : ""}`);
}
function headers() {
  const k = getKey();
  if (!k) { window.dispatchEvent(new Event("medora:key")); throw new Error("Add your Groq API key first (key icon, top right)."); }
  return { "Content-Type": "application/json", Authorization: `Bearer ${k}` };
}
type Opts = { model?: string; temperature?: number; max_tokens?: number };

export async function chat(messages: Msg[], o: Opts = {}): Promise<string> {
  const res = await fetch(URL_, { method: "POST", headers: headers(), body: JSON.stringify({ model: o.model ?? MODELS.text, messages, temperature: o.temperature ?? 0.4, max_tokens: o.max_tokens ?? 1500 }) });
  if (!res.ok) throw await fail(res);
  return (await res.json()).choices?.[0]?.message?.content ?? "";
}

export async function chatStream(messages: Msg[], onText: (full: string) => void, o: Opts = {}): Promise<string> {
  const res = await fetch(URL_, { method: "POST", headers: headers(), body: JSON.stringify({ model: o.model ?? MODELS.text, messages, temperature: o.temperature ?? 0.5, max_tokens: o.max_tokens ?? 1200, stream: true }) });
  if (!res.ok || !res.body) throw await fail(res);
  const reader = res.body.getReader(); const dec = new TextDecoder();
  let buf = "", full = "";
  for (;;) {
    const { done, value } = await reader.read(); if (done) break;
    buf += dec.decode(value, { stream: true });
    const lines = buf.split("\n"); buf = lines.pop() ?? "";
    for (const l of lines) {
      if (!l.startsWith("data:")) continue;
      const d = l.slice(5).trim(); if (!d || d === "[DONE]") continue;
      try { const t = JSON.parse(d).choices?.[0]?.delta?.content; if (t) { full += t; onText(full); } } catch { /* partial */ }
    }
  }
  return full;
}

export async function chatJSON<T>(messages: Msg[], o: Opts = {}): Promise<T> {
  const res = await fetch(URL_, { method: "POST", headers: headers(), body: JSON.stringify({ model: o.model ?? MODELS.text, messages, temperature: o.temperature ?? 0.2, max_tokens: o.max_tokens ?? 2200, response_format: { type: "json_object" } }) });
  if (!res.ok) throw await fail(res);
  const txt: string = (await res.json()).choices?.[0]?.message?.content ?? "{}";
  try { return JSON.parse(txt) as T; } catch {
    const m = txt.match(/\{[\s\S]*\}/); if (m) return JSON.parse(m[0]) as T;
    throw new Error("AI returned an unreadable answer — please retry.");
  }
}

/** Convenience: system prompt + user text -> JSON */
export const askJSON = <T,>(system: string, user: string, o?: Opts) =>
  chatJSON<T>([{ role: "system", content: withPrefs(system + "\nReturn ONLY valid JSON, no prose.") }, { role: "user", content: user }], o);

export async function visionExtract(dataUrl: string, prompt: string): Promise<string> {
  return chat([{ role: "user", content: [{ type: "text", text: prompt }, { type: "image_url", image_url: { url: dataUrl } }] }], { model: MODELS.vision, max_tokens: 2000 });
}

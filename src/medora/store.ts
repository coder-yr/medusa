import { useCallback, useEffect, useState } from "react";
import { DEFAULT_PREFS, type Prefs } from "./groq";

const L = new Set<() => void>();
const rd = <T,>(k: string, d: T): T => { try { const v = localStorage.getItem(k); return v ? (JSON.parse(v) as T) : d; } catch { return d; } };
const wr = (k: string, v: unknown) => { localStorage.setItem(k, JSON.stringify(v)); L.forEach((f) => f()); };

export function useLS<T>(key: string, initial: T) {
  const [v, setV] = useState<T>(() => rd(key, initial));
  useEffect(() => {
    setV(rd(key, initial));
    const f = () => setV(rd(key, initial));
    L.add(f); return () => { L.delete(f); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const set = useCallback((n: T | ((p: T) => T)) => wr(key, typeof n === "function" ? (n as (p: T) => T)(rd(key, initial)) : n),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key]);
  return [v, set] as const;
}

export const uid = () => Math.random().toString(36).slice(2, 9);
export const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const addDays = (n: number) => { const d = new Date(); d.setDate(d.getDate() + n); return iso(d); };
export const today = () => iso(new Date());
export const ageOf = (dob: string) => Math.floor((Date.now() - new Date(dob).getTime()) / 31557600000);

export type Profile = { id: string; name: string; relation: string; dob: string; allergies: string; conditions: string };
export type Med = { id: string; name: string; dose: string; times: string[]; notes: string; refill?: string };
export type Prep = { checklist: string[]; questions: string[]; bring: string[]; tips: string };
export type Appt = { id: string; title: string; with: string; date: string; time: string; place: string; status: "Upcoming" | "Requested" | "Cancelled" | "Completed"; prep?: Prep };
export type Ev = { id: string; date: string; type: "visit" | "test" | "vaccine" | "medication" | "document" | "note"; title: string; detail: string };
export type PlanStep = { id: string; title: string; detail: string; kind: string; dueInDays: number; done: boolean };
export type Plan = { title: string; summary: string; steps: PlanStep[] };

const SEED_PROFILES: Profile[] = [
  { id: "me", name: "Priya Sharma", relation: "Myself", dob: "1988-04-12", allergies: "Penicillin", conditions: "Type 2 diabetes (diet-controlled), Asthma" },
  { id: "arjun", name: "Arjun Sharma", relation: "Son", dob: "2018-09-03", allergies: "Peanuts", conditions: "" },
  { id: "meera", name: "Meera Sharma", relation: "Mother", dob: "1952-01-21", allergies: "None known", conditions: "Hypertension, Osteoarthritis" },
];
export const useProfiles = () => useLS<Profile[]>("medora.profiles", SEED_PROFILES);
export function useActive() {
  const [ps] = useProfiles(); const [id, setActive] = useLS<string>("medora.active", "me");
  return { profile: ps.find((p) => p.id === id) ?? ps[0], setActive, profiles: ps };
}
export const usePrefs = () => useLS<Prefs>("medora.prefs", DEFAULT_PREFS);

/** Per-profile data */
export function usePData<T>(name: string, seed: (pid: string) => T) {
  const { profile } = useActive();
  return useLS<T>(`medora.d.${profile.id}.${name}`, seed(profile.id));
}
export const seedMeds = (pid: string): Med[] =>
  pid === "me" ? [
    { id: "m1", name: "Metformin", dose: "500 mg", times: ["08:00", "20:00"], notes: "With food", refill: addDays(9) },
    { id: "m2", name: "Atorvastatin", dose: "20 mg", times: ["21:00"], notes: "", refill: addDays(21) },
    { id: "m3", name: "Salbutamol inhaler", dose: "100 mcg", times: [], notes: "As needed for wheeze", refill: addDays(45) },
  ] : pid === "meera" ? [
    { id: "m4", name: "Amlodipine", dose: "5 mg", times: ["08:00"], notes: "", refill: addDays(5) },
    { id: "m5", name: "Ibuprofen", dose: "200 mg", times: [], notes: "As needed for knee pain", refill: "" },
  ] : [];
export const seedAppts = (pid: string): Appt[] =>
  pid === "me" ? [{ id: "a1", title: "Diabetes annual review", with: "Dr A. Patel (GP)", date: addDays(3), time: "10:30", place: "Camden Family Practice, NW1", status: "Upcoming" }]
  : pid === "meera" ? [{ id: "a2", title: "Blood pressure review", with: "Practice nurse", date: addDays(6), time: "14:00", place: "Camden Family Practice, NW1", status: "Upcoming" }]
  : pid === "arjun" ? [{ id: "a3", title: "Dental check-up", with: "Dr Okafor", date: addDays(12), time: "16:15", place: "Bright Smiles Dental, N1", status: "Upcoming" }] : [];
export const seedEvents = (pid: string): Ev[] =>
  pid === "me" ? [
    { id: "e1", date: addDays(-14), type: "test", title: "HbA1c blood test", detail: "47 mmol/mol — within target range." },
    { id: "e2", date: addDays(-60), type: "visit", title: "Asthma review", detail: "Inhaler technique checked, no changes." },
    { id: "e3", date: addDays(-200), type: "vaccine", title: "Flu vaccine", detail: "Given at local pharmacy." },
    { id: "e4", date: addDays(-400), type: "medication", title: "Started atorvastatin 20 mg", detail: "Cholesterol management." },
  ] : pid === "arjun" ? [{ id: "e5", date: addDays(-300), type: "vaccine", title: "Nasal flu vaccine", detail: "School programme." }]
  : pid === "meera" ? [{ id: "e6", date: addDays(-30), type: "visit", title: "Hypertension review", detail: "BP 138/84. Continue amlodipine." }] : [];

// Audit trail (real: every AI call is recorded locally)
export type Audit = { t: number; module: string; action: string };
export function logAudit(module: string, action: string) {
  const a = rd<Audit[]>("medora.audit", []); a.unshift({ t: Date.now(), module, action }); wr("medora.audit", a.slice(0, 100));
}
export const useAudit = () => useLS<Audit[]>("medora.audit", []);
export function resetAll() {
  Object.keys(localStorage).filter((k) => k.startsWith("medora.") && k !== "medora.groqKey").forEach((k) => localStorage.removeItem(k));
  L.forEach((f) => f());
}

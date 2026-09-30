import { useState } from "react";
import { HeartHandshake, Plus, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { askJSON, chat, withPrefs } from "../groq";
import { ageOf, uid, useActive, useProfiles, type Profile } from "../store";
import { AIButton, Disclaimer, Md, PageHead, Panel, Pill, inputCls, useAI } from "../ui";

type List = { headline: string; items: { title: string; when: string; why: string }[] };

export default function Family() {
  const { profile, profiles, setActive } = useActive(); const [, setProfiles] = useProfiles();
  const [adding, setAdding] = useState(false); const [nw, setNw] = useState<Omit<Profile, "id">>({ name: "", relation: "Child", dob: "2020-01-01", allergies: "", conditions: "" });
  const [list, setList] = useState<List | null>(null); const [care, setCare] = useState(""); const { busy, run } = useAI("Family Agent");
  const age = ageOf(profile.dob);
  const gen = () => run("family checklist", async () => { setCare(""); setList(await askJSON<List>(`Create an age-appropriate UK preventive-care and vaccination checklist (NHS schedule where relevant). Schema: {"headline":"","items":[{"title":"","when":"e.g. now / next 3 months / annually","why":"one short sentence"}]}. 6-8 items.`, `${profile.relation}: ${profile.name}, age ${age}, conditions: ${profile.conditions || "none"}, allergies: ${profile.allergies || "none"}`)); });
  const caregiver = () => run("caregiver support", async () => { setList(null); setCare(await chat([{ role: "system", content: withPrefs("You support family caregivers. Give practical, empathetic guidance: daily routine tips, warning signs to watch, UK support available (Carers UK, local council carer's assessment, Attendance Allowance where relevant), and a self-care reminder for the caregiver. Under 200 words with bullets.") }, { role: "user", content: `I care for ${profile.name} (${profile.relation}, age ${age}). Conditions: ${profile.conditions || "none"}.` }])); });
  const add = () => { if (!nw.name.trim()) return; const p = { id: uid(), ...nw }; setProfiles((x) => [...x, p]); setActive(p.id); setAdding(false); };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <PageHead path="family" right={<Button className="rounded-full" onClick={() => setAdding(!adding)}><Plus />Add family member</Button>} />
      {adding && <Panel className="grid sm:grid-cols-2 gap-2">
        <input className={inputCls} placeholder="Name" value={nw.name} onChange={(e) => setNw({ ...nw, name: e.target.value })} />
        <select className={inputCls} value={nw.relation} onChange={(e) => setNw({ ...nw, relation: e.target.value })}>{["Child", "Partner", "Parent", "Grandparent", "Other dependant"].map((r) => <option key={r}>{r}</option>)}</select>
        <input type="date" className={inputCls} value={nw.dob} onChange={(e) => setNw({ ...nw, dob: e.target.value })} />
        <input className={inputCls} placeholder="Allergies" value={nw.allergies} onChange={(e) => setNw({ ...nw, allergies: e.target.value })} />
        <input className={cn(inputCls, "sm:col-span-2")} placeholder="Conditions" value={nw.conditions} onChange={(e) => setNw({ ...nw, conditions: e.target.value })} />
        <Button onClick={add} className="rounded-xl sm:col-span-2">Save</Button></Panel>}
      <div className="grid sm:grid-cols-3 gap-3">
        {profiles.map((p) => (
          <button key={p.id} onClick={() => setActive(p.id)} className={cn("text-left rounded-2xl border p-4 bg-card shadow-card transition", p.id === profile.id ? "ring-2 ring-rose-400" : "hover:bg-muted/50")}>
            <span className="grid place-items-center size-10 rounded-full bg-rose-100 text-rose-700 mb-2"><UserRound className="size-5" /></span>
            <p className="font-semibold">{p.name}</p><p className="text-xs text-muted-foreground">{p.relation} · {ageOf(p.dob)} yrs</p>
            {p.conditions && <p className="text-xs mt-1.5">{p.conditions}</p>}{p.allergies && <Pill cls="mt-2 bg-red-50 text-red-700">Allergy: {p.allergies}</Pill>}
          </button>))}
      </div>
      <Panel className="space-y-3">
        <p className="text-sm">Agent for <b>{profile.name}</b> — data across Medora (medicines, appointments, record) switches with the selected family member.</p>
        <div className="flex flex-wrap gap-2"><AIButton busy={busy} onClick={gen}>Generate care checklist</AIButton><AIButton busy={busy} onClick={caregiver} className="!bg-none bg-rose-600"><HeartHandshake />Caregiver support</AIButton></div>
        {list && <div><p className="font-medium text-sm mb-2">{list.headline}</p><div className="grid sm:grid-cols-2 gap-2">{list.items?.map((it, i) => <div key={i} className="rounded-xl border p-3 text-sm"><p className="font-medium">{it.title}</p><Pill>{it.when}</Pill><p className="text-muted-foreground mt-1 text-xs">{it.why}</p></div>)}</div></div>}
        {care && <Md text={care} />}
      </Panel>
      <Disclaimer />
    </div>
  );
}

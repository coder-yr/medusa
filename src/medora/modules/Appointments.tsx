import { useState } from "react";
import { CalendarDays, CalendarPlus, ClipboardList, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { askJSON } from "../groq";
import { addDays, uid, useActive, usePData, seedAppts, type Appt, type Prep } from "../store";
import { AIButton, CopyBtn, Disclaimer, PageHead, Panel, Pill, fmtDate, inputCls, useAI } from "../ui";

const ics = (a: Appt) => {
  const s = a.date.replace(/-/g, "") + "T" + a.time.replace(":", "") + "00";
  const t = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Medora//EN\nBEGIN:VEVENT\nUID:${a.id}@medora\nDTSTAMP:${s}\nDTSTART:${s}\nDURATION:PT30M\nSUMMARY:${a.title}\nLOCATION:${a.place}\nDESCRIPTION:With ${a.with}\nEND:VEVENT\nEND:VCALENDAR`;
  const el = document.createElement("a"); el.href = URL.createObjectURL(new Blob([t], { type: "text/calendar" })); el.download = "appointment.ics"; el.click();
};
const ST = { Upcoming: "bg-emerald-100 text-emerald-700", Requested: "bg-amber-100 text-amber-800", Cancelled: "bg-red-100 text-red-700", Completed: "bg-slate-100 text-slate-700" };

export default function Appointments() {
  const { profile } = useActive(); const [appts, setAppts] = usePData<Appt[]>("appts", seedAppts);
  const [adding, setAdding] = useState(false); const [nw, setNw] = useState({ title: "", with: "", date: addDays(7), time: "09:00", place: "" });
  const [busyId, setBusyId] = useState(""); const { busy, run } = useAI("Appointments");
  const upd = (id: string, patch: Partial<Appt>) => setAppts((a) => a.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  const prep = (a: Appt) => { setBusyId(a.id); run("prep pack", async () => upd(a.id, { prep: await askJSON<Prep>(`Prepare a patient for a UK appointment. Schema: {"checklist":["6-8 concrete items to do before"],"questions":["6 specific questions to ask"],"bring":["items/documents to bring"],"tips":"2 sentences"}. Patient ${profile.name}, conditions: ${profile.conditions || "none"}, allergies: ${profile.allergies}.`, `Appointment: ${a.title} with ${a.with} at ${a.place} on ${a.date}`) })).finally(() => setBusyId("")); };
  const add = () => { if (!nw.title.trim()) return; setAppts((a) => [{ id: uid(), ...nw, status: "Upcoming" }, ...a]); setAdding(false); setNw({ ...nw, title: "", with: "", place: "" }); };
  const sorted = [...appts].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <PageHead path="appointments" right={<Button className="rounded-full" onClick={() => setAdding(!adding)}><Plus />New</Button>} />
      {adding && <Panel className="grid sm:grid-cols-2 gap-2">
        <input className={inputCls} placeholder="What for? (e.g. Asthma review)" value={nw.title} onChange={(e) => setNw({ ...nw, title: e.target.value })} />
        <input className={inputCls} placeholder="With whom" value={nw.with} onChange={(e) => setNw({ ...nw, with: e.target.value })} />
        <input type="date" className={inputCls} value={nw.date} onChange={(e) => setNw({ ...nw, date: e.target.value })} />
        <input type="time" className={inputCls} value={nw.time} onChange={(e) => setNw({ ...nw, time: e.target.value })} />
        <input className={cn(inputCls, "sm:col-span-2")} placeholder="Location" value={nw.place} onChange={(e) => setNw({ ...nw, place: e.target.value })} />
        <Button onClick={add} className="rounded-xl sm:col-span-2">Add appointment</Button></Panel>}
      {sorted.length === 0 && <Panel className="text-center text-sm text-muted-foreground py-10">No appointments for {profile.name.split(" ")[0]}.</Panel>}
      {sorted.map((a) => (
        <Panel key={a.id} className={cn(a.status === "Cancelled" && "opacity-60")}>
          <div className="flex flex-wrap justify-between gap-2">
            <div><h3 className="font-semibold">{a.title}</h3><p className="text-sm text-muted-foreground">{a.with}{a.place && ` · ${a.place}`}</p>
              <p className="text-sm mt-1 flex items-center gap-1.5"><CalendarDays className="size-3.5" />{fmtDate(a.date)} at {a.time}</p></div>
            <Pill cls={ST[a.status]}>{a.status}</Pill>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <AIButton size="sm" busy={busy && busyId === a.id} disabled={a.status === "Cancelled"} onClick={() => prep(a)}><ClipboardList />{a.prep ? "Regenerate prep" : "Prepare me"}</AIButton>
            <Button size="sm" variant="outline" className="rounded-full" onClick={() => ics(a)}><CalendarPlus />Add to calendar</Button>
            {a.status !== "Cancelled" && <Button size="sm" variant="outline" className="rounded-full" onClick={() => { upd(a.id, { date: addDays(7) }); toast.success("Rescheduled to next week (demo)"); }}>Reschedule</Button>}
            {a.status !== "Cancelled" ? <Button size="sm" variant="ghost" onClick={() => upd(a.id, { status: "Cancelled" })}><X />Cancel</Button> : <Button size="sm" variant="ghost" onClick={() => upd(a.id, { status: "Upcoming" })}>Restore</Button>}
          </div>
          {a.prep && <div className="mt-4 grid sm:grid-cols-2 gap-4 border-t pt-4 text-sm">
            <div><p className="font-semibold text-xs text-muted-foreground mb-1">Before you go</p><ul className="space-y-1">{a.prep.checklist.map((c, i) => <li key={i} className="flex gap-2"><input type="checkbox" className="mt-1" />{c}</li>)}</ul>
              <p className="font-semibold text-xs text-muted-foreground mt-3 mb-1">Bring</p><p>{a.prep.bring.join(" · ")}</p></div>
            <div><div className="flex justify-between items-center mb-1"><p className="font-semibold text-xs text-muted-foreground">Questions to ask</p><CopyBtn text={a.prep.questions.join("\n")} /></div><ol className="list-decimal pl-4 space-y-1">{a.prep.questions.map((c, i) => <li key={i}>{c}</li>)}</ol></div>
            <p className="sm:col-span-2 text-xs rounded-lg bg-violet-50 dark:bg-violet-950/40 px-3 py-2">{a.prep.tips}</p></div>}
        </Panel>))}
      <Disclaimer>Booking, rescheduling and reminders are simulated in this MVP — production integrates with GP/hospital booking systems.</Disclaimer>
    </div>
  );
}

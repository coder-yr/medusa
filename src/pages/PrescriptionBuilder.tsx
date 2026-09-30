import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, X, Download, MessageSquare, Mail, Sparkles, Check, Printer } from "lucide-react";
import { toast } from "sonner";

interface Medicine { name: string; dosage: string; frequency: string; duration: string; instructions: string; }

export default function PrescriptionBuilder() {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState<Medicine[]>([
    { name: "", dosage: "", frequency: "Twice daily", duration: "5 days", instructions: "After meals" }
  ]);
  const [diagnosis, setDiagnosis] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [clinicalNotes, setClinicalNotes] = useState("");
  const [advice, setAdvice] = useState("");
  const [followup, setFollowup] = useState("");
  const [patientName, setPatientName] = useState("Jane Doe");
  const [patientAge, setPatientAge] = useState("28");
  const [patientGender, setPatientGender] = useState("Female");
  const [showPreview, setShowPreview] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggested, setAiSuggested] = useState(false);

  const doctorName = localStorage.getItem("userName") || "Dr. Maya Patel";

  const addMedicine = () => setMedicines([...medicines, { name: "", dosage: "", frequency: "Once daily", duration: "7 days", instructions: "After meals" }]);
  const removeMedicine = (i: number) => setMedicines(medicines.filter((_, idx) => idx !== i));
  const updateMedicine = (i: number, field: keyof Medicine, val: string) =>
    setMedicines(medicines.map((m, idx) => idx === i ? { ...m, [field]: val } : m));

  const handleAiSuggest = () => {
    if (!diagnosis) { toast.error("Enter diagnosis first for AI suggestions"); return; }
    setAiLoading(true);
    setTimeout(() => {
      setMedicines([
        { name: "Paracetamol 650mg", dosage: "1 tablet", frequency: "Twice daily", duration: "5 days", instructions: "After meals" },
        { name: "Cetirizine 10mg", dosage: "1 tablet", frequency: "Once at bedtime", duration: "7 days", instructions: "With water" },
        { name: "ORS Sachets", dosage: "1 sachet", frequency: "As needed", duration: "3 days", instructions: "Dissolve in 200ml water" },
      ]);
      setAdvice("Rest well. Drink plenty of fluids. Avoid cold beverages. Return if fever persists beyond 3 days.");
      setFollowup(new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0]);
      setAiLoading(false);
      setAiSuggested(true);
      toast.success("AI suggestions applied — review and approve before saving");
    }, 2000);
  };

  const handleGenerate = () => {
    if (!diagnosis || medicines.every(m => !m.name)) { toast.error("Add diagnosis and at least one medicine"); return; }
    setShowPreview(true);
    toast.success("Prescription generated! Review and share.");
  };

  return (
    <div className="min-h-screen bg-muted/30 dark:bg-[#0B1B2B]/30 p-4 sm:p-6 md:p-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="size-9 rounded-xl border bg-card grid place-items-center hover:bg-muted cursor-pointer"><ArrowLeft className="size-4" /></button>
          <div>
            <h1 className="text-2xl font-bold font-display">NMC-Compliant Prescription Builder</h1>
            <p className="text-xs text-muted-foreground mt-0.5">AI-assisted · Digital Signature · PDF / WhatsApp Ready</p>
          </div>
          <div className="ml-auto flex gap-2">
            <button onClick={handleAiSuggest} disabled={aiLoading}
              className="px-4 h-9 ai-panel rounded-xl text-sm font-bold cursor-pointer flex items-center gap-2 border disabled:opacity-60 text-primary">
              {aiLoading ? <div className="size-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /> : <Sparkles className="size-4" />}
              {aiLoading ? "AI Thinking..." : aiSuggested ? "Re-suggest" : "AI Suggest"}
            </button>
            <button onClick={handleGenerate} className="px-4 h-9 bg-gradient-primary text-primary-foreground rounded-xl text-sm font-bold cursor-pointer flex items-center gap-2 shadow-soft">
              <Check className="size-4" /> Generate Rx
            </button>
          </div>
        </div>

        {aiSuggested && (
          <div className="bg-violet-500/5 border border-violet-500/20 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="size-4 text-violet-500" />
              <p className="text-sm font-semibold text-violet-700 dark:text-violet-400">AI suggestions applied — review all medicines before generating</p>
            </div>
            <button onClick={() => setAiSuggested(false)} className="size-7 rounded-lg grid place-items-center hover:bg-violet-500/10 cursor-pointer"><X className="size-3.5 text-violet-500" /></button>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Doctor Info */}
          <div className="bg-card border rounded-3xl p-6 shadow-card">
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Doctor Information</h3>
            <div className="space-y-3">
              {[
                { label: "Doctor Name", val: doctorName, readonly: true },
                { label: "Qualification", val: "MBBS, MD (General Medicine)" },
                { label: "NMC Reg. Number", val: "MCI-45821" },
                { label: "Clinic / Hospital", val: "HealFlow AI Clinic, Mumbai" },
                { label: "Contact", val: "+91 98765 00001" },
              ].map((f, i) => (
                <div key={i} className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{f.label}</label>
                  <input type="text" defaultValue={f.val} readOnly={f.readonly}
                    className="w-full h-9 px-3 rounded-lg border bg-background/50 outline-none focus:ring-2 ring-primary/30 text-xs" />
                </div>
              ))}
            </div>
          </div>

          {/* Patient + Clinical */}
          <div className="lg:col-span-2 space-y-4">
            {/* Patient Info */}
            <div className="bg-card border rounded-3xl p-6 shadow-card">
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Patient Information</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1"><label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Patient Name</label><input type="text" value={patientName} onChange={e => setPatientName(e.target.value)} className="w-full h-9 px-3 rounded-lg border bg-background/50 outline-none focus:ring-2 ring-primary/30 text-xs" /></div>
                <div className="space-y-1"><label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Age</label><input type="text" value={patientAge} onChange={e => setPatientAge(e.target.value)} className="w-full h-9 px-3 rounded-lg border bg-background/50 outline-none focus:ring-2 ring-primary/30 text-xs" /></div>
                <div className="space-y-1"><label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Gender</label>
                  <select value={patientGender} onChange={e => setPatientGender(e.target.value)} className="w-full h-9 px-3 rounded-lg border bg-background/50 outline-none focus:ring-2 ring-primary/30 text-xs cursor-pointer">
                    <option>Female</option><option>Male</option><option>Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Clinical Notes */}
            <div className="bg-card border rounded-3xl p-6 shadow-card space-y-3">
              <h3 className="font-semibold mb-2 text-sm uppercase tracking-wider text-muted-foreground">Clinical Notes</h3>
              <div className="space-y-1"><label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Symptoms</label><textarea value={symptoms} onChange={e => setSymptoms(e.target.value)} rows={2} placeholder="e.g. Fever (38.8°C) since 2 days, headache, rhinorrhea..." className="w-full px-3 py-2 rounded-lg border bg-background/50 outline-none focus:ring-2 ring-primary/30 text-xs resize-none" /></div>
              <div className="space-y-1"><label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Diagnosis *</label><input type="text" value={diagnosis} onChange={e => setDiagnosis(e.target.value)} placeholder="e.g. Viral Upper Respiratory Tract Infection (URTI)" className="w-full h-9 px-3 rounded-lg border bg-background/50 outline-none focus:ring-2 ring-primary/30 text-xs" /></div>
              <div className="space-y-1"><label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Clinical Notes</label><textarea value={clinicalNotes} onChange={e => setClinicalNotes(e.target.value)} rows={2} placeholder="Findings, examination notes..." className="w-full px-3 py-2 rounded-lg border bg-background/50 outline-none focus:ring-2 ring-primary/30 text-xs resize-none" /></div>
            </div>
          </div>
        </div>

        {/* Medicines */}
        <div className="bg-card border rounded-3xl p-6 shadow-card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Medicines</h3>
            <button onClick={addMedicine} className="px-3 h-8 border rounded-xl text-xs font-bold hover:bg-muted cursor-pointer flex items-center gap-1.5"><Plus className="size-3.5" /> Add Medicine</button>
          </div>
          <div className="space-y-3">
            {medicines.map((med, i) => (
              <div key={i} className="grid grid-cols-6 gap-2 items-end p-3 rounded-xl bg-muted/30 border">
                <div className="col-span-2 space-y-1"><label className="text-[10px] font-bold uppercase text-muted-foreground">Medicine Name</label><input type="text" value={med.name} onChange={e => updateMedicine(i, "name", e.target.value)} placeholder="e.g. Paracetamol 650mg" className="w-full h-9 px-3 rounded-lg border bg-background/50 outline-none focus:ring-2 ring-primary/30 text-xs" /></div>
                <div className="space-y-1"><label className="text-[10px] font-bold uppercase text-muted-foreground">Dosage</label><input type="text" value={med.dosage} onChange={e => updateMedicine(i, "dosage", e.target.value)} placeholder="1 tablet" className="w-full h-9 px-3 rounded-lg border bg-background/50 outline-none focus:ring-2 ring-primary/30 text-xs" /></div>
                <div className="space-y-1"><label className="text-[10px] font-bold uppercase text-muted-foreground">Frequency</label>
                  <select value={med.frequency} onChange={e => updateMedicine(i, "frequency", e.target.value)} className="w-full h-9 px-2 rounded-lg border bg-background/50 outline-none text-xs cursor-pointer">
                    {["Once daily", "Twice daily", "Thrice daily", "Once at bedtime", "As needed", "Every 4 hrs"].map(f => <option key={f}>{f}</option>)}
                  </select>
                </div>
                <div className="space-y-1"><label className="text-[10px] font-bold uppercase text-muted-foreground">Duration</label><input type="text" value={med.duration} onChange={e => updateMedicine(i, "duration", e.target.value)} placeholder="5 days" className="w-full h-9 px-3 rounded-lg border bg-background/50 outline-none focus:ring-2 ring-primary/30 text-xs" /></div>
                <div className="flex items-end">
                  <button onClick={() => removeMedicine(i)} disabled={medicines.length === 1} className="size-9 rounded-xl border grid place-items-center hover:bg-destructive/10 text-destructive cursor-pointer disabled:opacity-30 ml-auto"><X className="size-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Advice + Follow-up */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-card border rounded-3xl p-6 shadow-card space-y-3">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Advice to Patient</h3>
            <textarea value={advice} onChange={e => setAdvice(e.target.value)} rows={4} placeholder="e.g. Rest well, drink fluids, avoid cold..." className="w-full px-3 py-2 rounded-xl border bg-background/50 outline-none focus:ring-2 ring-primary/30 text-sm resize-none" />
          </div>
          <div className="bg-card border rounded-3xl p-6 shadow-card space-y-3">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Follow-up Date</h3>
            <input type="date" value={followup} onChange={e => setFollowup(e.target.value)} className="w-full h-11 px-4 rounded-xl border bg-background/50 outline-none focus:ring-2 ring-primary/30 text-sm" />
            <div className="p-3 bg-primary/5 rounded-xl border border-primary/20">
              <p className="text-xs font-bold text-primary mb-1">Digital Signature</p>
              <p className="text-[10px] text-muted-foreground">Prescription will be digitally signed with {doctorName}'s NMC-verified credentials</p>
              <div className="mt-2 h-12 border-2 border-dashed border-primary/30 rounded-lg flex items-center justify-center"><p className="text-xs text-muted-foreground italic">{doctorName} — Digital Signature</p></div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button onClick={handleGenerate} className="px-6 h-12 bg-gradient-primary text-primary-foreground font-bold rounded-xl shadow-soft cursor-pointer text-sm flex items-center gap-2"><Download className="size-4" /> Generate PDF Prescription</button>
          <button onClick={() => toast.success("Prescription sent via WhatsApp!")} className="px-6 h-12 bg-emerald-500 text-white font-bold rounded-xl cursor-pointer text-sm flex items-center gap-2"><MessageSquare className="size-4" /> Share via WhatsApp</button>
          <button onClick={() => toast.success("Prescription sent via Email!")} className="px-6 h-12 border font-bold rounded-xl cursor-pointer text-sm flex items-center gap-2 hover:bg-muted"><Mail className="size-4" /> Email to Patient</button>
          <button onClick={() => toast.success("Printing prescription...")} className="px-6 h-12 border font-bold rounded-xl cursor-pointer text-sm flex items-center gap-2 hover:bg-muted"><Printer className="size-4" /> Print</button>
        </div>

        {/* Preview */}
        {showPreview && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border-2 border-primary/20 rounded-3xl p-8 shadow-elevated">
            <div className="border-b pb-6 mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gradient">{doctorName}</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">MBBS, MD · NMC Reg: MCI-45821</p>
                  <p className="text-xs text-muted-foreground">HealFlow AI Clinic, Mumbai · +91 98765 00001</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Date: {new Date().toLocaleDateString("en-IN")}</p>
                  <p className="text-xs font-mono text-primary mt-0.5">RX-{Math.floor(Math.random() * 900 + 200)}</p>
                </div>
              </div>
            </div>
            <div className="mb-6">
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Patient</p>
              <p className="font-bold text-lg">{patientName} · {patientAge} yrs · {patientGender}</p>
            </div>
            {diagnosis && <div className="mb-4"><p className="text-xs uppercase font-bold text-muted-foreground">Diagnosis</p><p className="font-semibold mt-1">{diagnosis}</p></div>}
            <div className="mb-4">
              <p className="text-xs uppercase font-bold text-muted-foreground mb-3">℞ Medicines</p>
              <div className="space-y-2">
                {medicines.filter(m => m.name).map((m, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-muted/30 rounded-xl">
                    <span className="font-bold text-primary text-sm">{i + 1}.</span>
                    <div><p className="font-bold text-sm">{m.name}</p><p className="text-xs text-muted-foreground">{m.dosage} · {m.frequency} · {m.duration} · {m.instructions}</p></div>
                  </div>
                ))}
              </div>
            </div>
            {advice && <div className="mb-4"><p className="text-xs uppercase font-bold text-muted-foreground">Advice</p><p className="text-sm mt-1">{advice}</p></div>}
            {followup && <div><p className="text-xs uppercase font-bold text-muted-foreground">Follow-up</p><p className="text-sm font-semibold text-primary mt-1">{new Date(followup).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p></div>}
            <div className="border-t pt-4 mt-6 flex justify-between items-center">
              <p className="text-[10px] text-muted-foreground">🔒 Digitally signed · NMC Compliant · HealFlow AI</p>
              <p className="text-xs font-bold text-primary italic">{doctorName}</p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}


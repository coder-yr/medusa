import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video, VideoOff, Mic, MicOff, Monitor, MessageSquare, Users, PhoneOff,
  PenTool, Circle, Square, Type, Eraser, Trash2, Upload, FileText, CheckCircle2,
  Download, Send, Sparkles, FileImage, ShieldCheck, ChevronRight, Activity, Plus, Trash, X,
  ChevronLeft, Maximize2, Minimize2, Network, ShieldAlert, RefreshCw, Volume2, Pill
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ConsultationRoom() {
  const { id: roomId } = useParams();
  const navigate = useNavigate();

  // Role Detection (Case-insensitive)
  const userRole = (localStorage.getItem("userRole") || "patient").toLowerCase();
  const isDoctor = userRole === "doctor";
  const userName = localStorage.getItem("userName") || (isDoctor ? "Dr. Maya Patel" : "Jane Doe");

  // Call Settings State
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [callMode, setCallMode] = useState<"simulator" | "jitsi">("simulator");

  // Layout View State
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [activeRightTab, setActiveRightTab] = useState<"chat" | "whiteboard" | "reports" | "notes" | "prescription" | "participants">(
    isDoctor ? "notes" : "chat"
  );
  const [mainView, setMainView] = useState<"video" | "whiteboard">("video");

  // Simulation settings
  const [patientSpeaking, setPatientSpeaking] = useState(true);
  const [poorNetwork, setPoorNetwork] = useState(false);

  // Local Video Capture Stream
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Canvas / Whiteboard State
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState("#2563EB");
  const [lineWidth, setLineWidth] = useState(4);
  const [drawingTool, setDrawingTool] = useState<"draw" | "rect" | "circle" | "eraser" | "text">("draw");
  const isDrawingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [textInput, setTextInput] = useState<{ x: number; y: number; value: string } | null>(null);

  // Interactive Real-Time Chat
  const [chatMessages, setChatMessages] = useState([
    { sender: "Patient (Jane Doe)", text: "Hello doctor, I've uploaded the blood panel report from yesterday.", time: "03:40 PM", self: false },
    { sender: "System", text: "HIPAA-secured encrypted room established.", time: "03:40 PM", self: false }
  ]);
  const [newMsg, setNewMsg] = useState("");

  // Reports State
  const [reports, setReports] = useState([
    { id: "R-501", name: "Blood_Panel_Report.pdf", type: "PDF", url: "/mock-reports/blood.jpg", preview: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=500&auto=format&fit=crop&q=60" },
    { id: "R-402", name: "Chest_XRay_Digital.jpg", type: "Image", url: "/mock-reports/xray.jpg", preview: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=500&auto=format&fit=crop&q=60" }
  ]);

  // Notes State (Doctor Only)
  const [notes, setNotes] = useState({
    symptoms: "Fever peaking at 101.5°F for 2 days. Accompanied by mild sore throat and retro-orbital headache.",
    diagnosis: "Acute Viral Upper Respiratory Infection",
    recommendations: "Adequate hydration. Strict bed rest. Monitor vitals daily. Review in 3 days."
  });

  // Prescriptions State (Doctor and Patient)
  const [medicines, setMedicines] = useState([
    { name: "Paracetamol 650mg", dosage: "1 Tablet", frequency: "Thrice daily after meals", duration: "3 Days", note: "Take only if temperature > 99°F" },
    { name: "Cetirizine 10mg", dosage: "1 Tablet", frequency: "Once daily at night", duration: "5 Days", note: "May cause mild drowsiness" }
  ]);
  const [newMed, setNewMed] = useState({ name: "", dosage: "", frequency: "", duration: "", note: "" });
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [prescriptionSent, setPrescriptionSent] = useState(() => {
    return localStorage.getItem("prescriptionSent") === "true";
  });

  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const [jitsiAPI, setJitsiAPI] = useState<any>(null);

  // Live Jitsi External Frame API loader & orchestrator
  useEffect(() => {
    if (callMode === "jitsi" && mainView === "video") {
      const scriptId = "jitsi-external-api-script";
      let script = document.getElementById(scriptId) as HTMLScriptElement;
      
      const initJitsi = () => {
        if (!jitsiContainerRef.current) return;
        jitsiContainerRef.current.innerHTML = "";
        
        const domain = "meet.jit.si";
        const options = {
          roomName: roomId || "doctor_45_patient_88_2026",
          width: "100%",
          height: "100%",
          parentNode: jitsiContainerRef.current,
          configOverwrite: {
            startWithAudioMuted: true,
            startWithVideoMuted: false,
            enableLobby: false,
            prejoinPageEnabled: false,
          },
          interfaceConfigOverwrite: {
            TOOLBAR_BUTTONS: [
              'microphone', 'camera', 'closedcaptions', 'desktop', 'embedmeeting', 'fullscreen',
              'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
              'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
              'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
              'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
              'security'
            ],
          },
          userInfo: {
            displayName: isDoctor ? "Dr. Maya Patel" : "Patient Jane Doe"
          }
        };
        
        try {
          const api = new (window as any).JitsiMeetExternalAPI(domain, options);
          setJitsiAPI(api);
          
          api.addEventListener("videoConferenceLeft", () => {
            setCallMode("simulator");
            toast.info("Live call ended. Switched back to simulated stream.");
          });
        } catch (err) {
          console.error("Failed to initialize Jitsi API", err);
        }
      };

      if (!window.hasOwnProperty("JitsiMeetExternalAPI")) {
        script = document.createElement("script");
        script.id = scriptId;
        script.src = "https://meet.jit.si/external_api.js";
        script.async = true;
        script.onload = () => {
          initJitsi();
        };
        document.body.appendChild(script);
      } else {
        initJitsi();
      }
    } else {
      if (jitsiAPI) {
        try {
          jitsiAPI.dispose();
        } catch (e) {}
        setJitsiAPI(null);
      }
    }
    
    return () => {
      if (jitsiAPI) {
        try {
          jitsiAPI.dispose();
        } catch (e) {}
      }
    };
  }, [callMode, mainView, roomId]);

  // Start Meeting Session Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime((t) => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Web Camera Stream Request
  useEffect(() => {
    if (videoOn) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((s) => {
          setStream(s);
          if (videoRef.current) videoRef.current.srcObject = s;
        })
        .catch(() => {
          console.log("Camera access not allowed or unavailable");
        });
    } else {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [videoOn]);

  // Whiteboard Canvas Drawing Setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = canvas.parentElement?.clientWidth || 700;
    canvas.height = canvas.parentElement?.clientHeight || 450;

    // Fill background color
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // If there is a background image, draw it
    if (bgImage) {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height) * 0.95;
        const w = img.width * scale;
        const h = img.height * scale;
        const x = (canvas.width - w) / 2;
        const y = (canvas.height - h) / 2;
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, x, y, w, h);
      };
      img.src = bgImage;
      img.crossOrigin = "anonymous";
    }
  }, [bgImage, mainView, activeRightTab]);

  const commitText = () => {
    if (!textInput || !textInput.value.trim()) {
      setTextInput(null);
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = color;
    ctx.font = "bold 16px sans-serif";
    ctx.textBaseline = "top";
    ctx.fillText(textInput.value, textInput.x, textInput.y);
    setTextInput(null);
    toast.info("Whiteboard synced in real-time with Patient (Socket: text-update)", { duration: 1500 });
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (drawingTool === "text") {
      e.preventDefault();
      e.stopPropagation();
      if (textInput) {
        commitText();
      }
      setTextInput({ x, y, value: "" });
      isDrawingRef.current = false;
      return;
    }

    isDrawingRef.current = true;
    startPosRef.current = { x, y };

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = drawingTool === "eraser" ? "#FFFFFF" : color;
    ctx.lineWidth = drawingTool === "eraser" ? 24 : lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (drawingTool === "draw" || drawingTool === "eraser") {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const handleCanvasMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    ctx.strokeStyle = drawingTool === "eraser" ? "#FFFFFF" : color;
    ctx.lineWidth = drawingTool === "eraser" ? 24 : lineWidth;

    if (drawingTool === "rect") {
      const w = endX - startPosRef.current.x;
      const h = endY - startPosRef.current.y;
      ctx.strokeRect(startPosRef.current.x, startPosRef.current.y, w, h);
    } else if (drawingTool === "circle") {
      const r = Math.sqrt(
        Math.pow(endX - startPosRef.current.x, 2) + Math.pow(endY - startPosRef.current.y, 2)
      );
      ctx.beginPath();
      ctx.arc(startPosRef.current.x, startPosRef.current.y, r, 0, 2 * Math.PI);
      ctx.stroke();
    }

    isDrawingRef.current = false;
    toast.info("Collaborative board synchronized successfully", { duration: 1000 });
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setBgImage(null);
    setTextInput(null);
    toast.info("Whiteboard cleared.");
  };

  const loadReportToWhiteboard = (imgUrl: string) => {
    setBgImage(imgUrl);
    setMainView("whiteboard");
    setActiveRightTab("whiteboard");
    toast.success("Medical report loaded onto collaborative whiteboard!");
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    setChatMessages([
      ...chatMessages,
      { sender: `${isDoctor ? "Doctor" : "Patient"} (You)`, text: newMsg.trim(), time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), self: true }
    ]);
    setNewMsg("");
  };

  const runMagicAI = () => {
    setNotes({
      symptoms: "Fever peaking at 101.5°F for 2 days. Accompanied by mild sore throat and retro-orbital headache. No signs of respiratory distress. Breath sounds clear.",
      diagnosis: "Acute Viral Upper Respiratory Infection (Viral Flu)",
      recommendations: "Drink warm fluids (2-3 liters daily). Strict bed rest. Paracetamol 650mg for fever control. Follow up if symptoms persist beyond 3 days."
    });
    toast.success("AI clinical draft recommendations successfully generated!");
  };

  const addMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMed.name || !newMed.dosage) {
      toast.error("Please fill medicine name and dosage.");
      return;
    }
    setMedicines([...medicines, newMed]);
    setNewMed({ name: "", dosage: "", frequency: "", duration: "", note: "" });
    toast.success("Medicine added to prescription.");
  };

  const removeMedicine = (idx: number) => {
    setMedicines(medicines.filter((_, i) => i !== idx));
    toast.info("Medicine removed.");
  };

  const handleSendPrescription = () => {
    localStorage.setItem("signedPrescription", JSON.stringify(medicines));
    localStorage.setItem("signedPrescriptionNotes", notes.recommendations);
    localStorage.setItem("prescriptionSent", "true");
    setPrescriptionSent(true);
    toast.success("Prescription signed and issued to Patient dashboard!");
    setShowPrescriptionModal(false);
  };

  const resetPrescriptionState = () => {
    localStorage.removeItem("signedPrescription");
    localStorage.removeItem("signedPrescriptionNotes");
    localStorage.removeItem("prescriptionSent");
    setPrescriptionSent(false);
    toast.info("Simulation prescription state reset.");
  };

  const formattedTime = () => {
    const mins = Math.floor(sessionTime / 60);
    const secs = sessionTime % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleTab = (tab: typeof activeRightTab) => {
    setActiveRightTab(tab);
    setSidebarExpanded(true);
  };

  return (
    <div className="h-screen bg-slate-950 text-white flex flex-col font-sans select-none overflow-hidden">
      
      {/* ROOM HEADER */}
      <header className="h-14 bg-slate-900 border-b border-slate-800/80 px-4 md:px-6 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-3">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
          <h1 className="font-semibold text-xs md:text-sm tracking-tight flex items-center gap-2">
            Medora TeleVisit: <span className="font-mono text-primary bg-primary/10 px-2 py-0.5 rounded text-[11px] font-bold">{roomId?.substring(0, 16) || "Session_Active"}</span>
          </h1>
          <div className="h-4 w-px bg-slate-800" />
          <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-semibold font-mono tracking-wider">{formattedTime()}</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Simulation Tools Panel Dropdown */}
          <div className="relative group">
            <button className="h-8 px-2.5 rounded-lg border border-slate-800 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-white text-xs font-medium transition flex items-center gap-1.5 cursor-pointer">
              <RefreshCw className="size-3.5" /> 
              <span className="hidden sm:inline">Simulate Events</span>
            </button>
            <div className="absolute right-0 mt-2 w-52 rounded-xl bg-slate-900 border border-slate-800 shadow-glow p-2 hidden group-hover:block z-50">
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider px-2 py-1">Demo Simulation Actions</p>
              <button 
                onClick={() => setPatientSpeaking(!patientSpeaking)}
                className="w-full text-left px-2 py-1.5 rounded-lg text-xs hover:bg-slate-800 flex items-center gap-2 transition cursor-pointer text-slate-300 hover:text-white"
              >
                <Volume2 className={`size-3.5 ${patientSpeaking ? 'text-primary' : 'text-slate-500'}`} />
                {patientSpeaking ? "Mute Patient Simulation" : "Simulate Patient Speaking"}
              </button>
              <button 
                onClick={() => setPoorNetwork(!poorNetwork)}
                className="w-full text-left px-2 py-1.5 rounded-lg text-xs hover:bg-slate-800 flex items-center gap-2 transition cursor-pointer text-slate-300 hover:text-white"
              >
                <Network className={`size-3.5 ${poorNetwork ? 'text-amber-500' : 'text-slate-500'}`} />
                {poorNetwork ? "Restore Network Quality" : "Simulate Network Degradation"}
              </button>
              <button 
                onClick={resetPrescriptionState}
                className="w-full text-left px-2 py-1.5 rounded-lg text-xs hover:bg-slate-850 hover:text-rose-400 flex items-center gap-2 transition cursor-pointer border-t border-slate-800/80 mt-1 pt-1.5 text-rose-500"
              >
                <Trash2 className="size-3.5" />
                Reset Prescription State
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full font-bold">
            <ShieldCheck className="size-3.5" /> HIPAA Secure
          </div>
          
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to end this consultation session?")) {
                toast.success("Consultation closed. Syncing medical databases.");
                navigate(isDoctor ? "/doctor/dashboard" : "/patient/dashboard");
              }
            }}
            className="h-8 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer hover:shadow-soft"
          >
            <PhoneOff className="size-3.5" /> Leave Room
          </button>
        </div>
      </header>

      {/* WORKSPACE BODY */}
      <div className="flex-1 flex overflow-hidden relative min-h-0">
        
        {/* LEFT WORKSPACE (VIDEO CALL / PRESENTATION BOARD) */}
        <section className="flex-1 bg-[#090E18] flex flex-col justify-between relative overflow-hidden h-full min-h-0">
          
          {/* Main Visual Display (Video or Whiteboard Share) */}
          <div className="flex-1 p-4 md:p-6 flex items-center justify-center relative min-h-0">
            <AnimatePresence mode="wait">
              {mainView === "video" ? (
                <motion.div 
                  key="videoView"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="w-full h-full max-w-5xl rounded-3xl overflow-hidden relative"
                >
                  {callMode === "jitsi" ? (
                    <div ref={jitsiContainerRef} className="w-full h-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden" />
                  ) : (
                    <div className="w-full h-full grid md:grid-cols-2 gap-4 items-stretch">
                      
                      {/* Doctor webcam frame */}
                      <div className="bg-[#BAC2CF] border border-slate-350 rounded-2xl relative overflow-hidden flex items-center justify-center group shadow-card">
                        {videoOn ? (
                          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1] rounded-2xl" />
                        ) : (
                          <div className="text-center space-y-2">
                            <div className="size-16 rounded-full bg-slate-850/20 grid place-items-center mx-auto text-slate-700"><VideoOff className="size-6" /></div>
                            <p className="text-xs text-slate-800 font-bold">Your video is toggled off</p>
                          </div>
                        )}
                        <div className="absolute top-3 left-3 bg-emerald-100 text-emerald-850 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-350 flex items-center gap-1">
                          <span className="size-1.5 rounded-full bg-emerald-600 animate-pulse" /> LIVE
                        </div>
                        <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-sm rounded-lg px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border border-slate-800">
                          <Activity className="size-3 text-emerald-400 animate-pulse" /> Dr. Maya Patel (You)
                        </div>
                      </div>

                      {/* Patient camera frame */}
                      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl relative overflow-hidden flex items-center justify-center group shadow-card glass">
                        <img
                          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=60"
                          alt="Jane Doe"
                          className="w-full h-full object-cover rounded-2xl"
                        />
                        <div className="absolute top-3 right-3 flex items-center gap-1.5">
                          {poorNetwork ? (
                            <span className="bg-amber-500/20 text-amber-400 text-[9px] font-bold px-2 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
                              <ShieldAlert className="size-3" /> Poor Connection
                            </span>
                          ) : (
                            <span className="bg-slate-800/60 text-slate-300 text-[9px] font-bold px-2 py-0.5 rounded-full border border-slate-700 flex items-center gap-1">
                              <Network className="size-3 text-emerald-400" /> 12ms Latency
                            </span>
                          )}
                        </div>

                        {patientSpeaking && (
                          <div className="absolute bottom-16 right-4 bg-primary/20 backdrop-blur-md rounded-xl p-2 border border-primary/30 flex items-center gap-1">
                            <div className="flex items-end gap-0.5 h-3">
                              <div className="w-0.5 bg-primary animate-[pulse_0.4s_infinite_alternate] h-2" />
                              <div className="w-0.5 bg-primary animate-[pulse_0.6s_infinite_alternate] h-3" />
                              <div className="w-0.5 bg-primary animate-[pulse_0.3s_infinite_alternate] h-1.5" />
                              <div className="w-0.5 bg-primary animate-[pulse_0.5s_infinite_alternate] h-2.5" />
                            </div>
                            <span className="text-[9px] font-bold text-slate-200">Patient Speaking</span>
                          </div>
                        )}

                        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm rounded-lg px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border border-slate-800">
                          <span className="size-1.5 rounded-full bg-emerald-400" /> Jane Doe (Patient)
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                
                // Presenter mode whiteboard is shown in the left main screen
                <motion.div
                  key="whiteboardView"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="w-full h-full max-w-5xl bg-white rounded-3xl overflow-hidden border border-slate-800 flex flex-col relative"
                >
                  <div className="h-10 bg-slate-100 border-b flex justify-between items-center px-4 shrink-0 text-slate-800 text-xs font-bold">
                    <span className="flex items-center gap-1"><PenTool className="size-3.5 text-primary" /> Active Annotation Board</span>
                    <button 
                      onClick={() => setMainView("video")}
                      className="px-2 py-1 rounded bg-slate-200 hover:bg-slate-300 transition cursor-pointer text-[10px]"
                    >
                      Return to Video Grid
                    </button>
                  </div>
                  <div className="flex-1 relative bg-white">
                    <canvas
                      ref={canvasRef}
                      onMouseDown={handleCanvasMouseDown}
                      onMouseMove={handleCanvasMouseMove}
                      onMouseUp={handleCanvasMouseUp}
                      className="cursor-crosshair w-full h-full block"
                    />
                    {textInput && (
                      <input
                        type="text"
                        autoFocus
                        value={textInput.value}
                        onChange={(e) => setTextInput({ ...textInput, value: e.target.value })}
                        onBlur={commitText}
                        onMouseDown={(e) => e.stopPropagation()}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            commitText();
                          } else if (e.key === "Escape") {
                            setTextInput(null);
                          }
                        }}
                        style={{
                          position: "absolute",
                          left: textInput.x,
                          top: textInput.y,
                          color: color,
                          background: "transparent",
                          border: `1.5px dashed ${color}`,
                          outline: "none",
                          font: "bold 16px sans-serif",
                          padding: "2px 4px",
                          zIndex: 50,
                          minWidth: "150px"
                        }}
                      />
                    )}
                  </div>

                  {/* Floating PIP camera feeds in bottom-right corner when in whiteboard share */}
                  <div className="absolute bottom-4 right-4 w-44 space-y-2 pointer-events-none z-10">
                    <div className="h-24 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden relative shadow-glow">
                      {videoOn ? (
                        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
                      ) : (
                        <div className="w-full h-full grid place-items-center bg-slate-950 text-[10px] text-slate-500 font-bold">Video Off</div>
                      )}
                      <div className="absolute bottom-1.5 left-1.5 bg-black/60 px-1 py-0.5 rounded text-[8px] font-bold">Dr. Maya Patel</div>
                    </div>
                    <div className="h-24 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden relative shadow-glow">
                      <img
                        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=60"
                        alt="Jane Doe"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-1.5 left-1.5 bg-black/60 px-1 py-0.5 rounded text-[8px] font-bold">Jane Doe</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Screen Share Simulated Overlay */}
            {screenSharing && mainView === "video" && (
              <div className="absolute inset-4 max-w-5xl rounded-3xl border border-primary/40 bg-slate-950 overflow-hidden flex flex-col shadow-glow z-10 animate-fade-in">
                <div className="h-8 bg-slate-900 border-b border-slate-800 px-4 flex justify-between items-center text-[10px] font-bold text-slate-400 shrink-0">
                  <span className="flex items-center gap-1.5 text-primary"><Monitor className="size-3 text-primary" /> Active Desktop Presentation Stream</span>
                  <span className="bg-primary/20 text-primary px-2 py-0.5 rounded">Encrypted Screenshare</span>
                </div>
                <div className="flex-1 bg-slate-900/40 p-6 flex flex-col justify-center items-center text-center space-y-4">
                  <div className="size-16 rounded-full bg-primary/10 grid place-items-center text-primary animate-pulse border border-primary/20"><Monitor className="size-8" /></div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-200">You are sharing your dashboard screen</h4>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm">Patient Jane Doe can now see your active desktop window with diagnostic details in high definition.</p>
                  </div>
                  <button 
                    onClick={() => setScreenSharing(false)}
                    className="h-8 px-4 bg-rose-600 hover:bg-rose-700 text-xs font-bold rounded-lg transition cursor-pointer"
                  >
                    Stop Screenshare
                  </button>
                </div>

                {/* Floating camera feeds in PIP mode when sharing screen */}
                <div className="absolute bottom-4 right-4 w-40 space-y-2 pointer-events-none">
                  <div className="h-20 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden relative shadow-card">
                    {videoOn ? (
                      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
                    ) : (
                      <div className="w-full h-full grid place-items-center bg-slate-950 text-[9px] text-slate-500 font-bold">Video Off</div>
                    )}
                    <div className="absolute bottom-1 left-1 bg-black/60 px-1 py-0.5 rounded text-[8px] font-bold">Dr. Maya Patel</div>
                  </div>
                  <div className="h-20 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden relative shadow-card">
                    <img
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=60"
                      alt="Jane Doe"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1 left-1 bg-black/60 px-1 py-0.5 rounded text-[8px] font-bold">Jane Doe</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* FLOATING GLASS CONTROL DOCK */}
          <footer className="px-4 py-4 md:px-6 flex justify-center shrink-0 z-20">
            <div className="glass bg-slate-900/70 border border-slate-800/80 backdrop-blur-md px-6 py-3 rounded-2xl flex items-center gap-6 shadow-glow">
              
              {/* Call Settings Controls */}
              <div className="flex items-center gap-2 border-r border-slate-800 pr-6">
                <button
                  onClick={() => setMicOn(!micOn)}
                  className={`size-10 rounded-xl grid place-items-center transition cursor-pointer border ${
                    micOn 
                      ? "bg-slate-800/80 border-slate-700 hover:bg-slate-700/80 text-slate-200" 
                      : "bg-rose-500/20 border-rose-500 text-rose-500 hover:bg-rose-500/30 shadow-[0_0_8px_#f43f5e]"
                  }`}
                  title={micOn ? "Mute Mic" : "Unmute Mic"}
                >
                  {micOn ? <Mic className="size-4" /> : <MicOff className="size-4" />}
                </button>
                <button
                  onClick={() => setVideoOn(!videoOn)}
                  className={`size-10 rounded-xl grid place-items-center transition cursor-pointer border ${
                    videoOn 
                      ? "bg-slate-800/80 border-slate-700 hover:bg-slate-700/80 text-slate-200" 
                      : "bg-rose-500/20 border-rose-500 text-rose-500 hover:bg-rose-500/30 shadow-[0_0_8px_#f43f5e]"
                  }`}
                  title={videoOn ? "Stop Video" : "Start Video"}
                >
                  {videoOn ? <Video className="size-4" /> : <VideoOff className="size-4" />}
                </button>
                <button
                  onClick={() => {
                    setScreenSharing(!screenSharing);
                    toast.success(screenSharing ? "Stopped screen share" : "Screensharing started");
                  }}
                  className={`size-10 rounded-xl grid place-items-center transition cursor-pointer border ${
                    screenSharing 
                      ? "bg-primary border-transparent text-white shadow-soft" 
                      : "bg-slate-800/80 border-slate-700 hover:bg-slate-700/80 text-slate-200"
                  }`}
                  title="Share Screen"
                >
                  <Monitor className="size-4" />
                </button>
              </div>

              {/* Utility Workflow Sidebar Toggles */}
              <div className="flex items-center gap-2 border-r border-slate-800 pr-6">
                <button
                  onClick={() => toggleTab("chat")}
                  className={`size-10 rounded-xl grid place-items-center transition cursor-pointer border ${
                    activeRightTab === "chat" && sidebarExpanded
                      ? "bg-primary border-transparent text-white shadow-soft" 
                      : "bg-slate-800/80 border-slate-700 hover:bg-slate-700/80 text-slate-400 hover:text-slate-200"
                  }`}
                  title="Secure Chat"
                >
                  <MessageSquare className="size-4" />
                </button>
                <button
                  onClick={() => toggleTab("whiteboard")}
                  className={`size-10 rounded-xl grid place-items-center transition cursor-pointer border ${
                    activeRightTab === "whiteboard" && sidebarExpanded
                      ? "bg-primary border-transparent text-white shadow-soft" 
                      : "bg-slate-800/80 border-slate-700 hover:bg-slate-700/80 text-slate-400 hover:text-slate-200"
                  }`}
                  title="Collaborative Whiteboard"
                >
                  <PenTool className="size-4" />
                </button>
                <button
                  onClick={() => toggleTab("reports")}
                  className={`size-10 rounded-xl grid place-items-center transition cursor-pointer border ${
                    activeRightTab === "reports" && sidebarExpanded
                      ? "bg-primary border-transparent text-white shadow-soft" 
                      : "bg-slate-800/80 border-slate-700 hover:bg-slate-700/80 text-slate-400 hover:text-slate-200"
                  }`}
                  title="Reports & Media"
                >
                  <FileImage className="size-4" />
                </button>
                {isDoctor && (
                  <button
                    onClick={() => toggleTab("notes")}
                    className={`size-10 rounded-xl grid place-items-center transition cursor-pointer border ${
                      activeRightTab === "notes" && sidebarExpanded
                        ? "bg-primary border-transparent text-white shadow-soft" 
                        : "bg-slate-800/80 border-slate-700 hover:bg-slate-700/80 text-slate-400 hover:text-slate-200"
                    }`}
                    title="Clinical Notes"
                  >
                    <FileText className="size-4" />
                  </button>
                )}
                <button
                  onClick={() => toggleTab("prescription")}
                  className={`size-10 rounded-xl grid place-items-center transition cursor-pointer border ${
                    activeRightTab === "prescription" && sidebarExpanded
                      ? "bg-primary border-transparent text-white shadow-soft" 
                      : "bg-slate-800/80 border-slate-700 hover:bg-slate-700/80 text-slate-400 hover:text-slate-200"
                  }`}
                  title="Prescription"
                >
                  <Pill className="size-4" />
                </button>
                <button
                  onClick={() => toggleTab("participants")}
                  className={`size-10 rounded-xl grid place-items-center transition cursor-pointer border ${
                    activeRightTab === "participants" && sidebarExpanded
                      ? "bg-primary border-transparent text-white shadow-soft" 
                      : "bg-slate-800/80 border-slate-700 hover:bg-slate-700/80 text-slate-400 hover:text-slate-200"
                  }`}
                  title="Active Members"
                >
                  <Users className="size-4" />
                </button>
              </div>

              {/* Call Mode Selector Segmented Switch */}
              <div className="flex bg-slate-950 p-1 border border-slate-800 rounded-xl">
                <button
                  onClick={() => { setCallMode("simulator"); setMainView("video"); }}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                    callMode === "simulator" 
                      ? "bg-slate-800 text-white border border-slate-700" 
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Sim Cam
                </button>
                <button
                  onClick={() => { setCallMode("jitsi"); setMainView("video"); }}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                    callMode === "jitsi" 
                      ? "bg-primary text-white shadow-soft" 
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  HD Live
                </button>
              </div>

            </div>
          </footer>

        </section>

        {/* RIGHT COLLAPSIBLE WORKSPACE SIDEBAR */}
        <section 
          className={`bg-slate-900 border-l border-slate-800/80 flex flex-col justify-between h-full text-slate-200 select-none transition-all duration-300 relative shrink-0 ${
            sidebarExpanded ? "w-full md:w-[380px]" : "w-[60px]"
          }`}
        >
          {sidebarExpanded ? (
            // EXPANDED SIDEBAR VIEW
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              
              {/* Tab Header Selector */}
              <div className="flex items-center justify-between border-b border-slate-850 bg-[#0B101E] px-3 py-2 shrink-0">
                <div className="flex-1 flex overflow-x-auto scrollbar-hide py-1 gap-1.5">
                  {[
                    { id: "chat", icon: MessageSquare, label: "Chat" },
                    { id: "whiteboard", icon: PenTool, label: "Canvas" },
                    { id: "reports", icon: FileImage, label: "Files" },
                    ...(isDoctor ? [{ id: "notes", icon: FileText, label: "Notes" }] : []),
                    { id: "prescription", icon: Pill, label: "Rx" },
                    { id: "participants", icon: Users, label: "Members" }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveRightTab(tab.id as any)}
                        className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                          activeRightTab === tab.id 
                            ? "bg-white text-slate-900 shadow-sm" 
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        <Icon className="size-3.5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setSidebarExpanded(false)}
                  className="size-8 rounded-full border border-slate-800 hover:bg-slate-850 grid place-items-center text-slate-500 hover:text-white transition cursor-pointer ml-2 shrink-0"
                  title="Collapse Sidebar"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>

              {/* Tab Content Body */}
              <div className="flex-1 overflow-hidden p-4 flex flex-col">
                <AnimatePresence mode="wait">
                  
                  {/* TAB: SECURE CHAT */}
                  {activeRightTab === "chat" && (
                    <motion.div
                      key="chatTab"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="flex-1 flex flex-col justify-between h-full min-h-0"
                    >
                      <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-3 shrink-0">
                        <div>
                          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Secure Consultation Chat</h4>
                          <p className="text-[10px] text-slate-500">HIPAA compliant and end-to-end encrypted.</p>
                        </div>
                        <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Secure</span>
                      </div>

                      <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs mb-3">
                        {chatMessages.map((msg, i) => (
                          <div key={i} className={`flex flex-col ${msg.self ? "items-end" : "items-start"}`}>
                            <div className={`p-2.5 rounded-xl max-w-[85%] ${
                              msg.sender === "System" 
                                ? "bg-slate-800 text-slate-400 text-center mx-auto text-[10px] py-1 px-3 border border-slate-700" 
                                : msg.self 
                                  ? "bg-gradient-primary text-white rounded-tr-none" 
                                  : "bg-[#1E2638] text-slate-200 rounded-tl-none border border-slate-700"
                            }`}>
                              {msg.sender !== "System" && <p className="text-[9px] font-bold opacity-60 mb-0.5">{msg.sender}</p>}
                              <p className="leading-normal">{msg.text}</p>
                            </div>
                            <span className="text-[8px] text-slate-500 mt-0.5 font-mono">{msg.time}</span>
                          </div>
                        ))}
                      </div>

                      <form onSubmit={handleSendMessage} className="border-t border-slate-800/80 pt-3 flex gap-2 shrink-0">
                        <input
                          type="text"
                          placeholder="Type encrypted message..."
                          value={newMsg}
                          onChange={(e) => setNewMsg(e.target.value)}
                          className="flex-1 h-9 bg-slate-950 border border-slate-800 rounded-lg px-3 text-xs outline-none focus:border-primary text-white animate-fade-in"
                        />
                        <button type="submit" className="size-9 rounded-lg bg-gradient-primary grid place-items-center text-white cursor-pointer hover:shadow-soft">
                          <Send className="size-3.5" />
                        </button>
                      </form>
                    </motion.div>
                  )}

                  {/* TAB: COLLABORATIVE WHITEBOARD */}
                  {activeRightTab === "whiteboard" && (
                    <motion.div
                      key="whiteboardTab"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="flex-1 flex flex-col gap-4 h-full"
                    >
                      <div className="flex justify-between items-center border-b border-slate-800 pb-2 shrink-0">
                        <div>
                          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Collaboration Whiteboard</h4>
                          <p className="text-[10px] text-slate-500">Annotate files and draw diagnostic charts.</p>
                        </div>
                        <button onClick={clearCanvas} className="size-8 rounded-lg border border-slate-800 hover:bg-slate-850 grid place-items-center text-rose-400 hover:text-rose-300 transition cursor-pointer" title="Clear Canvas">
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>

                      {/* Tool Settings Selector */}
                      <div className="bg-slate-950 border border-slate-800 p-1.5 rounded-xl flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-1">
                          {[
                            { id: "draw", icon: PenTool, title: "Pen" },
                            { id: "rect", icon: Square, title: "Rectangle" },
                            { id: "circle", icon: Circle, title: "Circle" },
                            { id: "text", icon: Type, title: "Text annotation" },
                            { id: "eraser", icon: Eraser, title: "Eraser" }
                          ].map((t) => {
                            const Icon = t.icon;
                            return (
                              <button
                                key={t.id}
                                onClick={() => setDrawingTool(t.id as any)}
                                className={`size-7 rounded-lg grid place-items-center transition cursor-pointer ${
                                  drawingTool === t.id ? "bg-primary text-white" : "text-slate-400 hover:bg-slate-800"
                                }`}
                                title={t.title}
                              >
                                <Icon className="size-3.5" />
                              </button>
                            );
                          })}
                        </div>
                        <div className="h-4 w-px bg-slate-800 mx-1" />
                        <div className="flex items-center gap-1">
                          {["#2563EB", "#10B981", "#F59E0B", "#EF4444", "#111827"].map((col) => (
                            <button
                              key={col}
                              onClick={() => { setColor(col); if (drawingTool === "eraser") setDrawingTool("draw"); }}
                              className={`size-4.5 rounded-full border transition ${color === col && drawingTool !== "eraser" ? "ring-2 ring-primary border-white scale-110" : "border-slate-800 hover:scale-105"}`}
                              style={{ backgroundColor: col }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Small whiteboard panel preview canvas (if whiteboard is in the right panel) */}
                      {mainView !== "whiteboard" ? (
                        <div className="flex-1 flex flex-col gap-3 min-h-0">
                          <div className="flex-1 bg-white rounded-2xl overflow-hidden border border-slate-800 relative">
                            <canvas
                              ref={canvasRef}
                              onMouseDown={handleCanvasMouseDown}
                              onMouseMove={handleCanvasMouseMove}
                              onMouseUp={handleCanvasMouseUp}
                              className="cursor-crosshair w-full h-full block"
                            />
                            {textInput && (
                              <input
                                type="text"
                                autoFocus
                                value={textInput.value}
                                onChange={(e) => setTextInput({ ...textInput, value: e.target.value })}
                                onBlur={commitText}
                                onMouseDown={(e) => e.stopPropagation()}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    commitText();
                                  } else if (e.key === "Escape") {
                                    setTextInput(null);
                                  }
                                }}
                                style={{
                                  position: "absolute",
                                  left: textInput.x,
                                  top: textInput.y,
                                  color: color,
                                  background: "transparent",
                                  border: `1.5px dashed ${color}`,
                                  outline: "none",
                                  font: "bold 16px sans-serif",
                                  padding: "2px 4px",
                                  zIndex: 50,
                                  minWidth: "150px"
                                }}
                              />
                            )}
                          </div>
                          <button
                            onClick={() => setMainView("whiteboard")}
                            className="w-full h-10 border border-primary/20 text-primary bg-primary/5 hover:bg-primary/10 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-soft"
                          >
                            <Maximize2 className="size-3.5" /> Present on Main Screen
                          </button>
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col justify-center items-center p-6 border border-dashed border-slate-800 rounded-2xl text-center space-y-3 bg-slate-950/40">
                          <div className="size-12 rounded-full bg-primary/10 text-primary grid place-items-center mx-auto border border-primary/20"><PenTool className="size-6 animate-pulse" /></div>
                          <div>
                            <h5 className="font-bold text-xs text-slate-200">Whiteboard Presenting Live</h5>
                            <p className="text-[10px] text-slate-500 mt-1 max-w-[200px] mx-auto">Collaborative drawing dashboard is loaded in high definition on the main panel.</p>
                          </div>
                          <button
                            onClick={() => setMainView("video")}
                            className="h-8 px-4 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700"
                          >
                            <Minimize2 className="size-3.5" /> Dock back to Sidebar
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* TAB: MEDICAL REPORTS */}
                  {activeRightTab === "reports" && (
                    <motion.div
                      key="reportsTab"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="space-y-4 flex-1 flex flex-col"
                    >
                      <div className="border-b border-slate-800 pb-2 shrink-0">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Digital Diagnostic Records</h4>
                        <p className="text-[10px] text-slate-500">MRI scans, blood panels, and clinical files.</p>
                      </div>

                      <div className="space-y-3 overflow-y-auto flex-1 pr-1 scrollbar-hide">
                        {reports.map((rep) => (
                          <div key={rep.id} className="p-3 border border-slate-700 rounded-2xl bg-[#1E2638] flex flex-col gap-3 group relative overflow-hidden">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="size-7 rounded-lg bg-primary/20 text-primary grid place-items-center font-bold text-[9px] border border-primary/20">{rep.type}</div>
                                <div>
                                  <p className="text-xs font-bold text-white truncate max-w-[180px]">{rep.name}</p>
                                  <p className="text-[9px] text-slate-400">Case Identifier #{rep.id}</p>
                                </div>
                              </div>
                            </div>

                            <div className="w-full h-24 rounded-xl overflow-hidden border border-slate-700 relative bg-slate-800 flex items-center justify-center">
                              <img src={rep.preview} alt={rep.name} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300" />
                            </div>

                            <div className="grid grid-cols-2 gap-2 shrink-0">
                              <button
                                onClick={() => loadReportToWhiteboard(rep.preview)}
                                className="h-8 rounded-xl bg-primary/20 hover:bg-primary/40 text-[10px] font-bold text-primary transition cursor-pointer flex items-center justify-center gap-1.5 border border-primary/30"
                              >
                                <PenTool className="size-3" /> Annotate
                              </button>
                              <button
                                onClick={() => toast.success(`Downloading report ${rep.name} to local device.`)}
                                className="h-8 rounded-xl bg-slate-700 hover:bg-slate-600 border border-slate-600 text-[10px] font-semibold text-slate-200 transition cursor-pointer flex items-center justify-center gap-1.5"
                              >
                                <Download className="size-3" /> Save Copy
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Drop-and-drop simulated input widget */}
                      <div
                        onClick={() => toast.info("File upload is simulated in this demo.")}
                        className="p-4 border border-dashed border-slate-600 hover:border-primary/50 rounded-2xl text-center bg-[#1E2638] hover:bg-slate-800/60 transition cursor-pointer shrink-0 group"
                      >
                        <Upload className="size-5 text-slate-400 group-hover:text-primary mx-auto mb-1.5 transition" />
                        <p className="text-xs font-bold text-slate-300 group-hover:text-white transition">Add Clinical File</p>
                        <p className="text-[9px] text-slate-500 mt-0.5">X-rays, blood reports, lab findings</p>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB: CLINICAL NOTES (DOCTOR ONLY) */}
                  {activeRightTab === "notes" && isDoctor && (
                    <motion.div
                      key="notesTab"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="space-y-4 flex-1 flex flex-col"
                    >
                      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                        <div>
                          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Clinical Consultation Log</h4>
                          <p className="text-[10px] text-slate-500">Private clinical records for this encounter.</p>
                        </div>
                        <button
                          onClick={runMagicAI}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/20 text-primary text-[10px] font-bold hover:bg-primary/30 border border-primary/20 transition cursor-pointer shadow-soft"
                        >
                          <Sparkles className="size-3" /> AI Assist
                        </button>
                      </div>

                      <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block">Chief Symptoms & Presentation</label>
                          <textarea
                            rows={3}
                            value={notes.symptoms}
                            onChange={(e) => setNotes({ ...notes, symptoms: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs outline-none focus:border-primary text-slate-200 leading-relaxed font-sans resize-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block">Diagnostic Conclusion</label>
                          <textarea
                            rows={2}
                            value={notes.diagnosis}
                            onChange={(e) => setNotes({ ...notes, diagnosis: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs outline-none focus:border-primary text-slate-200 font-bold leading-relaxed font-sans resize-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block">Advice & Directives</label>
                          <textarea
                            rows={3}
                            value={notes.recommendations}
                            onChange={(e) => setNotes({ ...notes, recommendations: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs outline-none focus:border-primary text-slate-200 leading-relaxed font-sans resize-none"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB: PRESCRIPTION */}
                  {activeRightTab === "prescription" && (
                    <motion.div
                      key="prescriptionTab"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="flex-1 flex flex-col justify-between h-full"
                    >
                      <div className="border-b border-slate-700 pb-2 shrink-0 mb-3">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-200">Electronic RX Prescription</h4>
                        <p className="text-[10px] text-slate-400">{isDoctor ? "Generate and sign prescription electronically." : "Secure medical prescription verified by doctor."}</p>
                      </div>

                      {isDoctor ? (
                        // DOCTOR WORKFLOW: PRESCRIPTION BUILDER
                        <div className="flex-1 flex flex-col justify-between overflow-hidden">
                                                  {/* Medicine List */}
                          <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs mb-3">
                            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-855 pb-1 mb-2">Prescribed Medicines ({medicines.length})</p>
                            {medicines.map((med, idx) => (
                              <div key={idx} className="p-3 bg-[#C8D0DC] border-0 rounded-2xl flex justify-between items-center text-xs group">
                                <div className="text-slate-900">
                                  <p className="font-bold text-slate-900 text-xs">{med.name}</p>
                                  <p className="text-[10px] text-slate-600 font-semibold mt-0.5">{med.dosage} · {med.frequency} · {med.duration}</p>
                                  {med.note && <p className="text-[9px] text-blue-700 font-bold italic mt-1 flex items-center gap-1">Note: {med.note}</p>}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeMedicine(idx)}
                                  className="size-7 rounded-lg hover:bg-rose-100 text-rose-600 grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shrink-0"
                                >
                                  <Trash className="size-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>

                          {/* Quick Add Medicine Card */}
                          <form onSubmit={addMedicine} className="bg-[#131C2E] border border-slate-700 p-4 rounded-2xl space-y-3 shrink-0 mb-3">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5"><Pill className="size-3.5 text-cyan-400" /> Add RX Medicine</p>
                            <input
                              type="text"
                              placeholder="Name (e.g. Paracetamol 650mg)"
                              value={newMed.name}
                              onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                              className="w-full h-9 px-3 bg-[#0B1629] border border-slate-700 rounded-xl text-xs outline-none focus:border-cyan-500 text-white placeholder:text-slate-500"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                placeholder="Dosage (e.g. 1 Tablet)"
                                value={newMed.dosage}
                                onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                                className="h-9 px-3 bg-[#0B1629] border border-slate-700 rounded-xl text-xs outline-none focus:border-cyan-500 text-white placeholder:text-slate-500"
                              />
                              <input
                                type="text"
                                placeholder="Frequency (e.g. Thrice daily)"
                                value={newMed.frequency}
                                onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
                                className="h-9 px-3 bg-[#0B1629] border border-slate-700 rounded-xl text-xs outline-none focus:border-cyan-500 text-white placeholder:text-slate-500"
                              />
                            </div>
                            <div className="grid grid-cols-[3fr_2fr] gap-2">
                              <input
                                type="text"
                                placeholder="Duration (e.g. 5 days)"
                                value={newMed.duration}
                                onChange={(e) => setNewMed({ ...newMed, duration: e.target.value })}
                                className="h-9 px-3 bg-[#0B1629] border border-slate-700 rounded-xl text-xs outline-none focus:border-cyan-500 text-white placeholder:text-slate-500"
                              />
                              <button
                                type="submit"
                                className="h-9 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1"
                              >
                                <Plus className="size-3.5" /> Append
                              </button>
                            </div>
                          </form>

                          <button
                            onClick={() => setShowPrescriptionModal(true)}
                            disabled={medicines.length === 0}
                            className="w-full h-10 bg-cyan-500 hover:bg-cyan-400 text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-40 disabled:pointer-events-none"
                          >
                            <CheckCircle2 className="size-4" /> Sign & Generate Document
                          </button>
                        </div>
                      ) : (
                        // PATIENT WORKFLOW: VIEW SECURE PRESCRIPTION
                        <div className="flex-1 flex flex-col justify-center text-xs">
                          {prescriptionSent ? (
                            <div className="flex-1 flex flex-col justify-between overflow-hidden">
                              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                                <div className="p-4 bg-white text-slate-800 rounded-2xl shadow-glow border flex flex-col gap-3 font-sans relative">
                                  <div className="absolute top-3 right-3 bg-emerald-100 text-emerald-700 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                                    <ShieldCheck className="size-3" /> Signed & Secured
                                  </div>
                                  
                                  {/* Letterhead */}
                                  <div className="border-b pb-2 flex justify-between items-start">
                                    <div>
                                      <h5 className="font-bold text-xs text-primary flex items-center gap-1">
                                        Medora Clinics Ltd.
                                      </h5>
                                      <p className="text-[8px] text-slate-500 mt-0.5">Navi Mumbai · Reg #82946</p>
                                    </div>
                                    <div className="text-right text-[8px] text-slate-500">
                                      <p className="font-bold text-slate-700">Dr. Maya Patel</p>
                                      <p>Internal Medicine Specialist</p>
                                    </div>
                                  </div>

                                  <div className="text-[10px] space-y-2">
                                    <p className="font-bold text-primary text-[9px] tracking-wider uppercase">💊 RX Medicines</p>
                                    <div className="divide-y space-y-1.5 text-slate-700 font-medium">
                                      {medicines.map((med, idx) => (
                                        <div key={idx} className="pt-1.5 flex justify-between items-start gap-3">
                                          <div>
                                            <p className="font-bold text-slate-800">{med.name}</p>
                                            <p className="text-[8px] text-slate-500 mt-0.5">{med.dosage} · {med.frequency}</p>
                                          </div>
                                          <p className="font-bold text-slate-700 text-[10px] shrink-0">{med.duration}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="border-t pt-3 flex justify-between items-end">
                                    <div className="text-[8px] text-slate-500 max-w-[120px]">
                                      <p className="font-bold">CLINICAL ADVICE</p>
                                      <p className="truncate italic mt-0.5">{notes.recommendations || "Strict rest."}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-serif italic text-primary font-bold text-xs">Dr. Maya Patel</p>
                                      <p className="text-[7px] text-slate-400 mt-0.5 uppercase font-bold">Electronically Signed</p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <button
                                onClick={() => toast.success("PDF Prescription saved to your downloads!")}
                                className="w-full h-10 mt-3 bg-gradient-primary text-white font-bold rounded-xl text-xs hover:opacity-95 transition cursor-pointer flex items-center justify-center gap-1.5 shrink-0 shadow-soft"
                              >
                                <Download className="size-4" /> Download Official PDF RX
                              </button>
                            </div>
                          ) : (
                            <div className="flex-1 flex flex-col justify-center items-center text-center p-6 space-y-4">
                              <div className="relative size-14 rounded-full bg-slate-900 border border-slate-800 grid place-items-center mx-auto text-slate-400">
                                <span className="absolute inset-0 size-full rounded-full border border-primary/20 animate-ping" />
                                <Activity className="size-6 text-primary animate-pulse" />
                              </div>
                              <div>
                                <h5 className="font-bold text-sm text-slate-200">Awaiting Doctor Signature</h5>
                                <p className="text-[10px] text-slate-500 mt-1 max-w-[200px] mx-auto">Dr. Maya Patel is reviewing clinical chart logs. Your verified prescription will appear here immediately upon electronic signature.</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* TAB: MEMBERS */}
                  {activeRightTab === "participants" && (
                    <motion.div
                      key="participantsTab"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="space-y-4 flex-1 flex flex-col"
                    >
                      <div className="border-b border-slate-700 pb-2">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-200">Active Consultation Members</h4>
                        <p className="text-[10px] text-slate-400">Live attendance in this consultation lobby.</p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 rounded-2xl bg-[#C8D0DC]">
                          <div className="flex items-center gap-2.5">
                            <div className="size-8 rounded-xl bg-primary text-white grid place-items-center font-bold text-[10px] shadow-sm">MP</div>
                            <span className="font-bold text-sm text-slate-900">Dr. Maya Patel</span>
                          </div>
                          <span className="text-[9px] font-bold text-cyan-700 bg-cyan-100 px-2.5 py-1 rounded-full uppercase tracking-wide">Physician</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-2xl bg-[#C8D0DC]">
                          <div className="flex items-center gap-2.5">
                            <div className="size-8 rounded-xl bg-emerald-500 text-white grid place-items-center font-bold text-[10px] shadow-sm">JD</div>
                            <span className="font-bold text-sm text-slate-900">Jane Doe</span>
                          </div>
                          <span className="text-[9px] font-bold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full uppercase tracking-wide">Patient</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

            </div>
          ) : (
            // COLLAPSED SIDEBAR VIEW (VERTICAL ICON BAR)
            <div className="flex flex-col items-center py-4 gap-4 h-full shrink-0">
              <button
                onClick={() => setSidebarExpanded(true)}
                className="size-8 rounded-lg border border-slate-800 hover:bg-slate-855 grid place-items-center text-slate-500 hover:text-white transition cursor-pointer mb-2"
                title="Expand Workspace"
              >
                <ChevronLeft className="size-4" />
              </button>

              <div className="h-px w-6 bg-slate-800" />

              {[
                { id: "chat", icon: MessageSquare, title: "Secure Chat" },
                { id: "whiteboard", icon: PenTool, title: "Whiteboard" },
                { id: "reports", icon: FileImage, title: "Diagnostic Reports" },
                ...(isDoctor ? [{ id: "notes", icon: FileText, title: "Consultation Notes" }] : []),
                { id: "prescription", icon: Pill, title: "Prescription" },
                { id: "participants", icon: Users, title: "Lobby Attendees" }
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeRightTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveRightTab(tab.id as any); setSidebarExpanded(true); }}
                    className={`size-9 rounded-xl grid place-items-center transition cursor-pointer border ${
                      active 
                        ? "bg-primary border-transparent text-white shadow-soft" 
                        : "bg-slate-900 border-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                    title={tab.title}
                  >
                    <Icon className="size-4.5" />
                  </button>
                );
              })}
            </div>
          )}
        </section>

      </div>

      {/* PRESCRIPTION PREVIEW & SIGNATURE MODAL (DOCTOR ONLY) */}
      <AnimatePresence>
        {showPrescriptionModal && isDoctor && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white text-slate-900 max-w-lg w-full rounded-3xl overflow-hidden shadow-glow border"
            >
              {/* PDF Preview Screen */}
              <div className="p-6 md:p-8 space-y-6 font-sans text-xs relative text-left">
                <button
                  onClick={() => setShowPrescriptionModal(false)}
                  className="absolute top-4 right-4 size-8 rounded-full border bg-slate-50 hover:bg-slate-100 grid place-items-center text-slate-500 cursor-pointer"
                >
                  <X className="size-4" />
                </button>

                {/* Header */}
                <div className="flex justify-between items-start border-b pb-4">
                  <div>
                    <h3 className="font-bold text-base text-primary flex items-center gap-1.5">
                      <span className="grid place-items-center size-8 rounded-lg bg-gradient-primary text-white shadow-soft"><Activity className="size-4" /></span>
                      Medora Clinics Ltd.
                    </h3>
                    <p className="text-[9px] text-slate-500 mt-1">Sector 30A, Vashi, Navi Mumbai · +91 (80) 4736-0000</p>
                  </div>
                  <div className="text-right text-[10px]">
                    <p className="font-bold text-slate-800">Dr. Maya Patel, MD</p>
                    <p className="text-[9px] text-slate-500">Internal Medicine · Reg #82946</p>
                  </div>
                </div>

                {/* Patient metadata */}
                <div className="grid grid-cols-2 gap-4 text-[10px] bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div>
                    <p className="text-slate-400 font-bold uppercase tracking-wide">PATIENT DETAILS</p>
                    <p className="font-bold text-slate-800 mt-0.5">Jane Doe (Female, 28 years)</p>
                  </div>
                  <div className="text-right font-medium">
                    <p className="text-slate-400 font-bold uppercase tracking-wide">DATE & ROOM</p>
                    <p className="font-semibold text-slate-800 mt-0.5">May 28, 2026 · {roomId?.substring(0, 12)}...</p>
                  </div>
                </div>

                {/* Medicine details */}
                <div className="space-y-3">
                  <p className="font-bold text-xs border-b pb-1 text-primary tracking-wide uppercase flex items-center gap-1"><Pill className="size-3.5 text-primary" /> Rx Prescriptions</p>
                  <table className="w-full text-left text-[11px] border-collapse">
                    <thead>
                      <tr className="text-slate-400 font-bold border-b">
                        <th className="pb-1.5">Medicine Details</th>
                        <th className="pb-1.5">Dosage</th>
                        <th className="pb-1.5">Frequency</th>
                        <th className="pb-1.5 text-right">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-slate-700 font-medium">
                      {medicines.map((med, idx) => (
                        <tr key={idx}>
                          <td className="py-2">
                            <p className="font-bold text-slate-800">{med.name}</p>
                            {med.note && <p className="text-[9px] text-primary italic mt-0.5">{med.note}</p>}
                          </td>
                          <td className="py-2">{med.dosage}</td>
                          <td className="py-2">{med.frequency}</td>
                          <td className="py-2 text-right font-semibold text-slate-800">{med.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Footer notes */}
                <div className="border-t pt-4 grid grid-cols-2 items-end">
                  <div className="text-[10px]">
                    <p className="text-slate-400 font-bold uppercase">CLINICAL ADVICE</p>
                    <p className="text-slate-600 italic mt-0.5 max-w-[200px] truncate leading-relaxed">{notes.recommendations || "Adequate bed rest & fluid intake."}</p>
                  </div>
                  <div className="text-right">
                    <div className="inline-block border-b border-slate-300 pb-0.5">
                      <p className="font-serif italic text-primary font-bold text-sm tracking-wide">Dr. Maya Patel</p>
                    </div>
                    <p className="text-[8px] text-slate-400 mt-1 uppercase tracking-wider font-bold">Electronically Signed</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-slate-50 border-t flex justify-end gap-3 shrink-0">
                <button
                  onClick={() => toast.success("Draft prescription PDF saved locally.")}
                  className="px-4 h-10 border rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 cursor-pointer transition border-slate-200"
                >
                  Download PDF
                </button>
                <button
                  onClick={handleSendPrescription}
                  className="px-6 h-10 bg-gradient-primary text-white text-xs font-bold rounded-xl shadow-soft hover:opacity-95 transition cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="size-3.5" /> Sign & Send Prescription
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

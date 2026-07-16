"use client";
import { useState, useRef, useEffect } from "react";
import { businessConfig } from "@/lib/config";

const { colors, name, emoji, suggestions, greeting } = businessConfig;

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 5, alignItems: "center", padding: "4px 2px" }}>
      {[0, 1, 2].map((i) => (
        <span key={i} className={`dot dot-${i}`} />
      ))}
    </div>
  );
}

function RichText({ text }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i}>{part.slice(2, -2)}</strong>
        ) : (
          part.split("\n").map((line, j, arr) => (
            <span key={`${i}-${j}`}>
              {line}
              {j < arr.length - 1 && <br />}
            </span>
          ))
        )
      )}
    </>
  );
}

export default function ChatWidget() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: greeting },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;
    setInput("");
    setError(null);
    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setError("Something went wrong. Please try again or call us at +216 71 234 567.");
      setMessages(newMessages);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      <style>{`
        .cw * { box-sizing: border-box; }
        .cw ::-webkit-scrollbar { width: 3px; }
        .cw ::-webkit-scrollbar-thumb { background: ${colors.primary}44; border-radius: 4px; }
        .mi { animation: mi 0.28s cubic-bezier(.22,.68,0,1.2) forwards; }
        @keyframes mi { from{opacity:0;transform:translateY(10px) scale(.97);}to{opacity:1;transform:none;} }
        .dot{width:7px;height:7px;border-radius:50%;background:${colors.primary};display:inline-block;}
        .dot-0{animation:p 1.2s ease-in-out 0s infinite;}
        .dot-1{animation:p 1.2s ease-in-out 0.2s infinite;}
        .dot-2{animation:p 1.2s ease-in-out 0.4s infinite;}
        @keyframes p{0%,80%,100%{transform:translateY(0);opacity:.4;}40%{transform:translateY(-6px);opacity:1;}}
        .chip{cursor:pointer;transition:all .18s;border:1px solid ${colors.primary}55;background:${colors.primary}12;color:${colors.textMuted};border-radius:20px;padding:6px 13px;font-size:12.5px;font-family:sans-serif;}
        .chip:hover{background:${colors.primary}30;transform:translateY(-1px);}
        .sb{transition:all .18s;}
        .sb:hover:not(:disabled){background:${colors.primaryLight} !important;transform:scale(1.06);}
        .sb:disabled{opacity:.35;cursor:default;}
        .ci:focus{outline:none;}
      `}</style>

      <div className="cw" style={{
        width:"100%",maxWidth:460,height:"min(680px, 90vh)",
        display:"flex",flexDirection:"column",
        background:"rgba(255,245,230,0.04)",borderRadius:22,
        border:`1px solid ${colors.primary}33`,overflow:"hidden",
        boxShadow:`0 28px 70px rgba(0,0,0,.55),inset 0 1px 0 ${colors.primary}22`,
        backdropFilter:"blur(20px)",
      }}>
        <header style={{
          padding:"18px 22px",borderBottom:`1px solid ${colors.primary}18`,
          background:`linear-gradient(135deg,${colors.primary}18,${colors.primary}06)`,
          flexShrink:0,display:"flex",alignItems:"center",gap:12,
        }}>
          <div style={{
            width:44,height:44,borderRadius:"50%",
            background:`linear-gradient(135deg,${colors.primary},${colors.primaryDark})`,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:20,flexShrink:0,boxShadow:`0 4px 14px ${colors.primary}55`,
          }}>{emoji}</div>
          <div>
            <div style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:700,color:colors.textLight,letterSpacing:.2}}>{name}</div>
            <div style={{display:"flex",alignItems:"center",gap:5,marginTop:3}}>
              <span style={{width:6,height:6,borderRadius:"50%",background:"#4caf82",display:"inline-block"}}/>
              <span style={{fontSize:11,color:colors.primary,letterSpacing:.5,textTransform:"uppercase",fontFamily:"sans-serif",fontWeight:500}}>Online · Replies instantly</span>
            </div>
          </div>
        </header>

        <div style={{flex:1,overflowY:"auto",padding:"18px 14px",display:"flex",flexDirection:"column",gap:10}}>
          {messages.map((msg, i) => (
            <div key={i} className="mi" style={{display:"flex",justifyContent:msg.role==="user"?"flex-end":"flex-start",alignItems:"flex-end",gap:8}}>
              {msg.role==="assistant" && (
                <div style={{width:26,height:26,borderRadius:"50%",background:`linear-gradient(135deg,${colors.primary},${colors.primaryDark})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,flexShrink:0,marginBottom:2}}>{emoji}</div>
              )}
              <div style={{
                maxWidth:"80%",padding:"10px 14px",
                borderRadius:msg.role==="user"?"17px 17px 4px 17px":"17px 17px 17px 4px",
                background:msg.role==="user"?`linear-gradient(135deg,${colors.primary},${colors.primaryDark})`:`rgba(255,245,230,.07)`,
                border:msg.role==="user"?"none":`1px solid ${colors.primary}15`,
                color:msg.role==="user"?colors.bg:colors.textMuted,
                fontSize:13.5,lineHeight:1.65,fontFamily:"sans-serif",
                fontWeight:msg.role==="user"?500:400,
              }}>
                <RichText text={msg.content}/>
              </div>
            </div>
          ))}

          {loading && (
            <div className="mi" style={{display:"flex",alignItems:"flex-end",gap:8}}>
              <div style={{width:26,height:26,borderRadius:"50%",background:`linear-gradient(135deg,${colors.primary},${colors.primaryDark})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12}}>{emoji}</div>
              <div style={{padding:"10px 14px",borderRadius:"17px 17px 17px 4px",background:"rgba(255,245,230,.07)",border:`1px solid ${colors.primary}15`}}>
                <TypingDots/>
              </div>
            </div>
          )}

          {error && (
            <div style={{background:"rgba(220,60,60,.15)",border:"1px solid rgba(220,60,60,.3)",borderRadius:10,padding:"9px 13px",color:"#ffb3b3",fontSize:12.5,fontFamily:"sans-serif"}}>{error}</div>
          )}

          {messages.length===1 && !loading && (
            <div style={{marginTop:6}}>
              <div style={{fontSize:10.5,color:`${colors.primary}77`,marginBottom:7,letterSpacing:.5,textTransform:"uppercase",fontFamily:"sans-serif"}}>Quick questions</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {suggestions.map((q) => (
                  <button key={q} className="chip" onClick={() => send(q)}>{q}</button>
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef}/>
        </div>

        <div style={{padding:"12px 14px",borderTop:`1px solid ${colors.primary}15`,background:"rgba(255,245,230,.025)",flexShrink:0}}>
          <div style={{display:"flex",gap:9,alignItems:"flex-end",background:"rgba(255,245,230,.06)",border:`1px solid ${colors.primary}28`,borderRadius:15,padding:"9px 13px"}}>
            <textarea
              ref={inputRef} className="ci" value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey} placeholder="Type your message..." rows={1}
              style={{flex:1,background:"none",border:"none",color:colors.textMuted,fontSize:13.5,fontFamily:"sans-serif",resize:"none",lineHeight:1.5,maxHeight:80,overflow:"auto"}}
            />
            <button className="sb" onClick={() => send()} disabled={!input.trim()||loading}
              style={{width:34,height:34,borderRadius:"50%",border:"none",background:`linear-gradient(135deg,${colors.primary},${colors.primaryDark})`,color:colors.bg,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:`0 2px 8px ${colors.primary}44`}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
          <div style={{textAlign:"center",marginTop:7,fontSize:10,color:`${colors.primary}44`,fontFamily:"sans-serif",letterSpacing:.3}}>
            Powered by Claude AI · {name} {emoji}
          </div>
        </div>
      </div>
    </>
  );
}

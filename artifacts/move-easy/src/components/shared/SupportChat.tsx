import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Mail, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: number;
  from: "bot" | "user";
  text: string;
  quickReplies?: string[];
  showEmail?: boolean;
}

interface MoveContext {
  userName: string;
  fromAddress: string;
  toAddress: string;
  moveDate: string;
  providerCount: number;
  providerNames: string[];
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex gap-1 items-center h-4">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function getBotResponse(
  input: string,
  ctx: MoveContext,
  failCount: number,
): { text: string; quickReplies?: string[]; showEmail?: boolean; resetFails?: boolean } {
  const q = input.toLowerCase();

  if (q.includes("status") || q.includes("progress") || q.includes("update")) {
    return {
      text: `Your move is in progress! We're notifying ${ctx.providerCount} provider${ctx.providerCount !== 1 ? "s" : ""} about your move from ${ctx.fromAddress} to ${ctx.toAddress} on ${ctx.moveDate}. Notifications are typically processed within 2–3 working days.`,
      quickReplies: ["Which providers?", "How long does it take?", "Something else"],
      resetFails: true,
    };
  }

  if (q.includes("provider") || q.includes("notification") || q.includes("which") || q.includes("notif")) {
    const names = ctx.providerNames.length > 0 ? ctx.providerNames.join(", ") : "your selected providers";
    return {
      text: `You've selected ${ctx.providerCount} provider${ctx.providerCount !== 1 ? "s" : ""} to notify: ${names}. All notifications are being processed — providers typically confirm within 2–5 working days.`,
      quickReplies: ["My move status", "How long does it take?", "I'm all set, thanks!"],
      resetFails: true,
    };
  }

  if (q.includes("how long") || q.includes("timeline") || q.includes("when") || q.includes("days")) {
    return {
      text: "Most providers confirm your change of address within 2–5 working days of your move date. Some councils can take up to 10 working days. You'll receive confirmation directly from each provider.",
      quickReplies: ["My move status", "Can I change my move date?", "Something else"],
      resetFails: true,
    };
  }

  if (q.includes("change") || q.includes("edit") || q.includes("update") || q.includes("wrong") || q.includes("mistake") || q.includes("incorrect")) {
    return {
      text: "To update any submitted move details, our support team can help you directly. Would you like me to connect you with them via email?",
      quickReplies: ["Yes, email support", "No thanks, I'm good"],
      showEmail: true,
      resetFails: true,
    };
  }

  if (q.includes("free") || q.includes("cost") || q.includes("price") || q.includes("pay") || q.includes("charge") || q.includes("billing")) {
    return {
      text: "MoveEasy is completely free to use — no hidden fees, ever. We earn a small commission only if you choose to switch to one of our partner providers, and there's no obligation to do so.",
      quickReplies: ["Great, thanks!", "My move status", "Something else"],
      resetFails: true,
    };
  }

  if (q.includes("cancel") || q.includes("delete") || q.includes("remove") || q.includes("stop")) {
    return {
      text: "If you'd like to cancel or withdraw a notification that's already been submitted, our support team can assist. This is best handled by a human. Shall I connect you via email?",
      showEmail: true,
      quickReplies: ["Yes, email support", "No thanks"],
      resetFails: true,
    };
  }

  if (q.includes("all set") || q.includes("thanks") || q.includes("thank you") || q.includes("perfect") || q.includes("great")) {
    return {
      text: "You're welcome! Good luck with your move 🏡 Feel free to come back anytime if you need anything else.",
      quickReplies: ["I have another question"],
      resetFails: true,
    };
  }

  if (q.includes("email support") || q.includes("contact support") || q.includes("human") || q.includes("speak to someone")) {
    return {
      text: "No problem — I'll hand you over to the team. Click below to send them an email and they'll get back to you within a few hours.",
      showEmail: true,
      resetFails: true,
    };
  }

  const newFails = failCount + 1;
  if (newFails >= 2) {
    return {
      text: "I'm sorry, that's a bit outside what I can help with right now. Would you like me to connect you with a human from our support team? They'll get back to you within a few hours.",
      showEmail: true,
      quickReplies: ["Yes, email support", "No thanks"],
    };
  }

  return {
    text: "I'm not quite sure I understood that. Could you try rephrasing? Or choose a topic below.",
    quickReplies: ["My move status", "Provider notifications", "Change my details", "Pricing & billing"],
  };
}

interface SupportChatProps {
  ctx: MoveContext;
}

let msgId = 0;
function nextId() { return ++msgId; }

export function SupportChat({ ctx }: SupportChatProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [failCount, setFailCount] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const firstName = ctx.userName.split(" ")[0] || "there";

  const emailHref = `mailto:support@moveeasy.com?subject=${encodeURIComponent(`Support Request – ${ctx.userName}`)}&body=${encodeURIComponent(`Hi MoveEasy team,\n\nI need help with my move from ${ctx.fromAddress} to ${ctx.toAddress} (moving on ${ctx.moveDate}).\n\nPlease describe your issue:\n`)}`;

  useEffect(() => {
    if (open && !started) {
      setStarted(true);
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setMessages([{
          id: nextId(),
          from: "bot",
          text: `Hi ${firstName} 👋 I'm Max, your MoveEasy assistant. I'm here 24/7 to help with any questions about your move. What can I help you with?`,
          quickReplies: ["My move status", "Provider notifications", "How long does it take?", "Pricing & billing", "Change my details"],
        }]);
      }, 1200);
    }
  }, [open, started, firstName]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  const addBotMessage = (response: ReturnType<typeof getBotResponse>) => {
    setTyping(true);
    const delay = 600 + Math.min(response.text.length * 10, 1000);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, {
        id: nextId(),
        from: "bot",
        text: response.text,
        quickReplies: response.quickReplies,
        showEmail: response.showEmail,
      }]);
      if (response.resetFails) setFailCount(0);
    }, delay);
  };

  const handleSend = (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg) return;
    setInput("");
    setMessages(prev => [...prev, { id: nextId(), from: "user", text: msg }]);
    const response = getBotResponse(msg, ctx, failCount);
    if (!response.resetFails) setFailCount(f => f + 1);
    addBotMessage(response);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-4 z-50 w-[360px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden"
            style={{ height: "480px" }}
          >
            {/* Header */}
            <div className="bg-primary px-4 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Max — MoveEasy Assistant</p>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <p className="text-white/80 text-xs">Online 24/7</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-muted/20">
              <AnimatePresence initial={false}>
                {messages.map(msg => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex flex-col gap-2 ${msg.from === "user" ? "items-end" : "items-start"}`}
                  >
                    <div className={`flex items-end gap-2 ${msg.from === "user" ? "flex-row-reverse" : ""}`}>
                      {msg.from === "bot" && (
                        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div
                        className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          msg.from === "user"
                            ? "bg-primary text-white rounded-br-sm"
                            : "bg-white text-foreground rounded-bl-sm border border-border/50 shadow-sm"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>

                    {msg.quickReplies && msg.quickReplies.length > 0 && (
                      <div className="flex flex-wrap gap-2 ml-9">
                        {msg.quickReplies.map(qr => (
                          <button
                            key={qr}
                            onClick={() => handleSend(qr)}
                            className="text-xs px-3 py-1.5 rounded-full border border-primary/40 text-primary hover:bg-primary hover:text-white transition-colors font-medium"
                          >
                            {qr}
                          </button>
                        ))}
                      </div>
                    )}

                    {msg.showEmail && (
                      <div className="ml-9">
                        <a href={emailHref}>
                          <Button size="sm" variant="outline" className="gap-2 text-xs h-8 border-primary/40 text-primary hover:bg-primary hover:text-white">
                            <Mail className="w-3.5 h-3.5" />
                            Email support team
                          </Button>
                        </a>
                      </div>
                    )}
                  </motion.div>
                ))}

                {typing && (
                  <motion.div key="typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <TypingIndicator />
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-3 py-3 border-t border-border bg-white shrink-0">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  placeholder="Type a message..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="h-10 text-sm rounded-xl border-border/60"
                />
                <Button size="sm" onClick={() => handleSend()} disabled={!input.trim()} className="h-10 w-10 p-0 rounded-xl shrink-0">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground text-center mt-2">Powered by MoveEasy AI · Escalates to human support</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      <motion.button
        id="open-chat-btn"
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-4 right-4 z-50 w-14 h-14 rounded-full bg-primary text-white shadow-lg shadow-primary/40 flex items-center justify-center hover:bg-primary/90 transition-colors"
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}

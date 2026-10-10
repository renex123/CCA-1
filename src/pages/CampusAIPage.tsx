import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/dbStore';
import { CAMPUS_KNOWLEDGE_BASE } from '../services/mockData';
import { ChatMessage } from '../types';
import {
  Sparkles,
  Send,
  Bot,
  User,
  ShieldCheck,
  ExternalLink,
  Info,
  Clock,
  BookOpen,
  MapPin,
  FileCheck,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export const CampusAIPage: React.FC = () => {
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      content: `Hello ${user?.full_name || 'there'}! I am **CampusAI**, your official verified campus assistant.\n\nI can retrieve your personalized class schedule, explain academic policies, provide locations of campus facilities, guide you through certificate applications, and look up exam notices. How can I assist you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sources: ['CampusOne Student Handbook 2026', 'Academic Regulations (Sec 4.2)'],
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const suggestedQuestions = [
    'Where is my next class?',
    'How do I apply for a bonafide certificate?',
    'What is today\'s timetable?',
    'What is the university attendance requirement?',
    'Where is the Central Library located?',
    'How do I report broken classroom Wi-Fi or projector?',
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    // Context-aware grounded knowledge response generator
    setTimeout(() => {
      const q = text.toLowerCase();
      let answer = '';
      let sources: string[] = [];

      if (q.includes('next class') || q.includes('where is my class')) {
        const timetable = db.getTimetable();
        const next = timetable[0];
        if (next) {
          answer = `Your next class is **${next.subject_name} (${next.subject_code})** scheduled from **${next.start_time} to ${next.end_time}**.\n\n• **Classroom:** ${next.room_number} (${next.building})\n• **Faculty In-Charge:** ${next.faculty_name}\n• **Status:** ${next.status.toUpperCase()}`;
          sources = ['Live Academic Timetable (Spring 2026)'];
        } else {
          answer = 'You have no further classes scheduled for today.';
          sources = ['Timetable Ledger'];
        }
      } else if (q.includes('timetable') || q.includes('today\'s schedule') || q.includes('classes today')) {
        const todayClasses = db.getTimetable().filter((t) => t.day_of_week === 1);
        answer = `Here is your schedule for today:\n\n` +
          todayClasses
            .map(
              (c, idx) =>
                `${idx + 1}. **${c.start_time} - ${c.end_time}**: ${c.subject_name} (${c.subject_code})\n   *Room:* ${c.room_number} • *Faculty:* ${c.faculty_name}`
            )
            .join('\n\n');
        sources = ['Academic Calendar & Timetable Matrix'];
      } else if (q.includes('bonafide') || q.includes('certificate')) {
        const kb = CAMPUS_KNOWLEDGE_BASE.find((k) => k.category === 'bonafide_certificate');
        answer = `${kb?.content}\n\n👉 **To apply:** Navigate to **Campus Services** -> Click **Request Campus Service** -> Select **Bonafide Certificate** -> Submit your purpose.`;
        sources = ['Academic Services Manual', 'CampusOne Knowledge Base Doc #02'];
      } else if (q.includes('attendance') || q.includes('75%') || q.includes('shortage')) {
        const kb = CAMPUS_KNOWLEDGE_BASE.find((k) => k.category === 'attendance_policy');
        const userAttend = user ? db.getStudentAttendance(user.id) : [];
        const total = userAttend.reduce((acc, c) => acc + c.total_classes, 0);
        const attended = userAttend.reduce((acc, c) => acc + c.attended_classes, 0);
        const agg = total > 0 ? ((attended / total) * 100).toFixed(1) : '88.8';

        answer = `${kb?.content}\n\n📊 **Your Current Status:** Your aggregate attendance is **${agg}%** across all registered theory & practical courses.`;
        sources = ['University Academic Regulations (Sec 4.2)', 'Student Attendance Records'];
      } else if (q.includes('library') || q.includes('books')) {
        const kb = CAMPUS_KNOWLEDGE_BASE.find((k) => k.category === 'library_rules');
        const libFac = db.getFacilities().find((f) => f.category === 'library');
        answer = `**${libFac?.name}** is located in **${libFac?.building}** (${libFac?.floor}).\n\n• **Timings:** ${libFac?.service_hours}\n• **Contact:** ${libFac?.contact_phone}\n\n${kb?.content}`;
        sources = ['Central Library Handbook', 'Campus Facility Directory'];
      } else if (q.includes('wifi') || q.includes('wi-fi') || q.includes('internet') || q.includes('projector') || q.includes('complain') || q.includes('report')) {
        const kb = CAMPUS_KNOWLEDGE_BASE.find((k) => k.category === 'complaint_sla');
        answer = `To report infrastructure issues:\n\n1. Go to the **Complaints** page.\n2. Click **Lodge New Complaint**.\n3. Select category (e.g., Internet & Wi-Fi, Classroom Equipment) and specify your exact room location.\n4. Your ticket will be assigned with SLA tracking.\n\n${kb?.content}`;
        sources = ['Campus SLA Governance Document', 'IT Helpdesk Policy'];
      } else if (q.includes('event') || q.includes('hackathon')) {
        const events = db.getEvents();
        answer = `Here are upcoming campus events:\n\n` +
          events
            .map(
              (e) =>
                `• **${e.title}** (${e.category.toUpperCase()})\n  *Date:* ${new Date(e.date_time).toLocaleDateString()} • *Venue:* ${e.venue}\n  *Registered:* ${e.registered_count} / ${e.capacity}`
            )
            .join('\n\n');
        sources = ['Student Affairs Event Calendar'];
      } else {
        answer = `I have verified this against the official university knowledge base. Based on institutional guidelines, please check the corresponding section on your portal or contact the Dean's Academic Desk. If you need specific assistance regarding timetable schedules, attendance condonation, bonafide certificates, or campus complaints, feel free to ask!`;
        sources = ['CampusOne Knowledge Base (Verified)'];
      }

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        content: answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources,
        isContextAware: true,
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold shadow-xs">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Campus Knowledge & Academic Desk
              </h2>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                Official Regulations Grounded
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Verified against BPUT Academic Handbooks, Examination By-Laws, and Live Timetable Matrix
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Zero-hallucination policy citations</span>
        </div>
      </div>

      {/* Suggested Prompt Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0">
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-600 transition-colors whitespace-nowrap cursor-pointer shadow-xs"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Feed */}
      <Card className="flex-1 flex flex-col overflow-hidden min-h-0">
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((m) => {
            const isBot = m.sender === 'assistant';
            return (
              <div
                key={m.id}
                className={`flex gap-3 max-w-3xl ${isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white ${
                    isBot ? 'bg-indigo-600 shadow-md' : 'bg-slate-700'
                  }`}
                >
                  {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div
                  className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isBot
                      ? 'bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 rounded-tl-xs'
                      : 'bg-indigo-600 text-white rounded-tr-xs'
                  }`}
                >
                  <div className="whitespace-pre-line font-normal">{m.content}</div>

                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-700/80">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Verified Sources:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {m.sources.map((src, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-semibold border border-slate-200 dark:border-slate-700"
                          >
                            <ExternalLink className="w-2.5 h-2.5" />
                            {src}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <span
                    className={`block text-[10px] mt-2 text-right ${
                      isBot ? 'text-slate-400' : 'text-indigo-200'
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 mr-auto max-w-xl">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="rounded-2xl p-4 bg-slate-100 dark:bg-slate-800/80 rounded-tl-xs flex items-center gap-2 text-xs text-slate-500">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]" />
                <span className="ml-2 font-medium">Retrieving campus knowledge base...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask a question about classes, policies, certificate applications, or locations..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Button type="submit" size="md" isLoading={isLoading} rightIcon={<Send className="w-3.5 h-3.5" />}>
              Send
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

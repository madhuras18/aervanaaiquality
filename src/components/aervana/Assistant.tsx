import { useEffect, useRef, useState } from "react";
import { ArrowUp, Sparkles } from "lucide-react";
import { aqiBand, bestWindow, formatHour } from "@/lib/air";
import type { City } from "@/lib/sample-data";
import { cn } from "@/lib/utils";
import { SampleBadge, SectionLabel } from "./SampleBadge";

type Msg = { role: "user" | "assistant"; text: string };

const SUGGESTIONS = [
  "Is it safe to run outside today?",
  "How do I protect my child from pollution?",
  "Which air purifier should I look for?",
  "What does PM2.5 mean?",
];

/** Prepared demo answers — no AI model is connected yet. */
function demoAnswer(q: string, city: City): string {
  const s = q.toLowerCase();
  const band = aqiBand(city.aqi);
  const run = bestWindow(city.hourly, 5, 21, 1);
  if (/(run|jog|exercise|walk|outside|outdoor|safe)/.test(s)) {
    return `In ${city.name}, the sample reading is AQI ${city.aqi} (${band.label.toLowerCase()}). The cleanest hour for exercise looks like ${formatHour(run.start)}, at around AQI ${run.avg}. ${city.aqi > 100 ? "I'd keep it short and easy, or move the workout indoors." : "Conditions are fine for most people — enjoy it."}`;
  }
  if (/(child|kid|baby|son|daughter|school|family)/.test(s)) {
    return `Children breathe faster and are closer to exhaust height, so they take in more pollution. Three things help most: plan outdoor play for the cleanest hours (the planner above shows them), walk the school route along quieter side streets, and run a HEPA purifier in their bedroom at night.`;
  }
  if (/(purifier|filter|hepa|machine)/.test(s)) {
    return `Look for a true-HEPA (H13) filter and a clean air delivery rate (CADR) of at least two-thirds of the room's floor area in square feet. Skip ionisers and ozone generators. Place it where you spend the most time — usually the bedroom — and keep doors closed.`;
  }
  if (/(pm2|pm 2|particle|pm10)/.test(s)) {
    return `PM2.5 means particles 2.5 micrometres or smaller — about thirty times thinner than a hair. They reach deep into the lungs and even the bloodstream. The WHO guideline is 15 µg/m³ as a 24-hour average.`;
  }
  if (/(mask|n95|ffp2)/.test(s)) {
    return `A well-fitted N95 or FFP2 mask filters most fine particles; cloth and surgical masks do little against PM2.5. Fit matters more than brand — no gaps around the nose and cheeks.`;
  }
  if (/(window|ventilat|open)/.test(s)) {
    const w = bestWindow(city.hourly, 5, 23, 1);
    return `For ${city.name}, the best time to air the home is around ${formatHour(w.start)} (sample AQI ~${w.avg}). Ten minutes with windows wide open on opposite sides is enough — then close them before traffic picks up.`;
  }
  if (/(car|bike|cycle|commute|transport|bus|metro)/.test(s)) {
    return `Swapping a 10 km car trip for the bike or metro saves roughly 1.7 kg of CO₂ each way. If you cycle, pick routes one block off main roads — exposure can drop by half.`;
  }
  return `Here's the short version for ${city.name}: the sample reading is AQI ${city.aqi}, which is ${band.label.toLowerCase()}. ${band.advice} Ask me about exercise timing, protecting children, purifiers or masks.`;
}

export function Assistant({ city }: { city: City }) {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", text: `Hello — I'm Aervana. Ask me anything about the air in ${city.name}, your home or your daily routine.` },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  const send = (text: string) => {
    const q = text.trim();
    if (!q || thinking) return;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setThinking(true);
    window.setTimeout(() => {
      setMessages((m) => [...m, { role: "assistant", text: demoAnswer(q, city) }]);
      setThinking(false);
    }, 900 + Math.random() * 600);
  };

  return (
    <section id="assistant" className="surface-forest surface-deep section-pad relative overflow-hidden">
      <div className="pointer-events-none absolute -right-40 top-20 h-[36rem] w-[36rem] rounded-full bg-mint/10 blur-3xl animate-breathe" aria-hidden />
      <div className="shell relative grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="reveal lg:col-span-5">
          <SectionLabel index="08">AI assistant</SectionLabel>
          <h2 className="display-lg mt-6">
            Ask the air
            <br />
            <span className="text-mint">anything.</span>
          </h2>
          <p className="lede mt-8 max-w-md text-muted-foreground">
            Plain-language answers about pollution, health and the small choices that help — tuned to the
            city you've selected.
          </p>
          <div className="mt-10 space-y-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                className="group flex w-full items-center justify-between border-b py-3 text-left text-foreground/80 transition-colors hover:text-foreground"
              >
                <span>{s}</span>
                <ArrowUp className="h-4 w-4 rotate-45 opacity-40 transition-all group-hover:rotate-90 group-hover:opacity-100" />
              </button>
            ))}
          </div>
        </div>

        <div className="reveal lg:col-span-7">
          <div className="flex h-[32rem] flex-col border bg-forest/60 backdrop-blur md:h-[36rem]">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-mint text-forest">
                  <Sparkles className="h-4 w-4" />
                  <span className="absolute inset-0 rounded-full bg-mint animate-breathe" aria-hidden />
                </span>
                <div>
                  <p className="font-display leading-none">Aervana</p>
                  <p className="mt-1 text-xs text-muted-foreground">Context · {city.name}</p>
                </div>
              </div>
              <SampleBadge label="Demo answers" />
            </div>

            <div ref={scroller} className="flex-1 space-y-6 overflow-y-auto px-5 py-6" aria-live="polite">
              {messages.map((m, i) => (
                <div key={i} className={cn("flex animate-rise", m.role === "user" ? "justify-end" : "justify-start")}>
                  <p
                    className={cn(
                      "max-w-[85%] text-[0.95rem] leading-relaxed",
                      m.role === "user"
                        ? "bg-ivory px-4 py-3 text-forest"
                        : "border-l border-mint/60 pl-4 text-foreground/90",
                    )}
                  >
                    {m.text}
                  </p>
                </div>
              ))}
              {thinking && (
                <div className="flex gap-1.5 border-l border-mint/60 pl-4" aria-label="Aervana is typing">
                  {[0, 1, 2].map((d) => (
                    <span key={d} className="h-1.5 w-1.5 rounded-full bg-mint animate-blink" style={{ animationDelay: `${d * 0.2}s` }} />
                  ))}
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-3 border-t p-3"
            >
              <label className="sr-only" htmlFor="ask">Ask Aervana</label>
              <input
                id="ask"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about air, health or your routine…"
                className="flex-1 bg-transparent px-2 py-2 outline-none placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                disabled={!input.trim() || thinking}
                aria-label="Send"
                className="flex h-10 w-10 items-center justify-center bg-primary text-primary-foreground transition-opacity disabled:opacity-30"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            </form>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Demo mode: replies are prepared examples, not medical advice. A live AI model isn't connected yet.
          </p>
        </div>
      </div>
    </section>
  );
}

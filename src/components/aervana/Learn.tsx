import particlesImg from "@/assets/particles.jpg";
import { SectionLabel } from "./SampleBadge";

const POLLUTANTS = [
  { name: "PM2.5", size: "≤ 2.5 µm", body: "Fine particles from traffic, industry and burning. Small enough to pass deep into the lungs and enter the bloodstream." },
  { name: "PM10", size: "≤ 10 µm", body: "Dust, pollen and construction debris. Trapped mostly in the nose and throat, irritating airways." },
  { name: "NO₂", size: "gas", body: "Produced by combustion engines. Inflames the airways and is closely linked to childhood asthma." },
  { name: "O₃", size: "gas", body: "Ground-level ozone forms when sunlight meets traffic fumes. Peaks on hot afternoons." },
];

const DEPTH = [
  { label: "Nose & throat", note: "PM10, pollen", w: "w-full" },
  { label: "Airways", note: "NO₂, O₃", w: "w-4/5" },
  { label: "Deep lungs", note: "PM2.5", w: "w-3/5" },
  { label: "Bloodstream & heart", note: "Ultrafine particles", w: "w-2/5" },
];

export function Learn() {
  return (
    <section id="learn" className="surface-ivory section-pad">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="reveal lg:col-span-5">
            <div className="grain relative overflow-hidden">
              <img
                src={particlesImg}
                alt="Fine dust particles drifting through a beam of light"
                loading="lazy"
                className="aspect-[4/5] w-full object-cover lg:aspect-[3/4]"
              />
              <p className="eyebrow absolute bottom-5 left-5 text-ivory/80">Fig. 1 — what a sunbeam reveals</p>
            </div>
          </div>

          <div className="lg:col-span-7 lg:pt-10">
            <div className="reveal">
              <SectionLabel index="03">Understanding the air</SectionLabel>
              <h2 className="display-lg mt-6">
                Invisible,
                <br />
                <span className="text-olive/60">not harmless.</span>
              </h2>
              <p className="lede mt-8 max-w-2xl text-muted-foreground">
                Air pollution is a mix of particles and gases we can't see. According to the World Health
                Organization, it is linked to around seven million early deaths every year — making it the
                largest environmental risk to human health.
              </p>
            </div>

            <blockquote className="reveal mt-14 border-l-2 border-olive pl-6 font-display text-2xl leading-snug tracking-tight md:text-3xl">
              “A PM2.5 particle is roughly thirty times thinner than a human hair.”
            </blockquote>
          </div>
        </div>

        <div className="mt-20 grid gap-16 border-t pt-14 lg:grid-cols-12">
          <div className="reveal lg:col-span-7">
            <h3 className="eyebrow text-muted-foreground">The usual suspects</h3>
            <dl className="mt-6 grid gap-x-10 sm:grid-cols-2">
              {POLLUTANTS.map((p, i) => (
                <div key={p.name} className="border-t py-6">
                  <dt className="flex items-baseline justify-between">
                    <span className="font-display text-4xl tracking-tight">{p.name}</span>
                    <span className="text-xs text-muted-foreground">
                      0{i + 1} · {p.size}
                    </span>
                  </dt>
                  <dd className="mt-3 text-muted-foreground">{p.body}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="reveal lg:col-span-5">
            <h3 className="eyebrow text-muted-foreground">How deep it travels</h3>
            <div className="mt-6 space-y-3">
              {DEPTH.map((d, i) => (
                <div key={d.label} className={d.w}>
                  <div
                    className="flex items-center justify-between bg-forest px-4 py-4 text-ivory"
                    style={{ opacity: 1 - i * 0.16 }}
                  >
                    <span className="font-display">{d.label}</span>
                    <span className="text-xs text-sage">{d.note}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              The smaller the particle, the further it reaches — which is why PM2.5 is the number most
              health guidance is built around.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

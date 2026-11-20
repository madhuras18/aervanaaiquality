import { describe, expect, it } from "vitest";
import { aqiBand, bestWindow, dayKg, INTENSITY_LIMIT, routeAqi, verdict, weekSummary, weeklyCo2Kg, yearlyImpact } from "@/lib/air";

describe("AQI bands (US EPA scale)", () => {
  it("50 is Good and 51 is Moderate", () => {
    expect(aqiBand(50).key).toBe("good");
    expect(aqiBand(51).key).toBe("moderate");
  });
  it("101 is unhealthy for sensitive groups", () => {
    expect(aqiBand(101).key).toBe("sensitive");
  });
  it("above 300 is Hazardous", () => {
    expect(aqiBand(301).key).toBe("hazardous");
    expect(aqiBand(650).key).toBe("hazardous");
  });
});

describe("planner best window", () => {
  it("picks the cleanest hour inside the allowed range", () => {
    const hourly = Array.from({ length: 24 }, (_, h) => (h === 6 ? 20 : h === 2 ? 5 : 100));
    expect(bestWindow(hourly, 5, 10, 1)).toEqual({ start: 6, avg: 20 });
  });
});

describe("transport and impact estimates", () => {
  it("a car emits 0.17 kg CO2 per km", () => {
    expect(weeklyCo2Kg("car", 10, 2)).toBeCloseTo(3.4);
  });
  it("cycling emits nothing", () => {
    expect(weeklyCo2Kg("bicycle", 10, 10)).toBe(0);
  });
  it("swapping 10 car km a week saves 88.4 kg CO2 a year for one person", () => {
    expect(yearlyImpact(10, 1).co2Kg).toBeCloseTo(88.4);
  });
});

describe("go / caution / avoid", () => {
  it("at the limit is go, just above is caution", () => {
    expect(verdict(75, 75)).toBe("go");
    expect(verdict(76, 75)).toBe("caution");
  });
  it("more than 50 over the limit is avoid", () => {
    expect(verdict(125, 75)).toBe("caution");
    expect(verdict(126, 75)).toBe("avoid");
  });
  it("vigorous exercise has the lowest limit", () => {
    expect(INTENSITY_LIMIT.vigorous).toBeLessThan(INTENSITY_LIMIT.moderate);
    expect(INTENSITY_LIMIT.moderate).toBeLessThan(INTENSITY_LIMIT.light);
  });
});

describe("EcoRoute exposure", () => {
  it("a green route sees 70% of the city AQI, a main road 135%", () => {
    expect(routeAqi(100, "green")).toBe(70);
    expect(routeAqi(100, "main")).toBe(135);
  });
});

describe("personal impact tracker", () => {
  it("cycling 8 km instead of driving saves 1.36 kg", () => {
    expect(dayKg(["cycle"])).toBeCloseTo(1.36);
  });
  it("sums a week and caps goal progress at 100%", () => {
    const log = [["wfh", "plant"], [], ["cycle"], ["wfh"], ["wfh"], ["wfh"], []];
    const s = weekSummary(log);
    expect(s.actions).toBe(6);
    expect(s.total).toBeCloseTo(3.4 * 4 + 1.5 + 1.36);
    expect(s.goalPct).toBe(1);
  });
});

import { describe, expect, it } from "vitest";
import { aqiBand, bestWindow, weeklyCo2Kg, yearlyImpact } from "@/lib/air";

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

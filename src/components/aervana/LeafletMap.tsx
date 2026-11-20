import { useEffect, useRef } from "react";
import L from "leaflet";
import { aqiBand } from "@/lib/air";
import type { City } from "@/lib/sample-data";

/** Browser-only Leaflet map. Import lazily — Leaflet touches `window` at import time. */
export default function LeafletMap({
  cities,
  selected,
  onSelect,
}: {
  cities: City[];
  selected: City;
  onSelect: (c: City) => void;
}) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const layers = useRef<Map<string, L.CircleMarker>>(new Map());
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  useEffect(() => {
    if (!el.current || map.current) return;
    const m = L.map(el.current, {
      center: [selected.lat, selected.lng],
      zoom: 4,
      zoomControl: false,
      scrollWheelZoom: false,
      worldCopyJump: true,
      attributionControl: true,
    });
    L.control.zoom({ position: "bottomright" }).addTo(m);
    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
      {
        attribution: 'Tiles &copy; Esri &mdash; Esri, HERE, Garmin, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 16,
      },
    ).addTo(m);

    const css = getComputedStyle(document.documentElement);
    for (const c of cities) {
      const color = css.getPropertyValue(`--${aqiBand(c.aqi).token}`).trim() || "#8DD6AD";
      const radius = 6 + Math.min(c.aqi, 250) / 14;
      const halo = L.circleMarker([c.lat, c.lng], {
        radius: radius * 2.2,
        stroke: false,
        fillColor: color,
        fillOpacity: 0.14,
        interactive: false,
      }).addTo(m);
      void halo;
      const dot = L.circleMarker([c.lat, c.lng], {
        radius,
        color,
        weight: 1,
        fillColor: color,
        fillOpacity: 0.75,
      })
        .bindTooltip(`${c.name} · ${c.aqi} AQI (sample)`, { direction: "top", offset: [0, -radius] })
        .on("click", () => onSelectRef.current(c))
        .addTo(m);
      layers.current.set(c.id, dot);
    }
    map.current = m;
    return () => {
      m.remove();
      map.current = null;
      layers.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const m = map.current;
    if (!m) return;
    m.flyTo([selected.lat, selected.lng], Math.max(m.getZoom(), 5), { duration: 1.2 });
    layers.current.forEach((layer, id) => {
      layer.setStyle({ weight: id === selected.id ? 3 : 1, color: id === selected.id ? "#F1EEE5" : (layer.options.fillColor as string) });
    });
    layers.current.get(selected.id)?.openTooltip();
  }, [selected]);

  return <div ref={el} className="h-full w-full" role="application" aria-label="Air pollution map with sample readings" />;
}

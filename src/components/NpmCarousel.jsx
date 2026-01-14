import React, { useEffect, useState, useRef } from "react";

export default function NpmCarousel({
  maintainer = "krishna.paul",
  maxPackages = 1000,
}) {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const idRef = useRef(Math.random().toString(36).slice(2, 9));

  useEffect(() => {
    let cancelled = false;
    async function fetchAll() {
      setLoading(true);
      setError(null);
      try {
        const pageSize = 250;
        let from = 0;
        let all = [];
        // first request to get total
        const firstRes = await fetch(
          `https://registry.npmjs.org/-/v1/search?text=maintainer:${encodeURIComponent(
            maintainer
          )}&size=${pageSize}&from=${from}`
        );
        const firstJson = await firstRes.json();
        all = firstJson.objects || [];
        const total = firstJson.total || all.length;
        const pages = Math.ceil(Math.min(total, maxPackages) / pageSize);

        const promises = [];
        for (let i = 1; i < pages; i++) {
          const f = i * pageSize;
          promises.push(
            fetch(
              `https://registry.npmjs.org/-/v1/search?text=maintainer:${encodeURIComponent(
                maintainer
              )}&size=${pageSize}&from=${f}`
            ).then((r) => r.json())
          );
        }
        const rest = await Promise.all(promises);
        rest.forEach((r) => {
          all = all.concat(r.objects || []);
        });

        if (!cancelled) setPackages(all.slice(0, maxPackages));
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to fetch packages");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchAll();
    return () => {
      cancelled = true;
    };
  }, [maintainer, maxPackages]);

  // inject CSS for continuous scroll using duplicated list
  useEffect(() => {
    const id = idRef.current;
    const containerClass = `npm-carousel-container-${id}`;
    const trackClass = `npm-carousel-track-${id}`;
    const keyframe = `npm-scroll-${id}`;
    const itemGap = 12;
    const duration = Math.max(18, (packages.length || 6) * 1.6);
    const style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = `
      .${containerClass}{overflow:hidden}
      .${trackClass}{display:flex;gap:${itemGap}px;align-items:center}
      @keyframes ${keyframe}{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
      .${trackClass}{animation: ${keyframe} ${duration}s linear infinite}
      .${containerClass}:hover .${trackClass}{animation-play-state:paused}
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, [packages]);

  const id = idRef.current;
  const containerClass = `npm-carousel-container-${id}`;
  const trackClass = `npm-carousel-track-${id}`;

  const items = packages.map((p, idx) => {
    const pkg = p.package || p;
    return (
      <a
        key={pkg.name + idx}
        href={`https://www.npmjs.com/package/${pkg.name}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <div
          style={{
            height: 120,
            minWidth: 220,
            maxWidth: 320,
            padding: "10px 12px",
            borderRadius: 10,
            background: "rgba(255,255,255,0.02)",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <div style={{ fontWeight: 700 }}>{pkg.name}</div>
          {pkg.description && (
            <div style={{ fontSize: 13, opacity: 0.85 }}>{pkg.description}</div>
          )}
          <div style={{ fontSize: 12, opacity: 0.7 }}>
            {pkg.version ?? pkg["dist-tags"]?.latest}
          </div>
        </div>
      </a>
    );
  });

  const duplicated = [...items, ...items];

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <div style={{ fontWeight: 700 }}>NPM packages</div>
        <div style={{ fontSize: 13, opacity: 0.8 }}>
          {loading
            ? "Loading…"
            : error
            ? "Error"
            : `${packages.length} packages`}
        </div>
      </div>
      <div className={containerClass}>
        <div className={trackClass} aria-hidden={loading || !!error}>
          {loading && (
            <div style={{ padding: 12, opacity: 0.8 }}>Loading packages…</div>
          )}
          {!loading && error && (
            <div style={{ padding: 12, color: "salmon" }}>{error}</div>
          )}
          {!loading && !error && duplicated}
        </div>
      </div>
    </div>
  );
}

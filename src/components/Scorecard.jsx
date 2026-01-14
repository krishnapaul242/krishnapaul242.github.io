import React, { useEffect, useState } from "react";

function formatNumber(n) {
  return typeof n === "number" ? new Intl.NumberFormat().format(n) : n;
}

export default function Scorecard({
  githubUser = "krishnapaul242",
  npmMaintainer = "krishna.paul",
  compact = false,
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [repoCount, setRepoCount] = useState(null);
  const [npmCount, setNpmCount] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function loadTotals() {
      setLoading(true);
      setError(null);
      try {
        // GitHub user info -> public_repos
        const ghRes = await fetch(`https://api.github.com/users/${githubUser}`);
        const ghJson = await ghRes.json();
        // NPM search by maintainer -> returns total
        const npmRes = await fetch(
          `https://registry.npmjs.org/-/v1/search?text=maintainer:${encodeURIComponent(
            npmMaintainer
          )}&size=0`
        );
        const npmJson = await npmRes.json();

        if (!cancelled) {
          setRepoCount(ghJson?.public_repos ?? null);
          setNpmCount(npmJson?.total ?? null);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Fetch error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadTotals();
    return () => {
      cancelled = true;
    };
  }, [githubUser, npmMaintainer]);

  if (compact) {
    return (
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        {loading && <div style={{ opacity: 0.9, fontSize: 13 }}>Loading…</div>}
        {error && <div style={{ color: "salmon", fontSize: 13 }}>Err</div>}
        {!loading && !error && (
          <>
            <a
              href={`https://github.com/${githubUser}?tab=repositories`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "inherit",
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: 12, opacity: 0.8 }}>Repos</div>
              <div style={{ fontWeight: 700 }}>
                {formatNumber(repoCount ?? "—")}
              </div>
            </a>
            <a
              href={`https://www.npmjs.com/search?q=maintainer:${encodeURIComponent(
                npmMaintainer
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "inherit",
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: 12, opacity: 0.8 }}>Packages</div>
              <div style={{ fontWeight: 700 }}>
                {formatNumber(npmCount ?? "—")}
              </div>
            </a>
          </>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 520,
        margin: "0 auto",
        padding: "18px",
        borderRadius: 12,
        boxShadow: "0 6px 28px -8px rgba(0,0,0,0.6)",
        background: "var(--pf-card-bg, #0f0f0f)",
        color: "var(--pf-text, #fff)",
      }}
    >
      <h3 style={{ margin: 0, marginBottom: 8 }}>Scorecard</h3>
      <div style={{ fontSize: "0.9rem", opacity: 0.85, marginBottom: 16 }}>
        Totals: GitHub repos & npm packages
      </div>

      {loading && <div style={{ opacity: 0.9 }}>Loading…</div>}
      {error && <div style={{ color: "salmon" }}>Error: {error}</div>}

      {!loading && !error && (
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              flex: "1 1 50%",
              padding: 12,
              borderRadius: 10,
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <div style={{ fontSize: 12, opacity: 0.85 }}>
              GitHub public repos
            </div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>
              {formatNumber(repoCount ?? "—")}
            </div>
            <a
              href={`https://github.com/${githubUser}?tab=repositories`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 12,
                opacity: 0.85,
                textDecoration: "underline",
              }}
            >
              {githubUser} repos
            </a>
          </div>

          <div
            style={{
              flex: "1 1 50%",
              padding: 12,
              borderRadius: 10,
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <div style={{ fontSize: 12, opacity: 0.85 }}>
              NPM packages (maintainer)
            </div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>
              {formatNumber(npmCount ?? "—")}
            </div>
            <a
              href={`https://www.npmjs.com/search?q=maintainer:${encodeURIComponent(
                npmMaintainer
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 12,
                opacity: 0.85,
                textDecoration: "underline",
              }}
            >
              {npmMaintainer} packages
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

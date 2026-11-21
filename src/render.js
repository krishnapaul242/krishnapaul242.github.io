// HTML for the portfolio's content sections, as plain strings and with no DOM access.
// The browser uses these to render and re-render; the build (vite.config.js) uses the same
// functions to write the content into index.html, so search engines and link previews see it
// without running any JavaScript.

export const KIND_COLOR = {Mobile:"#E0679A", Web:"#2F9E6B", Backend:"#3C6FB8", AI:"#7E6BE0", Dashboards:"#D99A10", Blockchain:"#B05CC8", Games:"#E04A4A", Tools:"#4F8FA8"};
export const KINDS = ["Mobile","Web","Backend","AI","Dashboards","Tools","Blockchain","Games"];
export const IND = {healthcare:"Healthcare", civic:"Government", realestate:"Real estate", social:"Social", food:"Food delivery", finance:"Finance", edtech:"Education", entertainment:"Entertainment", devtools:"Developer tools", productivity:"Productivity"};

export function esc(s){ return String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }
export function kindTag(k){ return `<span class="kind"><i style="background:${KIND_COLOR[k]}"></i>${k}</span>`; }
const linksOf = p => p.links || (p.link ? [["Visit project", p.link]] : []);

export function featuredHTML(projects){
  return projects.filter(p=>p.f).sort((a,b)=>a.f-b.f).map(p=>{
    const links = linksOf(p);
    return `<article class="card"><div class="meta">${kindTag(p.kind)}<span>${esc(p.when)}</span></div>
    <h3>${esc(p.name.replace(" app",""))}</h3>
    <p>${esc(p.desc)}</p>
    ${p.role?`<p class="part"><b>My part:</b> ${esc(p.role)}</p>`:""}
    <div class="tags">${p.tech.map(t=>`<span>${esc(t)}</span>`).join("")}</div>
    ${links.length?`<div class="links">${links.map(([l,u])=>`<a href="${u}" target="_blank" rel="noopener">${l}<span class="sr"> for ${esc(p.name)}</span></a>`).join("")}</div>`:""}</article>`;
  }).join("");
}

export function rowMore(p){
  const links = linksOf(p);
  return `<details><summary>Details<span class="sr"> for ${esc(p.name)}</span></summary><div class="more">
    <p><b>When:</b> ${esc(p.when)}</p>
    ${p.role?`<p><b>My part:</b> ${esc(p.role)}</p>`:""}
    <div class="tags">${p.tech.map(t=>`<span>${esc(t)}</span>`).join("")}</div>
    ${links.length?`<div class="ln">${links.map(([l,u])=>`<a href="${u}" target="_blank" rel="noopener">${esc(l)}<span class="sr"> for ${esc(p.name)}</span></a>`).join("")}</div>`:""}
  </div></details>`;
}

export function filtersHTML(projects, filter="All"){
  return ["All",...KINDS].map(k=>{
    const n = k==="All" ? projects.length : projects.filter(p=>p.kind===k).length;
    return `<button aria-pressed="${k===filter}" data-k="${k}">${k==="All"?"All":kindTag(k)} <span>${n}</span></button>`;
  }).join("");
}

// The list shows 12 projects until the visitor asks for all; the build writes all of them so none is hidden from crawlers.
export function allListHTML(projects, {filter="All", limit=12}={}){
  const sorted = projects.filter(p=>filter==="All"||p.kind===filter).sort((a,b)=>b.s-a.s || (b.f?1:0)-(a.f?1:0));
  const shown = sorted.slice(0, Math.min(sorted.length, limit));
  const years = [...new Set(shown.map(p=>p.s))];
  const html = years.map(y=>`<div class="yr"><h4>${y}</h4><div class="rows">${
    shown.filter(p=>p.s===y).map(p=>`<div class="row"><b>${p.link?`<a href="${p.link}" target="_blank" rel="noopener">${esc(p.name)}</a>`:esc(p.name)}</b>${kindTag(p.kind)}<p>${esc(p.desc)}</p>${rowMore(p)}</div>`).join("")
  }</div></div>`).join("");
  return {html, total: sorted.length};
}

export function jobsHTML(jobs){
  return jobs.map(j=>`<article class="job"><div class="when"><b>${j.from.slice(-4)}${j.to==="Present"?"–now":j.to.slice(-4)!==j.from.slice(-4)?"–"+j.to.slice(-4):""}</b>${j.from} to ${j.to}</div>
  <div><h3>${esc(j.role)}</h3><p class="co">${esc(j.co)}, ${esc(j.place)}</p><ul>${j.pts.map(t=>`<li>${esc(t)}</li>`).join("")}</ul></div></article>`).join("");
}

export function skillsHTML(skills){
  return skills.map(([h,items])=>`<div><h3>${h}</h3><ul>${items.map(i=>`<li>${esc(i)}</li>`).join("")}</ul></div>`).join("");
}

export function indsHTML(projects){
  const count = {}; projects.forEach(p=>p.ind.forEach(i=>count[i]=(count[i]||0)+1));
  return Object.entries(count).sort((a,b)=>b[1]-a[1]).map(([k,n])=>`<span><b>${n}</b>${IND[k]||k}</span>`).join("");
}

// The story as plain text: every chapter's title, setting and words, for readers and crawlers.
export function storyTextHTML(chapters){
  return chapters.map((c,i)=>`<li><h3><a href="#story-${i+1}" data-story="${i}">${esc(c.title)}</a></h3><p class="st-when">${esc(c.when)}</p><p>${esc(c.text)}</p></li>`).join("");
}

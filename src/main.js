import PROJECTS from "./data/projects.json";
import { JOBS, SKILLS } from "./data/profile.js";
import { KIND_COLOR, esc, featuredHTML, filtersHTML, allListHTML, jobsHTML, skillsHTML, indsHTML } from "./render.js";
const EMAIL = "krishnapaulmailbox@gmail.com";
const CV_BASE = "https://krishnapaul.in/";
const RESUMES = [
  {label:"All-rounder", note:"Default: mobile, web, backend and AI", file:"KrishnaPaulCV.pdf"},
  {label:"Mobile developer", note:"React Native, Android and iOS", file:"resume/KrishnaPaul-Mobile.pdf"},
  {label:"Frontend & web", note:"React, Next.js and dashboards", file:"resume/KrishnaPaul-Frontend.pdf"},
  {label:"Backend & DevOps", note:"Node.js, system design and CI/CD", file:"resume/KrishnaPaul-Backend-DevOps.pdf"},
  {label:"AI & developer tools", note:"LLM features, MCP and test automation", file:"resume/KrishnaPaul-AI-DevTools.pdf"},
];
const RESUME = CV_BASE + RESUMES[0].file;
let cvSeq = 0;
// A split button: the main part downloads the all-rounder; the arrow lists the focused versions.
function cvWidget(kind, label){
  const id = "cvMenu" + (++cvSeq);
  return `<div class="cv ${kind}"><a class="btn ${kind}" href="${RESUME}" target="_blank" rel="noopener">${esc(label)}</a><button class="btn ${kind} cv-more" type="button" aria-haspopup="true" aria-expanded="false" aria-controls="${id}" aria-label="Other résumé versions"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></button><div class="cv-menu" id="${id}" hidden><p>Choose a version</p>${RESUMES.map((r,i)=>`<a href="${CV_BASE + r.file}" target="_blank" rel="noopener"><b>${esc(r.label)}${i===0?' <i>Default</i>':''}</b><span>${esc(r.note)}</span></a>`).join("")}</div></div>`;
}
function closeCvMenus(except){ document.querySelectorAll(".cv-more[aria-expanded='true']").forEach(b=>{ if (b !== except){ b.setAttribute("aria-expanded","false"); $(b.getAttribute("aria-controls")).hidden = true; } }); }
document.addEventListener("click", e=>{
  const b = e.target.closest(".cv-more");
  if (b){ const m = $(b.getAttribute("aria-controls")), open = m.hidden; closeCvMenus(b);
    m.hidden = !open; b.setAttribute("aria-expanded", String(open));
    if (open){ const r = b.getBoundingClientRect(); m.classList.toggle("up", r.bottom + 330 > innerHeight && r.top > 330); m.querySelector("a").focus({preventScroll:true}); if (b.closest(".end-cta")) m.scrollIntoView({block:"nearest", behavior: reduce ? "auto" : "smooth"}); }
    return; }
  if (!e.target.closest(".cv-menu")) closeCvMenus();
});
document.addEventListener("keydown", e=>{ if (e.key === "Escape"){ const open = document.querySelector(".cv-more[aria-expanded='true']"); if (open){ closeCvMenus(); open.focus(); e.stopPropagation(); } } }, true);
document.querySelectorAll("[data-cv]").forEach(el=>{ el.outerHTML = cvWidget(el.dataset.cv, el.dataset.label); });

/* ---------- Small helpers ---------- */
const $ = id => document.getElementById(id);
function el(tag, attrs={}, html){ const e=document.createElement(tag); for(const k in attrs){ if(k==="class") e.className=attrs[k]; else e.setAttribute(k,attrs[k]); } if(html!=null) e.innerHTML=html; return e; }

$("projCount").textContent = PROJECTS.length;
/* ---------- Featured, all projects, experience, skills, industries ---------- */
// The build writes this content into index.html already; rendering it again here keeps dev mode and filters working.
$("featured").innerHTML = featuredHTML(PROJECTS);
let filter = "All", showAll = false;
function renderAll(){
  $("filters").innerHTML = filtersHTML(PROJECTS, filter);
  $("filters").querySelectorAll("button").forEach(b=>b.onclick=()=>{ filter=b.dataset.k; showAll=false; renderAll(); $("filters").querySelector(`[data-k="${filter}"]`).focus(); });
  const {html, total} = allListHTML(PROJECTS, {filter, limit: showAll ? Infinity : 12});
  $("allList").innerHTML = html;
  const more = $("moreBtn");
  more.hidden = total <= 12;
  more.textContent = showAll ? "Show fewer" : `Show all ${total} projects`;
}
$("moreBtn").onclick = ()=>{ showAll = !showAll; renderAll(); };
renderAll();
$("jobs").innerHTML = jobsHTML(JOBS);
$("skillGroups").innerHTML = skillsHTML(SKILLS);
$("inds").innerHTML = indsHTML(PROJECTS);

/* ---------- GitHub commits ---------- */
const GH_YEARS = {"2020": 190, "2021": 62, "2022": 30, "2023": 2, "2024": 16, "2025": 430, "2026": 1033};
(function(){ const max = Math.max(...Object.values(GH_YEARS)), ch = $("ghChart"), years = Object.keys(GH_YEARS);
  ch.innerHTML = years.map(y=>{ const v = GH_YEARS[y]; return `<div class="gh-col" tabindex="0" title="${v.toLocaleString("en-IN")} commits in ${y}"><span class="gh-val ${v===max||y===years[years.length-1]?"":"dim"}">${v.toLocaleString("en-IN")}</span><div class="gh-bar" style="height:${Math.max(1, v/max*82)}%"></div></div>`; }).join("");
  ch.insertAdjacentHTML("afterend", `<div class="gh-years" aria-hidden="true">${years.map(y=>`<span>${y}</span>`).join("")}</div>`);
  $("ghTable").innerHTML = years.map(y=>`<tr><th>${y}</th><td>${GH_YEARS[y]}</td></tr>`).join("");
})();

/* ---------- Copy email ---------- */
async function copyEmail(btn){
  let ok=false; try{ await navigator.clipboard.writeText(EMAIL); ok=true; }catch(e){}
  if(!ok){ const r=document.createRange(); r.selectNodeContents($("email")); const s=getSelection(); s.removeAllRanges(); s.addRange(r); }
  const old = btn.textContent; btn.textContent = ok ? "Copied" : "Selected, press Ctrl+C"; setTimeout(()=>btn.textContent=old, 2200);
}
$("copyEmail").onclick = e=>copyEmail(e.currentTarget);
document.querySelectorAll("[data-topic]").forEach(a=>a.addEventListener("click", ()=>{ $("topic").value = a.dataset.topic; setTimeout(()=>$("contactForm").querySelector("input").focus({preventScroll:true}), 400); }));
// The form posts to Pageclip from the real site. Anywhere else (a preview), say so instead of failing quietly.
const FORM_LIVE = /(^|\.)krishnapaul\.in$|github\.io$|^localhost$|^127\.0\.0\.1$/.test(location.hostname);
$("contactForm").addEventListener("submit", e=>{
  if (FORM_LIVE) return;
  e.preventDefault(); const n = $("formNote"); n.dataset.tone = "warn";
  n.textContent = `This preview can’t send messages. Please email ${EMAIL} instead, or use the form on krishnapaul.in.`;
});

/* =================================================================
   MY STORY: illustrated, animated chapters drawn on canvas
   Virtual stage 800 x 500, ground at y = 410. Key action stays in x 80..720.
   ================================================================= */
const story = $("story"), canvas = $("storyCanvas"), ctx = canvas.getContext("2d");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const VW = 600, VH = 720, GY = 640;
let W = 0, H = 0, K = 1, OX = 0, OY = 0, dpr = 1;
let cur = 0, chStart = 0, rafId = 0, auto = false, autoTimer = 0, lastFocus = null;
let fade = 0, fadeTo = -1, fadeStart = 0;
const seen = new Set();

/* ---------- colour + shape helpers ---------- */
function hx(h){ const n = parseInt(h.slice(1),16); return [n>>16&255, n>>8&255, n&255]; }
function sh(h, f){ const [r,g,b] = hx(h); return `rgb(${Math.min(255,Math.round(r*f))},${Math.min(255,Math.round(g*f))},${Math.min(255,Math.round(b*f))})`; }
function rr(x,y,w,h,r){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }
function box(x,y,w,h,c,r=0){ ctx.fillStyle = c; if (r){ rr(x,y,w,h,r); ctx.fill(); } else ctx.fillRect(x,y,w,h); }
function circ(x,y,r,c){ ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); }
function txt(s,x,y,size,c,weight=700,align="center",font){ ctx.fillStyle = c; ctx.textAlign = align; ctx.textBaseline = "middle"; ctx.font = `${weight} ${size}px ${font||'Inter, system-ui, sans-serif'}`; ctx.fillText(s,x,y); }
function sign(s,x,y,size,bg,fg){ ctx.font = `800 ${size}px Archivo, "Arial Narrow", Arial, sans-serif`; const w = ctx.measureText(s).width + size*1.2; box(x-w/2, y-size*0.85, w, size*1.7, bg, 4); txt(s, x, y+1, size, fg, 800, "center", 'Archivo, "Arial Narrow", Arial, sans-serif'); return w; }
function line(x1,y1,x2,y2,c,w){ ctx.strokeStyle = c; ctx.lineWidth = w; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke(); }
function rng(seed){ let s = seed; return ()=> (s = s*16807 % 2147483647)/2147483647; }
const ease = u => u<0.5 ? 2*u*u : 1-Math.pow(-2*u+2,2)/2;

/* ---------- backgrounds ---------- */
function sky(a,b){ const g = ctx.createLinearGradient(0,-300,0,GY); g.addColorStop(0,a); g.addColorStop(1,b); ctx.fillStyle = g; ctx.fillRect(-1200,-1200,3200,GY+1200); }
function ground(c, c2){ box(-1200, GY, 3200, 900, c); if (c2) box(-1200, GY, 3200, 8, c2); }
function hills(c, base, amp, seed, f=0.006){ ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(-1200, base+300);
  for (let x=-1200; x<=2000; x+=16) ctx.lineTo(x, base - amp*(0.55+0.3*Math.sin(x*f+seed)+0.15*Math.sin(x*f*3.1+seed*2)));
  ctx.lineTo(2000, base+300); ctx.closePath(); ctx.fill(); }
function peaks(c, snow, base, amp){ const pts = []; ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(-1200, base);
  for (let x=-1200; x<=2000; x+=14){ const y = base - amp*Math.max(0.1, Math.abs(Math.sin(x*0.004+0.8))*0.8 + 0.2*Math.sin(x*0.017)); pts.push([x,y]); ctx.lineTo(x,y); }
  ctx.lineTo(2000, base); ctx.closePath(); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.moveTo(-1200, base); pts.forEach(p=>ctx.lineTo(p[0],p[1])); ctx.lineTo(2000, base); ctx.closePath(); ctx.clip();
  ctx.fillStyle = snow; ctx.beginPath(); ctx.moveTo(-1200, -500); for (let x=-1200; x<=2000; x+=14) ctx.lineTo(x, base - amp*0.62 + Math.sin(x*0.08)*5); ctx.lineTo(2000,-500); ctx.fill(); ctx.restore(); }
function sun(x,y,r,c,glow=true){ if (glow){ const g = ctx.createRadialGradient(x,y,r*0.4,x,y,r*4); g.addColorStop(0, c+"88"); g.addColorStop(1, c+"00"); ctx.fillStyle = g; ctx.fillRect(x-r*4,y-r*4,r*8,r*8); } circ(x,y,r,c); }
function cloud(x,y,s,a=0.9){ ctx.globalAlpha = a; ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.ellipse(x,y,50*s,14*s,0,0,7); ctx.ellipse(x+22*s,y-10*s,30*s,15*s,0,0,7); ctx.ellipse(x-20*s,y-6*s,24*s,12*s,0,0,7); ctx.fill(); ctx.globalAlpha = 1; }
function clouds(t, y=70, a=0.85){ for (let k=0;k<4;k++){ const x = ((k*330 + t*8) % 1700) - 450; cloud(x, y + (k%2)*40, 0.8+0.3*(k%3), a); } }
function tree(x,y,s,c,trunk="#6B4B32"){ box(x-4*s, y-34*s, 8*s, 34*s, trunk); circ(x, y-52*s, 24*s, c); circ(x-16*s, y-40*s, 17*s, c); circ(x+16*s, y-40*s, 17*s, c); circ(x+4*s, y-66*s, 16*s, sh(c.startsWith("#")?c:"#5C9A5A",1.08)); }
function pine(x,y,s,c){ ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(x, y-90*s); ctx.lineTo(x-24*s, y-14*s); ctx.lineTo(x+24*s, y-14*s); ctx.fill(); box(x-3*s, y-16*s, 6*s, 16*s, "#4A3524"); }
function city(seed, base, minH, maxH, c, lit, x0=-900, x1=1700){ const r = rng(seed); let x = x0;
  while (x < x1){ const w = 40 + r()*60, h = minH + r()*(maxH-minH); box(x, base-h, w-6, h, c);
    for (let yy = base-h+10; yy < base-12; yy += 16) for (let xx = x+6; xx < x+w-16; xx += 13){ const on = r() < lit; box(xx, yy, 7, 8, on ? "rgba(255,214,120,.9)" : "rgba(255,255,255,.12)"); }
    x += w; } }
function interior(wall, floor, trim){ box(-1200,-1200,3200,GY+1200,wall); box(-1200, GY, 3200, 900, floor); box(-1200, GY-10, 3200, 10, trim||sh(wall,0.85)); }
function windowView(x,y,w,h,fn){ ctx.save(); ctx.beginPath(); ctx.rect(x,y,w,h); ctx.clip(); fn(); ctx.restore(); ctx.strokeStyle = "#F2EEE6"; ctx.lineWidth = 8; ctx.strokeRect(x,y,w,h); line(x+w/2,y,x+w/2,y+h,"#F2EEE6",4); }
function desk(x,y,w,c="#9A6B45"){ box(x, y, w, 10, c, 3); box(x+8, y+10, 8, GY-y-10, sh(c,0.75)); box(x+w-16, y+10, 8, GY-y-10, sh(c,0.75)); }
function stool(x,y,c="#7B5A3C"){ box(x-20, y, 40, 8, c, 3); box(x-16, y+8, 6, GY-y-8, sh(c,0.8)); box(x+10, y+8, 6, GY-y-8, sh(c,0.8)); }
function chair(x,y,dir=1,c="#3A4656"){ box(x-22, y, 44, 8, c, 3); box(x-dir*19-3, y-50, 6, 58, c); box(x-3, y+8, 6, GY-y-14, sh("#3A4656",0.8)); box(x-20, GY-8, 40, 6, sh("#3A4656",0.8), 3); }
function laptop(x,y,dir,s=1,scr){ // base on y, screen opens away from viewer facing dir
  const w = 64*s; box(x-w/2, y-4*s, w, 5*s, "#5B6470", 2);
  ctx.save(); ctx.translate(x - dir*w*0.45, y-4*s); ctx.fillStyle = "#454D58"; rr(-3*s, -44*s, 6*s, 44*s, 2); ctx.fill(); ctx.restore();
  if (scr) scr(x - dir*w*0.45, y-48*s, s); }
function monitor(x,y,w,h,scr,frame="#2B313A"){ box(x-w/2-6, y-h-6, w+12, h+12, frame, 6); box(x-w/2, y-h, w, h, "#0E1622", 3); ctx.save(); ctx.beginPath(); ctx.rect(x-w/2, y-h, w, h); ctx.clip(); scr && scr(x-w/2, y-h, w, h); ctx.restore(); box(x-5, y+6, 10, 14, frame); box(x-26, y+18, 52, 6, frame, 3); }
function phoneDev(x,y,w,h,scr,c="#20242B"){ box(x-w/2, y-h, w, h, c, w*0.16); ctx.save(); rr(x-w/2+3, y-h+6, w-6, h-12, w*0.1); ctx.clip(); box(x-w/2, y-h, w, h, "#FFFFFF"); scr && scr(x-w/2+3, y-h+6, w-6, h-12); ctx.restore(); }
function bubble(x,y,w,h,c="#FFFFFF",tail=1){ box(x-w/2, y-h, w, h, c, 12); ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(x-10*tail, y-2); ctx.lineTo(x-22*tail, y+14); ctx.lineTo(x+4*tail, y-2); ctx.fill(); }
function sparkle(x,y,s,c="#F4C20D"){ ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(x, y-s); ctx.quadraticCurveTo(x, y, x+s, y); ctx.quadraticCurveTo(x, y, x, y+s); ctx.quadraticCurveTo(x, y, x-s, y); ctx.quadraticCurveTo(x, y, x, y-s); ctx.fill(); }
function shadow(x,w){ ctx.fillStyle = "rgba(0,0,0,.14)"; ctx.beginPath(); ctx.ellipse(x, GY+2, w, 6, 0, 0, 7); ctx.fill(); }

/* ---------- people ---------- */
function limb(x,y,a1,a2,l1,l2,dir,w,c1,c2){
  const kx = x+Math.sin(a1)*l1*dir, ky = y+Math.cos(a1)*l1, ex = kx+Math.sin(a1+a2)*l2*dir, ey = ky+Math.cos(a1+a2)*l2;
  ctx.lineCap = "round"; ctx.lineWidth = w;
  ctx.strokeStyle = c1; ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(kx,ky); ctx.stroke();
  ctx.strokeStyle = c2; ctx.beginPath(); ctx.moveTo(kx,ky); ctx.lineTo(ex,ey); ctx.stroke();
  return [ex,ey];
}
const POSE = {
  stand: t=>({la:0.14,le:0.12,ra:-0.06,re:0.12,ll:0.05,lk:0,rl:-0.05,rk:0,bob:Math.sin(t*2)*0.6}),
  walk: t=>{ const s = Math.sin(t*8), c = Math.cos(t*8); return {la:-s*0.5,le:0.3,ra:s*0.5,re:0.3,ll:s*0.42,lk:-0.35*Math.max(0,c),rl:-s*0.42,rk:-0.35*Math.max(0,-c),bob:-Math.abs(c)*1.6}; },
  wave: t=>({la:0.14,le:0.12,ra:2.75,re:0.35*Math.sin(t*9),ll:0.05,lk:0,rl:-0.05,rk:0,bob:0}),
  cheer: t=>{ const j = Math.abs(Math.sin(t*5)); return {la:2.6+0.15*Math.sin(t*10),le:0.25,ra:2.75-0.15*Math.sin(t*10),re:-0.25,ll:0.08,lk:-0.1*j,rl:-0.08,rk:-0.1*j,bob:-j*7}; },
  clap: t=>{ const c = Math.sin(t*12); return {la:1.2,le:0.5+0.25*c,ra:1.2,re:0.5+0.25*c,ll:0.05,lk:0,rl:-0.05,rk:0,bob:Math.sin(t*2)*0.6}; },
  point: t=>({la:0.12,le:0.1,ra:1.5+0.05*Math.sin(t*2),re:0.05,ll:0.06,lk:0,rl:-0.06,rk:0,bob:0}),
  present: t=>({la:0.2,le:0.6,ra:1.9+0.12*Math.sin(t*1.6),re:-0.15,ll:0.06,lk:0,rl:-0.06,rk:0,bob:Math.sin(t*2)*0.5}),
  type: t=>({la:0.65,le:1.0+0.06*Math.sin(t*13+1),ra:0.75,re:0.95+0.06*Math.sin(t*13),ll:0.05,lk:0,rl:-0.05,rk:0,bob:0}),
  hold: t=>({la:0.3,le:1.25,ra:0.4,re:1.35+0.05*Math.sin(t*2),ll:0.05,lk:0,rl:-0.05,rk:0,bob:Math.sin(t*2)*0.5}),
  give: t=>({la:0.14,le:0.12,ra:1.3,re:0.25,ll:0.05,lk:0,rl:-0.05,rk:0,bob:0}),
  write: t=>({la:0.14,le:0.2,ra:2.0+0.18*Math.sin(t*4),re:0.3+0.2*Math.cos(t*4),ll:0.05,lk:0,rl:-0.05,rk:0,bob:0}),
  raise: t=>({la:0.6,le:1.0,ra:Math.sin(t*1.3)>0.2?2.9:0.7,re:Math.sin(t*1.3)>0.2?0.1:1.0,ll:0,lk:0,rl:0,rk:0,bob:0}),
  carry: t=>{ const s = Math.sin(t*6); return {la:2.75,le:0.5,ra:2.8,re:0.45,ll:s*0.35,lk:-0.2,rl:-s*0.35,rk:-0.2,bob:-Math.abs(Math.cos(t*6))*1.5}; },
  bend: t=>({la:0.7,le:0.2,ra:0.8+0.1*Math.sin(t*3),re:0.2,ll:0.1,lk:-0.1,rl:-0.15,rk:-0.1,tilt:14,bob:3}),
  nod: t=>({la:0.14,le:0.12,ra:-0.06,re:0.12,ll:0.05,lk:0,rl:-0.05,rk:0,bob:0,nod:Math.sin(t*3)*0.12}),
  torch: t=>({la:0.14,le:0.12,ra:1.25,re:-0.1,ll:0.05,lk:0,rl:-0.05,rk:0,bob:0}),
};
function sit(p){ return Object.assign({}, p, {ll:1.5,lk:-1.5,rl:1.55,rk:-1.55,sit:true}); }

function person(o){
  const P = o.pose, dir = o.dir||1, h = o.h, kid = !!o.kid;
  const hr = h*(kid?0.14:0.105), leg = h*(kid?0.2:0.235), th = h*(kid?0.27:0.3), w = h*(kid?0.08:0.07);
  const ua = h*0.155, fa = h*0.145;
  const drop = P.sit ? leg : 0;
  const hipX = o.x, hipY = o.y - leg*2 + drop + (P.bob||0);
  const shX = hipX + (P.tilt||0)*dir, shY = hipY - th + hr*0.25;
  const skin = o.skin, shirt = o.shirt, pants = o.pants;
  const sleeve = o.jacket || shirt, armLow = o.long || o.jacket ? (o.jacket||shirt) : skin;
  const legLow = o.shorts ? skin : pants;
  if (!o.noShadow) shadow(hipX, h*0.16);
  // back leg and arm
  if (!o.skirt){ const f = limb(hipX, hipY, P.ll, P.lk, leg, leg, dir, w*1.12, sh(pants,0.8), sh(legLow,0.8)); circ(f[0]+dir*3, f[1], w*0.6, "#2A2420"); }
  const bh = limb(shX, shY, P.la, P.le, ua, fa, dir, w, sh(sleeve,0.8), sh(armLow,0.82)); circ(bh[0], bh[1], w*0.55, sh(skin,0.85));
  if (o.bag){ box(shX - dir*(h*0.16) - (dir>0?0:-0), shY+2, h*0.12*dir, th*0.75, o.bag, 6); }
  // torso
  const tw = h*(kid?0.2:0.2), cx = (shX+hipX)/2, top = shY - hr*0.3;
  ctx.fillStyle = shirt; ctx.beginPath(); ctx.moveTo(shX - tw/2, top); ctx.lineTo(shX + tw/2, top); ctx.lineTo(hipX + tw/2, hipY + w*0.3); ctx.lineTo(hipX - tw/2, hipY + w*0.3); ctx.closePath(); ctx.fill();
  if (o.jacket){ ctx.fillStyle = o.jacket; ctx.beginPath(); ctx.moveTo(shX - tw/2, top); ctx.lineTo(shX + dir*tw*0.05, top); ctx.lineTo(hipX + dir*tw*0.02, hipY+w*0.3); ctx.lineTo(hipX - tw/2, hipY+w*0.3); ctx.closePath(); ctx.fill();
    if (dir<0){ ctx.beginPath(); ctx.moveTo(shX + tw/2, top); ctx.lineTo(shX + tw*0.05, top); ctx.lineTo(hipX + tw*0.02, hipY+w*0.3); ctx.lineTo(hipX + tw/2, hipY+w*0.3); ctx.fill(); } }
  if (o.lanyard){ line(shX, top+2, shX + dir*tw*0.18, top + th*0.45, "#2C7BE5", 2); box(shX + dir*tw*0.18 - 5, top + th*0.45, 10, 13, "#FFFFFF", 2); }
  if (o.skirt){ ctx.fillStyle = o.skirt; ctx.beginPath(); ctx.moveTo(hipX - tw*0.55, hipY - 4); ctx.lineTo(hipX + tw*0.55, hipY - 4); ctx.lineTo(hipX + tw*0.85, o.y - 4); ctx.lineTo(hipX - tw*0.85, o.y - 4); ctx.closePath(); ctx.fill();
    line(shX - dir*tw*0.4, top, hipX + dir*tw*0.5, hipY, sh(o.skirt,0.8), w*0.9); circ(hipX + dir*10, o.y-2, w*0.5, "#2A2420"); }
  // front leg
  if (!o.skirt){ const f = limb(hipX, hipY, P.rl, P.rk, leg, leg, dir, w*1.12, pants, legLow); circ(f[0]+dir*3, f[1], w*0.6, "#2A2420"); }
  if (o.belt) box(hipX - tw/2, hipY - 3, tw, 5, o.belt);
  // head
  const hX = shX + dir*hr*0.12, hY = shY - hr*1.05 + (P.nod ? Math.max(0,P.nod)*hr : 0);
  box(shX - w*0.35, shY - hr*0.4, w*0.7, hr*0.5, sh(skin,0.9));
  if (o.hs === "long"){ box(hX - dir*hr*0.9 - (dir>0?0:-hr*0.0) - hr*0.15, hY - hr*0.3, hr*1.2, hr*1.9, o.hair, hr*0.4); }
  circ(hX, hY, hr, skin);
  circ(hX - dir*hr*0.15, hY + hr*0.05, hr*0.16, sh(skin,0.88)); // ear
  ctx.fillStyle = o.hair;
  if (o.hs === "cap"){ ctx.beginPath(); ctx.arc(hX, hY - hr*0.1, hr*1.02, Math.PI, 0); ctx.fill(); box(hX - (dir<0?hr*1.5:-hr*0.2) , hY - hr*0.2, hr*1.3, hr*0.18, o.hair, 3); }
  else if (o.hs !== "bald"){
    ctx.beginPath(); ctx.arc(hX, hY, hr*1.05, Math.PI*0.92, Math.PI*2.08); ctx.fill();
    ctx.beginPath(); ctx.ellipse(hX - dir*hr*0.45, hY - hr*0.05, hr*0.62, hr*0.82, 0, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.ellipse(hX + dir*hr*0.35, hY - hr*0.72, hr*0.55, hr*0.28, dir*0.35, 0, 7); ctx.fill();
    if (o.hs === "bun") circ(hX - dir*hr*0.85, hY - hr*0.55, hr*0.38, o.hair);
  }
  // face
  const blink = (Math.sin(timeNow*0.9 + (o.seed||0)*3) > 0.985) ? 0.15 : 1;
  ctx.fillStyle = "#1C1715";
  [0.2, 0.62].forEach(k=>{ ctx.beginPath(); ctx.ellipse(hX + dir*hr*k, hY - hr*0.05, hr*0.085, hr*0.11*blink, 0, 0, 7); ctx.fill(); });
  if (o.glasses){ ctx.strokeStyle = "#1C1715"; ctx.lineWidth = 1.5; [0.2,0.62].forEach(k=>{ ctx.beginPath(); ctx.arc(hX + dir*hr*k, hY - hr*0.05, hr*0.2, 0, 7); ctx.stroke(); }); }
  if (o.mask){ box(hX + dir*hr*0.05 - (dir<0?hr*0.95:0), hY + hr*0.12, hr*0.95, hr*0.5, "#8FD3E8", 4); }
  else if (o.expr === "awe"){ circ(hX + dir*hr*0.45, hY + hr*0.42, hr*0.13, "#5A2A22"); }
  else { ctx.strokeStyle = "#5A2A22"; ctx.lineWidth = Math.max(1.2, hr*0.09); ctx.beginPath(); ctx.arc(hX + dir*hr*0.42, hY + hr*0.22, hr*0.2, 0.2*Math.PI, 0.8*Math.PI); ctx.stroke(); }
  if (kid){ ctx.globalAlpha = 0.25; circ(hX + dir*hr*0.7, hY + hr*0.25, hr*0.14, "#E0574A"); ctx.globalAlpha = 1; }
  if (o.onHead) o.onHead(hX, hY - hr);
  // front arm
  const fh = limb(shX, shY, P.ra, P.re, ua, fa, dir, w, sleeve, armLow); circ(fh[0], fh[1], w*0.55, skin);
  if (o.item) o.item(fh[0], fh[1], dir);
  return {hand:fh, head:[hX,hY], top:hY-hr};
}
const ME = {skin:"#B57E55", hair:"#1C1715", hs:"short", shirt:"#F4C20D", seed:1};
const LOOKS = {
  child: {...ME, kid:true, h:96, pants:"#3D72B8", shorts:true},
  teen:  {...ME, h:128, pants:"#2F4A6E"},
  student:{...ME, h:146, pants:"#2F4A6E", bag:"#B5462F"},
  young: {...ME, h:148, pants:"#3B4656", long:true},
  pro:   {...ME, h:150, pants:"#2C3440", jacket:"#22344F", lanyard:true},
  work:  {...ME, h:150, pants:"#2C3440", long:true},
};
// Krishna, walking in from the left on each new chapter
const PEOPLE = {
  friendKid: {skin:"#9A6440", hair:"#2A1E18", hs:"short", shirt:"#E0574A", pants:"#3B3F4A", shorts:true, kid:true, h:90, seed:2},
  girlKid:   {skin:"#C9966C", hair:"#2A1E18", hs:"long", shirt:"#7E6BE0", pants:"#7E6BE0", kid:true, h:88, seed:3},
  elder:     {skin:"#A86F48", hair:"#D6D3CC", hs:"short", shirt:"#6C8EBF", pants:"#E6E1D6", long:true, h:150, glasses:true, seed:4},
  friendM:   {skin:"#8E5A3A", hair:"#1E1916", hs:"short", shirt:"#2F9E6B", pants:"#2B3442", h:146, seed:5},
  friendF:   {skin:"#C08A62", hair:"#2A1E18", hs:"long", shirt:"#E0679A", pants:"#3D4A63", h:138, seed:6},
  friendM2:  {skin:"#A9744C", hair:"#2A1E18", hs:"short", shirt:"#3C6FB8", pants:"#26303D", h:150, seed:7},
  prof:      {skin:"#B07A52", hair:"#BDBAB3", hs:"short", shirt:"#F3F1EA", pants:"#3E4652", long:true, jacket:"#6B5544", h:150, glasses:true, seed:8},
  worker:    {skin:"#8A5636", hair:"#1E1916", hs:"cap", shirt:"#C9773A", pants:"#55606E", h:140, seed:9},
  worker2:   {skin:"#9A6440", hair:"#E8E2D6", hs:"cap", shirt:"#7A8F6B", pants:"#4E4A44", h:138, seed:10},
  mom:       {skin:"#B57E55", hair:"#1C1715", hs:"bun", shirt:"#C2425B", pants:"#C2425B", skirt:"#C2425B", long:true, h:132, seed:11},
  dev1:      {skin:"#C08A62", hair:"#2A1E18", hs:"long", shirt:"#2F9E6B", pants:"#2B3442", long:true, h:140, seed:12},
  dev2:      {skin:"#8E5A3A", hair:"#1E1916", hs:"short", shirt:"#E0679A", pants:"#2B3442", h:150, glasses:true, seed:13},
  dev3:      {skin:"#D2A27A", hair:"#3A2A1E", hs:"short", shirt:"#7E6BE0", pants:"#2B3442", long:true, h:146, seed:14},
  official:  {skin:"#A86F48", hair:"#2A1E18", hs:"short", shirt:"#F2F0E6", pants:"#3E4652", long:true, jacket:"#4A5A6E", h:150, seed:15},
  emt:       {skin:"#9A6440", hair:"#1E1916", hs:"short", shirt:"#E0574A", pants:"#2B3442", h:146, seed:16},
  doctor:    {skin:"#C08A62", hair:"#2A1E18", hs:"long", shirt:"#7FB2FF", pants:"#3E4652", long:true, jacket:"#FFFFFF", glasses:true, h:142, seed:17},
  patient:   {skin:"#B57E55", hair:"#6E6A63", hs:"short", shirt:"#BFD8C4", pants:"#5B6470", long:true, h:140, seed:18},
};
function who(name, x, pose, extra={}){ return person({...PEOPLE[name], x, y:GY, pose, ...extra}); }

/* ---------- props used in several chapters ---------- */
function crt(x,y,t,glowOn){ box(x-60, y-96, 120, 96, "#E7DFC8", 10); box(x-48, y-86, 96, 70, "#10322C", 6);
  const g = ctx.createRadialGradient(x, y-52, 4, x, y-52, 60); g.addColorStop(0, "rgba(120,240,200,.55)"); g.addColorStop(1,"rgba(120,240,200,0)"); ctx.fillStyle = g; ctx.fillRect(x-48, y-86, 96, 70);
  txt("HELLO", x-24, y-66, 11, "#9CF5D5", 700, "left", "monospace");
  const k = Math.floor(t*2)%3; for (let i=0;i<3;i++) box(x-24+i*16, y-48, 10, 10, i===k?"#F4C20D":"#3FBF93", 2);
  if (Math.floor(t*2)%2) box(x+28, y-66, 7, 10, "#9CF5D5");
  box(x-14, y, 28, 8, "#D6CDB3"); box(x-52, y+8, 104, 10, "#CFC6AC", 3);
  if (glowOn){ ctx.globalAlpha = 0.18 + 0.06*Math.sin(t*3); ctx.fillStyle = "#9CF5D5"; ctx.beginPath(); ctx.moveTo(x-48, y-86); ctx.lineTo(x-200, y-160); ctx.lineTo(x-200, y+40); ctx.lineTo(x-48, y-16); ctx.fill(); ctx.globalAlpha = 1; } }
function codeScreen(x,y,w,h,t,seed=1){ box(x,y,w,h,"#0F1724"); const r = rng(seed); const n = Math.floor(h/9); const off = Math.floor(t*3);
  for (let i=0;i<n;i++){ const k = (i+off)%n, ww = 10 + r()*(w*0.6); box(x+6+ (k%4)*6, y+5+i*9, ww, 4, ["#7FB2FF","#F4C20D","#8BE0A4","#E58FB4"][Math.floor(r()*4)], 2); } }
function uiScreen(x,y,w,h,t,accent="#3C6FB8"){ box(x,y,w,h,"#FFFFFF"); box(x,y,w,h*0.16,accent); for (let i=0;i<3;i++) box(x+w*0.08, y+h*0.26+i*h*0.2, w*0.84, h*0.13, "#E9EDF2", 3); box(x+w*0.08, y+h*0.26 + (Math.floor(t)%3)*h*0.2, w*0.06, h*0.13, accent, 2); }
function elephant(x,y,s,t,c="#4A5668"){ const step = Math.sin(t*2.2);
  ctx.fillStyle = c; [[-38,step],[ -14,-step],[18,step],[38,-step]].forEach(([dx,st],i)=>{ box(x+dx*s - 7*s + st*3*s, y-40*s, 14*s, 40*s, i%2?sh(c,0.85):c, 4); });
  ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y-62*s, 58*s, 36*s, 0, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x-60*s, y-74*s, 26*s, 24*s, 0, 0, 7); ctx.fill();
  ctx.fillStyle = sh(c,0.85); ctx.beginPath(); ctx.ellipse(x-48*s, y-74*s, 16*s, 22*s, 0.2, 0, 7); ctx.fill();
  ctx.strokeStyle = c; ctx.lineWidth = 11*s; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x-78*s, y-70*s); ctx.quadraticCurveTo(x-92*s + Math.sin(t*1.6)*6*s, y-40*s, x-84*s + Math.sin(t*1.6)*8*s, y-18*s); ctx.stroke();
  line(x-72*s, y-58*s, x-86*s, y-50*s, "#E9E3D2", 4*s); circ(x-66*s, y-80*s, 2.5*s, "#0B0E12"); }
function confetti(t, n=40, area=[60,740]){ const r = rng(3); for (let i=0;i<n;i++){ const x = area[0] + r()*(area[1]-area[0]) + Math.sin(t*2+i)*10, y = ((t*60 + r()*500) % 460) - 40; ctx.save(); ctx.translate(x,y); ctx.rotate(t*3+i); box(-4,-2,8,4,["#F4C20D","#E0679A","#2F9E6B","#3C6FB8","#7E6BE0"][i%5]); ctx.restore(); } }
function ripple(x,y,t,c){ for (let k=0;k<3;k++){ const p = ((t*0.9 + k/3) % 1); ctx.globalAlpha = (1-p)*0.8; ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x, y, 10 + p*60, 3 + p*14, 0, 0, 7); ctx.stroke(); } ctx.globalAlpha = 1; }

/* ---------- the chapters ---------- */
/* ---------- city signatures ---------- */
function howrah(x, base, s, c){
  const T = 200*s, gap = 220*s, deck = base - 34*s;
  const f = xx => { const d1 = Math.abs(xx-(x-gap/2)), d2 = Math.abs(xx-(x+gap/2)); let v = Math.max(0, 1-d1/T, 1-d2/T); if (xx > x-gap/2 && xx < x+gap/2) v = Math.max(v, 0.36); return v; };
  const ch = xx => deck - f(xx)*140*s, x0 = x-gap/2-T, x1 = x+gap/2+T;
  ctx.fillStyle = c; ctx.fillRect(x0-30*s, deck, x1-x0+60*s, 7*s);
  ctx.strokeStyle = c; ctx.lineWidth = 3.5*s; ctx.beginPath(); for (let xx=x0; xx<=x1; xx+=4) ctx.lineTo(xx, ch(xx)); ctx.stroke();
  ctx.lineWidth = 1.3*s; ctx.beginPath(); let up = true; for (let xx=x0; xx<=x1; xx+=13*s){ ctx.lineTo(xx, up ? ch(xx) : deck); up = !up; } ctx.stroke();
  [x-gap/2, x+gap/2].forEach(tx=>{ ctx.fillRect(tx-5*s, deck-142*s, 10*s, 142*s+44*s); });
}
function victoria(x, base, s, c="#F3F1EA"){
  box(x-120*s, base-50*s, 240*s, 50*s, c); box(x-64*s, base-82*s, 128*s, 32*s, c); box(x-30*s, base-112*s, 60*s, 30*s, c);
  ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, base-112*s, 36*s, 40*s, 0, Math.PI, 0); ctx.fill();
  box(x-2*s, base-170*s, 4*s, 20*s, "#3A3A3A"); circ(x, base-172*s, 5*s, "#3A3A3A");
  [-102,102].forEach(dx=>{ box(x+dx*s-15*s, base-72*s, 30*s, 22*s, c); ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x+dx*s, base-72*s, 16*s, 18*s, 0, Math.PI, 0); ctx.fill(); });
  for (let i=0;i<9;i++) box(x-110*s+i*26*s, base-40*s, 12*s, 28*s, "rgba(0,0,0,.12)", 6*s);
}
function taxi(x,y,s){ box(x-34*s, y-22*s, 68*s, 16*s, "#F4C20D", 7*s); box(x-20*s, y-34*s, 38*s, 15*s, "#F4C20D", 7*s); box(x-15*s, y-31*s, 13*s, 9*s, "#9CC3E0", 2); box(x+2*s, y-31*s, 13*s, 9*s, "#9CC3E0", 2); circ(x-20*s, y-5*s, 6*s, "#222"); circ(x+20*s, y-5*s, 6*s, "#222"); }
function kTram(x,y,s){ for (let k=0;k<2;k++){ const xx = x + k*86*s; box(xx, y-40*s, 82*s, 34*s, "#EDE3C6", 6*s); box(xx, y-20*s, 82*s, 6*s, "#2D5D9B"); for (let w=0;w<4;w++) box(xx+8*s+w*18*s, y-34*s, 12*s, 10*s, "#9CC3E0", 2); circ(xx+16*s, y-4*s, 5*s, "#222"); circ(xx+66*s, y-4*s, 5*s, "#222"); }
  line(x+40*s, y-40*s, x+60*s, y-72*s, "#3A3A3A", 2*s); }
function biswa(x, base, s, c="#C9CED8"){
  [-90,-36,36,90].forEach(dx=>box(x+dx*s-5*s, base-130*s, 10*s, 130*s, sh(c,0.85)));
  ctx.strokeStyle = c; ctx.lineWidth = 18*s; ctx.beginPath(); ctx.ellipse(x, base-142*s, 118*s, 30*s, 0, 0, 7); ctx.stroke();
  ctx.strokeStyle = "rgba(255,255,255,.45)"; ctx.lineWidth = 3*s; ctx.beginPath(); ctx.ellipse(x, base-148*s, 118*s, 30*s, 0, Math.PI*1.05, Math.PI*1.95); ctx.stroke();
}
function toyTrain(x,y,s,t){ box(x, y-26*s, 40*s, 20*s, "#2D5D9B", 4*s); box(x+26*s, y-40*s, 14*s, 16*s, "#2D5D9B", 3*s); box(x+4*s, y-36*s, 7*s, 12*s, "#2B2B2B");
  for (let k=0;k<3;k++){ const p = ((t*0.8 + k/3)%1); ctx.globalAlpha = 0.6*(1-p); circ(x+7*s - p*30*s, y-40*s - p*30*s, (5+p*8)*s, "#FFFFFF"); } ctx.globalAlpha = 1;
  for (let c=1;c<=2;c++){ const xx = x - c*46*s; box(xx, y-30*s, 42*s, 24*s, "#3E6FB4", 4*s); for (let w=0;w<3;w++) box(xx+5*s+w*12*s, y-25*s, 8*s, 8*s, "#DDEBF7", 1); circ(xx+10*s, y-4*s, 4*s, "#222"); circ(xx+32*s, y-4*s, 4*s, "#222"); }
  circ(x+10*s, y-4*s, 5*s, "#222"); circ(x+30*s, y-4*s, 5*s, "#222"); }
function tricolor(x,y,w,h,t){ for (let i=0;i<3;i++){ ctx.fillStyle = ["#FF9933","#FFFFFF","#138808"][i]; ctx.beginPath();
    for (let k=0;k<=10;k++){ const xx = x + w*k/10, yy = y + i*h/3 + Math.sin(t*4 + k*0.7)*h*0.08*(k/10); ctx.lineTo(xx, yy); }
    for (let k=10;k>=0;k--){ const xx = x + w*k/10, yy = y + (i+1)*h/3 + Math.sin(t*4 + k*0.7)*h*0.08*(k/10); ctx.lineTo(xx, yy); }
    ctx.fill(); } ctx.strokeStyle = "#1F3A93"; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x+w/2, y+h/2 + Math.sin(t*4+3.5)*h*0.04, h*0.12, 0, 7); ctx.stroke(); }
function pahari(x, base, s, t){
  ctx.fillStyle = "#7E8F5E"; ctx.beginPath(); ctx.moveTo(x-150*s, base); ctx.quadraticCurveTo(x-60*s, base-120*s, x, base-124*s); ctx.quadraticCurveTo(x+60*s, base-120*s, x+150*s, base); ctx.fill();
  for (let i=0;i<5;i++) circ(x-90*s + i*40*s, base-50*s - (i%2)*16*s, 12*s, "#9A8F7A");
  box(x-14*s, base-150*s, 28*s, 28*s, "#F3EEE2"); ctx.fillStyle = "#F3EEE2"; ctx.beginPath(); ctx.moveTo(x-14*s, base-150*s); ctx.lineTo(x, base-176*s); ctx.lineTo(x+14*s, base-150*s); ctx.fill();
  line(x+40*s, base-120*s, x+40*s, base-300*s, "#6B7480", 2.5*s); tricolor(x+41*s, base-300*s, 56*s, 36*s, t);
}
function waterfall(x, base, s, t){
  ctx.fillStyle = "#8A7A68"; ctx.beginPath(); ctx.moveTo(x-140*s, base); ctx.lineTo(x-90*s, base-130*s); ctx.lineTo(x+70*s, base-136*s); ctx.lineTo(x+140*s, base); ctx.fill();
  box(x-18*s, base-134*s, 36*s, 134*s, "rgba(235,246,255,.9)");
  ctx.strokeStyle = "rgba(150,195,230,.9)"; ctx.lineWidth = 2*s;
  for (let k=0;k<6;k++){ const yy = base - 134*s + ((t*90 + k*24*s) % (134*s)); line(x-14*s+k*5*s, yy, x-14*s+k*5*s, yy+14*s, "rgba(150,195,230,.9)", 2*s); }
  ctx.fillStyle = "rgba(255,255,255,.7)"; ctx.beginPath(); ctx.ellipse(x, base-4*s, 50*s, 10*s, 0, 0, 7); ctx.fill();
}
function rapidMetro(y, t){ for (let x=-900; x<1800; x+=150){ box(x-7, y, 14, GY-y, "#B9C0C9"); } box(-1200, y-10, 3200, 12, "#C9CED6");
  const x0 = ((t*110) % 2600) - 900; for (let k=0;k<3;k++){ const xx = x0 + k*64; box(xx, y-38, 60, 28, "#E9EEF3", 8); box(xx, y-22, 60, 5, "#2C7BE5"); for (let w=0;w<4;w++) box(xx+6+w*13, y-33, 9, 8, "#2B3A55", 2); } }
function glassCity(seed, base, x0=-900, x1=1700, dusk=false){ const r = rng(seed); let x = x0;
  while (x < x1){ const w = 50 + r()*70, h = 120 + r()*200; const g = ctx.createLinearGradient(x, 0, x+w, 0); g.addColorStop(0, dusk?"#2E3B66":"#7FA3C9"); g.addColorStop(1, dusk?"#3F5288":"#B7CDE3"); ctx.fillStyle = g; ctx.fillRect(x, base-h, w-8, h);
    for (let yy = base-h+8; yy < base-8; yy += 12) box(x+4, yy, w-16, 2, dusk ? (r()<0.5?"rgba(255,214,120,.8)":"rgba(255,255,255,.1)") : "rgba(255,255,255,.35)");
    x += w; } }
function hometown(t, late){ hills("#B5CFA0", GY-30, 50, 7);
  for (let i=0;i<4;i++){ const x = -300 + i*170; if (x > 430 && x < 760) continue; box(x, GY-110, 130, 110, ["#E8D3B0","#D7C2E0","#BFD8C4","#F0C9A8"][i]); box(x-6, GY-120, 142, 14, "#B5553C", 3); box(x+20, GY-86, 26, 26, late ? "#FFE7A3" : "#8BC5DE", 2); box(x+80, GY-70, 28, 70, "#7A4B32", 2); }
  tree(-60, GY, 1.4, "#5C9A5A"); }
function cards(items, x0, y0, cols, lt, delay=1.4){ items.forEach(([l,c],i)=>{ const a = Math.min(1, Math.max(0,(lt-delay-i*0.3)/0.4)); if (!a) return; const x = x0+(i%cols)*112, y = y0+Math.floor(i/cols)*42 + Math.sin(timeNow*1.5+i)*2;
  ctx.globalAlpha = a; box(x, y, 104, 34, "#FFFFFF", 8); box(x+8, y+10, 14, 14, c, 3); txt(l, x+28, y+17, 11, "#16191E", 700, "left"); ctx.globalAlpha = 1; }); }
function videoTiles(x,y,w,h,masked){ box(x,y,w,h,"#1C2430"); for (let i=0;i<4;i++){ const xx = x+4+(i%2)*(w/2-2), yy = y+4+Math.floor(i/2)*(h/2-2); box(xx,yy,w/2-6,h/2-6,"#2E3A4A",3); circ(xx+w/4-3, yy+h/4-5, 7, ["#B57E55","#8E5A3A","#C08A62","#A9744C"][i]); if (masked) box(xx+w/4-9, yy+h/4-1, 12, 5, "#8FD3E8", 2); } }
function wallScreen(x,y,w,h,title,fn,accent="#3C6FB8"){ box(x-5,y-5,w+10,h+10,"#2B313A",7); box(x,y,w,h,"#FFFFFF",4); box(x,y,w,22,accent,4); txt(title, x+w/2, y+11, 12, "#FFFFFF", 800); ctx.save(); ctx.beginPath(); ctx.rect(x, y+22, w, h-22); ctx.clip(); fn(x, y+22, w, h-22); ctx.restore(); }
const suitcase = (x,y)=>{ box(x-10, y+2, 26, 30, "#7E6BE0", 4); box(x-2, y-2, 10, 6, "#5B4AB0", 2); };

/* ---------- the working years ---------- */

/* ---------- portrait-first overrides ---------- */
let heroLT = 99, heroExit = 0, timeNow = 0;
function stars(t, n=70){ const r = rng(7); for (let i=0;i<n;i++){ ctx.globalAlpha = 0.4+0.6*Math.abs(Math.sin(t*1.3+i)); circ(r()*1600-500, r()*520-20, 0.6+r()*1.4, "#FFFFFF"); } ctx.globalAlpha = 1; }
function badge(title, sub, x, y, hot){ ctx.font = "800 17px Inter, sans-serif"; const w = Math.max(200, ctx.measureText(title).width + 40); box(x-w/2, y, w, 54, hot?"#F4C20D":"#FFFFFF", 12); txt(title, x, y+21, 17, "#16191E", 800); txt(sub, x, y+41, 13, "#555D69", 600); if (hot) for (let i=0;i<4;i++) sparkle(x - w/2 + 16 + i*(w-32)/3, y - 4 + Math.sin(timeNow*4+i)*4, 6); }
function label(s, x, y, size=16, bg="#FFFFFF", fg="#16191E"){ ctx.font = `800 ${size}px Inter, sans-serif`; const w = ctx.measureText(s).width + size*1.4; box(x-w/2, y-size*0.95, w, size*1.9, bg, size*0.6); txt(s, x, y, size, fg, 800); }

/* ---------- floating project cards, framed by platform ---------- */
function frameFor(p, cx, cy, t){
  const K = KIND_COLOR[p.kind] || "#3C6FB8", k = p.kind;
  const shadowBox = (x,y,w,h,r)=>{ box(x+4, y+7, w, h, "rgba(10,16,24,.22)", r); };
  if (k === "Mobile"){ const w = 92, h = 164, x = cx-w/2, y = cy-h/2; shadowBox(x,y,w,h,18); box(x,y,w,h,"#1B1F26",18); box(x+6,y+12,w-12,h-24,"#FFFFFF",10); box(cx-14, y+5, 28, 5, "#000", 3);
    box(x+6,y+12,w-12,30,K,10); box(x+6,y+30,w-12,12,K); for (let i=0;i<3;i++) box(x+14, y+52+i*24, w-28, 16, i===Math.floor(t*1.2)%3?sh(K,1.25):"#EEF1F4", 5); box(x+20, y+h-38, w-40, 16, K, 8); return; }
  if (k === "Games"){ const w = 190, h = 104, x = cx-w/2, y = cy-h/2; shadowBox(x,y,w,h,40); box(x,y,w,h,"#2B2F3A",40); box(cx-50, y+14, 100, 76, "#0E1622", 6);
    circ(cx-28 + Math.sin(t*3)*12, cy+8, 9, K); circ(cx+24 - Math.sin(t*3)*12, cy+8, 9, "#F4C20D"); box(x+18, cy-4, 26, 8, "#596273", 3); box(x+27, cy-13, 8, 26, "#596273", 3); circ(x+w-26, cy-8, 6, "#E0574A"); circ(x+w-38, cy+6, 6, "#2F9E6B"); return; }
  if (k === "Backend"){ const w = 220, h = 132, x = cx-w/2, y = cy-h/2; shadowBox(x,y,w,h,10); box(x,y,w,h,"#0F1724",10); box(x,y,w,22,"#222C3A",10); box(x,y+12,w,10,"#222C3A");
    [0,1,2].forEach(i=>circ(x+14+i*14, y+11, 4, ["#E0574A","#F4C20D","#2F9E6B"][i]));
    const n = 1 + Math.floor(t*2)%5; for (let i=0;i<n;i++){ txt("$", x+12, y+38+i*18, 13, "#8BE0A4", 800, "left", "monospace"); box(x+28, y+33+i*18, 40 + ((i*53)%110), 8, ["#7FB2FF","#8BE0A4","#F4C20D"][i%3], 3); }
    for (let i=0;i<3;i++){ box(x+w-46, y+36+i*24, 34, 18, "#2B3542", 3); circ(x+w-18, y+45+i*24, 3, Math.sin(t*6+i)>0?"#2F9E6B":"#1E2A22"); } return; }
  if (k === "AI"){ const w = 214, h = 140, x = cx-w/2, y = cy-h/2; shadowBox(x,y,w,h,16); box(x,y,w,h,"#FFFFFF",16); box(x,y,w,26,K,16); box(x,y+14,w,12,K); sparkle(x+18, y+13, 7, "#FFFFFF");
    const n = 1 + Math.floor(t*1.2)%4; for (let i=0;i<n;i++){ const me = i%2===0, bw = 90 + (i*37)%60; box(me ? x+w-12-bw : x+12, y+36+i*25, bw, 18, me ? sh(K,1.35) : "#EEF1F4", 9); } return; }
  if (k === "Blockchain"){ const w = 226, h = 110, x = cx-w/2, y = cy-h/2; shadowBox(x,y,w,h,14); box(x,y,w,h,"#FFFFFF",14);
    for (let i=0;i<3;i++){ const bx = x+20+i*68, by = cy-22 + Math.sin(t*2+i)*4; box(bx, by, 48, 44, i%2?K:sh(K,1.3), 8); txt("#"+(204+i), bx+24, by+22, 12, "#FFFFFF", 800); if (i<2) line(bx+48, cy, bx+68, cy, K, 4); } return; }
  if (k === "Tools"){ const w = 224, h = 140, x = cx-w/2, y = cy-h/2; shadowBox(x,y,w,h,10); box(x,y,w,h,"#1E1E1E",10); box(x,y,w,20,"#323233",10); box(x,y+10,w,10,"#323233");
    [0,1,2].forEach(i=>circ(x+12+i*12, y+10, 3.5, ["#E0574A","#F4C20D","#2F9E6B"][i])); box(x, y+20, 22, h-20, "#2C2C2C"); for (let i=0;i<4;i++) box(x+6, y+30+i*20, 10, 10, i===1?K:"#858585", 2);
    box(x+22, y+20, 60, h-20, "#252526"); for (let i=0;i<5;i++) box(x+28, y+30+i*16, 44, 7, i===Math.floor(t*1.5)%5?K:"#4A4A4A", 3);
    const n = 1 + Math.floor(t*2)%6; for (let i=0;i<n;i++) box(x+90, y+30+i*16, 30 + ((i*37)%90), 7, ["#569CD6","#CE9178","#4EC9B0","#DCDCAA"][i%4], 3); box(x, y+h-10, w, 10, K, 10); box(x, y+h-10, w, 4, K); return; }
  // Web and Dashboards: a browser window
  const w = 228, h = 146, x = cx-w/2, y = cy-h/2; shadowBox(x,y,w,h,12); box(x,y,w,h,"#FFFFFF",12); box(x,y,w,26,"#E9ECF0",12); box(x,y+14,w,12,"#E9ECF0");
  [0,1,2].forEach(i=>circ(x+14+i*13, y+13, 4, ["#E0574A","#F4C20D","#2F9E6B"][i])); box(x+58, y+6, w-72, 14, "#FFFFFF", 7);
  if (k === "Dashboards"){ for (let i=0;i<6;i++){ const bh = (0.3+0.6*Math.abs(Math.sin(t*1.5+i)))*70; box(x+16+i*22, y+h-14-bh, 14, bh, i===5?K:sh(K,1.4), 3); } ctx.strokeStyle = K; ctx.lineWidth = 3; ctx.beginPath(); for (let i=0;i<6;i++) ctx.lineTo(x+150+i*12, y+h-30 - Math.sin(i+t)*16 - i*4); ctx.stroke(); }
  else { box(x+12, y+36, w-24, 34, sh(K,1.35), 6); box(x+12, y+78, (w-30)/2, 54, "#EEF1F4", 6); box(x+18+(w-30)/2, y+78, (w-30)/2, 54, "#EEF1F4", 6); box(x+20, y+46, 70, 12, K, 4); }
}

/* ---------- the chapters, laid out for a 600 x 720 portrait stage (ground at 640) ---------- */
const CH = [
 { title:"The dreamer", era:"Growing up", when:"Childhood in Bundu", text:"A boy who wanted to be an innovator. Long before he knew the word, he was happiest building something new out of whatever he could find.",
   draw(t, lt){
     sky("#F9C9A4","#FFF1DC"); sun(470, 300, 34, "#FFE7B0"); clouds(t, 120); hills("#E3B99A", GY-60, 80, 1); hills("#C9A27F", GY, 40, 3); ground("#D9C495","#B7A273");
     box(-60, GY-190, 230, 190, "#EBCB9F"); ctx.fillStyle = "#B5553C"; ctx.beginPath(); ctx.moveTo(-80, GY-184); ctx.lineTo(55, GY-250); ctx.lineTo(190, GY-184); ctx.fill(); box(60, GY-110, 46, 110, "#7A4B32", 4); box(-10, GY-150, 44, 40, "#8BC5DE", 3);
     sunTemple(520, GY-60, 0.42, t);
     const f = who("friendKid", 500, POSE.point(t), {dir:-1});
     const kx = 430 + Math.sin(t*0.9)*30, ky = 340 + Math.cos(t*1.3)*16;
     line(f.hand[0], f.hand[1], kx, ky+24, "rgba(60,60,60,.7)", 1.4);
     ctx.save(); ctx.translate(kx,ky); ctx.rotate(Math.sin(t*1.4)*0.2); ctx.fillStyle = "#E0574A"; ctx.beginPath(); ctx.moveTo(0,-28); ctx.lineTo(20,0); ctx.lineTo(0,28); ctx.lineTo(-20,0); ctx.fill(); line(0,-28,0,28,"#F4C20D",2); line(-20,0,20,0,"#F4C20D",2); ctx.restore();
     for (let k=1;k<5;k++) circ(kx + Math.sin(t*2+k)*6, ky+28+k*11, 3.5, ["#3C6FB8","#F4C20D"][k%2]);
     const rx = 335, built = Math.min(1, Math.max(0, (lt - 1.3)/1.5));
     box(rx-26, GY-56, 52, 56, "#C79A62", 4); box(rx-18, GY-88, 36, 30, "#D4A96F", 4); circ(rx-8, GY-74, 4, "#1C1715"); circ(rx+8, GY-74, 4, "#1C1715"); line(rx, GY-88, rx, GY-102, "#6B4B32", 2); circ(rx, GY-104, 4, Math.sin(t*6)>0?"#E0574A":"#F4C20D");
     ctx.save(); ctx.translate(rx+26, GY-46); ctx.rotate(-0.4 - built*0.9*Math.abs(Math.sin(t*3))); box(0,-5,30,10,"#C79A62",3); ctx.restore();
     stool(255, GY-20);
     hero("child", 255, GY, sit(POSE.type(t)), {item:(x,y)=>line(x,y,x+12,y-6,"#9AA3AD",3)});
     if (lt > 1.3){ ctx.globalAlpha = 0.6+0.4*Math.sin(t*3); circ(255, GY-170, 24, "#FFE27A"); ctx.globalAlpha = 1; circ(255, GY-172, 14, "#F4C20D"); box(249, GY-160, 12, 8, "#9AA3AD", 2); [0,1,2,3,4].forEach(i=>{ const a = t*1.5 + i*1.25; sparkle(255 + Math.cos(a)*38, GY-170 + Math.sin(a)*32, 6); }); }
   }},
 { title:"Meeting a computer", era:"Growing up", when:"Childhood", text:"Then he met a computer: a machine that does whatever you tell it, once you learn its language. He was in awe, and the feeling never really went away.",
   draw(t, lt){
     interior("#DCE6EC","#B9A58A","#C3CDD3");
     windowView(30, 300, 140, 140, ()=>{ sky("#9FD0EE","#E6F4FA"); cloud(100, 360, 0.8); });
     box(372, 282, 200, 128, "#F7F3E8", 6); box(372, 282, 200, 18, "#E3DCC8", 6); box(372, 292, 200, 8, "#E3DCC8"); txt("index.html", 472, 291, 10, "#6B6455", 700);
     const CODE = [[["<","#8A8F98"],["h1","#C0392B"],[">","#8A8F98"],["Hi!","#16191E"],["</","#8A8F98"],["h1","#C0392B"],[">","#8A8F98"]],
       [["<","#8A8F98"],["p","#C0392B"],[" class","#B07A10"],["=","#8A8F98"],["\"me\"","#2F9E6B"],[">","#8A8F98"]],
       [["h1 ","#3C6FB8"],["{","#8A8F98"]], [["  color","#7E6BE0"],[": ","#8A8F98"],["tomato","#2F9E6B"],[";","#8A8F98"]], [["}","#8A8F98"]]];
     const shown = Math.min(CODE.length, 1 + Math.floor(lt*1.6));
     ctx.font = "700 13px monospace"; ctx.textBaseline = "middle"; ctx.textAlign = "left";
     CODE.slice(0, shown).forEach((ln, r)=>{ let x = 384; ln.forEach(([s2,c])=>{ ctx.fillStyle = c; ctx.fillText(s2, x, 316 + r*20); x += ctx.measureText(s2).width; }); if (r === shown-1 && Math.sin(t*6) > 0) box(x+2, 309 + r*20, 7, 14, "#16191E"); });
     desk(230, GY-110, 210); crt(330, GY-110, t, true);
     who("elder", 510, POSE.point(t), {dir:-1});
     who("girlKid", 110, POSE.stand(t), {dir:1, expr:"awe"});
     const me = hero("child", 220, GY, POSE.stand(t), {expr:"awe"});
     if (lt > 1.3) for (let i=0;i<5;i++){ const a = t*1.2 + i*1.26; sparkle(me.head[0] + Math.cos(a)*36, me.head[1] - 24 + Math.sin(a)*24, 5+2*Math.sin(t*4+i), i%2?"#9CF5D5":"#F4C20D"); }
   }},
 { title:"Learning, friends and phones", era:"Growing up", when:"Saraswati Shishu Vidya Mandir, Bundu", text:"He learned everything he could, from HTML, CSS and PHP to Visual Basic, played with friends, and tinkered with anything that had a circuit inside. Before long he was opening up phones and repairing them.",
   draw(t, lt){
     sky("#8EC9EC","#E9F5F8"); clouds(t, 110); hills("#A9C99A", GY-120, 70, 2);
     sunTemple(120, GY-140, 0.55, t); shishuMandir(420, GY-140, 0.9);
     box(-1200, GY-140, 3200, 140, "#C8B98A"); ground("#C8B98A","#A8996C");
     // table tennis with friends, out by the school
     const B = GY-142, TL = 200, TR = 380, TY = B-30, NX = (TL+TR)/2;
     box(TL, TY, TR-TL, 6, "#1F6E8C", 2); box(NX-1, TY-1, 2, 7, "#FFFFFF"); box(TL+10, TY+6, 4, B-TY-6, "#3A424D"); box(TR-14, TY+6, 4, B-TY-6, "#3A424D");
     box(NX-1, TY-11, 2, 11, "#3A424D"); ctx.fillStyle = "rgba(255,255,255,.75)"; ctx.fillRect(NX-1, TY-10, 2, 9);
     const P = 1.1, rally = t/P, k = Math.floor(rally), u = rally - k, toRight = k % 2 === 0;
     const xa = toRight ? 188 : 392, xb = toRight ? 392 : 188, xm = toRight ? 335 : 245, yh = B-46, yt = TY-3;
     let bx, by; if (u < 0.55){ const v = u/0.55; bx = xa + (xm-xa)*v; by = yh + (yt-yh)*v - Math.sin(v*Math.PI)*24; }
     else { const v = (u-0.55)/0.45; bx = xm + (xb-xm)*v; by = yt + (yh-yt)*v - Math.sin(v*Math.PI)*20; }
     circ(bx, by, 3.5, "#FFFFFF");
     const swingL = toRight ? Math.max(0, 1 - u*5) : Math.max(0, (u-0.82)*5.5), swingR = toRight ? Math.max(0, (u-0.82)*5.5) : Math.max(0, 1 - u*5);
     const paddle = c => (x,y)=>{ line(x, y, x+4, y-4, "#6E4B2A", 2); circ(x+7, y-7, 5, c); };
     const swing = sw => ({...POSE.stand(t), ra:1.2 + sw*1.1, re:0.9 - sw*0.6, ll:0.15, rl:-0.15, lk:-0.15, rk:-0.15});
     person({...PEOPLE.friendKid, x:170, y:B, h:70, pose:swing(swingL), dir:1, noShadow:true, item:paddle("#D33A2C")});
     person({...PEOPLE.girlKid, x:410, y:B, h:68, pose:swing(swingR), dir:-1, noShadow:true, item:paddle("#1D1D1D")});
     desk(200, GY-50, 200, "#8C6A48");
     box(214, GY-62, 34, 12, "#2B313A", 3); box(218, GY-60, 26, 8, "#2F9E6B", 2); box(262, GY-64, 28, 14, "#3A4656", 3); box(266, GY-61, 20, 9, "#7FB2FF", 2);
     box(306, GY-76, 22, 26, "#F2C200", 3); box(310, GY-72, 14, 10, "#1C1715", 2); [0,1,2].forEach(i=>box(350, GY-58-i*9, 30, 8, ["#3C6FB8","#E0574A","#2F9E6B"][i], 2));
     for (let k=0;k<3;k++){ const p = ((t*0.8 + k/3)%1); ctx.globalAlpha = 0.5*(1-p); circ(240 + Math.sin(t*2+k)*4, GY-70 - p*40, 4+p*6, "#DDDDDD"); } ctx.globalAlpha = 1;
     stool(170, GY-30);
     hero("teen", 170, GY, sit(POSE.type(t)), {item:(x,y)=>line(x,y,x+14,y-4,"#9AA3AD",3)});
     who("friendM", 470, POSE.give(t), {dir:-1, h:132, item:(x,y)=>box(x-10,y-14,14,24,"#20242B",3)});
     if (lt > 1.5) label("Fixed it!", 470, GY-178, 17);
   }},
 { title:"BCA, and a class of his own", era:"P.P.K. College", when:"P.P.K. College", text:"He studied for his BCA at P.P.K. College. Alongside the degree he taught part time at a school, his first time explaining technology to a room full of students.",
   draw(t, lt){
     interior("#EFE3C8","#B79B78","#D9C9A8");
     box(30, 290, 230, 56, "#B5462F", 6); txt("P.P.K. COLLEGE", 145, 312, 20, "#FFFFFF", 800, "center", 'Archivo, "Arial Narrow", sans-serif'); txt("BCA", 145, 334, 13, "#FFE2B0", 700);
     box(220, 370, 350, 140, "#2F5D46", 6); ctx.strokeStyle = "#8C6A48"; ctx.lineWidth = 8; ctx.strokeRect(220, 370, 350, 140);
     const chars = Math.floor(Math.max(0, lt-1.4)*10), lines = ["INPUT → PROCESS → OUTPUT", "if (curious) learn();"];
     let left = chars; lines.forEach((l,i)=>{ const s = l.slice(0, Math.max(0, Math.min(l.length, left))); left -= l.length; txt(s, 240, 410+i*44, 19, "#F2F0E6", 600, "left"); });
     box(40, 380, 30, 46, "#B5462F", 6); box(46, 374, 18, 10, "#6B4B32", 3);
     hero("young", 200, GY, POSE.write(t), {item:(x,y)=>box(x-2,y-6,4,8,"#FFFFFF")});
     [[330,"girlKid"],[420,"friendKid"],[510,"girlKid"]].forEach(([x,n],i)=>{
       box(x-34, GY-56, 60, 8, "#8C6A48", 2); box(x+16, GY-48, 6, 48, "#6E5238");
       person({...PEOPLE[n], x, y:GY, dir:-1, seed:i, shirt:["#F2F0E6","#DCE7F3"][i%2], pants:"#3B5C8A", pose: sit(i===1 ? POSE.raise(t) : POSE.type(t*0.3)), h:i%2?88:86}); });
   }},
 { title:"MCA, and robots", era:"University of North Bengal", when:"University of North Bengal, Siliguri", text:"For his MCA he moved to the University of North Bengal, in the hills near Siliguri. There he discovered robotics and started entering competitions.",
   draw(t, lt){
     sky("#86C3EA","#E8F4F7"); peaks("#9DB2C8","#FFFFFF", GY-210, 210); hills("#7FAE77", GY-130, 60, 4);
     for (let r=0;r<7;r++){ ctx.strokeStyle = "rgba(255,255,255,.2)"; ctx.lineWidth = 3; ctx.beginPath(); for (let x=-900;x<1500;x+=20) ctx.lineTo(x, GY-140+r*12+Math.sin(x*0.01+r)*4); ctx.stroke(); }
     line(-1200, GY-150, 2000, GY-166, "#6B5A4A", 2); { const tx = ((t*45) % 1700) - 500; toyTrain(tx, GY-149 - 0.005*(tx+1200), 0.8, t); }
     ground("#9BBE7E","#7FA266"); box(-1200, GY-60, 3200, 60, "#9BBE7E");
     box(-60, GY-250, 190, 190, "#E9E2D2"); for (let i=0;i<3;i++) for (let j=0;j<2;j++) box(-40+i*56, GY-230+j*62, 34, 38, "#8BB6D6", 2); box(-60, GY-266, 190, 20, "#B5462F", 2); txt("UNIV. OF NORTH BENGAL", 35, GY-256, 12, "#FFFFFF", 800);
     line(170, 330, 590, 330, "#6B7480", 2); box(250, 330, 270, 44, "#3C6FB8", 6); txt("ROBOTICS CONTEST", 385, 352, 20, "#FFFFFF", 800, "center", 'Archivo, "Arial Narrow", sans-serif');
     for (let k=0;k<7;k++){ ctx.fillStyle = ["#F4C20D","#E0574A","#2F9E6B"][k%3]; const x = 180 + k*60; ctx.beginPath(); ctx.moveTo(x,330); ctx.lineTo(x+14,330); ctx.lineTo(x+7,348); ctx.fill(); }
     who("prof", 330, POSE.nod(t), {dir:-1, h:140, item:(x,y)=>box(x-2,y-18,14,20,"#F3F1EA",2)});
     box(200, GY-76, 250, 12, "#5B6470", 3); box(210, GY-64, 8, 64, "#3E4652"); box(432, GY-64, 8, 64, "#3E4652"); line(210, GY-80, 440, GY-80, "#16191E", 3);
     const u = (Math.sin(t*1.1)+1)/2, rbx = 230 + u*190;
     box(rbx-20, GY-102, 40, 18, "#E0574A", 4); circ(rbx-12, GY-82, 6, "#16191E"); circ(rbx+12, GY-82, 6, "#16191E"); box(rbx+12, GY-108, 10, 8, "#F4C20D", 2); line(rbx, GY-102, rbx-4, GY-118, "#16191E", 2); circ(rbx-4, GY-120, 3, Math.sin(t*8)>0?"#2F9E6B":"#F4C20D");
     hero("student", 140, GY, POSE.hold(t), {item:(x,y)=>{ box(x-4,y-10,22,14,"#20242B",4); circ(x+4,y-3,2.5,"#E0574A"); }});
     who("friendM", 500, POSE.cheer(t), {dir:-1});
     who("friendF", 570, POSE.clap(t+0.5), {dir:-1});
   }},
 { title:"Building for the university", era:"University of North Bengal", when:"University of North Bengal", text:"As an intern he built NBU PayBill for the university. For the High Performance Computing lab he built an ESP32-based system that warns when the room gets too hot.",
   draw(t, lt){
     interior("#E4E9EE","#9AA3AD","#C9D0D6");
     box(40, 330, 210, 140, "#FFFFFF", 8); box(40, 330, 210, 30, "#3C6FB8", 8); box(40, 346, 210, 14, "#3C6FB8"); txt("NBU PayBill", 145, 346, 17, "#FFFFFF", 800);
     for (let i=0;i<3;i++){ box(56, 374+i*26, 120, 16, "#E3E8EE", 4); box(184, 374+i*26, 50, 16, i===Math.floor(t)%3?"#2F9E6B":"#C3CCD5", 4); } line(145, 470, 145, GY-112, "#B0B8C2", 2);
     desk(40, GY-58, 220, "#7A5A3E"); laptop(180, GY-58, 1, 1.15);
     const pr = (t*0.4)%1; box(212, GY-80, 46, 22, "#D6DCE2", 4); box(220, GY-80 - pr*36, 30, pr*36+2, "#FFFFFF", 1);
     chair(110, GY-34, 1); hero("student", 120, GY, sit(POSE.type(t)), {bag:null});
     who("prof", 300, POSE.nod(t), {dir:-1});
     txt("HPC LAB", 490, 300, 20, "#3B4656", 800, "center", 'Archivo, "Arial Narrow", sans-serif');
     [430, 530].forEach((x,i)=>{ box(x-42, GY-250, 84, 250, "#2B313A", 4); for (let r=0;r<10;r++){ box(x-34, GY-240+r*24, 68, 16, "#3A424D", 2); circ(x+26, GY-232+r*24, 2.5, Math.sin(t*6+r+i*2)>0?"#2F9E6B":"#1E2A22"); } });
     const temp = 22 + 18*((Math.sin(t*0.7)+1)/2), hot = temp > 35;
     box(400, 318, 160, 64, "#FFFFFF", 10); box(410, 330, 40, 24, "#2C7BE5", 4); txt("ESP32", 430, 342, 10, "#FFFFFF", 800);
     txt(temp.toFixed(0)+"°C", 505, 343, 22, hot?"#C0392B":"#16191E", 800); box(412, 362, 136, 9, "#E2E6EA", 4); box(412, 362, 136*(temp-20)/22, 9, hot?"#E0574A":"#2F9E6B", 4);
     if (hot){ ctx.globalAlpha = 0.5+0.5*Math.sin(t*12); circ(560, 316, 12, "#E0574A"); ctx.globalAlpha = 1; txt("!", 560, 317, 16, "#FFFFFF", 900); label("Too hot!", 480, 285, 15, "#E0574A", "#FFFFFF"); }
   }},
 { title:"Listening for elephants", era:"University of North Bengal", when:"Research at the University of North Bengal", text:"He helped with research on machine-learning-based signal detection for elephants, using geosensors in the ground and Arduino programming.",
   draw(t, lt){
     sky("#0D1830","#2C4466"); stars(t); sun(470, 300, 26, "#F3F0E2");
     hills("#1C2C3E", GY-90, 110, 5, 0.01); for (let i=0;i<12;i++) pine(-200 + i*80 + (i%3)*10, GY-70, 1.2+0.3*(i%2), "#18263A");
     ground("#1F3328","#2A4434"); for (let r=0;r<4;r++) for (let x=-200; x<900; x+=34) circ(x + r*12, GY+18 + r*20, 12, sh("#2E4C38", 1 + r*0.08));
     const ex = 620 - ((t*12) % 300);
     elephant(ex, GY, 1, t); elephant(ex + 105, GY, 0.62, t+1.3, "#56627A");
     [250, 340, 430].forEach((x,i)=>{ box(x-3, GY-24, 6, 28, "#9AA3AD", 2); circ(x, GY-26, 5, "#F4C20D"); if (Math.abs(x - ex) < 150) ripple(x, GY+4, t + i*0.3, "#9CF5D5"); });
     box(40, GY-56, 130, 8, "#5B4636", 2); box(48, GY-48, 6, 48, "#4A3A2C"); box(156, GY-48, 6, 48, "#4A3A2C");
     box(60, GY-150, 110, 74, "#0F1724", 6); ctx.strokeStyle = "#9CF5D5"; ctx.lineWidth = 2; ctx.beginPath();
     for (let i=0;i<100;i++){ const near = Math.abs(340 - ex) < 170 ? 1 : 0.2; const v = Math.sin(i*0.6 + t*8)*3 + (Math.sin(i*0.15 - t*3) > 0.8 ? near*20 : 0)*Math.sin(i*1.7); ctx.lineTo(65 + i, GY-113 + v); } ctx.stroke();
     line(115, GY-76, 115, GY-58, "#3A424D", 4); box(120, GY-70, 32, 12, "#2C7BE5", 2); circ(146, GY-66, 2.5, Math.sin(t*9)>0?"#E0574A":"#3A1010");
     stool(70, GY-34, "#5B4636"); hero("student", 70, GY, sit(POSE.type(t)), {bag:null, long:true});
     const r = who("prof", 200, POSE.torch(t), {dir:1, h:144});
     const g = ctx.createLinearGradient(r.hand[0], 0, r.hand[0]+260, 0); g.addColorStop(0,"rgba(255,240,190,.45)"); g.addColorStop(1,"rgba(255,240,190,0)");
     ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(r.hand[0], r.hand[1]); ctx.lineTo(r.hand[0]+280, r.hand[1]-40); ctx.lineTo(r.hand[0]+280, r.hand[1]+110); ctx.closePath(); ctx.fill();
   }},
 { title:"Friends, service and a first client", era:"University of North Bengal", when:"Final semester", projects:["16 Ana Bangalee Client","16 Ana Bangalee Vendor"],
   text:"He volunteered with the NSS and made the most of time with friends. At the end of his last semester, he landed his first freelance project: apps for 16 Ana Bangalee, a restaurant.",
   draw(t, lt){
     sky("#9AD0EF","#EEF7F2"); clouds(t, 110); peaks("#B6C6D6","#FFFFFF", GY-130, 120); hills("#8CBF7A", GY-60, 40, 6); ground("#9BC27F","#7FA266");
     line(30, 300, 30, GY, "#6B4B32", 4); line(250, 300, 250, GY, "#6B4B32", 4); box(30, 300, 220, 50, "#1F4E8C", 6); txt("NSS", 72, 325, 22, "#F4C20D", 900, "center", 'Archivo, "Arial Narrow", sans-serif'); txt("NOT ME BUT YOU", 170, 325, 14, "#FFFFFF", 700);
     person({...PEOPLE.friendF, x:80, y:GY, pose:POSE.bend(t), dir:1, h:132, item:(x,y)=>{ box(x-2,y-8,22,14,"#3C6FB8",3); for (let k=0;k<3;k++){ const p=((t*1.5+k/3)%1); circ(x+24+p*8, y+4+p*30, 2.5, "#7FB2FF"); } }});
     box(134, GY-6, 22, 8, "#7A4B32", 2); line(145, GY-6, 145, GY-36, "#3F8A3A", 3); circ(138, GY-32, 7, "#5CB85C"); circ(152, GY-40, 7, "#5CB85C");
     for (let i=0;i<4;i++){ const p = ((t*0.5 + i*0.25)%1), x = 330 + i*65 + Math.sin(t+i)*10, y = GY-170 - Math.sin(p*Math.PI)*120; ctx.save(); ctx.translate(x,y); ctx.rotate(Math.sin(t*2+i)*0.6); box(-17,-4,34,8,"#16191E",2); box(-9,0,18,10,"#16191E",2); line(11,0,15,14,"#F4C20D",2); ctx.restore(); }
     who("friendM", 330, POSE.cheer(t), {dir:1});
     who("friendF", 560, POSE.cheer(t+0.4), {dir:-1, shirt:"#F28C38"});
     const me = hero("student", 450, GY, POSE.hold(t), {item:(x,y)=>{ box(x-2,y-24,18,30,"#20242B",4); box(x+1,y-20,12,22,"#F4C20D",2); }});
     if (lt > 1.2){ for (let k=0;k<2;k++){ ctx.strokeStyle = `rgba(22,25,30,${0.5-0.2*k})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(me.hand[0]+8, me.hand[1]-10, 18+k*8 + Math.sin(t*8)*2, -0.8, 0.8); ctx.stroke(); } label("First freelance project!", 450, GY-196, 16); }
   }},
 { title:"Kolkata, in lockdown", era:"Distronix, Kolkata", when:"Distronix LLC, Kolkata, from November 2020",
   projects:["NKDA Citizen Covid App","NKDA Covid Call Center Dashboard","NKDA Sanitization Worker App","Smart Health Card","Display Configuration Dashboard","Quest Mall Display"],
   text:"In November 2020 he moved to Kolkata to join Distronix, in the middle of the pandemic. Working from a small room, he was the team’s only frontend developer, building Covid apps for New Town’s residents and sanitisation workers, and display software for a shopping mall.",
   draw(t, lt){
     interior("#E9E2D4","#8F7B66","#CFC6B8");
     windowView(30, 290, 540, 200, ()=>{ sky("#F2A78A","#FCE0C2"); sun(500, 350, 24, "#FFF0D0"); box(0, 430, 620, 70, "#8FA9B8"); city(21, 432, 30, 90, "#C49A90", 0.2, 0, 620); howrah(300, 462, 0.6, "#6E5560"); taxi(((t*45)%640) - 20, 432, 0.55); box(60 + ((t*12)%420), 468, 34, 7, "#5B4636", 3); });
     desk(40, GY-58, 280, "#7A5A3E"); laptop(180, GY-58, 1, 1.15); monitor(270, GY-62, 92, 58, (x,y,w,h)=>videoTiles(x,y,w,h,true));
     box(60, GY-74, 12, 16, "#7FD1B9", 3); box(62, GY-78, 8, 5, "#2F9E6B", 2); box(80, GY-66, 22, 8, "#8FD3E8", 3);
     chair(110, GY-35, 1); hero("work", 120, GY, sit(POSE.type(t)));
     badge("Junior Software Engineer", "Sole frontend developer", 460, GY-130);
   }},
 { title:"New Town, a smart city", era:"Distronix, Kolkata", when:"Distronix LLC, New Town, Kolkata, 2021",
   projects:["NKDA Trams","WBTC Trams","NKDA SWM Scanner","Smart Card Verifier","NKDA Parking Assistant","NKDA Smart Home Tags Dashboard","Radio New Town"],
   text:"Through 2021 he built apps for New Town, Kolkata’s planned smart city: tram trackers, NFC smart-card scanners for homes and waste collection, a parking assistant and dashboards for smart home tags.",
   draw(t, lt){
     sky("#8EC6E8","#E3F1F4"); clouds(t, 110); city(31, GY-120, 110, 240, "#A9BACB", 0.0); biswa(380, GY-120, 1.05);
     box(-1200, GY-120, 3200, 40, "#6B6F76"); for (let x=-900; x<1500; x+=60) box(x, GY-102, 30, 3, "#E9E3D2"); line(-1200, GY-170, 2000, GY-170, "#3A3A3A", 1.2); kTram(((t*40) % 1400) - 400, GY-84, 0.85);
     ground("#B8C4A8","#9EAA8E"); box(-1200, GY-80, 3200, 80, "#B8C4A8");
     box(330, GY-150, 150, 150, "#EBD9BE"); box(320, GY-160, 170, 14, "#B5553C", 3); box(420, GY-90, 36, 90, "#7A4B32", 2); box(346, GY-130, 34, 30, "#8BC5DE", 2);
     box(390, GY-104, 18, 18, "#FFFFFF", 3); txt("NFC", 399, GY-95, 7, "#2C7BE5", 800); if (lt > 1.6) ripple(399, GY-95, t, "#2C7BE5");
     who("worker2", 330, POSE.give(t), {dir:1, shirt:"#F28C38", item:(x,y)=>box(x-2,y-14,14,22,"#20242B",3)});
     box(555, GY-150, 6, 150, "#6B7480"); box(535, GY-196, 46, 46, "#2C7BE5", 6); txt("P", 558, GY-173, 28, "#FFFFFF", 900);
     hero("work", 150, GY, POSE.hold(t), {item:(x,y)=>{ box(x-4,y-24,20,32,"#20242B",4); box(x-1,y-20,14,22, lt>2.4?"#2F9E6B":"#FFFFFF",2); }});
     if (lt > 2.4) label("Tag verified ✓", 160, GY-190, 16, "#FFFFFF", "#2F9E6B");
   }},
 { title:"Dashboards for cleaner air", era:"Distronix, Kolkata", when:"Distronix LLC, for the West Bengal Pollution Control Board, 2021 to 2022",
   projects:["WBPCB Command & Control Center","NKDA Air Quality Dashboard","WBPCB ANMS Dashboard","WBPCB Paribesh App","WBPCB Paribesh App Admin Panel","WBPCB ANMS Display","PIS MQTT Tabular Dashboard","Paribesh Tree Image Uploader","React Clock Counter","React Native Dropdown Step"],
   text:"For the West Bengal Pollution Control Board he built the Paribesh app, noise and air quality dashboards, public display screens and a full command and control centre. Along the way he was promoted from junior engineer to software engineer.",
   draw(t, lt){
     interior("#26303D","#3A4350","#323C4A");
     windowView(20, 290, 170, 160, ()=>{ sky("#F0A47A","#FBD9B0"); box(0, 410, 220, 60, "#6E9A5A"); victoria(105, 420, 0.6); });
     const S = [
       ["Air quality", (x,y,w,h)=>{ const v = 0.35 + 0.15*Math.sin(t*0.8); ctx.strokeStyle = "#E2E6EA"; ctx.lineWidth = 9; ctx.beginPath(); ctx.arc(x+w/2, y+h-8, 30, Math.PI, 0); ctx.stroke(); ctx.strokeStyle = v>0.45?"#D99A10":"#2F9E6B"; ctx.beginPath(); ctx.arc(x+w/2, y+h-8, 30, Math.PI, Math.PI*(1+v)); ctx.stroke(); txt("AQI "+Math.round(60+v*80), x+w/2, y+h-16, 13, "#16191E", 800); }],
       ["Noise", (x,y,w,h)=>{ for (let i=0;i<8;i++){ const bh = (0.3+0.6*Math.abs(Math.sin(t*2+i)))*(h-12); box(x+12+i*20, y+h-6-bh, 13, bh, i>5?"#E0574A":"#3C6FB8", 2); } }],
       ["Live map", (x,y,w,h)=>{ box(x,y,w,h,"#E3EEF3"); ctx.strokeStyle = "#B9CCD8"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, y+h*0.7); ctx.quadraticCurveTo(x+w*0.5, y+h*0.2, x+w, y+h*0.6); ctx.stroke(); for (let i=0;i<6;i++){ const px = x+15+((i*41)%(w-30)), py = y+10+((i*19)%(h-20)); circ(px, py, 5, ["#2F9E6B","#D99A10","#E0574A"][i%3]); } }],
       ["Reports", (x,y,w,h)=>{ ctx.strokeStyle = "#3C6FB8"; ctx.lineWidth = 3; ctx.beginPath(); for (let i=0;i<=10;i++) ctx.lineTo(x+8+i*(w-16)/10, y+h-10 - (Math.sin(i*0.9+t)*0.3+0.5)*(h-22)); ctx.stroke(); }],
     ];
     S.forEach(([n,fn],i)=>wallScreen(210 + (i%2)*190, 290 + Math.floor(i/2)*92, 176, 82, n, fn, ["#2F9E6B","#3C6FB8","#7E6BE0","#D99A10"][i]));
     who("official", 460, POSE.nod(t), {dir:-1});
     who("prof", 545, POSE.stand(t), {dir:-1, h:146});
     hero("work", 260, GY, POSE.present(t));
     badge(lt > 4 ? "Software Engineer" : "Junior Software Engineer", lt > 4 ? "Promoted" : "Distronix LLC", 140, GY-150, lt > 4);
   }},
 { title:"Into blockchain", era:"Zeeve DeepTech", when:"Zeeve DeepTech, from April 2022", projects:["Phaeton Bond Marketplace"],
   text:"In April 2022 he joined Zeeve DeepTech as a frontend software engineer. His first big project was Phaeton’s Bond Marketplace, a public blockchain marketplace for buying and selling bonds.",
   draw(t, lt){
     interior("#E3E7EF","#6E7684","#C9CED8");
     wallScreen(40, 290, 330, 190, "Bond Marketplace", (x,y,w,h)=>{ ["BOND A","BOND B","BOND C","BOND D"].forEach((b,i)=>{ box(x+10, y+8+i*40, w-20, 32, i===Math.floor(t)%4?"#F1EEFA":"#F8F8FB", 6); txt(b, x+22, y+24+i*40, 14, "#16191E", 700, "left"); txt((5+Math.sin(t*1.5+i)*0.4+i*0.25).toFixed(2)+"%", x+w-96, y+24+i*40, 14, "#5B3FB8", 800, "right"); box(x+w-80, y+13+i*40, 62, 22, i%2?"#2F9E6B":"#5B3FB8", 5); txt(i%2?"Sell":"Buy", x+w-49, y+24+i*40, 13, "#FFFFFF", 800); }); }, "#5B3FB8");
     for (let i=0;i<5;i++){ const u = ((t*0.3 + i/5)%1), x = 400 + u*180, y = 340 + Math.sin(u*Math.PI*2)*14; box(x-11, y-11, 22, 22, ["#7E6BE0","#B05CC8"][i%2], 5); }
     txt("Phaeton chain", 490, 390, 15, "#5B3FB8", 800);
     desk(380, GY-56, 190, "#5B6470"); chair(500, GY-33, -1); who("dev1", 510, sit(POSE.type(t)), {dir:-1}); laptop(440, GY-56, -1, 1.1);
     hero("work", 140, GY, POSE.present(t), {lanyard:true});
     who("dev2", 300, POSE.nod(t), {dir:-1});
   }},
 { title:"The Identity Dashboard", era:"Zeeve DeepTech", when:"Zeeve DeepTech, 2022", projects:["Phaeton Identity Dashboard"],
   text:"His second project was the Phaeton Identity Dashboard, which handles registration and onboarding on the blockchain. It raised user landings by 121%.",
   draw(t, lt){
     interior("#E3E7EF","#6E7684","#C9CED8");
     wallScreen(40, 290, 520, 190, "Identity Dashboard", (x,y,w,h)=>{
       const k = Math.floor((t*0.8)%4); ["Register","Verify","Approved"].forEach((s,i)=>{ const done = i < k; circ(x+32, y+28+i*48, 15, done?"#2F9E6B":"#E2E6EA"); if (done) txt("✓", x+32, y+29+i*48, 15, "#FFFFFF", 900); txt(s, x+56, y+28+i*48, 16, "#16191E", 700, "left"); });
       const u = Math.min(1, Math.max(0, (lt-1.2)/2.5)); ctx.strokeStyle = "#2F9E6B"; ctx.lineWidth = 5; ctx.beginPath();
       for (let i=0;i<=20*u;i++) ctx.lineTo(x+200 + i*(w-230)/20, y+h-20 - Math.pow(i/20,1.6)*(h-70)); ctx.stroke();
       if (u >= 1){ box(x+w-130, y+12, 112, 36, "#2F9E6B", 9); txt("+121%", x+w-74, y+30, 20, "#FFFFFF", 900); txt("user landings", x+w-74, y+62, 13, "#555D69", 700); } }, "#5B3FB8");
     box(20, GY-110, 56, 110, "#5B3FB8", 6); box(28, GY-102, 40, 102, "#B7A6F2", 4); txt("JOIN", 48, GY-122, 14, "#5B3FB8", 800);
     for (let i=0;i<3;i++){ const u = ((t*0.3 + i/3)%1); ctx.globalAlpha = Math.min(1, (1-u)*3); person({...PEOPLE.dev3, h:60, x: 140 - u*90, y:GY, pose:POSE.walk(t+i), dir:-1, noShadow:true, shirt:["#E0679A","#2F9E6B","#D99A10"][i]}); ctx.globalAlpha = 1; }
     hero("work", 230, GY, POSE.point(t), {lanyard:true});
     who("dev1", 420, POSE.clap(t), {dir:-1});
     who("dev2", 520, POSE.cheer(t+0.4), {dir:-1});
   }},
 { title:"A call from home", era:"Daynil Group, from Bundu", when:"Back home in Bundu, late 2022",
   text:"Then a call came from home in Bundu: the family house was going to be built. He packed his bags and went home to be there for it.",
   draw(t, lt){
     sky("#A9D6F0","#F3F6EC"); sun(470, 300, 30, "#FFF4D0"); clouds(t, 110); hills("#B5CFA0", GY-120, 60, 7); sunTemple(480, GY-120, 0.42, t);
     for (let i=0;i<3;i++){ const x = -120 + i*150; box(x, GY-230, 120, 110, ["#E8D3B0","#D7C2E0","#BFD8C4"][i]); box(x-6, GY-240, 132, 14, "#B5553C", 3); box(x+20, GY-206, 26, 26, "#8BC5DE", 2); }
     ground("#CDB98E","#B09C70"); box(-1200, GY-120, 3200, 120, "#CDB98E");
     for (let i=0;i<4;i++){ box(340 + i*65, GY-70, 10, 70, "#9AA3AD"); line(345 + i*65, GY-70, 345+i*65, GY-100, "#6B7480", 2); } box(330, GY-8, 220, 8, "#B9B3A8");
     for (let r=0;r<4;r++) for (let c=0;c<4-r;c++) box(250 + c*22 + r*11, GY - 12 - r*11, 20, 10, "#C9673F", 1);
     who("worker", 500, POSE.bend(t), {dir:-1, item:(x,y)=>line(x,y,x-10,y+24,"#6B4B32",3)});
     who("mom", 240, POSE.wave(t), {dir:-1});
     hero("young", 120, GY, POSE.hold(t), {item:(x,y)=>{ box(x-2,y-22,16,26,"#20242B",4); box(x+1,y-18,10,18,"#2F9E6B",2); }});
     suitcase(70, GY-36);
     if (lt > 1.3){ box(40, GY-268, 300, 70, "#FFFFFF", 14); txt("“We’re building the house.", 190, GY-243, 16, "#16191E", 700); txt("Come home?”", 190, GY-218, 16, "#16191E", 700); }
   }},
 { title:"BioFlow, with Celltrio", era:"Daynil Group, from Bundu", when:"Daynil Group, working from home in Bundu, from November 2022", projects:["BioFlow"],
   text:"He took a work-from-home role at Daynil Group, writing code on the verandah while the walls went up. His main project was BioFlow, software for a bio lab automation robot, built for Celltrio, a South Korean client.",
   draw(t, lt){
     sky("#A9D6F0","#F3F6EC"); sun(520, 300, 26, "#FFF4D0"); clouds(t, 110); hills("#B5CFA0", GY-60, 60, 7); sunTemple(300, GY-40, 0.36, t); ground("#CDB98E","#B09C70");
     const rows = Math.min(14, 6 + Math.floor(lt*0.8));
     for (let r=0;r<rows;r++) for (let c=0;c<7;c++){ const off = r%2 ? 12 : 0; box(370 + c*26 + off - 6, GY - 14 - r*14, 24, 12, r%3===2?"#B8553F":"#C9673F", 1); }
     ctx.strokeStyle = "#B8915A"; ctx.lineWidth = 4; for (let i=0;i<3;i++){ ctx.beginPath(); ctx.moveTo(360 + i*90, GY); ctx.lineTo(360 + i*90, GY-230); ctx.stroke(); } for (let j=1;j<4;j++){ ctx.beginPath(); ctx.moveTo(352, GY - j*60); ctx.lineTo(560, GY - j*60); ctx.stroke(); }
     const wx = 470 + Math.sin(t*0.6)*70; person({...PEOPLE.worker, x:wx, y:GY, pose:POSE.carry(t), dir: Math.cos(t*0.6)>0?1:-1, onHead:(x,y)=>box(x-18, y-10, 36, 10, "#C9673F", 2)});
     box(-120, GY-250, 400, 14, "#8C6A48"); box(-100, GY-236, 10, 236, "#8C6A48"); box(250, GY-236, 10, 236, "#8C6A48");
     box(30, 300, 210, 150, "#FFFFFF", 10); box(30, 300, 210, 30, "#2F9E6B", 10); box(30, 316, 210, 14, "#2F9E6B"); txt("BioFlow", 135, 316, 17, "#FFFFFF", 800);
     for (let r=0;r<3;r++) for (let c=0;c<8;c++) circ(52 + c*18, 352 + r*18, 6, (r*8+c) <= Math.floor(t*3)%24 ? "#E0679A" : "#E2E6EA");
     const a = Math.sin(t*1.5); ctx.strokeStyle = "#5B6470"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(215, 440); ctx.lineTo(215, 352); ctx.lineTo(120 + a*70, 352); ctx.lineTo(120 + a*70, 372); ctx.stroke();
     line(135, 450, 135, GY-112, "#B0B8C2", 2);
     desk(40, GY-58, 200, "#7A5A3E"); laptop(170, GY-58, 1, 1.2);
     chair(100, GY-35, 1, "#6B4B32"); hero("young", 110, GY, sit(POSE.type(t)));
     if (lt > 1.5) label("안녕하세요!", 170, GY-140, 16);
     who("mom", 290, POSE.give(t), {dir:-1, item:(x,y)=>{ box(x-6,y-8,12,12,"#FFFFFF",3); ctx.globalAlpha = 0.5; circ(x + Math.sin(t*3)*3, y-14, 3, "#DDD"); ctx.globalAlpha = 1; }});
   }},
 { title:"On the bench, working on himself", era:"Daynil Group, from Bundu", when:"Daynil Group, Bundu, 2024", projects:["Gati","Simplify Captcha"],
   text:"When BioFlow wrapped up, he had time on the bench. He spent it working on himself: learning, practising, and starting his own open source projects, Gati and Simplify Captcha.",
   draw(t, lt){
     sky("#F0A868","#FBE3B4"); sun(470, 310, 34, "#FFE2A0"); hills("#C9A27F", GY-40, 50, 8); ground("#B9A57E","#9E8A64");
     box(-140, GY-260, 560, 260, "#F1E3C6"); ctx.fillStyle = "#B5553C"; ctx.beginPath(); ctx.moveTo(-160, GY-256); ctx.lineTo(140, GY-330); ctx.lineTo(440, GY-256); ctx.fill();
     box(330, GY-110, 46, 110, "#7A4B32", 3);
     box(20, GY-230, 80, 66, "#FFE7A3", 3); person({...PEOPLE.mom, x:58, y:GY-166, h:76, pose:POSE.wave(t), dir:1, noShadow:true}); ctx.strokeStyle = "#F2EEE6"; ctx.lineWidth = 6; ctx.strokeRect(20, GY-230, 80, 66);
     box(140, GY-236, 170, 110, "#0F1724", 8); txt("$ npm publish gati", 152, GY-216, 13, "#8BE0A4", 700, "left", "monospace"); codeScreen(150, GY-200, 150, 64, t, 9);
     [470, 520].forEach(x=>{ box(x-14, GY-28, 28, 28, "#B5553C", 3); circ(x, GY-40, 16, "#5CB85C"); circ(x-9, GY-50, 10, "#6BC56B"); });
     desk(100, GY-58, 190, "#7A5A3E"); laptop(230, GY-58, 1, 1.15);
     box(116, GY-72, 54, 10, "#3C6FB8", 2); box(120, GY-82, 48, 10, "#E0574A", 2); box(114, GY-92, 56, 10, "#2F9E6B", 2);
     chair(150, GY-35, 1, "#6B4B32"); hero("young", 160, GY, sit(POSE.type(t)));
     ctx.fillStyle = "#3A3A3A"; ctx.beginPath(); ctx.ellipse(60, GY-8, 26, 10, 0, 0, 7); ctx.fill(); circ(38, GY-14, 8, "#3A3A3A"); ctx.beginPath(); ctx.moveTo(33, GY-20); ctx.lineTo(36, GY-28); ctx.lineTo(39, GY-21); ctx.fill();
   }},
 { title:"CashBook goes live", era:"Daynil Group, from Bundu", when:"Daynil Group, Bundu, 2024", projects:["My Cash Book"],
   text:"Then came CashBook, a fintech app for accounting and GST. He took it all the way to Google Play, where it passed 1,000 downloads.",
   draw(t, lt){
     sky("#9FD0EE","#F2F7EE"); sun(80, 300, 28, "#FFF4D0"); clouds(t, 110); hills("#B5CFA0", GY-60, 60, 9); sunTemple(330, GY-50, 0.4, t); ground("#C9B98E","#B09C70");
     box(-200, GY-260, 360, 260, "#F1E3C6"); ctx.fillStyle = "#B5553C"; ctx.beginPath(); ctx.moveTo(-220, GY-256); ctx.lineTo(-20, GY-330); ctx.lineTo(180, GY-256); ctx.fill(); box(60, GY-110, 46, 110, "#7A4B32", 3);
     who("mom", 180, POSE.clap(t), {dir:1});
     hero("young", 280, GY, POSE.cheer(t));
     const u = Math.min(1, Math.max(0, (lt-1.2)/0.6)), px = 460, py = GY-24 - u*16;
     ctx.globalAlpha = u; phoneDev(px, py, 150, 290, (x,y,w,h)=>{ box(x,y,w,40,"#2F9E6B"); txt("CashBook", x+w/2, y+20, 17, "#FFFFFF", 800);
       [["Sales","+₹12,400","#2F9E6B"],["Rent","−₹8,000","#C0392B"],["GST","₹1,860","#3C6FB8"]].forEach(([a,b,c],i)=>{ box(x+8, y+52+i*42, w-16, 34, "#F1F5F2", 6); txt(a, x+16, y+69+i*42, 14, "#16191E", 700, "left"); txt(b, x+w-14, y+69+i*42, 14, c, 800, "right"); });
       const dl = Math.min(1000, Math.floor(Math.max(0, lt-1.8)*450)); box(x+8, y+h-52, w-16, 42, "#16191E", 8); txt(dl >= 1000 ? "1,000+ downloads" : dl+" downloads", x+w/2, y+h-31, 14, "#F4C20D", 800); });
     ctx.globalAlpha = 1;
     if (lt > 1.6){ label("Live on Google Play", 460, GY-340, 16, "#2F9E6B", "#FFFFFF"); }
     if (lt > 3) confetti(t, 26, [150, 600]);
   }},
 { title:"Leading in Ranchi", era:"Csharptek, Ranchi", when:"Csharptek, Ranchi, from February 2025", projects:["Lets Partii","Invest Luxury","Connect MyTown","Amalgamate"],
   text:"In February 2025 he joined Csharptek in Ranchi and stepped into leadership: meeting clients, turning their needs into specifications, designing the architecture and leading the team on platforms like Lets Partii and Invest Luxury.",
   draw(t, lt){
     interior("#E6E9E4","#7D8678","#CDD2C8");
     windowView(330, 280, 250, 210, ()=>{ sky("#8CC7EA","#E9F4F5"); clouds(t, 310); hills("#93A876", 490, 40, 9, 0.02); pahari(455, 490, 0.62, t); city(61, 494, 20, 46, "#C9C0B0", 0, 330, 590); });
     box(20, 290, 290, 170, "#FFFFFF", 10); ctx.strokeStyle = "#C9CED8"; ctx.lineWidth = 6; ctx.strokeRect(20, 290, 290, 170);
     [["Discovery","#E0679A"],["Specs","#D99A10"],["Architecture","#3C6FB8"],["Team","#2F9E6B"]].forEach(([l,c],i)=>{ const x = 40 + (i%2)*140, y = 310 + Math.floor(i/2)*72, on = Math.floor(lt*0.9) % 5 > i; box(x, y, 120, 50, on?c:"#E9EDF2", 10); txt(l, x+60, y+25, 15, on?"#FFFFFF":"#555D69", 800); });
     line(160, 335, 180, 335, "#9AA3AD", 3); line(160, 407, 180, 407, "#9AA3AD", 3); line(100, 360, 100, 382, "#9AA3AD", 3);
     hero("pro", 90, GY, POSE.point(t));
     desk(250, GY-56, 190, "#5B6470"); stool(330, GY-32, "#3A4656"); who("dev1", 330, sit(POSE.type(t)), {dir:-1, h:136}); laptop(285, GY-56, -1, 1);
     monitor(410, GY-60, 70, 46, (x,y,w,h)=>{ box(x,y,w,h,"#2E3A4A"); circ(x+w/2, y+h/2-3, 9, "#C08A62"); box(x+w/2-11, y+h/2+6, 22, 10, "#3C6FB8", 4); }, "#5B6470");
     who("dev2", 520, POSE.nod(t), {dir:-1});
   }},
 { title:"Apps for healthcare", era:"Csharptek, Ranchi", when:"Csharptek, Ranchi, 2025", projects:["MyMDCard","Companion Scribe AI","Charting Hero"],
   text:"Healthcare became a big part of the work: MyMDCard, which lets EMTs and doctors read critical medical information from an NFC tag, and AI clinical documentation apps that he moved from iOS to Android.",
   draw(t, lt){
     interior("#EAF3F4","#A9B9BC","#D3E2E4");
     windowView(20, 290, 190, 180, ()=>{ sky("#8CC7EA","#E9F4F5"); hills("#7FA86E", 470, 30, 2, 0.02); waterfall(115, 472, 1.0, t); });
     box(240, 300, 46, 46, "#E0574A", 9); box(258, 308, 10, 30, "#FFFFFF"); box(248, 318, 30, 10, "#FFFFFF");
     if (lt > 2) ["Symptoms","Diagnosis","Next steps"].forEach((s,i)=>{ const a = Math.min(1,(lt-2-i*0.4)/0.4); if (a<=0) return; ctx.globalAlpha = a; box(400, 296+i*48, 170, 38, "#FFFFFF", 10); box(412, 309+i*48, 12, 12, ["#7E6BE0","#E0679A","#2F9E6B"][i], 3); txt(s, 434, 315+i*48, 15, "#16191E", 700, "left"); ctx.globalAlpha = 1; });
     box(330, GY-62, 170, 16, "#DCE7EA", 6); box(340, GY-46, 8, 46, "#9AA3AD"); box(484, GY-46, 8, 46, "#9AA3AD");
     who("patient", 440, sit(POSE.stand(t)), {dir:-1, y:GY-26}); box(410, GY-112, 20, 13, "#F4C20D", 3);
     who("emt", 340, POSE.give(t), {dir:1, item:(x,y)=>box(x-2,y-14,14,22,"#20242B",3)}); if (lt > 1.6) ripple(420, GY-106, t, "#2C7BE5");
     who("doctor", 555, POSE.hold(t), {dir:-1, item:(x,y)=>box(x-24,y-14,28,20,"#20242B",3)});
     hero("pro", 140, GY, POSE.hold(t), {item:(x,y)=>{ phoneDev(x-8, y+10, 24, 44, (a,b,w,h)=>box(a,b,w,h,"#F3F1EA"), "#C9CED8"); phoneDev(x+24, y+10, 24, 44, (a,b,w,h)=>box(a,b,w,h,"#DFF3E6"), "#20242B"); }});
     label("iOS → Android", 150, GY-190, 15);
   }},
 { title:"DevOps for 20+ services", era:"Csharptek, Ranchi", when:"Csharptek, Ranchi, 2025 to early 2026", projects:["HERD","Trunking Recorder","Flowmina","Kahiye","Utho CDK"],
   text:"He also owned DevOps for more than 20 services: containers, CI/CD pipelines, preview environments and runbooks. And he built the entire backend of Trunking Recorder, a radio monitoring platform.",
   draw(t, lt){
     interior("#222B36","#323C48","#2B3542");
     windowView(370, 280, 210, 200, ()=>{ sky("#4C4A7A","#E88A62"); hills("#5B4F5E", 480, 50, 4, 0.02); for (let i=0;i<5;i++) circ(400 + i*40, 462 - (i%2)*10, 14, "#4A4250");
       line(500, 480, 500, 330, "#B9C0C9", 3); line(490, 480, 500, 330, "#B9C0C9", 1.5); line(510, 480, 500, 330, "#B9C0C9", 1.5); circ(500, 328, 4, "#E0574A");
       for (let k=0;k<3;k++){ const p = ((t*0.7 + k/3)%1); ctx.strokeStyle = `rgba(255,255,255,${1-p})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(500, 328, 10+p*40, -0.9, 0.9); ctx.stroke(); ctx.beginPath(); ctx.arc(500, 328, 10+p*40, Math.PI-0.9, Math.PI+0.9); ctx.stroke(); } });
     const n = Math.min(20, Math.floor(lt*5)); for (let i=0;i<n;i++){ const c = i%5, r = Math.floor(i/5); box(30 + c*40, 380 - r*26, 34, 22, ["#2C7BE5","#2F9E6B","#E07A2C","#7E6BE0"][i%4], 3); }
     label(`${n}${n>=20?"+":""} services`, 300, 350, 16, "#F4C20D", "#16191E");
     box(20, 440, 330, 16, "#3A4552", 8);
     ["Build","Test","Deploy"].forEach((s,i)=>{ const x = 70 + i*115; box(x-36, 412, 72, 44, "#2B3542", 6); txt(s, x, 426, 14, "#F4C20D", 800); circ(x, 445, 6, Math.floor(t*1.5)%3===i?"#2F9E6B":"#55606E"); });
     for (let k=0;k<5;k++){ const u = ((t*0.25 + k/5)%1), x = 20 + u*330; box(x-11, 466, 22, 16, ["#2C7BE5","#2F9E6B","#E07A2C"][k%3], 3); }
     desk(140, GY-56, 260, "#4A5563"); monitor(250, GY-60, 90, 54, (x,y,w,h)=>codeScreen(x,y,w,h,t,5)); monitor(350, GY-60, 90, 54, (x,y,w,h)=>{ box(x,y,w,h,"#101A12"); for (let i=0;i<5;i++) txt("✓ deploy", x+6, y+8+i*10, 8, "#8BE0A4", 700, "left", "monospace"); });
     chair(170, GY-35, 1); hero("pro", 178, GY, sit(POSE.type(t)), {jacket:null});
     who("dev3", 520, POSE.nod(t), {dir:-1});
   }},
 { title:"Gurugram, day one", era:"examday.ai, Gurugram", when:"examday.ai (Bolimart Pvt Ltd), Gurugram, February 2026",
   text:"In February 2026 he joined examday.ai (Bolimart Pvt Ltd) in Gurugram as a founding engineer. There was no app yet: just a whiteboard, a small team and a lot to build.",
   draw(t, lt){
     interior("#E9EBEF","#9EA4AE","#D3D7DE");
     windowView(20, 280, 560, 150, ()=>{ sky("#9BC8EC","#EAF3FA"); glassCity(71, 430, 0, 600); rapidMetro(390, t); });
     box(190, 440, 270, 120, "#FFFFFF", 8); ctx.strokeStyle = "#C9CED8"; ctx.lineWidth = 5; ctx.strokeRect(190, 440, 270, 120); box(210, 560, 6, 80, "#9AA3AD"); box(434, 560, 6, 80, "#9AA3AD");
     const d = Math.min(1, Math.max(0, (lt-1.3)/2.5)); txt("0 → 1", 245, 470, 24, "#16191E", 900, "center", 'Archivo, "Arial Narrow", sans-serif');
     ctx.strokeStyle = "#2C3440"; ctx.lineWidth = 2.5; [[320,456],[372,456],[424,456]].forEach(([x,y],i)=>{ if (d > i/3){ rr(x-18, y, 36, 64, 6); ctx.stroke(); line(x-10, y+14, x+10, y+14, "#2C3440", 2); line(x-10, y+26, x+4, y+26, "#2C3440", 2); } });
     if (d > 0.9) txt("Android  iOS  Web", 372, 540, 13, "#555D69", 700);
     hero("pro", 150, GY, POSE.write(t), {jacket:null});
     who("dev2", 500, POSE.nod(t), {dir:-1});
     who("friendF", 570, POSE.hold(t), {dir:-1, item:(x,y)=>box(x-20,y-12,22,16,"#F4C20D",3)});
   }},
 { title:"Live on Android, iOS and the web", era:"examday.ai, Gurugram", when:"examday.ai, Gurugram, 2026", projects:["examday.ai app","Face Smash","astory.fun"],
   text:"He built the examday.ai app and launched it on Android, iOS and the web. On the side, he keeps building his own products: Face Smash and astory.fun.",
   draw(t, lt){
     interior("#1E2433","#3A4252","#2A3142");
     windowView(-60, 280, 720, 170, ()=>{ sky("#20284D","#E07C62"); glassCity(44, 450, -60, 660, true); rapidMetro(410, t); });
     label("examday.ai", 300, 490, 24, "#F4C20D", "#16191E");
     const dev = (x, kind, i)=>{ const u = Math.min(1, Math.max(0, (lt - 1.3 - i*0.3)/0.5)); if (!u) return; ctx.globalAlpha = u;
       const scr = (x0,y0,w,h)=>{ box(x0,y0,w,h,"#FFFFFF"); box(x0,y0,w,h*0.14,"#16191E"); txt("examday", x0+w/2, y0+h*0.07, Math.max(9,w*0.11), "#F4C20D", 800); box(x0+w*0.08, y0+h*0.2, w*0.84, h*0.2, "#F2F4F7", 4); [0,1,2].forEach(k=>box(x0+w*0.08, y0+h*0.46+k*h*0.15, w*0.84, h*0.11, k===Math.floor(t)%3?"#2F9E6B":"#E6E9EE", 4)); };
       if (kind==="web"){ box(x-70, GY-140, 140, 90, "#2B313A", 6); ctx.save(); ctx.beginPath(); ctx.rect(x-64, GY-134, 128, 78); ctx.clip(); scr(x-64, GY-134, 128, 78); ctx.restore(); box(x-84, GY-50, 168, 10, "#5B6470", 4); }
       else phoneDev(x, GY-40, 58, 112, scr, kind==="ios"?"#C9CED8":"#20242B");
       label(kind==="web"?"Web":kind==="ios"?"iOS":"Android", x, GY-18, 13, "#2F9E6B", "#FFFFFF"); ctx.globalAlpha = 1; };
     dev(300, "android", 0); dev(380, "ios", 1); dev(505, "web", 2);
     if (lt > 2.4) confetti(t, 36, [0, 600]);
     hero("pro", 180, GY, POSE.cheer(t));
     who("dev1", 70, POSE.clap(t), {dir:1});
   }},
 { title:"MoTA and the testing lab", era:"examday.ai, Gurugram", when:"examday.ai, Gurugram, 2026", projects:["MoTA","ExamDay internal tools"],
   text:"He also built the team’s tooling. MoTA turns a desk of Android phones into a local device farm for performance optimisation, end-to-end, regression and stress testing, and bug hunting, and it’s published on the VS Code Marketplace. Alongside it he set up MCP servers, VS Code extensions and internal tools for examday.ai.",
   draw(t, lt){
     interior("#E7EAF0","#9AA3AE","#D3D8E0");
     // the device farm: two shelves of phones running tests
     const tests = ["Perf","E2E","Regress","Stress"], bugPhone = Math.floor(t/2.5) % 12, bugOn = (t % 2.5) > 1.2;
     [372, 456].forEach(sy=>box(28, sy, 544, 9, "#7A5A3E", 3)); box(32, 290, 8, 175, "#6B4B32"); box(560, 290, 8, 175, "#6B4B32");
     for (let i=0;i<12;i++){ const px = 52 + (i%6)*86, py = i < 6 ? 372 : 456, bug = i === bugPhone && bugOn, prog = (t*0.3 + i*0.17) % 1;
       box(px, py-72, 46, 72, "#1B1F26", 8); box(px+4, py-64, 38, 56, bug ? "#FDE2DE" : "#FFFFFF", 4);
       box(px+4, py-64, 38, 11, bug ? "#E0574A" : KIND_COLOR.Tools, 4); txt(tests[i%4], px+23, py-58, 7, "#FFFFFF", 800);
       box(px+9, py-44, 28, 5, "#E2E6EA", 3); box(px+9, py-44, 28*prog, 5, bug ? "#E0574A" : "#2F9E6B", 3);
       if (bug){ circ(px+23, py-24, 7, "#E0574A"); line(px+17, py-28, px+29, py-20, "#FFFFFF", 1.5); line(px+17, py-20, px+29, py-28, "#FFFFFF", 1.5); }
       else { circ(px+23, py-24, 6, prog > 0.85 ? "#2F9E6B" : "#C9CED8"); if (prog > 0.85) txt("✓", px+23, py-24, 8, "#FFFFFF", 800); }
       line(px+23, py, px+23, py+7, "#3A424D", 2); }
     // the desk, with MoTA open in VS Code
     desk(150, GY-56, 410, "#5B6470");
     monitor(410, GY-60, 230, 116, (x,y,w,h)=>{ box(x,y,w,h,"#1E1E1E"); box(x,y,18,h,"#2C2C2C"); for (let i=0;i<4;i++) box(x+5, y+8+i*18, 8, 8, i===1?KIND_COLOR.Tools:"#858585", 2);
       box(x+18, y, 58, h, "#252526"); txt("MOTA DEVICES", x+22, y+8, 6, "#BBBBBB", 800, "left");
       for (let i=0;i<7;i++){ box(x+22, y+17+i*12, 6, 6, i===bugPhone%7 && bugOn ? "#E0574A" : "#2F9E6B", 2); box(x+32, y+18+i*12, 38, 4, "#4A4A4A", 2); }
       ["Perf","E2E","Regr","Stress"].forEach((tb,k)=>{ const on = Math.floor(t*0.6)%4 === k; box(x+80+k*36, y+4, 33, 13, on?KIND_COLOR.Tools:"#333", 3); txt(tb, x+96+k*36, y+10.5, 7, "#FFFFFF", 700); });
       txt("CPU", x+82, y+26, 7, "#BBBBBB", 700, "left"); ctx.strokeStyle = "#4EC9B0"; ctx.lineWidth = 1.5; ctx.beginPath(); for (let i=0;i<=26;i++) ctx.lineTo(x+82 + i*5, y+62 - (Math.sin(i*0.6 + t*2)*0.35+0.5)*28); ctx.stroke();
       txt(`Bugs found: ${3 + Math.floor(lt/2.5)}`, x+82, y+74, 8, "#F4C20D", 800, "left"); txt("E2E 42/42 passed", x+82, y+86, 8, "#4EC9B0", 800, "left");
       box(x+156, y+68, 66, 22, "#3A2E5C", 4); txt("MCP ● live", x+189, y+79, 7, "#D9CCFF", 800);
       box(x+18, y+h-14, w-18, 14, "#007ACC"); txt("Published on the VS Code Marketplace", x+18+(w-18)/2, y+h-7, 7, "#FFFFFF", 800); }, "#2B313A");
     chair(200, GY-35, 1); hero("pro", 208, GY, sit(POSE.type(t)), {jacket:null});
     who("dev2", 70, POSE.hold(t), {dir:1, item:(x,y)=>box(x-2,y-18,14,24,"#20242B",3)});
   }},
 { title:"What’s next?", era:"What’s next", when:"Now", end:true,
   text:"The boy who loved building things is still building. If you’re hiring or have a project in mind, Krishna would like to hear about it.",
   draw(t, lt){
     sky("#7FA9D6","#FFD9A8"); sun(420, 430, 44, "#FFE6B0"); clouds(t, 160); hills("#A9A4B8", GY-50, 80, 10); hills("#8DB874", GY, 30, 11); ground("#8DB874","#7AA563");
     ctx.fillStyle = "#E8D8B5"; ctx.beginPath(); ctx.moveTo(60, GY+80); ctx.lineTo(400, GY+2); ctx.lineTo(440, GY+2); ctx.lineTo(260, GY+80); ctx.fill();
     const gl = ctx.createRadialGradient(440, GY-100, 10, 440, GY-100, 220); gl.addColorStop(0,"rgba(255,220,140,.55)"); gl.addColorStop(1,"rgba(255,220,140,0)"); ctx.fillStyle = gl; ctx.fillRect(220, GY-320, 440, 340);
     box(370, GY-200, 140, 200, "#5B4636", 6); const g = ctx.createLinearGradient(380, 0, 500, 0); g.addColorStop(0,"#FFE7A3"); g.addColorStop(1,"#FFC861"); box(382, GY-188, 116, 188, g, 3);
     sign("YOUR TEAM?", 440, GY-232, 26, "#F4C20D", "#16191E");
     person({...PEOPLE.dev1, x:420, y:GY, h:118, pose:POSE.wave(t), dir:-1, noShadow:true});
     person({...PEOPLE.dev2, x:465, y:GY, h:124, pose:POSE.stand(t), dir:-1, noShadow:true});
     for (let i=0;i<4;i++){ const x = ((t*30 + i*160) % 800) - 100, y = 330 + i*18 + Math.sin(t*3+i)*6; ctx.strokeStyle = "#3B4656"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x-8, y-4); ctx.quadraticCurveTo(x-4, y-8 + Math.sin(t*10+i)*3, x, y); ctx.quadraticCurveTo(x+4, y-8 + Math.sin(t*10+i)*3, x+8, y-4); ctx.stroke(); }
     hero("pro", 220, GY, POSE.wave(t));
   }},
];
CH.forEach(c=>{ if (!c.look) c.look = "pro"; });
const ERAS = []; CH.forEach((c,i)=>{ const last = ERAS[ERAS.length-1]; if (!last || last.name !== c.era) ERAS.push({name:c.era, start:i, end:i}); else last.end = i; });

/* ---------- one continuous traveller between chapters ---------- */
let heroHidden = false, lastHero = null, entering = false;
const heroCache = {};
function hero(look, x, y, pose, extra={}){
  lastHero = {x, look, extra};
  if (heroHidden) return {hand:[x, y-70], head:[x, y-140], top:y-160};
  const e = (!entering || reduce) ? 1 : Math.min(1, heroLT/1.2);
  const o = {...LOOKS[look], ...extra, y, dir: extra.dir||1};
  if (e < 1){ o.x = -110 + (x + 110)*ease(e); o.y = GY; o.pose = POSE.walk(timeNow); o.dir = 1; delete o.item; }
  else { o.x = x; o.pose = pose; }
  return person(o);
}
function heroOf(i){
  if (!heroCache[i]){ ctx.save(); ctx.beginPath(); ctx.rect(0,0,0,0); ctx.clip(); heroHidden = true; try { CH[i].draw(timeNow, 9); } finally { heroHidden = false; ctx.restore(); } heroCache[i] = {...lastHero}; }
  return heroCache[i];
}

/* ---------- project cards: wrapped names, each shown once ---------- */
function wrapLines(s, maxW, font){ ctx.font = font; const words = s.split(" "), lines = []; let line = "";
  for (const w of words){ const tryL = line ? line + " " + w : w; if (ctx.measureText(tryL).width <= maxW) line = tryL; else { if (line) lines.push(line); line = w; } }
  if (line) lines.push(line);
  if (lines.length > 2){ let l2 = lines.slice(1).join(" "); while (ctx.measureText(l2 + "…").width > maxW && l2.length > 3) l2 = l2.slice(0,-1); return [lines[0], l2.trimEnd() + "…"]; }
  return lines.map(l=>{ let x = l; while (ctx.measureText(x).width > maxW && x.length > 3) x = x.slice(0,-1); return x === l ? l : x + "…"; });
}
function projectCard(p, cx, cy, a, t){
  ctx.save(); ctx.globalAlpha = a; ctx.translate(cx, cy - 30); ctx.scale(0.86, 0.86); ctx.translate(-cx, -(cy - 30)); frameFor(p, cx, cy, t);
  const font = "800 17px Inter, sans-serif", lines = wrapLines(p.name, 210, font);
  ctx.font = font; const lw = Math.min(240, Math.max(...lines.map(l=>ctx.measureText(l).width), 70) + 28);
  const top = cy + 86, lh = 22, bh = 16 + lines.length*lh + 20;
  box(cx-lw/2, top, lw, bh, "#FFFFFF", 12);
  lines.forEach((l,i)=>txt(l, cx, top + 18 + i*lh, 17, "#16191E", 800));
  const ky = top + 18 + lines.length*lh + 2; ctx.font = "700 13px Inter, sans-serif"; const kw = ctx.measureText(p.kind).width + 16;
  circ(cx - kw/2, ky, 5, KIND_COLOR[p.kind]); txt(p.kind, cx - kw/2 + 10, ky, 13, "#555D69", 700, "left");
  ctx.restore();
}
function floatCards(c, lt, t){
  const list = (c.projects||[]).map(n=>PROJECTS.find(p=>p.name===n)).filter(Boolean); if (!list.length) return;
  const start = 0.4, n = list.length, spacing = 1.3, life = n > 1 ? spacing*2 - 0.2 : 4.8;
  const slots = n > 1 ? [[155,138],[445,138]] : [[300,138]];
  const age0 = lt - start; if (age0 < 0) return;
  const g = Math.floor(age0/spacing);
  let endFade = 1; if (auto && !reduce){ const left = autoDur(cur) - lt; endFade = Math.max(0, Math.min(1, (left - 0.3)/0.5)); }
  for (const k of [g-1, g]){ if (k < 0 || k >= n) continue; const age = age0 - k*spacing; if (age > life || age < 0) continue;
    const inA = Math.min(1, age/0.4), outA = Math.min(1, (life - age)/0.4), a = Math.min(inA, outA)*endFade; if (a <= 0) continue;
    const [sx2, sy] = slots[k % slots.length];
    projectCard(list[k], sx2, sy + (1-inA)*24 - (1-outA)*16 + Math.sin(t*1.4+k)*5, a, t); }
}
function autoDur(i){ const n = (CH[i].projects||[]).length, k = (SKILLS_LEARNED[i]||[]).length; return Math.max(6, 1.0 + n*1.3 + 1.0, 1.0 + k*1.4 + 1.2); }

/* ---------- skills learned, floating up from Krishna ---------- */
const SKILLS_LEARNED = {2:["HTML","CSS","PHP","Visual Basic","Phone repair","Electronics"], 3:["Programming","Teaching"], 4:["Robotics"], 5:["ESP32","Web services"], 6:["Arduino","Machine learning"], 7:["React Native","Freelancing","AI tools"],
  8:["React","TypeScript"], 9:["NFC","Maps & location"], 10:["Next.js","MQTT","Docker","GitHub Copilot"], 11:["Web3","MetaMask"], 14:["Material UI","Remote work"], 15:["Node.js","Kubernetes","Open source"],
  16:["Expo","Play Store releases"], 17:["System design","Client leadership"], 18:["AI integration","iOS to Android","Codex"], 19:["CI/CD","DevOps"], 20:["Building from zero"], 21:["Claude Code"], 22:["Device farms","Maestro E2E","MCP servers","VS Code extensions"]};
function skillBadges(i, lt, t){
  // One "Learned …" toast at a time, in a band across the top of the stage that nothing else uses.
  const list = SKILLS_LEARNED[i]; if (!list) return;
  list.forEach((sk, k)=>{ const age = lt - 1.0 - k*1.4; if (age < 0 || age > 1.3) return;
    const inU = Math.min(1, age/0.25), outU = Math.min(1, (1.3 - age)/0.25), y = 26 - (1 - Math.min(inU, outU))*40, x = 300;
    ctx.save(); ctx.globalAlpha = Math.min(inU, outU);
    ctx.font = "600 17px Inter, sans-serif"; const lw = ctx.measureText("Learned ").width; ctx.font = "800 17px Inter, sans-serif"; const tw = ctx.measureText(sk).width, w = tw + lw + 54;
    box(x - w/2 + 3, y - 18 + 5, w, 36, "rgba(10,16,24,.22)", 18); box(x - w/2, y - 18, w, 36, "#16191E", 18);
    sparkle(x - w/2 + 20, y, 8, "#F4C20D"); txt("Learned", x - w/2 + 34, y + 1, 17, "#C9D0D8", 600, "left"); txt(sk, x - w/2 + 34 + lw, y + 1, 17, "#F4C20D", 800, "left");
    ctx.restore(); });
}

/* ---------- vehicles ---------- */
function miniHead(x, y, r, look){ const L = LOOKS[look] || LOOKS.pro;
  box(x-r*0.45, y+r*0.7, r*0.9, r*0.8, L.jacket || L.shirt, 3);
  circ(x, y, r, L.skin); circ(x - r*0.15, y + r*0.05, r*0.16, sh(L.skin,0.88));
  ctx.fillStyle = L.hair; ctx.beginPath(); ctx.arc(x, y, r*1.05, Math.PI*0.92, Math.PI*2.08); ctx.fill(); ctx.beginPath(); ctx.ellipse(x - r*0.45, y - r*0.05, r*0.62, r*0.82, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(x + r*0.35, y - r*0.72, r*0.55, r*0.28, 0.35, 0, 7); ctx.fill();
  circ(x + r*0.2, y - r*0.05, r*0.1, "#1C1715"); circ(x + r*0.62, y - r*0.05, r*0.1, "#1C1715");
  ctx.strokeStyle = "#5A2A22"; ctx.lineWidth = Math.max(1, r*0.1); ctx.beginPath(); ctx.arc(x + r*0.42, y + r*0.22, r*0.22, 0.2*Math.PI, 0.8*Math.PI); ctx.stroke(); }
function glass(x, y, w, h, r){ ctx.fillStyle = "rgba(255,255,255,.28)"; ctx.beginPath(); ctx.moveTo(x+w*0.15, y+h); ctx.lineTo(x+w*0.55, y); ctx.lineTo(x+w*0.75, y); ctx.lineTo(x+w*0.35, y+h); ctx.fill(); }
const VEHICLES = {"3-4":"bus", "7-8":"bus", "10-11":"train", "12-13":"train", "19-20":"plane"};
function bus(x, y, dir, t, moving, rider){ ctx.save(); ctx.translate(x, y); ctx.scale(dir, 1);
  const bob = moving ? Math.sin(t*18)*1.5 : 0; ctx.translate(0, bob);
  box(-120, -112, 240, 96, "#2D6CB5", 16); box(-120, -60, 240, 10, "#FFFFFF"); box(-120, -30, 240, 14, "#1F4E8C");
  for (let i=0;i<5;i++) box(-104 + i*38, -100, 30, 32, "#CFE6F7", 4);
  if (rider){ box(6, -104, 38, 40, "#CFE6F7", 5); ctx.save(); rr(6, -104, 38, 40, 5); ctx.clip(); miniHead(25, -84 + (moving ? Math.sin(t*18)*1 : 0), 14, rider); ctx.restore(); glass(6, -104, 38, 40); }
  box(84, -100, 30, 74, "#9FC3E3", 4); box(108, -104, 12, 30, "#F4C20D", 3); circ(112, -36, 5, "#FFF4C8");
  box(-96, -128, 160, 16, "#DCE6EE", 4); txt("EXPRESS", -16, -120, 11, "#1F4E8C", 900);
  [-78, 70].forEach(wx=>{ circ(wx, -14, 16, "#1E2228"); circ(wx, -14, 7, "#8F98A3"); line(wx, -14, wx + Math.cos(t*12)*7, -14 + Math.sin(t*12)*7, "#1E2228", 2); });
  ctx.restore(); }
function train(x, y, dir, t, moving, rider){ ctx.save(); ctx.translate(x, y); ctx.scale(dir, 1);
  box(-260, -6, 520, 6, "#7A7F86"); for (let k=-250; k<260; k+=24) box(k, 0, 12, 5, "#5B4636");
  const coach = (cx)=>{ box(cx-90, -96, 180, 82, "#7E2F2F", 12); box(cx-90, -54, 180, 8, "#F4C20D"); for (let i=0;i<5;i++) box(cx-78 + i*32, -86, 24, 24, "#F6E7C8", 3); [-60, 60].forEach(wx=>circ(cx+wx, -12, 11, "#1E2228")); };
  coach(-150); box(-58, -60, 20, 8, "#3A3A3A");
  if (rider){ box(-104, -92, 34, 36, "#F6E7C8", 4); ctx.save(); rr(-104, -92, 34, 36, 4); ctx.clip(); miniHead(-87, -74, 13, rider); ctx.restore(); glass(-104, -92, 34, 36); }
  box(-40, -104, 200, 90, "#24467A", 14); box(110, -104, 54, 90, "#24467A", 22); box(-40, -60, 204, 8, "#F4C20D");
  box(100, -94, 40, 28, "#9CC3E0", 5); box(-20, -94, 30, 28, "#F6E7C8", 3); box(20, -94, 30, 28, "#F6E7C8", 3); circ(160, -40, 6, "#FFF4C8");
  [0, 60, 120].forEach(wx=>circ(wx, -12, 12, "#1E2228"));
  line(20, -104, 40, -136, "#2B2F36", 3); line(40, -136, 60, -136, "#2B2F36", 3);
  if (moving){ for (let k=0;k<3;k++){ const p = ((t*1.2 + k/3)%1); ctx.globalAlpha = 0.35*(1-p); circ(-260 - p*60, -40 - p*20, 8+p*10, "#FFFFFF"); } ctx.globalAlpha = 1; }
  ctx.restore(); }
function plane(x, y, dir, t, tilt, rider){ ctx.save(); ctx.translate(x, y); ctx.scale(dir, 1); ctx.rotate(-tilt);
  ctx.fillStyle = "#F3F5F8"; ctx.beginPath(); ctx.moveTo(-150, -40); ctx.quadraticCurveTo(-150, -70, -110, -70); ctx.lineTo(120, -70); ctx.quadraticCurveTo(170, -66, 170, -48); ctx.quadraticCurveTo(170, -30, 120, -28); ctx.lineTo(-120, -28); ctx.quadraticCurveTo(-150, -28, -150, -40); ctx.fill();
  ctx.fillStyle = "#2C7BE5"; ctx.beginPath(); ctx.moveTo(-140, -70); ctx.lineTo(-170, -124); ctx.lineTo(-130, -124); ctx.lineTo(-96, -70); ctx.fill();
  ctx.fillStyle = "#C9D1DB"; ctx.beginPath(); ctx.moveTo(-20, -44); ctx.lineTo(-70, 4); ctx.lineTo(-40, 4); ctx.lineTo(40, -44); ctx.fill();
  box(-100, -44, 230, 6, "#2C7BE5"); for (let i=0;i<9;i++) if (!(rider && i===5)) circ(-90 + i*24, -56, 5, "#5B7FA8");
  if (rider){ circ(30, -52, 15, "#CFE6F7"); ctx.save(); ctx.beginPath(); ctx.arc(30, -52, 15, 0, 7); ctx.clip(); miniHead(30, -51, 11, rider); ctx.restore(); ctx.strokeStyle = "#9AA3AD"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(30, -52, 15, 0, 7); ctx.stroke(); } ctx.fillStyle = "#2B3A55"; ctx.beginPath(); ctx.moveTo(140, -64); ctx.lineTo(162, -54); ctx.lineTo(140, -50); ctx.fill();
  box(-10, -24, 4, 12, "#55606E"); circ(-8, -10, 6, "#1E2228"); box(110, -26, 4, 10, "#55606E"); circ(112, -12, 5, "#1E2228");
  ctx.restore(); }
function drawVehicle(kind, x, dir, t, moving, q, rider){
  if (kind === "bus") bus(x, GY, dir, t, moving, rider);
  else if (kind === "train") train(x, GY, dir, t, moving, rider);
  else { const alt = Math.sin(Math.PI*Math.min(1, Math.max(0, q)))*330, tilt = Math.cos(Math.PI*Math.min(1, Math.max(0, q)))*0.18*(q>0&&q<1?1:0); plane(x, GY - alt, dir, t, tilt); }
}

/* ---------- stage, slides and autoplay ---------- */
let trans = null, arrivedAt = 0, startTimes = {};
function resize(){
  const r = canvas.getBoundingClientRect(); dpr = Math.min(devicePixelRatio||1, 2);
  W = r.width; H = r.height; canvas.width = Math.round(W*dpr); canvas.height = Math.round(H*dpr);
  K = Math.min(W/VW, H/VH); OY = H - VH*K;
}
addEventListener("resize", ()=>{ if (!story.hidden) resize(); });
// The stage's height depends on the text panel beside or below it, which changes from chapter to
// chapter and settles only after the story opens. Re-measure whenever the canvas's box changes, so
// the drawing is never stretched or squashed to fit a stale size.
if ("ResizeObserver" in window) new ResizeObserver(()=>{ if (!story.hidden) resize(); }).observe(canvas);
function drawScene(i, offX, hide, now){
  ctx.save(); ctx.setTransform(dpr,0,0,dpr,0,0); ctx.beginPath(); ctx.rect(offX, 0, W, H); ctx.clip();
  OX = W/2 - (VW/2)*K + offX;
  ctx.setTransform(dpr*K,0,0,dpr*K,dpr*OX,dpr*OY);
  const lt = reduce ? 9 : now - (startTimes[i] ?? now);
  heroLT = lt; heroHidden = hide;
  CH[i].draw(timeNow, lt);
  heroHidden = false;
  floatCards(CH[i], lt, timeNow);
  if (!hide) skillBadges(i, lt, timeNow);
  ctx.restore();
}
// The traveller is drawn once, in stage coordinates centred on the screen, so it never jumps between slides.
function traveller(look, x, dir, alpha, pose){ if (alpha <= 0) return; ctx.globalAlpha = alpha; person({...LOOKS[look], x, y:GY, dir, pose: pose || POSE.walk(timeNow), noShadow:false}); ctx.globalAlpha = 1; }
function drawTransition(now){
  if (trans.trip) return drawTrip(trans, now);
  const T = trans, p = Math.min(1, (now - T.start)/T.dur), dir = T.dir;
  const slideU = T.vehicle ? Math.min(1, Math.max(0, (p - 0.2)/0.6)) : p, s = ease(slideU);
  drawScene(T.from, -dir*s*W, true, now);
  drawScene(T.to, dir*(1-s)*W, true, now);
  ctx.setTransform(dpr*K,0,0,dpr*K,dpr*(W/2 - (VW/2)*K),dpr*OY);
  const A = heroOf(T.from), B = heroOf(T.to);
  if (!T.vehicle){
    const x = A.x + (B.x - A.x)*s, mix = Math.min(1, Math.max(0, (p - 0.35)/0.3));
    traveller(A.look, x, dir, 1 - mix); traveller(B.look, x, dir, mix);
  } else {
    const D = {bus:99, train:-150, plane:100}[T.vehicle];
    const door0 = A.x + dir*80, door1 = B.x - dir*80, c0 = door0 - dir*D, c1 = door1 - dir*D;
    if (p < 0.2){ // the vehicle pulls in, then he walks to the door and climbs aboard
      const arrive = ease(Math.min(1, p/0.12));
      drawVehicle(T.vehicle, c0 - dir*(1 - arrive)*800, dir, timeNow, arrive < 1, 0);
      const w = Math.min(1, Math.max(0, (p - 0.12)/0.08));
      traveller(A.look, A.x + (door0 - A.x)*w, dir, 1 - Math.max(0, (w - 0.6)/0.4), w > 0 ? null : POSE.stand(timeNow));
    } else if (p < 0.8){ const q = (p - 0.2)/0.6; drawVehicle(T.vehicle, c0 + (c1 - c0)*ease(q), dir, timeNow, true, q); }
    else { // he steps off and the vehicle drives on
      const w = Math.min(1, (p - 0.8)/0.12), leave = Math.max(0, (p - 0.86)/0.14);
      drawVehicle(T.vehicle, c1 + dir*leave*leave*1000, dir, timeNow, leave > 0, 1);
      traveller(B.look, door1 + (B.x - door1)*w, dir, Math.min(1, w/0.3), w >= 1 ? POSE.stand(timeNow) : null);
    }
  }
  if (p >= 1){ trans = null; arrivedAt = now; }
}
function frame(ms){
  rafId = requestAnimationFrame(frame);
  const now = ms/1000; timeNow = reduce ? 6 : now;
  ctx.setTransform(dpr,0,0,dpr,0,0); ctx.clearRect(0,0,W,H);
  if (trans) drawTransition(now); else { drawScene(cur, 0, false, now); if (entering && now - (startTimes[cur]||0) > 1.3) entering = false; }
  if (commitAnim){ const u = Math.min(1, (now - commitAnim.start)/1.2); commitAnim.el.textContent = Math.round(commitAnim.n*(1 - Math.pow(1-u, 3))).toLocaleString("en-IN"); if (u >= 1) commitAnim = null; }
  if (auto && !trans){ const sc = $("storyScroll"), max = sc.scrollHeight - sc.clientHeight; if (max > 4){ const u = Math.min(1, Math.max(0, (now - arrivedAt - 1.5)/Math.max(2, autoDur(cur) - 3.5))); sc.scrollTop = max*u; } }
  const fill = $("nextFill"), bar = $("storyBar");
  if (auto && !trans){ const u = Math.min(1, (now - arrivedAt)/autoDur(cur)); fill.style.width = (u*100)+"%"; bar.style.width = (u*100)+"%";
    if (u >= 1){ if (cur < CH.length-1) go(cur+1); else stopAuto(); } }
  else if (!auto){ fill.style.width = "0%"; bar.style.width = "0%"; }
}

/* ---------- Bundu: the Sun Temple and the school beside it ---------- */
function sunTemple(x, base, s, t){
  const c = "#F3EBDD", d = "#C9B48E", red = "#C2542B";
  box(x-170*s, base-34*s, 340*s, 34*s, "#E3D6BC"); for (let i=0;i<5;i++) box(x-170*s + i*8*s, base-34*s + i*6*s, 4*s, 6*s, d);
  box(x-130*s, base-120*s, 260*s, 86*s, c); for (let i=0;i<4;i++) box(x-130*s, base-110*s + i*20*s, 260*s, 3*s, d);
  for (let i=0;i<6;i++){ const wx = x-110*s + i*44*s, wy = base-52*s; circ(wx, wy, 21*s, c); ctx.strokeStyle = "#8C6A48"; ctx.lineWidth = 3*s; ctx.beginPath(); ctx.arc(wx, wy, 21*s, 0, 7); ctx.stroke();
    ctx.lineWidth = 1.5*s; ctx.beginPath(); for (let k=0;k<8;k++){ const a = k*Math.PI/4; ctx.moveTo(wx, wy); ctx.lineTo(wx + Math.cos(a)*19*s, wy + Math.sin(a)*19*s); } ctx.stroke(); circ(wx, wy, 4*s, "#8C6A48"); }
  ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(x-70*s, base-120*s); ctx.quadraticCurveTo(x-62*s, base-260*s, x-10*s, base-318*s); ctx.lineTo(x+10*s, base-318*s); ctx.quadraticCurveTo(x+62*s, base-260*s, x+70*s, base-120*s); ctx.fill();
  ctx.strokeStyle = d; ctx.lineWidth = 2*s; for (let k=1;k<8;k++){ const yy = base-120*s - k*24*s, hw = 70*s*(1 - Math.pow(k/8.2, 1.6)); ctx.beginPath(); ctx.moveTo(x-hw, yy); ctx.lineTo(x+hw, yy); ctx.stroke(); }
  circ(x, base-326*s, 11*s, "#E0A43A"); line(x, base-336*s, x, base-380*s, "#6B5A4A", 2*s);
  ctx.fillStyle = red; ctx.beginPath(); ctx.moveTo(x+1*s, base-380*s); ctx.lineTo(x+34*s + Math.sin(t*4)*4*s, base-370*s); ctx.lineTo(x+1*s, base-360*s); ctx.fill();
  for (let h=0;h<3;h++){ const hx = x-205*s - h*16*s, hy = base-46*s + h*4*s, step = Math.sin(t*3+h)*2*s;
    ctx.fillStyle = h===1 ? "#E9DFC9" : c; ctx.beginPath(); ctx.ellipse(hx, hy, 30*s, 14*s, 0, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.moveTo(hx-22*s, hy-6*s); ctx.lineTo(hx-34*s, hy-34*s); ctx.lineTo(hx-24*s, hy-38*s); ctx.lineTo(hx-12*s, hy-10*s); ctx.fill();
    ctx.beginPath(); ctx.ellipse(hx-36*s, hy-38*s, 11*s, 6*s, -0.4, 0, 7); ctx.fill();
    [-18, -8, 10, 20].forEach((lx,k)=>box(hx + lx*s, hy + 6*s, 4*s, 26*s + (k%2?step:-step), d, 2*s)); }
  line(x-190*s, base-46*s, x-130*s, base-70*s, "#8C6A48", 2*s);
}
function shishuMandir(x, base, s){
  box(x-150*s, base-150*s, 300*s, 150*s, "#F2D9A6"); box(x-160*s, base-162*s, 320*s, 16*s, "#C2542B", 3*s);
  for (let i=0;i<5;i++) box(x-130*s + i*56*s, base-118*s, 34*s, 40*s, "#8BC5DE", 3*s);
  box(x-24*s, base-66*s, 48*s, 66*s, "#7A4B32", 4*s);
  box(x-150*s, base-228*s, 300*s, 60*s, "#FFF7E6", 6*s); ctx.strokeStyle = "#C2542B"; ctx.lineWidth = 3*s; ctx.strokeRect(x-146*s, base-224*s, 292*s, 52*s);
  txt("SARASWATI SHISHU", x, base-208*s, 17*s, "#C2542B", 900, "center", 'Archivo, "Arial Narrow", sans-serif'); txt("VIDYA MANDIR", x, base-186*s, 17*s, "#C2542B", 900, "center", 'Archivo, "Arial Narrow", sans-serif');
}

/* ---------- journeys between cities: extra travel slides ---------- */
const TRIPS = {
  "3-4":  {v:"bus",   a:"ppk",      b:"siliguri"},
  "7-8":  {v:"bus",   a:"siliguri", b:"kolkata"},
  "10-11":{v:"train", a:"kolkata",  b:"dehradun"},
  "12-13":{v:"train", a:"dehradun", b:"home"},
  "19-20":{v:"plane", a:"ranchi",   b:"gurugram"},
};
const CITY = {ppk:"P.P.K. College", home:"Bundu", siliguri:"Siliguri", kolkata:"Kolkata", dehradun:"Dehradun", ranchi:"Ranchi", gurugram:"Gurugram"};
const STATION = {kolkata:"HOWRAH JN.", dehradun:"DEHRADUN", ranchi:"RANCHI", gurugram:"GURUGRAM"};

function clockTower(x, base, s){ const c = "#E9DCC0";
  ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(x-46*s, base); ctx.lineTo(x-34*s, base-230*s); ctx.lineTo(x+34*s, base-230*s); ctx.lineTo(x+46*s, base); ctx.fill();
  box(x-40*s, base-250*s, 80*s, 24*s, "#D8C7A3", 4*s); ctx.fillStyle = "#B5553C"; ctx.beginPath(); ctx.moveTo(x-40*s, base-250*s); ctx.quadraticCurveTo(x, base-310*s, x+40*s, base-250*s); ctx.fill();
  circ(x, base-196*s, 22*s, "#FFFFFF"); ctx.strokeStyle = "#2B2B2B"; ctx.lineWidth = 2*s; ctx.beginPath(); ctx.arc(x, base-196*s, 22*s, 0, 7); ctx.stroke();
  line(x, base-196*s, x, base-210*s, "#2B2B2B", 2*s); line(x, base-196*s, x+10*s, base-196*s, "#2B2B2B", 2*s);
  for (let i=0;i<4;i++) box(x-22*s+i*12*s, base-150*s, 6*s, 40*s, "rgba(0,0,0,.15)", 3*s);
  box(x-12*s, base-60*s, 24*s, 60*s, "#7A4B32", 10*s); }
function howrahStation(x, base, s){ const c = "#B5553C";
  box(x-180*s, base-120*s, 360*s, 120*s, c); for (let i=0;i<6;i++){ const tx = x-170*s + i*68*s; box(tx, base-170*s, 26*s, 170*s, sh(c,0.9)); box(tx-4*s, base-178*s, 34*s, 10*s, "#E9DCC0"); }
  for (let i=0;i<9;i++) box(x-160*s + i*38*s, base-92*s, 20*s, 40*s, "#E9DCC0", 10*s); }
function paddy(base, c="#7FBF5E"){ for (let r=0;r<5;r++){ ctx.strokeStyle = sh(c, 1 - r*0.04); ctx.lineWidth = 3; ctx.beginPath(); for (let x=-900; x<1500; x+=18) ctx.lineTo(x, base + r*14 + Math.sin(x*0.05+r)*2); ctx.stroke(); } }
function palm(x, y, s, c="#3F7A4A"){ ctx.strokeStyle = "#7A5A3E"; ctx.lineWidth = 6*s; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x+8*s, y-60*s, x+2*s, y-110*s); ctx.stroke(); ctx.fillStyle = c; for (let k=0;k<6;k++){ const a = -Math.PI/2 + (k-2.5)*0.55; ctx.beginPath(); ctx.ellipse(x+2*s+Math.cos(a)*26*s, y-110*s+Math.sin(a)*14*s+10*s, 28*s, 7*s, a, 0, 7); ctx.fill(); } }
function truck(x, y, dir){ ctx.save(); ctx.translate(x, y); ctx.scale(dir, 1); box(-90, -88, 120, 76, "#E07A2C", 8); box(-86, -84, 112, 16, "#F4C20D"); box(-86, -64, 112, 10, "#2F9E6B"); txt("HORN OK PLEASE", -30, -40, 11, "#FFFFFF", 900);
  box(34, -76, 56, 64, "#2D6CB5", 10); box(44, -70, 36, 24, "#CFE6F7", 4); [-60, 0, 66].forEach(wx=>circ(wx, -10, 13, "#1E2228")); ctx.restore(); }
function greenSign(x, y, l1, l2){ box(x-3, y+56, 6, GY-y-56, "#6B7480"); ctx.font = "800 24px Inter, sans-serif"; const w = Math.max(200, ctx.measureText(l2).width + 50);
  box(x-w/2, y, w, 66, "#1F7A45", 8); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 2; rr(x-w/2+5, y+5, w-10, 56, 6); ctx.stroke(); txt(l1, x, y+20, 13, "#FFFFFF", 700); txt(l2, x, y+44, 24, "#FFFFFF", 800); }
function stationBoard(x, y, name){ box(x-60, y+56, 6, GY-y-90, "#2B2F36"); box(x+54, y+56, 6, GY-y-90, "#2B2F36"); ctx.font = '900 30px Archivo, "Arial Narrow", Arial, sans-serif';
  const w = Math.max(200, ctx.measureText(name).width + 50); box(x-w/2, y, w, 60, "#F4C20D", 6); ctx.strokeStyle = "#16191E"; ctx.lineWidth = 3; rr(x-w/2+5, y+5, w-10, 50, 3); ctx.stroke(); txt(name, x, y+31, 30, "#16191E", 900, "center", 'Archivo, "Arial Narrow", Arial, sans-serif'); }

function cityBackdrop(cty, t){
  switch(cty){
    case "ppk": sky("#9FD0EE","#F2F7EE"); sun(480, 300, 28, "#FFF4D0"); clouds(t, 120); hills("#A9C99A", GY-120, 60, 2);
      for (let i=0;i<4;i++){ const x = -60 + i*170; box(x, GY-250, 130, 120, ["#E8D3B0","#D7C2E0","#BFD8C4","#F0C9A8"][i]); box(x-6, GY-260, 142, 14, "#B5553C", 3); box(x+20, GY-220, 26, 26, "#8BC5DE", 2); }
      box(170, GY-330, 18, 210, "#C9B79A"); box(410, GY-330, 18, 210, "#C9B79A"); box(160, GY-350, 280, 46, "#B5462F", 6); txt("P.P.K. COLLEGE", 300, GY-327, 22, "#FFFFFF", 800, "center", 'Archivo, "Arial Narrow", sans-serif'); break;
    case "home": sky("#A9D6F0","#F3F6EC"); sun(500, 300, 30, "#FFF4D0"); clouds(t, 120); hills("#B5CFA0", GY-130, 60, 7); sunTemple(330, GY-130, 0.7, t); break;
    case "siliguri": sky("#86C3EA","#E8F4F7"); peaks("#9DB2C8","#FFFFFF", GY-180, 240); hills("#7FAE77", GY-130, 60, 4);
      for (let r=0;r<6;r++){ ctx.strokeStyle = "rgba(255,255,255,.22)"; ctx.lineWidth = 3; ctx.beginPath(); for (let x=-900;x<1500;x+=20) ctx.lineTo(x, GY-150+r*12+Math.sin(x*0.01+r)*4); ctx.stroke(); }
      line(-1200, GY-158, 2000, GY-174, "#6B5A4A", 2); { const tx = ((t*45) % 1700) - 500; toyTrain(tx, GY-157 - 0.005*(tx+1200), 0.8, t); } break;
    case "kolkata": sky("#F2A78A","#FCE0C2"); sun(480, 330, 26, "#FFF0D0"); city(21, GY-150, 40, 120, "#C49A90", 0.2); box(-1200, GY-150, 3200, 40, "#8FA9B8"); howrah(300, GY-120, 0.9, "#6E5560"); taxi(((t*60)%800) - 100, GY-150, 0.7); break;
    case "dehradun": sky("#8CC7EA","#EEF6F4"); clouds(t, 120); peaks("#A9BCCD","#FFFFFF", GY-170, 150); hills("#6E9A5A", GY-130, 90, 5, 0.012); clockTower(300, GY-120, 0.95); break;
    case "ranchi": sky("#8CC7EA","#E9F4F5"); clouds(t, 120); hills("#93A876", GY-130, 50, 9, 0.02); pahari(170, GY-130, 0.95, t); waterfall(460, GY-130, 0.9, t); break;
    case "gurugram": sky("#9BC8EC","#EAF3FA"); clouds(t, 120); glassCity(71, GY-130); rapidMetro(GY-200, t); break;
  }
}
function cityArt(city, mode, v, t){
  cityBackdrop(city, t);
  const name = CITY[city];
  if (v === "bus"){ ground("#9EB07E","#86996A"); box(-1200, GY-46, 3200, 46, "#5E6268"); for (let x=-900; x<1500; x+=60) box(x, GY-26, 30, 4, "#E9E3D2");
    box(30, GY-160, 150, 12, "#3A4656", 3); box(40, GY-148, 6, 102, "#3A4656"); box(164, GY-148, 6, 102, "#3A4656"); box(56, GY-80, 98, 10, "#7A5A3E", 3); txt("BUS", 105, GY-130, 16, "#3A4656", 900);
    greenSign(430, GY-300, mode === "depart" ? "Leaving" : "Welcome to", name); }
  else if (v === "train"){ ground("#8F8A80","#6E6A62"); box(-1200, GY-44, 3200, 30, "#BDB6A8"); box(-1200, GY-44, 3200, 5, "#F4C20D");
    for (let x=-900; x<1500; x+=160){ box(x, GY-260, 8, 216, "#55606E"); box(x-20, GY-268, 48, 8, "#55606E"); }
    if (city === "kolkata") { ctx.save(); ctx.globalAlpha = 0.9; howrahStation(300, GY-44, 0.9); ctx.restore(); }
    if (STATION[city]) stationBoard(300, GY-250, STATION[city]); }
  else { ground("#8FA37A","#7A8C66"); box(-1200, GY-40, 3200, 40, "#4A4F57"); for (let x=-900; x<1500; x+=80) box(x, GY-22, 40, 4, "#FFFFFF");
    box(470, GY-280, 40, 240, "#D6DCE2"); box(450, GY-310, 80, 40, "#7FA6C9", 8); box(40, GY-130, 260, 90, "#E9EDF2", 6); for (let i=0;i<6;i++) box(52 + i*42, GY-116, 30, 40, "#9FC3E3", 3);
    txt(name.toUpperCase() + " AIRPORT", 170, GY-150, 14, "#2C3440", 900); }
  label(mode === "depart" ? `Leaving ${name}` : `Welcome to ${name}`, 300, 120, 22, "#16191E", "#F4C20D");
}
function journeyArt(v, to, t, dir){
  const name = CITY[to];
  if (v === "bus"){ sky("#9ED2F0","#F4F1DC"); sun(480, 300, 30, "#FFF4D0"); clouds(t, 120); hills("#A7C48E", GY-140, 50, 3);
    ground("#9EB07E","#86996A"); paddy(GY-120); [60, 220, 520].forEach((x,i)=>palm(x, GY-60, 1 + (i%2)*0.2));
    box(-1200, GY-46, 3200, 46, "#5E6268"); for (let x=-900; x<1500; x+=60) box(x, GY-26, 30, 4, "#E9E3D2");
    box(380, GY-110, 50, 64, "#FFFFFF", 6); box(380, GY-110, 50, 22, "#F4C20D", 6); box(380, GY-96, 50, 8, "#F4C20D"); txt("NH", 405, GY-99, 12, "#16191E", 900); txt(name.slice(0,8).toUpperCase(), 405, GY-68, 9, "#16191E", 800);
    truck(((-t*170*dir) % 1600 + 1600) % 1600 - 500, GY-48, -dir);
    label(`On the bus to ${name}`, 300, 120, 22, "#16191E", "#F4C20D"); }
  else if (v === "train"){ sky("#A5D3EE","#F1F5E6"); clouds(t, 120); hills("#9FBF86", GY-150, 60, 6);
    ground("#9EB07E","#86996A"); paddy(GY-130, "#86C46A"); box(-1200, GY-130, 3200, 30, "#8FB8D0");
    ctx.strokeStyle = "#6B7480"; ctx.lineWidth = 3; for (let x=40; x<560; x+=60){ ctx.beginPath(); ctx.moveTo(x, GY-60); ctx.lineTo(x+30, GY-110); ctx.lineTo(x+60, GY-60); ctx.stroke(); } box(20, GY-114, 560, 6, "#6B7480");
    box(-1200, GY-20, 3200, 8, "#7A7F86"); for (let x=-900; x<1500; x+=24) box(x, GY-12, 12, 6, "#5B4636");
    for (let x=-900; x<1500; x+=140){ box(x, GY-180, 5, 160, "#7A5A3E"); line(x-14, GY-176, x+18, GY-176, "#7A5A3E", 3); } line(-1200, GY-174, 2000, GY-170, "rgba(40,40,40,.5)", 1);
    label(`On the train to ${name}`, 300, 120, 22, "#16191E", "#F4C20D"); }
  else { sky("#4B8FD6","#CFE6F8"); sun(470, 260, 34, "#FFF6D8");
    for (let k=0;k<9;k++){ const x = (((k*190 - t*40*dir) % 1600) + 1600) % 1600 - 500, y = 300 + (k%3)*110; cloud(x, y, 1.6 + (k%2)*0.6, 0.95); }
    box(-1200, GY-40, 3200, 200, "rgba(255,255,255,.9)"); for (let k=0;k<14;k++) cloud(-400 + k*90, GY-40, 1.8, 1);
    label(`Flying to ${name}`, 300, 120, 22, "#16191E", "#F4C20D"); }
}

function drawSlide(fn, offX){
  ctx.save(); ctx.setTransform(dpr,0,0,dpr,0,0); ctx.beginPath(); ctx.rect(offX, 0, W, H); ctx.clip();
  ctx.setTransform(dpr*K,0,0,dpr*K,dpr*(W/2 - (VW/2)*K + offX),dpr*OY); fn(); ctx.restore();
}
function drawTrip(T, now){
  // Five slides: chapter, departure city, journey, arrival city, chapter. He walks to the vehicle, rides it across, then walks on.
  const p = Math.min(1, (now - T.start)/T.dur), dir = T.dir, trip = T.trip, v = trip.v;
  const fromCity = dir > 0 ? trip.a : trip.b, toCity = dir > 0 ? trip.b : trip.a;
  const seg = (a, b)=>Math.min(1, Math.max(0, (p - a)/(b - a)));
  const u1 = ease(seg(0, 0.16)), u3 = seg(0.22, 0.78), u5 = ease(seg(0.84, 1));
  const cam = p < 0.22 ? u1 : p < 0.84 ? 1 + 2*u3 - 0.5*Math.sin(4*Math.PI*u3)/(2*Math.PI) + (p >= 0.78 ? 0 : 0) : 3 + u5;
  const slides = [
    ()=>{ heroHidden = true; heroLT = 99; CH[T.from].draw(timeNow, now - (startTimes[T.from] ?? now)); heroHidden = false; },
    ()=>cityArt(fromCity, "depart", v, timeNow),
    ()=>journeyArt(v, toCity, timeNow, dir),
    ()=>cityArt(toCity, "arrive", v, timeNow),
    ()=>{ heroHidden = true; heroLT = 99; CH[T.to].draw(timeNow, now - startTimes[T.to]); heroHidden = false; },
  ];
  slides.forEach((fn, j)=>{ const off = (j - cam)*W*dir; if (off > -W && off < W) drawSlide(fn, off); });
  ctx.setTransform(dpr*K,0,0,dpr*K,dpr*(W/2 - (VW/2)*K),dpr*OY);
  const span = W/K, at = (j, x)=>(j - cam)*span*dir + x;   // stage x of a point on slide j
  const A = heroOf(T.from), B = heroOf(T.to), D = {bus:99, train:-150, plane:100}[v];
  const vc = 300 - dir*40, door = vc + dir*D;
  const planeAlt = cm => { const up = Math.max(0, Math.min(1, (cm - 1.08)/0.6)), down = Math.max(0, Math.min(1, (2.92 - cm)/0.6)); const a = Math.min(up, down); return {s: 0.5 - 0.5*Math.cos(Math.PI*a), tilt: (cm < 2 ? 1 : -1)*Math.sin(Math.PI*a)*0.16}; };
  const rider = (p >= 0.2 && p < 0.8) ? (cam < 2 ? A.look : B.look) : null;
  const drawV = (x, moving, cm)=>{ if (v === "plane"){ const k = planeAlt(cm); plane(x, GY - k.s*330, dir, timeNow, k.tilt, rider); } else drawVehicle(v, x, dir, timeNow, moving, 0, rider); };
  if (p < 0.22){ // walk out of the chapter to the waiting vehicle, then board
    drawV(at(1, vc), false, 1);
    const w = seg(0, 0.16), j = w, x = A.x + (door - A.x)*w, board = seg(0.16, 0.22);
    traveller(A.look, at(j, x), dir, 1 - board, board > 0.5 ? POSE.stand(timeNow) : null);
  } else if (p < 0.78){ // ride across the journey
    const ride = (cam - 1)/2; drawV(at(cam, vc), true, cam);
  } else if (p < 0.84){ drawV(at(3, vc), false, 3);
    traveller(B.look, at(3, door), dir, seg(0.78, 0.84), POSE.stand(timeNow));
  } else { // step off and walk into the next chapter while the vehicle moves on
    const leave = seg(0.88, 1); drawV(at(3, vc) + dir*leave*leave*900, leave > 0, 3);
    traveller(B.look, at(3 + u5, door + (B.x - door)*u5), dir, 1, p >= 0.995 ? POSE.stand(timeNow) : null);
  }
  if (p >= 1){ trans = null; arrivedAt = now; }
}
/* ---------- panel ---------- */
const chips = $("storyChips");
CH.forEach((c,i)=>{ const b = el("button", {"data-i":String(i), "aria-label":`Chapter ${i+1}: ${c.title}`}, String(i+1)); b.onclick = ()=>{ stopAuto(); go(i); }; chips.appendChild(b); });
function setStrip(i){ chips.querySelectorAll("button").forEach((b,k)=>{ if (k===i) b.setAttribute("aria-current","step"); else b.removeAttribute("aria-current"); b.classList.toggle("seen", seen.has(k)); }); const c = chips.children[i]; if (c && chips.scrollWidth > chips.clientWidth) chips.scrollLeft = c.offsetLeft - chips.clientWidth/2 + c.clientWidth/2; }
const ERA_COMMITS = {
  "University of North Bengal": {n:119, when:"from college days, 2017 to October 2020"},
  "Distronix, Kolkata": {n:153, when:"from November 2020 to March 2022"},
  "Daynil Group, from Bundu": {n:30, when:"from November 2022 to December 2024"},
  "Csharptek, Ranchi": {n:496, when:"from February 2025 to January 2026"},
  "examday.ai, Gurugram": {n:966, when:"since February 2026"},
};
let commitAnim = null;
function setPanel(i){
  const c = CH[i]; seen.add(i);
  const ce = ERA_COMMITS[c.era], cel = $("storyCommits");
  if (ce){ cel.hidden = false; cel.title = `GitHub commits ${ce.when}`; cel.setAttribute("aria-label", `${ce.n} GitHub commits ${ce.when}`); cel.innerHTML = `<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M0 8h5M11 8h5" stroke="currentColor" stroke-width="2"/></svg><b>0</b> commits`; commitAnim = {el: cel.querySelector("b"), n: ce.n, start: performance.now()/1000}; } else { cel.hidden = true; commitAnim = null; }
  $("storyCount").textContent = `Chapter ${i+1} of ${CH.length}: ${c.era}`;
  $("storyTitle").textContent = c.title; $("storyWhen").textContent = c.when; $("storyText").textContent = c.text;
  $("storyDetail").textContent = c.detail || ""; $("storyDetail").hidden = !c.detail;
  const built = $("storyBuilt");
  if (c.projects){ const list = PROJECTS.filter(p=>c.projects.includes(p.name));
    built.innerHTML = `<h3>Projects from this chapter (${list.length})</h3><ul>${list.map(p=>`<li><i style="background:${KIND_COLOR[p.kind]}"></i>${p.link?`<a href="${p.link}" target="_blank" rel="noopener">${esc(p.name)}</a>`:esc(p.name)}</li>`).join("")}</ul>`; }
  else if (c.end){ built.innerHTML = `<div class="end-cta">${cvWidget("primary","Download résumé")}<button class="btn" id="storyCopy">Copy email</button><span>${EMAIL}</span></div>`; $("storyCopy").onclick = e=>copyEmail(e.currentTarget); }
  else built.innerHTML = "";
  $("storyScroll").scrollTop = 0;
  $("storyPrev").disabled = i === 0;
  $("nextLbl").textContent = i === CH.length-1 ? "Back to portfolio" : "Next chapter";
  $("storyAuto").hidden = i === CH.length-1;
  $("storyLive").textContent = `Chapter ${i+1}: ${c.title}. ${c.text}`;
  setStrip(i);
  try { history.replaceState(null, "", "#story-" + (i+1)); } catch(e){}
}
function go(i){
  i = Math.max(0, Math.min(CH.length-1, i)); if (i === cur && !trans) return;
  const now = performance.now()/1000;
  if (trans){ startTimes[trans.to] = Math.min(startTimes[trans.to], now); trans = null; }
  entering = false;
  if (reduce || story.hidden){ startTimes[i] = now; cur = i; arrivedAt = now; setPanel(i); return; }
  const from = cur, dir = i > from ? 1 : -1, key = dir > 0 ? `${from}-${i}` : `${i}-${from}`;
  const trip = Math.abs(i - from) === 1 ? (TRIPS[key] || null) : null, dur = trip ? 7.5 : 1.2;
  trans = {from, to:i, start:now, dir, trip, dur};
  startTimes[i] = now + dur - 0.3;
  cur = i; slidePanel(i, dir);
}
let panelAnim = null;
function slidePanel(i, dir){
  // The text slides vertically while the scene slides sideways: up and out going forward, down going back.
  const inner = $("storyInner"); if (!inner.animate){ setPanel(i); return; }
  if (panelAnim) panelAnim.cancel();
  panelAnim = inner.animate([{transform:"translateY(0)", opacity:1}, {transform:`translateY(${-dir*36}px)`, opacity:0}], {duration:200, easing:"ease-in", fill:"forwards"});
  panelAnim.onfinish = ()=>{ setPanel(i); panelAnim = inner.animate([{transform:`translateY(${dir*36}px)`, opacity:0}, {transform:"translateY(0)", opacity:1}], {duration:340, easing:"cubic-bezier(.2,.8,.2,1)", fill:"forwards"}); panelAnim.onfinish = ()=>{ panelAnim = null; }; };
}
function stopAuto(){ auto = false; $("storyAuto").setAttribute("aria-pressed","false"); $("storyAuto").textContent = "Autoplay"; }
$("storyAuto").onclick = ()=>{ if (auto){ stopAuto(); return; } auto = true; arrivedAt = performance.now()/1000; $("storyAuto").setAttribute("aria-pressed","true"); $("storyAuto").textContent = "Pause"; };
$("storyNext").onclick = ()=>{ if (cur === CH.length-1) closeStory(); else { stopAuto(); go(cur+1); } };
$("storyPrev").onclick = ()=>{ stopAuto(); go(cur-1); };
$("storyExit").onclick = ()=>closeStory();
let swipeX = null, swipeY = 0;
canvas.addEventListener("pointerdown", e=>{ swipeX = e.clientX; swipeY = e.clientY; });
canvas.addEventListener("pointerup", e=>{ if (swipeX === null) return; const dx = e.clientX - swipeX, dy = e.clientY - swipeY; swipeX = null;
  if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)){ stopAuto(); go(cur + (dx < 0 ? 1 : -1)); }
  else if (Math.abs(dx) < 10 && Math.abs(dy) < 10){ stopAuto(); go(cur + 1); } });

function openStory(i){
  lastFocus = document.activeElement;
  story.hidden = false; document.body.style.overflow = "hidden"; resize();
  cur = Math.max(0, Math.min(CH.length-1, i||0)); const now = performance.now()/1000; startTimes[cur] = now; arrivedAt = now; trans = null; entering = true; setPanel(cur);
  cancelAnimationFrame(rafId); rafId = requestAnimationFrame(frame);
  $("storyNext").focus();
}
function closeStory(){
  stopAuto(); cancelAnimationFrame(rafId); story.hidden = true; document.body.style.overflow = "";
  try { history.replaceState(null, "", location.pathname + location.search); } catch(e){}
  if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
}
document.querySelectorAll("[data-story]").forEach(b=>b.addEventListener("click", ()=>openStory(+b.dataset.story)));
addEventListener("keydown", e=>{
  if (story.hidden) return;
  if (e.key === "Escape"){ e.preventDefault(); closeStory(); }
  else if (e.key === "ArrowRight"){ e.preventDefault(); stopAuto(); go(cur+1); }
  else if (e.key === "ArrowLeft"){ e.preventDefault(); stopAuto(); go(cur-1); }
  else if (e.key === "Tab"){
    const f = [...story.querySelectorAll("button:not([disabled]), a[href]")].filter(x=>x.offsetParent!==null);
    if (!f.length) return; const a = f[0], z = f[f.length-1];
    if (e.shiftKey && document.activeElement === a){ e.preventDefault(); z.focus(); }
    else if (!e.shiftKey && document.activeElement === z){ e.preventDefault(); a.focus(); }
  }
});
ERAS.forEach((e,k)=>{ const range = e.start===e.end ? `Chapter ${e.start+1}` : `Chapters ${e.start+1}–${e.end+1}`; const b = el("button", {class:"chap", "aria-label":`${e.name}, ${range}`}, `<b>${k+1}</b><span>${esc(e.name)}<small>${range}</small></span>`); b.addEventListener("click", ()=>openStory(e.start)); $("heroChapters").appendChild(b); });
$("chapCount").textContent = CH.length;
(function fromHash(){ const m = location.hash.match(/^#story(?:-(\d+))?$/); if (m) openStory(m[1] ? +m[1]-1 : 0); })();

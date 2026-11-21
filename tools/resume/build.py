"""Build the résumé variants: one all-rounder master plus focused versions.

Each variant picks its own title, summary, bullet order, projects and skill order
from the same facts, so every version stays consistent with the others.
"""
import asyncio, html, pathlib
from playwright.async_api import async_playwright

OUT = pathlib.Path(__file__).resolve().parents[2] / "public"  # PDFs land where the site serves them
OUT.mkdir(exist_ok=True)

CONTACT = ('Gurugram, India · +91 96798 66193 · krishnapaulmailbox@gmail.com · '
           '<a href="https://krishnapaul.in">krishnapaul.in</a> · '
           '<a href="https://www.linkedin.com/in/krishna-paul-129391148/">linkedin.com/in/krishna-paul-129391148</a> · '
           '<a href="https://github.com/krishnapaul242">github.com/krishnapaul242</a> · '
           '<a href="https://www.npmjs.com/~krishna.paul">npmjs.com/~krishna.paul</a>')

# Bullets are tagged with the perspectives they serve; variants choose by tag, in their own order.
JOBS = [
 dict(t="Founding Engineer, examday.ai (Bolimart Pvt Ltd)", where="Gurugram, Haryana", when="Feb 2026 – Present", b=[
   ("mobile web all", "Took the examday.ai app from zero to launch on Android, iOS and the web."),
   ("ai tools mobile all", "Built MoTA, a VS Code extension that turns Android phones into a local device farm for performance, end-to-end (Maestro), regression and stress testing; published on the VS Code Marketplace."),
   ("ai tools backend all", "Set up MCP servers, VS Code extensions and internal tools that speed up how the team builds and tests."),
 ]),
 dict(t="Software Engineer, Csharptek (Cloudgarner Solutions Pvt Ltd)", where="Ranchi, Jharkhand", when="Feb 2025 – Feb 2026", b=[
   ("backend web all lead", "Led system design and architecture across 10+ web, mobile and backend platforms."),
   ("lead all", "Technical and client-facing lead for 15+ stakeholders: requirement discovery, specifications, cross-team coordination and delivery."),
   ("mobile ai all", "Delivered features, iOS-to-Android migrations and 50+ bug fixes across 6+ production apps, including AI clinical-notes and healthcare apps."),
   ("ai", "Added AI features to client products: an AI concierge, AI chat for property search and AI clinical documentation."),
   ("web", "Built admin dashboards and partner PWAs in React and Next.js for events, bookings, payments and property management."),
   ("backend all", "Owned DevOps for 20+ services: containerisation, CI/CD pipelines, ephemeral preview environments and production runbooks."),
   ("backend", "Designed and built the complete backend for Trunking Recorder, a live and recorded radio platform for law enforcement, and deployed it to QA and production."),
 ]),
 dict(t="React.js Developer, Daynil Group Solutions Pvt Ltd", where="Remote", when="Nov 2022 – Dec 2024", b=[
   ("web all", "Built 20+ interfaces for BioFlow, Celltrio’s cell-culture lab automation platform, improving usability and accessibility by 43%."),
   ("mobile all", "Launched CashBook, a React Native accounting and GST app, on Google Play (1,000+ downloads) and integrated 32 third-party APIs."),
   ("backend", "Integrated 32 third-party APIs into the CashBook fintech platform."),
 ]),
 dict(t="Software Engineer, Frontend, Zeeve DeepTech Pvt Ltd", where="Dehradun, Uttarakhand", when="Apr 2022 – Oct 2022", b=[
   ("web all", "Built onboarding and registration dashboards on the Phaeton blockchain, raising user landings by 121%."),
   ("web all", "Engineered 19 responsive components and a Web3 bond marketplace with MetaMask; set code-quality practices."),
   ("backend", "Designed APIs with the backend team for smooth data flow between the frontend and blockchain services."),
 ]),
 dict(t="Software Engineer (joined as Junior), Distronix LLC", where="Kolkata, West Bengal", when="Nov 2020 – Mar 2022", b=[
   ("all web", "Sole frontend developer through COVID; built 30+ web and mobile apps for city agencies (NKDA, WBPCB) and businesses."),
   ("mobile", "Built or maintained 14 mobile apps for city agencies in React Native and Swift, with NFC, maps and location, image capture and OTA updates, on Google Play and the App Store."),
   ("web", "Built 13 dashboards for air quality, noise, smart homes and transit with maps, charts, data grids and live MQTT data."),
   ("all mobile backend", "Shipped 5 apps through CI/CD with over-the-air updates and integrated 12 third-party services."),
 ]),
]

PROJECTS = {
 "examday": "<b>examday.ai app</b> – Founding engineer; took the exam-prep app from zero to launch on Android, iOS and the web. LINK(examday.ai)",
 "examday_mobile": "<b>examday.ai app</b> – Founding engineer; built and launched the Android and iOS apps from zero. LINK(examday.ai)",
 "examday_web": "<b>examday.ai web app</b> – Founding engineer; built and launched the web app alongside Android and iOS. LINK(examday.ai)",
 "letspartii": "<b>Lets Partii</b> – Social events app with short videos, ticketing, QR check-in, payments, chat and an AI concierge; led architecture and the team. LINK(letspartii.com)",
 "letspartii_web": "<b>Lets Partii admin and partner portals</b> – React and Next.js dashboards and PWAs for events, venues, tickets, bookings and finances. LINK(letspartii.com)",
 "letspartii_api": "<b>Lets Partii backend</b> – Express.js monorepo for bookings, payments, chat and notifications; designed the architecture and ran deployments. LINK(letspartii.com)",
 "herd": "<b>HERD</b> – Work management hub; containerised it and set up CI/CD, preview environments and runbooks. LINK(getherd.ai)",
 "trunking": "<b>Trunking Recorder</b> – Live and recorded radio platform for law enforcement; designed and built the whole backend and deployed it to QA and production.",
 "mota": "<b>MoTA</b> – VS Code extension for Android device farms: live screens, multi-device installs, performance stats, recording and replay, Maestro and AI test runs, MCP server. LINK(krishnapaul.in/MoTA)",
 "gati": "<b>Gati</b> – TypeScript-first, contract-driven backend framework, published on npm. LINK(krishnapaul.in/gati)",
 "utho": "<b>Utho CDK</b> – Typed SDK, CLI and browser bundle generated from Utho Cloud’s OpenAPI spec. LINK(www.npmjs.com/package/utho-cdk,npm: utho-cdk)",
 "face": "<b>Face Smash</b> – Android multiplayer game played with your face: Kotlin, Jetpack Compose, LibGDX, ML Kit. LINK(play.google.com/store/apps/details?id=in.krishnapaul.facesmash,Google Play)",
 "amalgamate": "<b>Amalgamate</b> – React Native social app; built face authentication, surveys and voting feeds and fixed key issues. LINK(play.google.com/store/apps/details?id=com.amalgamate,Google Play)",
 "paribesh": "<b>WBPCB Paribesh</b> – West Bengal Pollution Control Board’s app for pollution data and complaints; designed the architecture and set up OTA updates. LINK(play.google.com/store/apps/details?id=in.gov.wbpcb.paribeshapp,Google Play)",
 "cashbook": "<b>CashBook</b> – Accounting and GST app for small businesses in React Native and Expo, 1,000+ downloads. LINK(play.google.com/store/apps/details?id=in.mycashbook,Google Play)",
 "bioflow": "<b>BioFlow</b> – 20+ interfaces for Celltrio’s cell-culture lab automation platform in React and Material UI. LINK(celltrio.com/platform.html,celltrio.com)",
 "flowmina": "<b>Flowmina</b> – Visual workflow builder with modular nodes and an interactive canvas. LINK(flowmina.krishnapaul.in)",
 "astory": "<b>astory.fun</b> – AI-assisted long-form fiction platform with a living story bible, consistency checks and MCP tools. LINK(astory.fun)",
 "scribe": "<b>Companion Scribe AI and Charting Hero</b> – AI clinical documentation apps; migrated them from iOS to Android and fixed recording interruptions. LINK(companionscribeai.com) · LINK(chartinghero.com)",
 "invest": "<b>Invest Luxury</b> – Real-estate app with video feeds, AI chat, map listings and payments; led architecture and the team. LINK(www.investluxury.com,investluxury.com)",
 "kahiye": "<b>Kahiye</b> – Conversational AI playground with streaming chat, prompt and memory management, and tool calls. LINK(kahiye.krishnapaul.in)",
}
import re as _re
def _link(m):
    parts = m.group(1).split(",", 1); url = parts[0]; text = parts[1] if len(parts) > 1 else url
    return f'<a class="muted" href="https://{url}">{text}</a>'
PROJECTS = {k: _re.sub(r"LINK\(([^)]*)\)", _link, v) for k, v in PROJECTS.items()}

SK = {
 "mobile": ("Mobile", "React Native, Expo, Android, iOS, Kotlin, Swift, Jetpack Compose, NFC, maps and location, OTA updates, Play Store and App Store releases"),
 "web": ("Web", "React, Next.js, TypeScript, JavaScript, HTML, CSS, Redux, Tailwind CSS, Material UI, Bootstrap, Chakra UI, PWA"),
 "backend": ("Backend & DevOps", "Node.js, Express.js, tRPC, REST APIs, microservices, MQTT, system design, Docker, Kubernetes, AWS, CI/CD, preview environments"),
 "ai": ("AI & testing", "LLM features, streaming chat, MCP servers, Claude Code, GitHub Copilot, Codex, device farms, Maestro E2E, regression and stress testing, TDD"),
 "tools": ("Tools", "Git, GitHub, GitLab, Bitbucket, VS Code, Android Studio, Xcode, Figma, Postman, Jira, Asana, Slack"),
 "lang": ("Languages", "English (fluent), Hindi (fluent), Bengali (intermediate)"),
}

VARIANTS = [
 dict(key="master", file="KrishnaPaulCV.pdf", label="All-rounder", tag="all",
      title="Founding Engineer · Mobile & Full Stack · React Native, TypeScript, Node.js, Kotlin",
      summary="Software engineer with 6 years of experience and 50+ shipped web, mobile and backend projects. As founding engineer, took examday.ai from zero to launch on Android, iOS and the web. Leads system design, client delivery and DevOps, builds developer tooling such as MoTA on the VS Code Marketplace, and has worked with AI tools since 2020 (Claude Code, GitHub Copilot, Codex).",
      projects=["examday", "letspartii", "herd", "mota", "gati", "face"], skills=["mobile", "web", "backend", "ai", "tools", "lang"]),
 dict(key="mobile", file="resume/KrishnaPaul-Mobile.pdf", label="Mobile developer", tag="mobile",
      title="Mobile Engineer · React Native, Android & iOS · Kotlin, Swift, TypeScript",
      summary="Mobile engineer with 6 years of experience shipping React Native and native apps to Google Play and the App Store. Took the examday.ai app from zero to launch on Android and iOS, migrated AI healthcare apps from iOS to Android, and built or maintained 14 mobile apps for city agencies with NFC, maps and over-the-air updates. Founder of Face Smash, a Kotlin multiplayer game, and builder of MoTA, a device-farm testing tool for Android.",
      projects=["examday_mobile", "face", "amalgamate", "paribesh", "cashbook"], skills=["mobile", "web", "ai", "backend", "tools", "lang"]),
 dict(key="web", file="resume/KrishnaPaul-Frontend.pdf", label="Frontend & web", tag="web",
      title="Frontend Engineer · React, Next.js & TypeScript · Dashboards and Web Platforms",
      summary="Frontend engineer with 6 years of experience building React and Next.js products: admin panels, partner portals, real-time dashboards and Web3 apps. Built 13 city and pollution dashboards in Kolkata, 20+ interfaces for a lab automation platform and onboarding flows that raised user landings by 121%. Comfortable across the stack, from component systems to the APIs behind them.",
      projects=["examday_web", "letspartii_web", "bioflow", "astory", "flowmina"], skills=["web", "mobile", "backend", "ai", "tools", "lang"]),
 dict(key="backend", file="resume/KrishnaPaul-Backend-DevOps.pdf", label="Backend & DevOps", tag="backend",
      title="Backend & DevOps Engineer · Node.js, TypeScript · Docker, Kubernetes, CI/CD",
      summary="Engineer with 6 years of experience who designs systems and keeps them shipping. Led architecture across 10+ platforms, owned DevOps for 20+ services with containers, CI/CD, preview environments and runbooks, and built complete backends for production apps. Author of Gati, a contract-driven TypeScript backend framework, and Utho CDK, a typed SDK and CLI for Utho Cloud.",
      projects=["herd", "trunking", "letspartii_api", "gati", "utho"], skills=["backend", "web", "ai", "mobile", "tools", "lang"]),
 dict(key="ai", file="resume/KrishnaPaul-AI-DevTools.pdf", label="AI & developer tools", tag="ai",
      title="AI & Developer Tools Engineer · LLM Features, MCP, Test Automation",
      summary="Engineer who has worked with AI tools since 2020 and builds daily with Claude Code, GitHub Copilot and Codex. Added AI concierges, AI chat and clinical documentation to client products; built astory.fun, an AI fiction platform, and Kahiye, a streaming chat playground. Builds developer tooling: MoTA, an Android device-farm extension on the VS Code Marketplace, plus MCP servers and internal tools at examday.ai.",
      projects=["mota", "scribe", "invest", "astory", "kahiye"], skills=["ai", "backend", "web", "mobile", "tools", "lang"]),
]

CSS = open(pathlib.Path(__file__).parent / "style.css").read()

def render(v):
    tag = v["tag"]
    jobs = []
    for j in JOBS:
        # all-rounder keeps 'all' bullets; focused variants lead with their own tag, then fill with 'all'.
        if tag == "all":
            bs = [t for k, t in j["b"] if "all" in k.split()]
        else:
            own = [t for k, t in j["b"] if tag in k.split()]
            rest = [t for k, t in j["b"] if "all" in k.split() and tag not in k.split()]
            bs = (own + rest)[: min(4, max(2, len(own) + 1))] if own else rest[:2]
        # never repeat the same fact twice inside one job
        seen, uniq = set(), []
        for b in bs:
            key = b[:40]
            if key not in seen: seen.add(key); uniq.append(b)
        jobs.append(f'<div class="job"><div class="row"><span><b>{html.escape(j["t"])}</b> <span class="sub">· {j["where"]}</span></span><span class="when">{j["when"]}</span></div><ul>{"".join(f"<li>{html.escape(b)}</li>" for b in uniq)}</ul></div>')
    projects = "".join(f"<li>{PROJECTS[p]}</li>" for p in v["projects"])
    skills = "".join(f"<p><b>{html.escape(SK[s][0])}:</b> {SK[s][1]}</p>" for s in v["skills"])
    return f"""<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Krishna Paul – Résumé ({v['label']})</title><style>{CSS}</style></head><body>
<h1>Krishna Paul</h1><p class="title">{html.escape(v['title'])}</p><p class="contact">{CONTACT}</p>
<h2>Summary</h2><p>{html.escape(v['summary'])}</p>
<h2>Experience</h2>{''.join(jobs)}
<h2>Selected projects</h2><ul class="proj">{projects}</ul>
<h2>Skills</h2><div class="skills">{skills}</div>
<h2>Education</h2>
<p><b>MCA</b>, University of North Bengal, Siliguri, 2017 – 2020 · 7.59 CGPA &nbsp;|&nbsp; <b>BCA</b>, P.P.K. College, Ranchi University, 2014 – 2017 · 83.33%</p>
</body></html>"""

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for v in VARIANTS:
            path = OUT / v["file"]; path.parent.mkdir(parents=True, exist_ok=True)
            hp = pathlib.Path("/tmp") / f"resume-{v['key']}.html"; hp.write_text(render(v))
            pg = await b.new_page(); await pg.goto(hp.as_uri()); await pg.wait_for_timeout(200)
            await pg.pdf(path=str(path), format="A4", prefer_css_page_size=True, print_background=True)
            await pg.close()
        await b.close()

asyncio.run(main())

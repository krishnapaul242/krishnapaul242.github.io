# Krishna Paul - Portfolio Website

My personal portfolio website, built with vanilla JavaScript, Canvas and Vite.

## 🚀 Features

- **Standard portfolio** - featured work, all projects with filters, experience, skills, GitHub activity and contact
- **"Watch my story"** - a 24-chapter illustrated canvas story of my life and career, portrait-first so it plays well on phones
- **Story details** - city landmarks, walking and vehicle transitions, floating project cards in platform frames, "Learned …" skill badges and per-era GitHub commit counts
- **Autoplay** - progress bar, auto-scrolling text, keyboard and swipe controls, and `#story-N` deep links
- **Accessible** - respects reduced motion, announces chapters to screen readers and gives the canvas text alternatives

## 🛠️ Tech Stack

- **Vanilla JavaScript + Canvas 2D** - no framework
- **Vite** - build tool and development server
- **Google Fonts** - Archivo and Inter

## 📁 Project Structure

```
index.html            # Page markup (portfolio + story overlay)
src/
├── main.js           # Portfolio rendering, story chapters and canvas drawing
├── style.css         # All styles
└── data/
    └── projects.json # Projects: name, kind, industries, description, tech, links, dates
public/               # Static files (résumé PDF, CNAME, favicon, /date page, …)
```

To add a project, add it to `src/data/projects.json`. To show it in the story, add its name to a chapter's `projects` list in `src/main.js`.

## 🚀 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Deployment

This site is automatically deployed to GitHub Pages using GitHub Actions when changes are pushed to the main branch.

### CI/CD Pipeline

1. **Build** - Vite builds the React app
2. **Deploy** - Artifacts are deployed to GitHub Pages
3. **Live** - Site is available at [krishnapaul242.github.io](https://krishnapaul242.github.io)

### Manual Deployment Setup

1. Go to repository **Settings** → **Pages**
2. Set **Source** to "GitHub Actions"
3. The workflow will automatically deploy on push to main branch

## 📄 License

GNU GPL v3 License

## 🔎 SEO

- `vite.config.js` pre-renders the projects, experience, skills and the story's text into `index.html` at build time, using the same functions as the browser (`src/render.js`), so crawlers and link previews see the content without JavaScript.
- `index.html` carries the title, description, canonical URL, Open Graph and Twitter tags, and JSON-LD (`ProfilePage` + `Person`).
- `public/og-image.png` is the 1200×630 link-preview image; `public/robots.txt` and `public/sitemap.xml` point search engines at the site.

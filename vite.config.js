import { defineConfig } from 'vite'
import { readFileSync } from 'node:fs'
import { JOBS, SKILLS } from './src/data/profile.js'
import { featuredHTML, filtersHTML, allListHTML, jobsHTML, skillsHTML, indsHTML, storyTextHTML } from './src/render.js'

// The story's chapter titles and text live beside their drawing code in src/main.js.
// Read them from the source so the plain-text version can never drift from the animated one.
function storyChapters() {
  const src = readFileSync(new URL('./src/main.js', import.meta.url), 'utf8')
  const re = /\{ title:"((?:[^"\\]|\\.)*)", era:"(?:[^"\\]|\\.)*", when:"((?:[^"\\]|\\.)*)"[\s\S]*?text:"((?:[^"\\]|\\.)*)"/g
  const unq = s => JSON.parse(`"${s}"`)
  const out = [...src.matchAll(re)].map(m => ({ title: unq(m[1]), when: unq(m[2]), text: unq(m[3]) }))
  if (out.length < 20) throw new Error(`Pre-render found only ${out.length} story chapters; check the chapter format in src/main.js`)
  return out
}

// Writes the portfolio's content into index.html at build time, so search engines,
// link previews and visitors without JavaScript see the full page.
function prerender() {
  return {
    name: 'prerender-content',
    transformIndexHtml(html) {
      const projects = JSON.parse(readFileSync(new URL('./src/data/projects.json', import.meta.url), 'utf8'))
      const fill = (id, inner) => {
        const re = new RegExp(`(<(div|ol)\\b[^>]*\\bid="${id}"[^>]*>)(</\\2>)`)
        if (!re.test(html)) throw new Error(`Pre-render: no empty #${id} in index.html`)
        html = html.replace(re, (_, open, tag, close) => open + inner + close)
      }
      fill('featured', featuredHTML(projects))
      fill('filters', filtersHTML(projects))
      fill('allList', allListHTML(projects, { limit: Infinity }).html)
      fill('jobs', jobsHTML(JOBS))
      fill('skillGroups', skillsHTML(SKILLS))
      fill('inds', indsHTML(projects))
      fill('storyText', storyTextHTML(storyChapters()))
      return html.replace(/(<b id="projCount">)\d+(<\/b>)/, `$1${projects.length}$2`)
    },
  }
}

export default defineConfig({
  plugins: [prerender()],
  base: process.env.VITE_BASE_PATH || '/',
  build: {
    outDir: 'dist',
    sourcemap: true,
    assetsDir: 'assets'
  },
  server: {
    port: 3000,
    open: true
  },
  define: {
    'process.env.VITE_BASE_PATH': JSON.stringify(process.env.VITE_BASE_PATH || '/')
  }
})

# Krishna Paul - Portfolio Website

My personal portfolio website built with React and Vite, showcasing my experience as a Full Stack Developer.

## 🚀 Features

- **React-based SPA** - Modern component architecture
- **Responsive Design** - Mobile-first approach
- **Interactive Timeline** - Experience showcase
- **Project Filtering** - Filter projects by technology
- **Smooth Scrolling Navigation** - Enhanced UX
- **Dynamic Content** - JSON-driven data

## 🛠️ Tech Stack

- **React 18** - UI Library
- **Vite** - Build tool and development server
- **CSS3** - Styling with custom properties
- **Font Awesome** - Icons
- **Google Fonts** - Typography

## 📁 Project Structure

```
src/
├── components/         # React components
│   ├── Header.jsx     # Navigation header
│   ├── Hero.jsx       # Main hero section
│   ├── Services.jsx   # Services showcase
│   ├── Experience.jsx # Work experience timeline
│   ├── Projects.jsx   # Projects grid with filtering
│   └── Footer.jsx     # Footer component
├── data/              # JSON data files
│   ├── services.json
│   ├── experience.json
│   ├── projects.json
│   └── social-links.json
├── App.jsx           # Main app component
├── main.jsx          # React entry point
├── index.css         # Global styles
└── App.css           # App-specific styles
```

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

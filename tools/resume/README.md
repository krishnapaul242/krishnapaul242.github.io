# Résumé variants

`build.py` writes one all-rounder résumé (`public/KrishnaPaulCV.pdf`, the site's default) and focused versions in `public/resume/`: Mobile, Frontend, Backend & DevOps, and AI & developer tools.

All versions come from the same facts in `build.py`. Each bullet is tagged with the perspectives it serves; a variant leads with its own bullets and fills in with the all-rounder ones.

```bash
pip install playwright pypdf && playwright install chromium
python3 tools/resume/build.py
```

The site lists the versions in `RESUMES` in `src/main.js`.

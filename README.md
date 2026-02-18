# 🏗️ Blueprint — AI-Powered Website Builder

> **Describe it. Sketch it. Build it.**
>
> Blueprint lets you describe a website idea in plain English, sketch a rough layout on a canvas, and then uses Google Gemini AI to generate 4 unique design concepts with real image previews. You pick your favorite, and the AI writes the full React + Tailwind CSS code for you — live in the browser.

---

## 🔄 How It Works (User Flow)

The app follows a **4-step pipeline**:

### Step 1 — `Describe` (Home Page `/`)
You land on a sleek landing page and type a **one-line description** of the website you want to create.
> *Example: "A modern portfolio for a photographer"*

Pressing Enter takes you to the design canvas.

### Step 2 — `Sketch` (Design Page `/design`)
A **full-screen drawing canvas** appears where you can **freehand sketch** the rough layout of your website (navbar at top, hero section, cards grid, etc.).

Tools available:
- 🎨 Color picker (black, blue, red)
- ↩️ Undo
- 🗑️ Clear canvas

When done sketching, you hit **"Generate Styles"** — this sends your drawing + text description to the AI.

### Step 3 — `Choose` (Select Page `/select`)
Gemini AI analyzes your sketch and intent, then generates **4 distinct design concepts**, each with:
- A unique **name** and **theme** (e.g. "Minimalist Dark", "Vibrant Gradient")
- A **color palette**
- A **description** of the visual style
- An **AI-generated image preview** of what the website could look like (generated via Gemini 3 Pro Image)

You browse the 4 concept cards and **pick your favorite**.

### Step 4 — `Build` (Build Page `/build`)
Gemini AI takes your selected concept and generates a **complete React application** with:
- `App.js` — main entry point
- `Navbar.js`, `Hero.js`, `Feature.js`, `Footer.js` — component files
- `styles.css` — custom styles
- Real **Unsplash images** (no placeholders)
- **Tailwind CSS** utility classes matching the selected theme

The generated code is rendered **live in the browser** using [Sandpack](https://sandpack.codesandbox.io/) (CodeSandbox's embeddable code editor + preview). You can see the code on the left and the running website on the right.

---

## 🧠 AI Architecture (Hybrid: Node.js + Python)

| Component | Technology | Purpose |
|---|---|---|
| **Text/JSON Generation** | Gemini 3 Flash (Node.js SDK) | Analyzes the sketch, generates 4 concept JSONs |
| **Image Generation** | Gemini 3 Pro Image (Python SDK) | Creates visual previews for each concept |
| **Code Generation** | Gemini 3 Pro (Node.js SDK) | Writes the full React + Tailwind code |

### Why Python?
The Gemini 3 **image generation** endpoint (`gemini-3-pro-image-preview`) only works reliably through the Python `google-genai` SDK. The Node.js server spawns a Python child process (`generate_images.py`) to handle this, then pipes the base64 image data back.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript + Python |
| **Styling** | Tailwind CSS 3 |
| **State Management** | Zustand |
| **Canvas/Drawing** | react-sketch-canvas |
| **Drag & Drop** | @dnd-kit (for stencil components — navbar, button, card, etc.) |
| **Animations** | Framer Motion |
| **Live Code Preview** | @codesandbox/sandpack-react |
| **AI** | Google Gemini API (both `@google/generative-ai` JS SDK and `google-genai` Python SDK) |
| **Icons** | Lucide React |

---

## 📁 Project Structure

```
blueprint-web/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Step 1: Home — text input (describe your idea)
│   │   ├── design/page.tsx       # Step 2: Freehand sketch canvas
│   │   ├── select/page.tsx       # Step 3: Browse & pick from 4 AI concepts
│   │   ├── build/page.tsx        # Step 4: Live code preview (Sandpack)
│   │   ├── layout.tsx            # Root layout
│   │   ├── globals.css           # Global styles & CSS variables
│   │   └── api/
│   │       ├── concepts/route.ts      # POST — generates 4 design concepts + images
│   │       └── generate-code/route.ts # POST — generates full React project code
│   ├── components/
│   │   ├── CanvasLayer.tsx       # Sketch canvas wrapper (react-sketch-canvas)
│   │   ├── ConceptCard.tsx       # Design concept card with HTML preview
│   │   └── StencilLayer.tsx      # Draggable UI stencils (navbar, button, card, etc.)
│   ├── lib/
│   │   └── gemini.ts            # Client-side Gemini helpers & API fetch wrappers
│   ├── store/
│   │   └── useBlueprintStore.ts # Zustand global state (intent, sketch, concepts, code)
│   └── scripts/
│       └── generate_images.py   # Python bridge — Gemini 3 image generation
├── tailwind.config.ts           # Tailwind config with custom design tokens
├── Dockerfile                   # Docker setup for hybrid Node + Python deployment
├── DEPLOY.md                    # Deployment guide (Railway, Render, ngrok)
└── package.json
```

---

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Your Google Gemini API key (server-side) |
| `NEXT_PUBLIC_GEMINI_API_KEY` | Same key, exposed to client (fallback) |

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install
pip install google-genai

# 2. Set your API key
echo "GEMINI_API_KEY=your_key_here" > .env.local

# 3. Run the dev server
npm run dev

# 4. Open http://localhost:3000
```

---

## 💡 Summary

**Blueprint** is an AI-powered web builder that turns a rough idea and a hand-drawn sketch into a fully coded, live-previewed React website — all in under a minute. It bridges the gap between "I have an idea" and "I have a working website" by leveraging Gemini AI for design generation, image previews, and code writing.

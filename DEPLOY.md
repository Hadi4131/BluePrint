# How to Deploy Blueprint

Because this app uses a powerful **Hybrid Architecture** (Next.js for the UI + Python for Gemini 3 Image Generation), it requires a hosting provider that supports Docker or custom build environments.

## Option 1: Instant Sharing (Local)
If you just want to show your friend *right now* without configuring a server:
1.  Run the app locally: `npm run dev`
2.  Use a tunneling tool like **ngrok** (https://ngrok.com/) to expose your port 3000.
    ```bash
    ngrok http 3000
    ```
3.  Send the generated URL to your friend.

## Option 2: Cloud Hosting (Recommended)
We recommend **Railway** or **Render** because they handle the Dockerfile automatically.

### Deploy on Railway (Easiest)
1.  Push your code to **GitHub**.
2.  Go to [Railway.app](https://railway.app/).
3.  Click "New Project" -> "Deploy from GitHub repo".
4.  Select your repository.
5.  Railway will detect the `Dockerfile` and build it automatically.
6.  **Important:** Go to the "Variables" tab and add your `GEMINI_API_KEY`.
7.  Wait for the build to finish, and you'll get a public URL!

### Deploy on Render
1.  Push code to GitHub.
2.  Go to [Render.com](https://render.com/).
3.  Create a "Web Service".
4.  Connect your repo.
5.  Choose "Docker" as the Runtime.
6.  Add Environment Variable `GEMINI_API_KEY`.
7.  Deploy.

## Why not Vercel?
Standard Vercel hosting is optimized for Node.js-only apps. While it can support Python, our specific "Pro Image Preview" setup works best when the Node server can directly talk to the Python script in the same container. The Docker method above ensures 100% compatibility.

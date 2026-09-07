<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/973aba04-2041-4b0e-8977-b0cf016f08d1

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## 3D model credits

The 360° inspector's optional "Scanned mesh" view loads `public/models/implant.glb`.
Placeholder asset: **"Tooth" by sugamo**, licensed **CC-BY**, via [Poly Pizza](https://poly.pizza/m/66NBoNdhb03).
Also downloaded: `public/models/teeth.glb` — **"Teeth" by Poly by Google**, **CC-BY**.

To upgrade realism, replace `public/models/implant.glb` with any licensed textured `.glb`
(the loader auto-centers and auto-fits it — no code change needed). Update this credit accordingly.

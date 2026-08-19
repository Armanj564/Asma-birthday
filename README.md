# Asuma — Birthday PWA

A lightweight, dependency-free birthday web app designed for iPhone, iPad and Android.

## GitHub Pages

1. Create a new **public** GitHub repository, for example `asuma-birthday`.
2. Upload every file in this folder, keeping the `icons/` folder.
3. GitHub → **Settings** → **Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select `main` and `/ (root)`, then Save.
6. Wait for GitHub Pages to publish the site.
7. Open the generated HTTPS URL on the iPhone/iPad.

## iPhone/iPad installation

Safari does not permit a website to silently install itself. On the device:

**Share → Add to Home Screen → Add**

The PWA then opens in standalone mode and uses the **Asuma** icon.

## Performance

- No frameworks or external libraries.
- No network requests after the initial page load.
- Canvas particle count is capped.
- Device pixel ratio is capped at 1.5 for lower GPU load.
- Service worker caches the app.
- Respects `prefers-reduced-motion`.
- Works without a database or server.

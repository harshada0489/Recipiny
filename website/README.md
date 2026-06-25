# Recipiny website

Two static HTML files — a landing page and a privacy policy. No build step, no
dependencies. Just deploy the folder.

## Deploy via Cloudflare Pages (recommended — you already have a Cloudflare account)

1. Go to <https://dash.cloudflare.com> → **Workers & Pages** → **Pages** tab → **Create application** → **Upload assets**
2. Project name: `recipiny` → click **Create project**
3. On the upload screen, **drag and drop the entire `website/` folder contents** (both `index.html` and `privacy.html`)
4. Click **Deploy site**

In about 60 seconds you get a public URL:
- Landing page: `https://recipiny.pages.dev/`
- Privacy policy: `https://recipiny.pages.dev/privacy.html`

The privacy URL is what you paste into App Store Connect as the **Privacy Policy URL**.

## Optional — connect your own domain later

If you buy `recipiny.app` (or any domain) later, Cloudflare Pages can map it to
this same site in a few clicks. Until then, the `*.pages.dev` URL is permanent
and publicly accessible — perfect for App Store submission.

## Updating the site

Edit the HTML files locally, then in the Cloudflare Pages dashboard:
**Create deployment** → drag the updated folder. New version goes live in
seconds.

Or, if you want continuous deployment, push the `website/` folder to a GitHub
repo and connect Cloudflare Pages to it — every git push triggers a fresh deploy.

## Alternative — GitHub Pages

If you'd rather not use Cloudflare Pages:

1. Create a new GitHub repo (any name, public)
2. Drop `index.html` and `privacy.html` in the root
3. In repo settings → Pages → Source: `main` branch / root folder
4. Save. After ~30 seconds, your site is live at `https://<username>.github.io/<repo>/`

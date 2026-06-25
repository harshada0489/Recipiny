# App Store Connect — copy & paste

All fields ready to paste into App Store Connect. Edit anything you'd like.

---

## App Name (30 char max)

```
Recipiny: Save Any Recipe
```

## Subtitle (30 char max)

```
From Instagram, TikTok, YouTube
```

## Promotional Text (170 char max — can be updated without re-review)

```
Paste any cooking link. Get a clean, structured recipe with ingredients and step-by-step instructions, saved on your phone.
```

## Description (4000 char max)

```
Recipiny turns any cooking link into a clean, structured recipe — saved on your phone, ready to cook.

THE PROBLEM
You're scrolling Instagram, TikTok or YouTube. You find an amazing recipe video. You save it. Two weeks later, you can't find it. You're not going to scroll through 300 saved reels to figure out which one had the chicken.

THE FIX
Tap "Pin" with a recipe link copied. In a few seconds, Recipiny gives you a clean recipe screen with the ingredient list and step-by-step instructions, neatly formatted, ready to cook. No more scrubbing through videos looking for "what was the temperature again?"

WHAT MAKES IT GOOD
• Paste once, cook forever — every recipe is saved on your phone, browsable in a clean list
• Cook Mode keeps the screen on, shows one big step at a time
• Smart serving scaler — bump from 2 to 6 servings and watch every quantity adjust
• Tastier ↔ Healthier toggle — one tap swaps in lighter ingredients
• Personal notes per recipe — "double the garlic", "kids loved this", "freezes well"
• Custom cover photos — upload your own pretty plating shot
• Source links saved — tap "Imported from Instagram" to jump back to the original video

LOCAL-FIRST BY DESIGN
Your recipes live on your device, not in our cloud. No sync, no lock-in, no tracking. You can export everything as a JSON backup to iCloud Drive, Google Drive or any file location — anytime.

WHAT WE NEED ONLY FOR EXTRACTION
When you tap "Pin", we send the link (and only the link) to our recipe-extraction service to read the public post and turn it into structured text. We don't store it. Full details in our privacy policy.

WORKS WITH
Instagram, TikTok and YouTube — for any public cooking content.

NO ADS, NO ACCOUNT REQUIRED TO COOK
Sign in once to enable the service. After that, the app works offline for everything you've already saved.

Tag your kitchen experiments. Make Sunday meal planning less painful. Stop losing the best recipes to the Instagram saved-reels void.
```

## Keywords (100 char max, comma-separated)

```
recipe,cooking,instagram recipe,tiktok recipe,meal plan,save recipe,recipe book,cookbook,food
```

## Support URL

```
https://recipiny.pages.dev
```
(or wherever you deploy the website — replace with the actual URL after deployment)

## Marketing URL (optional)

```
https://recipiny.pages.dev
```

## Privacy Policy URL (required)

```
https://recipiny.pages.dev/privacy.html
```

---

## Category

- Primary: **Food & Drink**
- Secondary: **Lifestyle** (optional, can be left blank)

## Age rating

Run through Apple's age-rating questionnaire and select:
- Cartoon or fantasy violence: **None**
- Realistic violence: **None**
- Sexual content / nudity: **None**
- Profanity / crude humor: **None**
- Alcohol, tobacco, drugs: **None**
- Simulated gambling: **None**
- Horror / fear themes: **None**
- Mature themes: **None**
- Medical/treatment info: **None**

Result should be **4+**.

---

## App Review Information

### Test account

App Review will need a working sign-in. Use the same Cognito account you create
to test, or create a dedicated review account.

```
Email: review@recipiny.app
Password: <create one and put it here>
```

### Notes for the reviewer (paste this into the "Notes" field)

```
Recipiny is a local-first recipe app. Sign in is required because the
recipe-extraction backend uses authenticated requests, but no recipe data is
stored on our servers — everything is saved locally on the device.

To test the core feature:
1. Sign in with the provided account (or create a new one — verification code arrives to the registered email)
2. On the Home screen, tap the green "Try it: share from Instagram" button. It opens Instagram (a placeholder demo URL is also acceptable if Instagram is not installed)
3. Alternatively, copy any public Instagram, TikTok or YouTube recipe URL and tap "Pin" on the Home screen — the extraction takes ~5 seconds
4. The saved recipe appears in the "Saved" tab. Tap to view, scale, or cook from it.

No special permissions are required beyond:
- Photos (only when the user manually taps "Change cover" on a recipe)
- Notifications (currently unused — included for future cook reminders)

The app works fully offline once recipes are saved.
```

### Contact information

```
First name: <your first name>
Last name: <your last name>
Phone number: <your phone>
Email: mycreativelab26@gmail.com
```

---

## What's New (release notes, for v1.0)

```
Welcome to Recipiny. Paste an Instagram, TikTok or YouTube recipe link and get a clean recipe on your phone. Cook from it, scale servings, swap to healthier versions, and back it up to your own cloud. All saved on your device.
```

---

## Screenshots required

Apple wants screenshots for these device sizes:

- **6.7" Display** (iPhone 15 Pro Max, 14 Pro Max): 1290 × 2796 px — required
- **6.5" Display** (iPhone 11 Pro Max): 1242 × 2688 px — recommended
- **5.5" Display** (older iPhones): 1242 × 2208 px — optional

You only need to upload the 6.7" set; Apple scales them for smaller listings.
**3-10 screenshots per size** — 5 is the sweet spot.

Suggested screens to capture (from Expo Go on your phone, or once you have a TestFlight build, from a real install):

1. Home — "Pin Recipe" with one or two recently-saved cards visible
2. Recipe screen — Tuscan Pasta (or any imported recipe) showing the hero image, servings stepper, and ingredients list
3. Recipe screen with Healthier toggled — calorie reduced, swap caption visible
4. Cook mode — full-screen step with the green progress dots
5. Saved tab — the 2-column grid with several recipes
6. (Optional) Profile — showing local-first messaging

Use your phone's built-in screenshot (volume-up + lock button on Face ID iPhones).
```

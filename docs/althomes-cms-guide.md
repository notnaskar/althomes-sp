# AltHomes CMS Guide

A practical handbook for editing your website content through Sanity Studio.

---

## Table of Contents

1. [Getting Started](#1-getting-started)
2. [Studio Layout — What Lives Where](#2-studio-layout--what-lives-where)
3. [Drafts, Publishing & Live Preview](#3-drafts-publishing--live-preview)
4. [Editing Properties](#4-editing-properties)
5. [Editing Experiences](#5-editing-experiences)
6. [Editing Reviews & Amenities](#6-editing-reviews--amenities)
7. [Editing Page Content (Home, Our Homes, Alt Way, etc.)](#7-editing-page-content)
8. [Blog Posts](#8-blog-posts)
9. [Legal Pages](#9-legal-pages)
10. [Image Upload Guide](#10-image-upload-guide)
11. [SEO Field Guide](#11-seo-field-guide)
12. [Off-Limits — Don't Touch Without Developer](#12-off-limits--dont-touch-without-developer)
13. [Free Tier Limits — What to Watch](#13-free-tier-limits--what-to-watch)
14. [Common Workflows — Hacks & Tricks](#14-common-workflows--hacks--tricks)
15. [Troubleshooting](#15-troubleshooting)
16. [Inviting Team Members](#16-inviting-team-members)

---

## 1. Getting Started

**Studio URL:** `https://yourdomain.com/studio`

**Login:** Use the Google/email account your developer added to the project. If login fails, contact your developer — only project admins can grant access.

**First time?** After login, you'll see a left sidebar with content sections. Click any item to open that document. Don't panic — nothing saves until you hit **Publish**.

---

## 2. Studio Layout — What Lives Where

The sidebar is grouped:

### Global
- **Site** — Site-wide settings (logo, footer, social links). *Mostly off-limits, see Section 12.*

### Core Pages
Singletons — one document each, controls a specific page:
- **Home Page** — Homepage (`/`)
- **Our Homes Page** — Listing page (`/our-homes`)
- **The Alt Way Page** — `/the-alt-way`
- **Experiences Page** — `/experiences`
- **Join Us Page** — `/join-us` (partner enquiry)
- **Contact Page** — `/contact`
- **Legal Pages** — Privacy policy, terms, etc. (multiple, by slug)

### Properties & Experiences
Collections — add/remove/edit many:
- **Properties** — Each home you list
- **Amenities** — Reusable amenity tags (Wi-Fi, Pool, etc.)
- **Experiences** — Curated experiences
- **Reviews** — Guest reviews

### Blog
- **Posts** — Blog articles

### Settings
- **Redirects** — URL redirects. *Off-limits, see Section 12.*

---

## 3. Drafts, Publishing & Live Preview

### How saving works

Sanity has two states per document:

| State | What it means |
|-------|---------------|
| **Draft** | Your unsaved/saved-but-unpublished work. Only visible to you in Studio. |
| **Published** | Live on website. |

When you edit, changes auto-save as a **Draft** every few seconds. Nothing hits the live site until you click **Publish**.

### Buttons (bottom of editor)
- **Publish** — Pushes draft → live.
- **Unpublish** — Removes from live site (but keeps draft).
- **Discard changes** — Throws away unsaved draft, restores last published version.
- **Duplicate** — Copies current document (handy for new properties/experiences).

### Live preview

Edits show on the live site within seconds of clicking Publish. No build/deploy needed.

> **How this works under the hood:** Sanity sends a webhook to the website on every Publish/Unpublish/Delete. The website receives it, invalidates the cache for the affected page, and the next visitor sees the new content. There's also a 5-minute fallback so even if a webhook is ever missed, the site self-refreshes within 5 min.
>
> If a published edit hasn't appeared after ~10 seconds: hard-refresh the page (Cmd+Shift+R / Ctrl+Shift+R). If still stale, contact your developer — webhook may need re-checking.

### Safety net

Every Publish creates a version in **History** (clock icon, top-right). You can revert to any past version. So: don't fear publishing — you can always roll back.

---

## 4. Editing Properties

Properties are the most complex doc. Fields are split across **tabs** (top of editor). Edit tab-by-tab.

### Identity
- **Title** — Property name (e.g. "The Tea Estate")
- **Slug** — URL path (`/our-homes/the-tea-estate`). Auto-generated from title. **Don't change after launch** — it breaks shared links.
- **Status** — `Active` (visible), `Hidden` (not on listing), `Coming Soon` (visible with badge)
- **Display Order** — Number controlling listing order. Lower = first.

### RentalWise
🚫 **Off-limits.** See Section 12.

### Listing Card
What shows on `/our-homes`:
- **Tagline, Short Description, Pull Quote** — Card copy
- **Card Thumbnail** — Used for social sharing previews (Open Graph)
- **Main Listing Photo** — Big left-side photo on listing page
- **Showcase Secondary Image** — Right-side panel photo
- **Showcase Decorative Image / Secondary Decor** — Optional botanical overlay (flower, leaf). Position via the Top/Right/Bottom/Left/Width/Height/Rotation fields. **Tip:** leave decor empty if unsure — looks cleaner.
- **Property Type, Price From, Card Amenities** — Card metadata text
- **Location Headline** — Short location text on card (e.g. "12.5 km from Ooty Bazaar")

### Intro
Detail page (`/our-homes/[slug]`):
- **Detail Page Cover Image** — Hero photo. Falls back to Main Listing Photo if empty.
- **Detail Intro Heading + Body** — Two-column intro section
- **Description** — Rich text body
- **Gallery** — Min 2 images, no max. Drag to reorder.
- **Gallery Section Quote** — Pull quote over gallery
- **Location Image** — Collage shown in "Getting Here"

### Specs & Amenities
- **Max Guests, Bedrooms, Bathrooms** — Numbers
- **Amenities** — Reference picker. Click "Add item" → choose from existing amenities. To add new ones, see Section 6.
- **House Rules Teaser + House Rules** — Short summary + full rich text rules

### Location
- **Location Data** — Map coordinates, address
- **Location Body** — "Getting Here" rich text
- **Location CTA** — Optional button (e.g. "Open in Google Maps")

### Highlights
4 fixed blocks for the property detail page. Each has title + body + image:
- **Wind Down** (dining-table block)
- **Wake Up** (tea-leaves block)
- **Hosted With Heart** (text-only, no image)
- **Symphony of Flavours** (food + menu CTA)

### Experiences
- **Related Experiences** — Reference picker, choose which experiences to show on this property page
- **Max Experiences Shown** — Default 3
- **Experiences Background Image** — Section background

### FAQs
- **FAQ Circle Badge Text** — Decorative badge text (defaults to "your questions, answered")
- **FAQs** — Add Q&A pairs. Question = string, Answer = rich text.

### Causes
- **Cause Headline + Body** — Charity/cause section
- **Cause Images** — Exactly 2 images required

### Reviews
- **Max Reviews Shown** — Default 5. Reviews auto-pull from Reviews collection.

### CTA
Bottom of detail page:
- **CTA Headline, Button Label, Background Image**

### SEO
See Section 11.

---

## 5. Editing Experiences

Simpler than properties. Single tab. Fill in title, description, images, optional CTA.

To add a new one: **Experiences** in sidebar → green **+** button (top-right) → fill in → Publish.

To link to property: open property → Experiences tab → Related Experiences → Add → pick.

---

## 6. Editing Reviews & Amenities

### Reviews
- **+ New** → guest name, quote, rating, optional photo, link to property → Publish.
- Auto-appear on linked property's detail page (up to "Max Reviews Shown" limit).

### Amenities
- Reusable tags. Add once, reference everywhere.
- **+ New** → name + icon → Publish.
- Then attach in any property's **Specs & Amenities** tab.

---

## 7. Editing Page Content

Singletons (one doc per page). Open from sidebar **Core Pages**.

| Page | Doc | Common edits |
|------|-----|--------------|
| Homepage | Home Page | Hero headline + image, nav labels |
| Our Homes | Our Homes Page | Page heading, intro, CTA |
| The Alt Way | Alt Way Page | All sections — text + images |
| Experiences | Experiences Page | Heading, intro, CTA background |
| Join Us | Join Us Page | Form intro, partner copy |
| Contact | Contact Page | Form intro, contact info |

**Navigation labels** live on Home Page → Navigation Labels (exactly 5 labels, locked).

---

## 8. Blog Posts

Sidebar → **Posts** → **+ New**.

Required:
- **Title, Slug** (auto-from-title)
- **Cover Image** (with alt text)
- **Body** — Rich text

Optional:
- **Excerpt** (preview text)
- **Author, Categories, Published Date**
- **SEO** fields

Publish → live at `/blog/[slug]`.

**Tip:** Use the rich text **Add ▾** menu to embed images mid-article. Always set alt text.

---

## 9. Legal Pages

Sidebar → **Legal Pages** → **+ New** or open existing.

Fields:
- **Title** — e.g. "Privacy Policy"
- **Slug** — Becomes URL path (`/privacy-policy`)
- **Heading + Subheading** — Two-line page heading
- **Body** — Rich text content
- **CTA Background** — Optional bottom-section image

---

## 10. Image Upload Guide

### Sizes (recommended)

| Use | Resolution | Format |
|-----|-----------|--------|
| Hero / Cover | ≥ 2400 × 1600 | JPG (best) or WebP |
| Gallery | ≥ 1800 × 1200 | JPG |
| Card thumbnails | ≥ 1200 × 800 | JPG |
| Decorative overlays | PNG with transparency | PNG |
| OG / social | 1200 × 630 | JPG |

**File size:** Keep under 2 MB before upload. Compress with [tinypng.com](https://tinypng.com) or [squoosh.app](https://squoosh.app) first — Sanity stores the original forever (counts toward asset quota).

### Upload steps
1. Click any image field → **Upload** → drag file or browse.
2. Sanity processes it. Wait for thumbnail to appear.
3. Click **Edit hotspot/crop** to set the focal point — the part that stays visible when image is cropped on different screens.
4. **Always fill alt text.** It's required on most fields, but mandatory for accessibility + SEO regardless.

### Hotspot
The dot you drag. Defines the "important" part. On mobile or square crops, the image centers on the hotspot. Set it on faces, key objects.

### Reusing images
Click **Select** instead of Upload → search media library. Avoids duplicate uploads.

---

## 11. SEO Field Guide

Most documents have an **SEO** tab. Fields:

| Field | What it does | Limit |
|-------|--------------|-------|
| **Meta Title** | Browser tab + Google result title | 50–60 chars |
| **Meta Description** | Google result preview text | 140–160 chars |
| **OG Image** | Image shown when shared on WhatsApp/Twitter/FB | 1200×630 |
| **No Index** | If checked, hides from Google. Use only for unfinished pages. | — |

**Tips:**
- Meta title: include brand → "The Tea Estate — AltHomes"
- Meta description: write a sentence a human would click on, not keyword soup
- OG image: use a clean photo, no logo overlay (every social platform crops differently)

If you leave SEO empty, defaults pull from the doc title + cover image.

---

## 12. Off-Limits — Don't Touch Without Developer

These break the website or cost money. Always ping your dev first.

### 🚫 Site singleton
- Logo, footer, social links — coordinated with code. Edit only with dev.
- **Megamenu** — Navigation structure. Wrong edits break header.

### 🚫 Redirects
- URL redirect rules. Misconfigured redirects = broken links + SEO damage.

### 🚫 Property → RentalWise tab
Three fields: `RentalWise Property ID`, `RentalWise Identifier`, `RentalWise Widget Property ID`.

These connect the property to the booking system. **Wrong values = broken availability calendar + booking widget = lost reservations.** Set once at property launch, never edit.

### 🚫 Slugs (after launch)
Once a page is live and shared, the slug = the URL = links you've sent out. Changing it 404s those links. Email your dev to set up a redirect first.

### 🚫 Schema fields you don't recognise
If a field has no description and you're unsure — leave it. Ask first.

---

## 13. Free Tier Limits — What to Watch

You're on Sanity's free tier. Quotas:

| Resource | Limit | What happens at limit |
|----------|-------|----------------------|
| **Documents** | 10,000 | Hard stop on creating new |
| **Asset bandwidth** | 100 GB/month | Images stop loading on site |
| **Asset storage** | 5 GB total | Can't upload new images |
| **API requests (CDN)** | 1M/month | Site reads fail |
| **Live Content updates** | Limited | Edits may not propagate instantly |
| **Users** | 3 non-admin | Can't invite more |

### Practical impact
- **Compress images before upload** (storage + bandwidth).
- **Delete old/unused assets.** Sidebar → cog → Assets → filter unused → delete.
- **Avoid duplicate uploads** — use the "Select" picker.
- **Don't bulk-import** hundreds of blog posts in one go.
- **History is free** — don't worry about creating versions, but don't restore-spam either.

You'll get an email warning at 80% of any quota. Forward it to your dev.

---

## 14. Common Workflows — Hacks & Tricks

### Adding a new property (the right order)
1. Get RentalWise IDs from dev (don't make them up).
2. **Duplicate** an existing property as template → rename → change slug.
3. Set status = `Coming Soon` while you fill content.
4. Fill tabs left-to-right: Identity → Listing Card → Intro → Specs → Location → Highlights → FAQs → CTA → SEO.
5. Upload all images, set hotspots, alt text.
6. Set status = `Active` → Publish.

### Hiding a property without deleting
Set **Status** to `Hidden`. Stays in Studio, vanishes from `/our-homes`. Reverse anytime.

### Quickly reordering listings
Edit each property's **Display Order** number. Lower = earlier. Use 10, 20, 30 (not 1, 2, 3) — leaves room to insert later.

### Reusing a review on multiple properties
Reviews link to *one* property. Duplicate the review and change the link.

### Bulk content updates
For 10+ similar edits, ask your dev to script it instead — faster + safer.

### Quick-find a document
`Cmd+K` (Mac) or `Ctrl+K` (Windows) opens search.

### Comparing versions
Top-right **clock icon** → see all versions side-by-side → revert with one click.

### Preview before publishing
After saving a draft, open the live page in another tab → drafts mode shows your changes if dev set up Visual Editing. If not, publish during low-traffic hours.

### Markdown-style shortcuts in rich text
Type `**bold**` → bold. `# heading` → heading. `> quote` → blockquote. Speeds up writing.

### Pasting from Word/Google Docs
Use **Cmd+Shift+V** (paste without formatting) to avoid weird styles. Then format inside Studio.

---

## 15. Troubleshooting

| Problem | Try this |
|---------|----------|
| Edit not showing on live site | Did you click **Publish**? Hard-refresh the page (Cmd+Shift+R). Wait 30s for CDN. |
| "You don't have permission" | Your role is read-only. Ask dev to upgrade. |
| Image won't upload | File too big (>20MB)? Wrong format (HEIC)? Convert to JPG. |
| Studio is blank/white | Hard refresh. Clear cache. Try incognito. Then ping dev. |
| Lost work | History tab → restore last published version. |
| Can't find a field | Check all tabs at top. Field may live in another tab. |
| Slug is taken | Slugs must be unique per type. Add a suffix or change. |
| "Reference not found" | The linked doc was deleted. Re-pick or remove the reference. |

---

## 16. Inviting Team Members

You're on the free tier — **3 non-admin seats max.**

To invite:
1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Pick the AltHomes project
3. **Members** tab → **Invite member**
4. Enter email + pick role:
   - **Viewer** — Read-only
   - **Editor** — Can edit + publish (recommended for content team)
   - **Administrator** — Full control. Don't hand out lightly.
5. They get an email → accept → log into `/studio`.

To revoke: same screen → click member → Remove.

If you hit the 3-seat limit, either remove someone or upgrade the plan (paid).

---

## Need Help?

Contact your developer. Include:
- What you were trying to do
- The document title + URL of the Studio page
- Screenshot of any error
- Whether you clicked Publish or not

Don't hit Publish on something you're unsure about — leave it as a draft and ask first.

---

## Appendix A — Webhook Setup (Developer Reference)

This site uses **on-demand revalidation** so Studio Publishes appear on the live site within seconds. One-time setup:

### Environment variables

Set on the host (Vercel / Coolify / etc.):

```
REVALIDATE_SECRET=<random 32+ char string>
```

Generate with `openssl rand -hex 32`. Store securely.

### Sanity webhook configuration

1. Open [sanity.io/manage](https://sanity.io/manage) → AltHomes project → **API** → **Webhooks** → **Create webhook**
2. Fill in:
   - **Name**: `Revalidate Next site (production)`
   - **URL**: `https://<your-live-domain>/api/revalidate`
   - **Dataset**: `production`
   - **Trigger on**: Create, Update, Delete
   - **Filter (GROQ)**:
     ```
     _type in ["site","homePage","ourHomesPage","altWayPage","experiencesPage","joinUsPage","contactPage","legalPage","property","experience","review","amenity","blog.post","redirect"]
     ```
   - **Projection**:
     ```
     {_type, "slug": slug.current, _id}
     ```
   - **Secret**: same value as `REVALIDATE_SECRET`
   - **HTTP method**: `POST`
   - **API version**: `v2025-10-23`
3. Save → click **Attempt delivery** to smoke-test (should return `{ revalidated: true, ... }`).

### How it works

- Webhook → `POST /api/revalidate` (route at `src/app/(site)/api/revalidate/route.ts`)
- Route HMAC-verifies signature with `REVALIDATE_SECRET` via `next-sanity/webhook` `parseBody`
- Whitelists `_type`, calls `revalidateTag(_type)` and `revalidateTag(_type:slug)` for affected docs
- Tagged fetches in `src/sanity/lib/data.ts` invalidate → next visitor gets fresh HTML

### Safety net

`src/app/(site)/layout.tsx` exports `revalidate = 300` → ISR refresh every 5 min if webhooks ever fail silently.

### Migrating hosting (e.g. Vercel → Coolify)

1. Copy all env vars (`REVALIDATE_SECRET` etc.) to new host
2. Redeploy
3. In sanity.io/manage → Webhooks → edit existing webhook → change URL to new domain
4. Test: edit + publish a doc → reload site → confirm change visible


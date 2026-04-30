# CMS Dependencies

These items require Sanity schema or content updates before the frontend fix can be executed. NOT executed by the frontend executor — route to the CMS/schema owner.

---

## Header CTA from Sanity Site Document

**Component/Page:** `src/ui/header/index.tsx:18-29` (desktop CTA), `src/ui/header/index.tsx:32-45` (mobile mini CTA)
**What's needed:** The header already has `site.navCtaLabel` and `site.navCtaLink` wired from the Sanity `site` document. The inline-style hex values in the header are the actual bug — they should just be using the `NavCta` atom with those two props. No schema change needed. **Content action:** Confirm that `navCtaLabel` and `navCtaLink` are populated in the Sanity Studio `Site` singleton before the frontend fix goes live. If either is blank the button will be hidden by design.
**Why:** The `NavCta` atom is already built and correct — the organism is bypassing it with a duplicated inline-style implementation. Once the atom is used, the CTA label and link are fully CMS-managed.

---

## Home Hero — Hero Image Priority & Sizes

**Component/Page:** `src/ui/home-hero.tsx:19` (URL builder), `src/ui/home-hero.tsx:31-40` (Image component)
**What's needed:** No schema change. The `heroImage` field already exists on the `homePage` document. The frontend fix (remove the forced `.height(900)` crop and update `sizes`) is purely code-side.
**Content action:** Ensure the hero image uploaded in Studio has a natural aspect ratio close to 1:1 (the circle crop renders it square). If the image is very wide or very tall, the crop will look wrong once the forced `.height(900)` is removed. Ask the content team to verify the uploaded image.
**Why:** The forced `.width(900).height(900)` crop is masking potentially wrong-ratio uploads. Removing it reveals the original image.

---

## Hero Image — Mobile Preload Suppression

**Component/Page:** `src/ui/home-hero.tsx:31-40`
**What's needed:** No schema change. The fix is code-only: update `sizes` to `"(max-width: 820px) 0px, 856px"` so the browser does not download the hero image on mobile (where `.heroImg` is `display: none`).
**Content action:** None required.
**Why:** Listed as CMS-DEP in audit because the heroImage originates from the `homePage` Sanity document — but the fix is entirely frontend. Flagged here for traceability.

---

## Experiences Hero — Background Image Quality

**Component/Page:** `src/ui/pages/experiences/experiences-updated/experiences-hero.tsx:27-28`
**What's needed:** No schema change. `heroBackground` already exists on the `experiencesPage` document. Frontend fix: add `.width(1440).quality(85)` to the URL builder call.
**Content action:** Verify that the image uploaded to `experiencesPage.heroBackground` in Studio is at least 1440px wide. If it is smaller, increasing `.width(1440)` will cause upscaling — the content team should upload a high-resolution version.
**Why:** Fetching full-resolution Sanity originals without width/quality constraints means unpredictable download sizes across devices.

---

## The Alt Way — Hero Background Image

**Component/Page:** `src/app/(site)/the-alt-way/page.tsx:17-22`
**What's needed:** No schema change. `heroBackground` already exists on the `altWayPage` document. Frontend fix: add `quality={85}` to the `<Img>` and change `loading="eager"` to `priority`.
**Content action:** Verify that `altWayPage.heroBackground` has a high-resolution image uploaded (≥1440px wide).
**Why:** `loading="eager"` does not add a `<link rel="preload">` to `<head>` — `priority` does. Above-the-fold images should use `priority`.

---

## Join Us — Hero Cover Image

**Component/Page:** `src/app/(site)/join-us/page.tsx:43`
**What's needed:** No schema change. `heroImage` exists on `joinUsPage`. Frontend fix: add `.quality(85)` to URL builder; change `sizes="1440px"` → `sizes="100vw"`.
**Content action:** Verify `joinUsPage.heroImage` is populated with a high-res image (≥1440px wide) in Studio.
**Why:** `sizes="1440px"` is a fixed pixel hint that prevents Next.js from serving smaller optimised variants at sub-1440 viewports.

---

## Blog Post Hero Image

**Component/Page:** `src/ui/modules/blog/blog-post-content.tsx:32-41`
**What's needed:** No schema change. `post.metadata.image` already exists on `blog.post`. Frontend fix: change `loading="eager"` → `priority`; add `sizes="100vw"` and `quality={85}`.
**Content action:** Ensure all published blog posts have a `metadata.image` set. Posts without an image will render without a hero — that is acceptable (the component should already guard `if (!post.metadata?.image) return null`).
**Why:** Blog post hero images are above the fold and need preloading via `priority`, not just eager loading.

---

## Header Navigation — CMS-Driven Nav Items

**Component/Page:** `src/ui/header/navigation.tsx:4-9`
**What's needed:** The `NAV_ITEMS` array is hardcoded (`Our Homes`, `Experiences`, `The Alt Way`, `Blog`). To make this CMS-managed, the Sanity `site` document needs a new `headerNav` array field: `{ label: string, url: string, megamenu?: boolean }[]`.
**Schema change required:**
1. Add `headerNav` field to `src/sanity/schemaTypes/documents/site.ts` — array of `{ label: string, url: string }` objects.
2. Add `headerNav` to `SITE_QUERY` in `src/sanity/lib/queries.ts` (using `defineQuery()`).
3. Run `npm run typegen`.
4. Update `navigation.tsx` to consume `site.headerNav` instead of the hardcoded array.
5. Populate nav items in Sanity Studio.
**Why:** Content editors cannot currently add, remove, or reorder nav items without a code deploy.

---

## Footer Navigation — CMS-Driven Footer Nav

**Component/Page:** `src/ui/footer/navigation.tsx:3-10`
**What's needed:** `FOOTER_NAV` is hardcoded with the same four links as the header. Needs a `footerNav` field on the Sanity `site` document, similar to `headerNav` above.
**Schema change required:**
1. Add `footerNav` field to `src/sanity/schemaTypes/documents/site.ts`.
2. Add to `SITE_QUERY`.
3. Run `npm run typegen`.
4. Update `footer/navigation.tsx` to consume `site.footerNav`.
5. Populate in Studio.
**Why:** Footer nav items are hardcoded — editors cannot manage them from Studio.

---

## Blog Category Filter — Sanity Category Fetch

**Component/Page:** `src/ui/modules/blog/filter-list.tsx:1-9`
**What's needed:** `FilterList` currently renders only an `<Filter>All</Filter>` with no categories from the CMS. The blog category filter is non-functional.
**Schema change required:**
1. Confirm that blog categories exist as a Sanity document type (likely `blog.category` or similar). If not, create it: `{ title: string, slug: { current: string } }`.
2. Add a `BLOG_CATEGORIES_QUERY = defineQuery(\`*[_type == "blog.category"] { _id, title, slug }\`)` to `queries.ts`.
3. Run `npm run typegen`.
4. Update `filter-list.tsx` to fetch categories via `sanityFetch` and pass each as a `<Filter value={slug}>` child.
5. Wire the `category` query param in `paginated-posts.tsx` to filter by the selected category's slug.
**Why:** Filtering is completely non-functional from the UI — the CMS categories are not being fetched or rendered.

---

## Property Detail — Causes & Reviews Sections

**Component/Page:** `src/app/(site)/our-homes/[slug]/page.tsx:404-432`
**What's needed:** The Causes section (`bg-gray-900`, `prose prose-invert`) and Reviews section (`container`, `md:grid-cols-2 lg:grid-cols-3`) are placeholder implementations with no design system tokens. These sections require both frontend token fixes (covered in Group 1 and Group 4 of REMEDIATION.md) and confirmation that the CMS fields driving them (`property.causes[]`, `property.reviews[]`) are fully populated and typed.
**Content action:** Verify in Studio that at least one property document has both `causes` images and `reviews` populated, so the sections can be visually validated after the token fixes are applied.
**Why:** Placeholder sections with no tokens cannot be visually reviewed until content exists in CMS and tokens are applied together.

---

## Home Hero Image — Aspect Ratio Verification

**Component/Page:** `src/ui/home-hero.tsx:19`
**What's needed:** No schema change. The frontend fix removes the forced `.height(900)` crop from the Sanity URL builder. After removal, the hero image will display at its natural aspect ratio within the circular clip.
**Content action:** The content team must verify the `homePage.heroImage` uploaded in Studio has a natural 1:1 (or portrait) aspect ratio. If the image was uploaded in landscape, the circular crop will look wrong after the forced height is removed. Upload a portrait or square hero image.
**Why:** The forced crop was masking this content requirement.

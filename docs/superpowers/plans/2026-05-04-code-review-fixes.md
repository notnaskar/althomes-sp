# Code Review Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all 4 critical and 6 important findings from the May 4 code review across 5 source files.

**Architecture:** Surgical single-file edits per task. No refactors beyond the fix scope. Typecheck after each task. Atomic commits.

**Tech Stack:** Next.js 16 App Router · TypeScript · Tailwind v4 · Sanity v3 · React Hook Form

---

## Files Modified

| File | Tasks |
|------|-------|
| `src/ui/forms/contact-form.tsx` | Task 1 |
| `src/ui/molecules/reviews-section.tsx` | Task 2 |
| `src/ui/pages/our-homes/property-faq-section.tsx` | Task 3 |
| `src/app/(site)/contact/page.tsx` | Task 4 |
| `src/sanity/schemaTypes/documents/contactPage.ts` | Task 5 |
| `src/sanity/types.ts` | Task 5 (auto-generated via typegen) |
| `src/sanity/schema.json` | Task 5 (auto-generated via typegen) |
| `src/ui/UI_GUIDELINES.md` | Task 6 |

---

## Task 1: Fix submit button token — contact-form.tsx

**Files:**
- Modify: `src/ui/forms/contact-form.tsx:140`

**Finding (Critical):** Button uses `bg-[#F8C844] text-black` — wrong hex (`#F8C844` ≠ accent `#F2C94C`) and wrong token classes. Tracking downgraded from `[0.3em]` to `[0.2em]` — restore per guidelines. Correct tokens: `bg-accent text-accent-foreground`, tracking `[0.3em]`.

- [ ] **Step 1: Edit line 140**

Change:
```tsx
className="mt-6 inline-block w-full min-[821px]:w-auto rounded-[3px] bg-[#F8C844] px-10 py-3.5 text-[11px] font-bold text-black tracking-[0.2em] uppercase transition hover:opacity-90 disabled:opacity-50"
```
To:
```tsx
className="mt-6 inline-block w-full min-[821px]:w-auto rounded-[3px] bg-accent px-10 py-3.5 text-[11px] font-bold text-accent-foreground tracking-[0.3em] uppercase transition hover:bg-accent/90 disabled:opacity-50"
```

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```
Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/ui/forms/contact-form.tsx
git commit -m "fix(ui): use bg-accent/text-accent-foreground on contact form submit button"
```

---

## Task 2: Fix reviews-section.tsx — broken asset, hardcoded hex, redundant inline style

**Files:**
- Modify: `src/ui/molecules/reviews-section.tsx`

**Findings:**
- **(Critical)** Lines 19-23: `url('/images/tree-illustration.svg')` — file does not exist in `/public`. Broken in production. Comment says "Placeholder" which is itself a guideline violation.
- **(Critical)** Line 76: `bg-[#E8DDD0]` — wrong color. Design token is `bg-card-shell` (`#E3D5C1`).
- **(Important)** Lines 26-27: `style={{ fontFamily: 'var(--font-stories)', fontWeight: 400, fontStyle: 'normal' }}` redundant — overrides Tailwind classes. `fontStyle: 'normal'` actively fights italic variants.

- [ ] **Step 1: Remove tree illustration placeholder div (lines 19-23)**

Delete these lines entirely from `reviews-section.tsx`:
```tsx
				{/* Decorative Tree Illustration Placeholder */}
				<div 
					className="hidden lg:block absolute top-0 left-0 h-full w-[100px] bg-no-repeat bg-left-top bg-contain pointer-events-none opacity-50"
					style={{ backgroundImage: "url('/images/tree-illustration.svg')" }} 
				/>
```

- [ ] **Step 2: Remove redundant inline style from quote paragraph (line 26-27)**

Change:
```tsx
				<p
					className="font-stories text-[30px] leading-[1.4] text-primary-foreground max-w-[453px] relative z-10"
					style={{ fontFamily: 'var(--font-stories)', fontWeight: 400, fontStyle: 'normal' }}
				>
```
To:
```tsx
				<p className="font-stories text-[30px] leading-[1.4] text-primary-foreground max-w-[453px] relative z-10">
```

- [ ] **Step 3: Fix hardcoded hex on review card (line 76)**

Change:
```tsx
					className="w-full max-w-[541px] lg:-rotate-[2.94deg] lg:ml-[18px] bg-[#E8DDD0] rounded-[8px] shadow-[0px_8px_32px_rgba(0,0,0,0.08)] overflow-hidden transition-transform duration-500 ease-in-out"
```
To:
```tsx
					className="w-full max-w-[541px] lg:-rotate-[2.94deg] lg:ml-[18px] bg-card-shell rounded-[8px] shadow-[0px_8px_32px_rgba(0,0,0,0.08)] overflow-hidden transition-transform duration-500 ease-in-out"
```

- [ ] **Step 4: Typecheck**

```bash
npm run typecheck
```
Expected: 0 errors.

- [ ] **Step 5: Commit**

```bash
git add src/ui/molecules/reviews-section.tsx
git commit -m "fix(ui): remove broken tree placeholder, use card-shell token, drop redundant inline style"
```

---

## Task 3: Fix property-faq-section.tsx — focus ring + SVG ID collision

**Files:**
- Modify: `src/ui/pages/our-homes/property-faq-section.tsx`

**Findings:**
- **(Important)** Line 37: `outline-none` removes browser focus ring with no `focus-visible:` replacement — keyboard users lose focus indicator.
- **(Minor)** Line 19: `id="circlePath"` is a generic document-scoped ID. If a second SVG on the page uses the same ID, `<textPath href="#circlePath">` resolves to the wrong element. Rename to a unique descriptor.

- [ ] **Step 1: Fix SVG ID (line 19)**

Change:
```tsx
						id="circlePath"
```
To:
```tsx
						id="faq-circle-path"
```

- [ ] **Step 2: Fix textPath href (line 24)**

Change:
```tsx
							<textPath href="#circlePath" startOffset="0%">
```
To:
```tsx
							<textPath href="#faq-circle-path" startOffset="0%">
```

- [ ] **Step 3: Add focus-visible ring to accordion summary (line 37)**

Change:
```tsx
						<summary className="flex cursor-pointer list-none items-center justify-between gap-4 outline-none">
```
To:
```tsx
						<summary className="flex cursor-pointer list-none items-center justify-between gap-4 outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:rounded-sm">
```

- [ ] **Step 4: Typecheck**

```bash
npm run typecheck
```
Expected: 0 errors.

- [ ] **Step 5: Commit**

```bash
git add src/ui/pages/our-homes/property-faq-section.tsx
git commit -m "fix(a11y): restore focus-visible ring on FAQ accordion; rename SVG id to avoid collisions"
```

---

## Task 4: Fix contact/page.tsx — bg-white token, phone icon, SocialLinks molecule

**Files:**
- Modify: `src/app/(site)/contact/page.tsx`

**Findings:**
- **(Critical)** Line 171: `bg-white` is not a design token. Join-us page uses `bg-[var(--color-white)]` for the same pattern — match it.
- **(Important)** Lines 74-79: Phone row uses `pl-6` as a visual spacer but has no icon. Email row (line 82-88) already has an SVG icon. Inconsistent.
- **(Important)** Lines 119-165: Social links reimplemented inline — 4 anchor+SVG blocks duplicating the `SocialLinks` molecule at `src/ui/molecules/social-links.tsx`. Use the molecule.
- **(Minor)** Line 171: `h-[fit-content]` → `h-fit` (canonical Tailwind class).

- [ ] **Step 1: Add SocialLinks import**

At the top of `contact/page.tsx`, after the existing imports, add:
```tsx
import SocialLinks from '@/ui/molecules/social-links'
```

- [ ] **Step 2: Add phone icon to phone row (lines 74-79)**

Change:
```tsx
							{page.phone && (
								<div className="flex items-center gap-3">
									<a href={`tel:${page.phone}`} className="text-[13px] font-semibold text-foreground/80 hover:text-accent tracking-wide pl-6">
										{page.phone}
									</a>
								</div>
							)}
```
To:
```tsx
							{page.phone && (
								<div className="flex items-center gap-3">
									<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground shrink-0" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 9.63 19.79 19.79 0 0 1 1 1.16 2 2 0 0 1 2.96 0h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 7.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 15h0l.92 1.92z"></path></svg>
									<a href={`tel:${page.phone}`} className="text-[13px] font-semibold text-foreground/80 hover:text-accent tracking-wide">
										{page.phone}
									</a>
								</div>
							)}
```

- [ ] **Step 3: Replace inline social links block with SocialLinks molecule (lines 113-166)**

Replace the entire Follow Us block:
```tsx
					{/* Follow Us Block */}
					{(site?.facebookUrl ||
						site?.instagramUrl ||
						site?.linkedinUrl ||
						site?.youtubeUrl) && (
						<div>
							<h2 className="font-stories text-[40px] min-[821px]:text-[56px] tracking-wide mb-4 min-[821px]:mb-6 text-foreground leading-none">Follow Us</h2>
							<div className="flex gap-4 pl-2">
								{site?.facebookUrl && (
									<a href={site.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-foreground transition hover:text-accent" aria-label="Facebook">
										<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
									</a>
								)}
								{site?.instagramUrl && (
									<a href={site.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-foreground transition hover:text-accent" aria-label="Instagram">
										<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
									</a>
								)}
								{site?.linkedinUrl && (
									<a href={site.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-foreground transition hover:text-accent" aria-label="LinkedIn">
										<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
									</a>
								)}
								{site?.youtubeUrl && (
									<a href={site.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-foreground transition hover:text-accent" aria-label="YouTube">
										<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
									</a>
								)}
							</div>
						</div>
					)}
```
With:
```tsx
					{/* Follow Us Block */}
					{(site?.facebookUrl ||
						site?.instagramUrl ||
						site?.linkedinUrl ||
						site?.youtubeUrl) && (
						<div>
							<h2 className="font-stories text-[40px] min-[821px]:text-[56px] tracking-wide mb-4 min-[821px]:mb-6 text-foreground leading-none">Follow Us</h2>
							<div className="pl-2">
								<SocialLinks
									size={16}
									instagram={site?.instagramUrl}
									facebook={site?.facebookUrl}
									linkedin={site?.linkedinUrl}
									youtube={site?.youtubeUrl}
								/>
							</div>
						</div>
					)}
```

- [ ] **Step 4: Fix bg-white + h-[fit-content] on form card (line 171)**

Change:
```tsx
					<div className="bg-white min-[821px]:bg-white/95 px-6 py-12 min-[821px]:py-[80px] min-[821px]:pr-[120px] min-[821px]:pl-[80px] relative z-20 w-full h-[fit-content] mb-[10%] max-w-[550px] min-[821px]:mr-[80px] shadow-none min-[821px]:shadow-sm">
```
To:
```tsx
					<div className="bg-[var(--color-white)] min-[821px]:bg-[var(--color-white)]/95 px-6 py-12 min-[821px]:py-[80px] min-[821px]:pr-[120px] min-[821px]:pl-[80px] relative z-20 w-full h-fit mb-[10%] max-w-[550px] min-[821px]:mr-[80px] shadow-none min-[821px]:shadow-sm">
```

- [ ] **Step 5: Typecheck**

```bash
npm run typecheck
```
Expected: 0 errors.

- [ ] **Step 6: Commit**

```bash
git add src/app/(site)/contact/page.tsx
git commit -m "fix(ui): use --color-white token, add phone icon, delegate social links to SocialLinks molecule"
```

---

## Task 5: Add CMS fields for contact page section headings

**Files:**
- Modify: `src/sanity/schemaTypes/documents/contactPage.ts`
- Auto-generated: `src/sanity/types.ts`, `src/sanity/schema.json`
- Modify: `src/app/(site)/contact/page.tsx`

**Finding (Important):** "Our Office" and "Follow Us" are hardcoded strings in JSX. All text must originate from CMS per project guidelines. The `CONTACT_PAGE_QUERY` uses `...` spread, so new string fields on `contactPage` are automatically included — no query change needed.

- [ ] **Step 1: Add two fields to contactPage.ts**

In `src/sanity/schemaTypes/documents/contactPage.ts`, after the `formCardHeading` field definition, add:

```ts
		defineField({
			name: 'officeSectionTitle',
			title: 'Office Section Title',
			type: 'string',
			description: 'Heading above the office address block. Defaults to "Our Office" if empty.',
		}),
		defineField({
			name: 'followUsSectionTitle',
			title: 'Follow Us Section Title',
			type: 'string',
			description: 'Heading above the social links block. Defaults to "Follow Us" if empty.',
		}),
```

- [ ] **Step 2: Run typegen**

```bash
npm run typegen
```
Expected: `src/sanity/types.ts` and `src/sanity/schema.json` updated. No errors.

- [ ] **Step 3: Update contact page to use the CMS fields**

In `src/app/(site)/contact/page.tsx`, change line 95 (the "Our Office" h2):
```tsx
							<h2 className="font-stories text-[40px] min-[821px]:text-[56px] tracking-wide mb-4 min-[821px]:mb-6 text-foreground leading-none">Our Office</h2>
```
To:
```tsx
							<h2 className="font-stories text-[40px] min-[821px]:text-[56px] tracking-wide mb-4 min-[821px]:mb-6 text-foreground leading-none">{page.officeSectionTitle ?? 'Our Office'}</h2>
```

Change line 118 (the "Follow Us" h2):
```tsx
							<h2 className="font-stories text-[40px] min-[821px]:text-[56px] tracking-wide mb-4 min-[821px]:mb-6 text-foreground leading-none">Follow Us</h2>
```
To:
```tsx
							<h2 className="font-stories text-[40px] min-[821px]:text-[56px] tracking-wide mb-4 min-[821px]:mb-6 text-foreground leading-none">{page.followUsSectionTitle ?? 'Follow Us'}</h2>
```

- [ ] **Step 4: Typecheck**

```bash
npm run typecheck
```
Expected: 0 errors.

- [ ] **Step 5: Commit**

```bash
git add src/sanity/schemaTypes/documents/contactPage.ts src/sanity/types.ts src/sanity/schema.json src/app/(site)/contact/page.tsx
git commit -m "feat(cms): add officeSectionTitle + followUsSectionTitle fields to contactPage"
```

---

## Task 6: Resolve breakpoint policy contradiction

**Files:**
- Modify: `src/ui/UI_GUIDELINES.md`

**Finding (Important):** `UI_GUIDELINES.md` says "single breakpoint 820px, use `max-[820px]:`". The `claude-design-guideline.md` (updated in this working-tree batch) now says "use standard Tailwind breakpoints; avoid arbitrary values." New components in this batch (FAQ, reviews) already use `md:` and `lg:`. The contradiction must be resolved so future agents follow a consistent policy.

Decision: Adopt standard Tailwind breakpoints as canonical. Existing `min-[821px]:` / `max-[820px]:` in older code is legacy — no forced conversion required unless refactoring that component.

- [ ] **Step 1: Update the breakpoint section in UI_GUIDELINES.md**

Find lines 68-72:
```markdown
## Responsive Breakpoint

**Single breakpoint: 820px** — below is mobile, above is desktop.

Use `max-[820px]:` prefix in Tailwind for mobile overrides. No other breakpoints unless design explicitly requires.
```

Replace with:
```markdown
## Responsive Breakpoints

Use standard Tailwind v4 default breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

**Guidance:**
- Design mobile-first by default.
- Use `md:` or `lg:` for primary tablet/desktop layout shifts.
- Do not use arbitrary values like `min-[821px]:` or `max-[820px]:` in new code.
- Existing code using `max-[820px]:` / `min-[821px]:` is legacy — leave as-is unless refactoring that component.
```

- [ ] **Step 2: Commit**

```bash
git add src/ui/UI_GUIDELINES.md
git commit -m "docs: align UI_GUIDELINES breakpoint policy with claude-design-guideline.md"
```

---

## Task 7: Final verification

**Files:** None modified.

- [ ] **Step 1: Full typecheck**

```bash
npm run typecheck
```
Expected: 0 errors.

- [ ] **Step 2: Start dev server**

```bash
npm run dev
```

- [ ] **Step 3: Visual verification checklist**

| Page | What to verify |
|------|---------------|
| `/contact` | Form card is off-white (not bright white); button is accent yellow (not `#F8C844`); phone row has phone icon; social icons render via SocialLinks molecule (filled style, size 16); "Our Office" + "Follow Us" headings visible |
| `/contact` mobile | Decorative tulip asset renders (mobileHeroAsset); layout collapses to single column |
| `/our-homes/[slug]` | FAQ section visible with green background; circle text badge renders; accordion opens/closes |
| `/our-homes/[slug]` — keyboard | Tab to FAQ accordion `<summary>` — white focus ring must be visible against green bg |
| Any page with ReviewsSection | Review card has `bg-card-shell` beige (not `#E8DDD0`); no broken console errors for missing SVG |

- [ ] **Step 4: Lint**

```bash
npm run lint
```
Expected: no new lint errors.

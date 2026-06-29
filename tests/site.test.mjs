import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readOutput = (path) =>
  readFile(new URL(`../dist/${path}`, import.meta.url), "utf8");

const readSource = (path) =>
  readFile(new URL(`../${path}`, import.meta.url), "utf8");

const composite = ([red, green, blue, alpha], background) => [
  red * alpha + background[0] * (1 - alpha),
  green * alpha + background[1] * (1 - alpha),
  blue * alpha + background[2] * (1 - alpha),
];

const relativeLuminance = ([red, green, blue]) => {
  const linear = [red, green, blue].map((channel) => {
    const value = channel / 255;
    return value <= 0.04045
      ? value / 12.92
      : ((value + 0.055) / 1.055) ** 2.4;
  });

  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
};

const contrastRatio = (foreground, background) => {
  const lighter = Math.max(
    relativeLuminance(foreground),
    relativeLuminance(background),
  );
  const darker = Math.min(
    relativeLuminance(foreground),
    relativeLuminance(background),
  );

  return (lighter + 0.05) / (darker + 0.05);
};

test("homepage contains the approved content structure", async () => {
  const html = await readOutput("index.html");

  assert.match(html, /<main id="main-content"/);
  assert.match(html, /class="site-frame"/);
  assert.equal((html.match(/class="site-side"/g) ?? []).length, 2);
  assert.match(html, /Nikolaos Banis/);
  assert.equal((html.match(/class="intro-copy"> <p>/g) ?? []).length, 1);
  assert.match(html, /Past work/);
  assert.match(html, /Selected work/);
  assert.doesNotMatch(html, /id="now-title">Now/);
  assert.equal((html.match(/class="past-work-item"/g) ?? []).length, 5);
  assert.equal((html.match(/class="project-row"/g) ?? []).length, 6);
  assert.doesNotMatch(html, /playground-sidebar/);
});

test("homepage frame uses diagonal side fields and single separators", async () => {
  const html = await readOutput("index.html");
  const css = await readOutput(
    html.match(/href="([^"]+\.css)"/)?.[1].replace(/^\//, "") ?? "",
  );

  assert.match(css, /\.site-side\{/);
  assert.match(css, /repeating-linear-gradient\(135deg/);
  assert.match(css, /grid-template-columns:var\(--side-column-width\)/);
  assert.match(css, /\.site-side:first-child\{/);
  assert.match(css, /\.site-side:last-child\{/);
  assert.match(css, /border-inline:/);
  assert.match(css, /\.home-main>\*\+\*\{/);
  assert.match(css, /\.home-main>\*\{min-width:0/);
});

test("homepage exposes a persistent version toggle for iteration", async () => {
  const html = await readOutput("index.html");
  const css = await readSource("src/styles/global.css");
  const component = await readSource("src/components/HomeVersionToggle.astro");

  assert.match(html, /data-home-version="v1"/);
  assert.match(html, /aria-label="Homepage version switcher"/);
  assert.match(html, /name="home-version"/);
  assert.match(html, /value="v1"/);
  assert.match(html, /value="v2"/);
  assert.match(html, /version-toggle-indicator/);
  assert.match(component, /localStorage\.getItem\(versionStorageKey\)/);
  assert.match(component, /frame\.dataset\.homeVersion = value/);
  assert.match(css, /\.version-toggle\s*\{/);
  assert.match(css, /\.site-frame\[data-home-version="v2"\]\s*\{/);
});

test("homepage v2 provides a two-column case-study explorer", async () => {
  const html = await readOutput("index.html");
  const css = await readSource("src/styles/global.css");
  const component = await readSource("src/components/HomeVersionTwo.astro");

  assert.match(html, /class="home-v2"/);
  assert.match(html, /data-home-v2-workspace/);
  assert.doesNotMatch(html, /Current page/);
  assert.match(html, /Past experience/);
  assert.doesNotMatch(html, /Design canvas/);
  assert.equal((html.match(/class="home-v2-case-row/g) ?? []).length, 6);
  assert.match(html, /class="home-v2-case-row" href="\/work\/statista-statistics"/);
  assert.match(html, /class="home-v2-case-row" href="\/work\/invoice-management"/);
  assert.match(html, /class="home-v2-case-row home-v2-case-row--draft"/);
  assert.equal((html.match(/class="home-v2-experience-item"/g) ?? []).length, 5);
  assert.doesNotMatch(component, /showProject|showExplorer|data-home-v2-detail/);
  assert.match(css, /\.site-frame\[data-home-version="v2"\]\s*\{[\s\S]*?grid-template-columns: minmax\(0, 1fr\)/);
  assert.match(css, /\.site-frame\[data-home-version="v2"\] \.site-side/);
  assert.match(css, /\.site-frame\[data-home-version="v2"\] \.site-footer/);
  assert.match(css, /grid-template-columns: minmax\(20rem, 40rem\) minmax\(0, 1fr\)/);
  assert.match(css, /\.home-v2-column--empty/);
  assert.doesNotMatch(css, /\.home-v2-page-card|\.home-v2-detail-view/);
  assert.doesNotMatch(css, /\.home-v2-canvas/);
  assert.match(css, /\.site-frame\[data-home-version="v2"\] \.home-version-v1/);
});

test("header exposes accessible icon-only actions without a dead CV link", async () => {
  const html = await readOutput("index.html");

  assert.match(html, /href="mailto:nbanis30@gmail\.com"/);
  assert.match(html, /href="https:\/\/linkedin\.com\/in\/nikosbn"/);
  assert.match(html, /href="https:\/\/x\.com\/Nikos_bn"/);
  assert.match(html, /aria-label="Email Nikolaos Banis"/);
  assert.match(html, /aria-label="View Nikolaos Banis on LinkedIn"/);
  assert.match(html, /aria-label="Follow Nikolaos Banis on X"/);
  assert.match(html, /Send me a message/);
  assert.match(html, /Connect with me/);
  assert.match(html, /Follow me on X/);
  assert.doesNotMatch(html, /Motion preview/);
  assert.doesNotMatch(html, /tooltip-demo-mark/);
  assert.doesNotMatch(html, />Email<\/span>/);
  assert.doesNotMatch(html, />LinkedIn<\/span>/);
  assert.doesNotMatch(html, />CV<\/span>/);
});

test("past work uses an exclusive accessible accordion", async () => {
  const html = await readOutput("index.html");

  assert.equal((html.match(/class="past-work-item"/g) ?? []).length, 5);
  assert.equal((html.match(/class="past-work-trigger"/g) ?? []).length, 5);
  assert.equal((html.match(/aria-expanded="false"/g) ?? []).length, 5);
  assert.equal((html.match(/aria-controls="past-work-panel-/g) ?? []).length, 5);
  assert.equal((html.match(/class="past-work-reveal"/g) ?? []).length, 5);
  assert.equal((html.match(/role="region"/g) ?? []).length, 5);
  assert.equal((html.match(/ inert/g) ?? []).length, 5);
  assert.doesNotMatch(html, /<details/);
  assert.equal((html.match(/class="past-work-leader"/g) ?? []).length, 5);
  assert.equal((html.match(/class="past-work-separator"/g) ?? []).length, 5);
  assert.doesNotMatch(html, /AI-assisted survey workflows, statistics platform/);
  assert.doesNotMatch(html, /Financial workflows, logistics tools, design systems/);
  assert.equal((html.match(/class="past-work-copy"/g) ?? []).length, 5);
  assert.doesNotMatch(html, /class="past-work-lead"/);
  assert.doesNotMatch(html, /Related work/);
});

test("past work motion is interruptible and avoids measured heights", async () => {
  const component = await readSource("src/components/PastWorkAccordion.astro");
  const css = await readSource("src/styles/global.css");

  assert.match(component, /aria-expanded="false"/);
  assert.match(component, /setExpanded/);
  assert.match(component, /closeOthers/);
  assert.match(component, /event\.key !== "Escape"/);
  assert.match(component, /document\.addEventListener\("pointerdown"/);
  assert.doesNotMatch(component, /\.animate\(/);
  assert.doesNotMatch(component, /\.finish\(/);
  assert.doesNotMatch(component, /scrollHeight|offsetHeight|getBoundingClientRect/);
  assert.match(css, /grid-template-rows: 0fr/);
  assert.match(css, /grid-template-rows: 1fr/);
  assert.match(css, /--motion-duration-accordion-reduced/);
  assert.doesNotMatch(css, /filter: blur|clip-path|scale: 1\.2/);
});

test("expanded past work reveals a separate inner panel", async () => {
  const css = await readOutput(
    (
      await readOutput("index.html")
    ).match(/href="([^"]+\.css)"/)?.[1].replace(/^\//, "") ?? "",
  );

  assert.match(css, /\.past-work-panel\{/);
  assert.match(css, /\.past-work-item\[data-state=open\]\{[^}]*box-shadow:/);
  assert.doesNotMatch(css, /past-work-notch/);
});

test("section headings are concise while project descriptions remain", async () => {
  const html = await readOutput("index.html");

  assert.doesNotMatch(html, /A compact history of the companies/);
  assert.doesNotMatch(html, /Selected projects across data products/);
  assert.equal((html.match(/class="project-description"/g) ?? []).length, 6);
});

test("footer is quiet and contains no links", async () => {
  const html = await readOutput("index.html");
  const footer = html.match(/<footer class="site-footer">([\s\S]*?)<\/footer>/)?.[1];

  assert.ok(footer);
  assert.match(footer, /© Nikolaos Banis/);
  assert.doesNotMatch(footer, /<a /);
  assert.match(footer, /value="system"/);
  assert.match(footer, /value="light"/);
  assert.match(footer, /value="dark"/);
  assert.match(footer, /theme-switcher-indicator/);
});

test("theme preferences support system, light, and dark modes", async () => {
  const html = await readOutput("index.html");
  const css = await readOutput(
    html.match(/href="([^"]+\.css)"/)?.[1].replace(/^\//, "") ?? "",
  );

  assert.match(html, /localStorage\.getItem\("theme"\)/);
  assert.match(html, /setTimeout/);
  assert.match(html, /},220\)/);
  assert.match(html, /theme-transitioning/);
  assert.match(html, /prefers-color-scheme: dark/);
  assert.match(css, /:root\[data-theme=dark\]/);
  assert.match(css, /prefers-color-scheme:dark/);
});

test("foundation tokens use semantic roles without legacy dependencies", async () => {
  const tokens = await readSource("src/styles/tokens.css");
  const css = await readSource("src/styles/global.css");

  assert.match(tokens, /--color-text-primary:/);
  assert.match(tokens, /--color-surface-base:/);
  assert.match(tokens, /--color-border-subtle:/);
  assert.match(tokens, /--elevation-raised:/);
  assert.match(tokens, /--elevation-panel:/);
  assert.match(tokens, /--elevation-overlay:/);
  assert.match(tokens, /--z-tooltip:/);
  assert.match(tokens, /--z-sticky:/);
  assert.match(tokens, /--motion-duration-accordion-open: 320ms/);
  assert.match(tokens, /--motion-duration-accordion-close: 220ms/);
  assert.match(tokens, /--motion-duration-accordion-reduced: 120ms/);
  assert.match(tokens, /--type-copy-leading: 1\.5714/);
  assert.doesNotMatch(tokens, /--text-step-/);
  assert.doesNotMatch(tokens, /--color-ink-/);
  assert.doesNotMatch(css, /var\(--text-step-/);
  assert.doesNotMatch(css, /var\(--color-ink-/);
  assert.doesNotMatch(css, /var\(--shadow-/);
});

test("typography uses corrective tracking and resilient wrapping", async () => {
  const tokens = await readSource("src/styles/tokens.css");
  const css = await readSource("src/styles/global.css");

  assert.match(tokens, /--type-display-tracking: -0\.015em/);
  assert.match(tokens, /--type-title-tracking: -0\.015em/);
  assert.match(tokens, /--type-label-tracking: normal/);
  assert.match(tokens, /--type-copy-tracking: normal/);
  assert.match(tokens, /--type-meta-tracking: normal/);
  assert.match(css, /text-wrap: balance/);
  assert.match(css, /overflow-wrap: anywhere/);
  assert.match(
    css,
    /\.past-work-summary\s*\{[\s\S]*?grid-template-columns: minmax\(0, 1fr\) auto auto/,
  );
  assert.match(
    css,
    /\.past-work-leader\s*\{[\s\S]*?display: none/,
  );
  assert.doesNotMatch(
    css,
    /\.past-work-summary\s*\{[^}]*overflow-x:\s*auto/,
  );
});

test("color and icon roles remain accessible across themes and system modes", async () => {
  const tokens = await readSource("src/styles/tokens.css");
  const css = await readSource("src/styles/global.css");
  const productionCss = css.replace(
    /\/\* High-fidelity project recreations \*\/[\s\S]*?\/\* Case study pages \*\//,
    "/* Case study pages */",
  );
  const icon = await readSource("src/components/Icon.astro");
  const linkedInIcon = await readSource("src/components/LinkedInIcon.astro");
  const xIcon = await readSource("src/components/XIcon.astro");

  const lightSurface = [255, 255, 255];
  const darkSurface = [21, 21, 21];
  const lightPrimary = composite([0, 0, 0, 0.9], lightSurface);
  const lightSecondary = composite([0, 0, 0, 0.7], lightSurface);
  const lightIcon = composite([0, 0, 0, 0.55], lightSurface);
  const darkPrimary = composite([255, 255, 255, 0.92], darkSurface);
  const darkSecondary = composite([255, 255, 255, 0.68], darkSurface);
  const darkIcon = composite([255, 255, 255, 0.58], darkSurface);
  const lightTooltipText = composite([255, 255, 255, 0.92], lightPrimary);
  const darkTooltipSurface = [241, 239, 233];
  const darkTooltipText = composite([0, 0, 0, 0.88], darkTooltipSurface);

  assert.ok(contrastRatio(lightPrimary, lightSurface) >= 4.5);
  assert.ok(contrastRatio(lightSecondary, lightSurface) >= 4.5);
  assert.ok(contrastRatio(lightIcon, lightSurface) >= 3);
  assert.ok(contrastRatio(lightTooltipText, lightPrimary) >= 4.5);
  assert.ok(contrastRatio(darkPrimary, darkSurface) >= 4.5);
  assert.ok(contrastRatio(darkSecondary, darkSurface) >= 4.5);
  assert.ok(contrastRatio(darkIcon, darkSurface) >= 3);
  assert.ok(contrastRatio(darkTooltipText, darkTooltipSurface) >= 4.5);

  assert.match(tokens, /@media \(prefers-contrast: more\)/);
  assert.match(css, /@media \(forced-colors: active\)/);
  assert.match(css, /\.system-icon\s*\{[^}]*color: currentColor/);
  assert.match(css, /\.brand-icon\s*\{[^}]*color: currentColor/);
  assert.doesNotMatch(productionCss, /#[0-9a-f]{3,8}|rgb\(/i);
  assert.match(icon, /aria-hidden="true" focusable="false"/);
  assert.match(linkedInIcon, /fill="currentColor"/);
  assert.match(linkedInIcon, /focusable="false"/);
  assert.match(xIcon, /fill="currentColor"/);
  assert.match(xIcon, /focusable="false"/);
});

test("layout roles and components adapt to local container width", async () => {
  const tokens = await readSource("src/styles/tokens.css");
  const css = await readSource("src/styles/global.css");

  assert.match(tokens, /--control-size-compact: 2rem/);
  assert.match(tokens, /--interaction-target-min: 2\.75rem/);
  assert.match(tokens, /--tooltip-max-width: 12rem/);
  assert.match(css, /container: home-intro \/ inline-size/);
  assert.match(css, /container: past-work \/ inline-size/);
  assert.match(css, /container: selected-work \/ inline-size/);
  assert.match(css, /@container home-intro \(max-width: 30rem\)/);
  assert.match(css, /@container past-work \(max-width: 32rem\)/);
  assert.match(css, /@container selected-work \(max-width: 30rem\)/);
  assert.match(css, /min-height: var\(--interaction-target-min\)/);
  assert.match(css, /width: var\(--control-size-compact\)/);
  assert.doesNotMatch(css, /min-height: 44px/);
  assert.doesNotMatch(css, /padding-inline: 0\.625rem/);
  assert.doesNotMatch(css, /padding-top: 0\.15rem/);
});

test("generated pages preserve document and accessibility relationships", async () => {
  const baseLayout = await readSource("src/layouts/BaseLayout.astro");
  const identityHeader = await readSource("src/components/IdentityHeader.astro");
  const css = await readSource("src/styles/global.css");

  for (const path of ["index.html", "playground/index.html"]) {
    const html = await readOutput(path);
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
    const references = [
      ...html.matchAll(
        /\b(?:aria-labelledby|aria-controls|aria-describedby)="([^"]+)"/g,
      ),
    ].flatMap((match) => match[1].split(/\s+/));
    const headings = [
      ...html.matchAll(/<h([1-6])\b[^>]*>[\s\S]*?<\/h\1>/g),
    ].map((match) => Number(match[1]));

    assert.equal(new Set(ids).size, ids.length);
    references.forEach((reference) => assert.ok(ids.includes(reference)));
    assert.equal(headings.filter((level) => level === 1).length, 1);
    headings.slice(1).forEach((level, index) => {
      assert.ok(level <= headings[index] + 1);
    });
    assert.doesNotMatch(html, /\btabindex="[1-9]/);
  }

  assert.doesNotMatch(baseLayout, /user-scalable=no|maximum-scale=/);
  assert.doesNotMatch(css, /outline:\s*none/);
  assert.equal(
    (identityHeader.match(/aria-hidden="true" class="action-tooltip"/g) ?? [])
      .length,
    3,
  );
  assert.match(identityHeader, /headingLevel\?: "h1" \| "h4"/);
});

test("playground is internal and documents shared foundations", async () => {
  const html = await readOutput("playground/index.html");

  assert.match(html, /noindex, nofollow/);
  assert.match(html, /Design library/);
  assert.match(html, /Typography/);
  assert.match(html, /--color-text-primary/);
  assert.match(html, /--color-surface-base/);
  assert.match(html, /raised · panel · overlay/);
  assert.match(html, /base · raised · tooltip · sticky/);
  assert.match(html, /Direction B is active in production/);
  assert.match(html, /Structural layout roles/);
  assert.match(html, /--interaction-target-min/);
  assert.match(html, /Component containers/);
  assert.doesNotMatch(html, /Proposed directions/);
  assert.doesNotMatch(html, /type-direction--/);
  assert.match(html, /Semantic icon roles/);
  assert.match(html, /system-icon--navigation/);
  assert.match(html, /system-icon--control/);
  assert.match(html, /system-icon--metadata/);
  assert.doesNotMatch(html, /system-icon--small/);
  assert.match(html, /aria-current/);
  assert.match(html, /IntersectionObserver/);
  assert.match(html, /Iconography/);
  assert.match(html, /Themes/);
  assert.match(html, /Past work accordion/);
  assert.match(html, /Production structure · interruptible CSS motion/);
  assert.doesNotMatch(html, /accordion-motion-controls/);
  assert.doesNotMatch(html, /Stable list and reserved detail panel/);
  assert.doesNotMatch(html, /Floating overlay panel/);
  assert.doesNotMatch(html, /Two-column master\/detail/);
  assert.match(html, /Selected work/);
  assert.doesNotMatch(html, />Now</);
});

test("playground is excluded from the sitemap", async () => {
  const sitemap = await readOutput("sitemap-0.xml");

  assert.match(sitemap, /https:\/\/www\.nikosbanis\.com\//);
  assert.doesNotMatch(sitemap, /playground/);
});

test("invoice management case study renders approved content and metadata", async () => {
  const html = await readOutput("work/invoice-management/index.html");

  assert.match(html, /Invoice Management Redesign/);
  assert.match(html, /Container xChange/);
  assert.match(html, /Turning invoice management into a clearer payment workflow/);
  assert.match(html, /Payment collections/);
  assert.match(html, /\+24%/);
  assert.match(html, /−45%/);
  assert.match(html, /5 → 3\.2 days/);
  assert.match(html, /The problem was not only invoices/);
  assert.match(html, /Backend limitations shaped the solution/);
  assert.match(html, /four rounds of usability testing/i);
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /https:\/\/www\.nikosbanis\.com\/work\/invoice-management/);
  assert.match(html, /class="site-frame case-frame"/);
  assert.match(html, /class="case-workspace"/);
  assert.match(html, /class="case-empty"/);
  assert.doesNotMatch(html, /class="site-side"/);
  assert.doesNotMatch(html, /class="site-footer"/);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert.doesNotMatch(html, /cs_invoices\.md/);
});

test("homepage links to the invoice case study", async () => {
  const html = await readOutput("index.html");
  const sitemap = await readOutput("sitemap-0.xml");

  assert.match(html, /href="\/work\/invoice-management"/);
  assert.match(
    sitemap,
    /https:\/\/www\.nikosbanis\.com\/work\/invoice-management/,
  );
});

test("statista case study uses the shared editorial structure", async () => {
  const html = await readOutput("work/statista-statistics/index.html");

  assert.match(html, /Statistics Page Redesign/);
  assert.match(html, /Statistic pages are among the most visited pages/);
  assert.match(html, /I was responsible for the page redesign/);
  assert.match(html, /<h2[^>]*id="changes-title"[^>]*>What changed<\/h2>/);
  assert.match(html, /application\/ld\+json/);
  assert.match(
    html,
    /https:\/\/www\.nikosbanis\.com\/work\/statista-statistics/,
  );
  assert.match(html, /class="site-frame case-frame"/);
  assert.match(html, /class="case-workspace"/);
  assert.match(html, /class="case-empty"/);
  assert.doesNotMatch(html, /class="site-side"/);
  assert.doesNotMatch(html, /class="site-footer"/);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert.doesNotMatch(html, /cs_statista\.md/);
});

test("playground includes the static invoice table recreation", async () => {
  const html = await readOutput("playground/index.html");

  assert.match(html, /id="invoice-recreation"/);
  assert.match(html, /Project recreations/);
  assert.match(html, /Invoice management table/);
  assert.match(html, /All types/);
  assert.match(html, /Subscription/);
  assert.match(html, /Invoice number/);
  assert.equal((html.match(/454-2022-06-03/g) ?? []).length, 10);
  assert.equal((html.match(/Invoice for \{invoice-period\}/g) ?? []).length, 10);
  assert.equal((html.match(/invoice-demo-status--overdue/g) ?? []).length, 2);
  assert.equal((html.match(/invoice-demo-status--partial/g) ?? []).length, 2);
  assert.equal((html.match(/invoice-demo-status--open/g) ?? []).length, 2);
  assert.equal((html.match(/invoice-demo-status--paid/g) ?? []).length, 2);
  assert.equal((html.match(/invoice-demo-status--cancelled/g) ?? []).length, 2);
  assert.equal((html.match(/Pay now/g) ?? []).length, 4);
  assert.match(html, /1-10 of 100 items/);
  assert.match(html, /Want to learn about invoices\?/);
  assert.match(html, /href="#invoice-recreation"/);
});

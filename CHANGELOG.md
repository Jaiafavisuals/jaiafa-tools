# Changelog

All notable changes to Jaiafa Tools are documented here.

## 4.1.5 — local test build

- Fixes font collector loading in CEP mixed-context, where CommonJS globals previously prevented the browser API from being exposed.
- Distinguishes requested, disabled, and failed font collection in package reports.
- Captures the font option at build time and keeps the build button disabled through font collection.
- Adds regression coverage for the CEP mixed-context loader.

## 4.1.4 — local test build

- Prompts before building when font files are disabled, making it clear the Fonts folders will contain names only.

## 4.1.3 — local test build

- Makes the font-file sharing option clearer and warns after packaging when font files were not copied.
- Labels a font manifest explicitly as not copied when the sharing option is off.

## 4.1.2 — local test build

- Continues packaging other artboards when an individual export fails and writes a package report for partial handoffs.
- Adds a per-size PDF failure note and checks requested export files for existence and nonzero size.
- Includes a per-size Fonts folder with a clear font manifest; eligible local font files are copied only when the user enables the sharing option.
- Writes per-size font collection results into that folder's `Fonts Report.txt`.

## 4.1.1 — local test build

- Repairs PDF preset lookup when the CEP host does not supply a script filename, using the extension path from the panel.
- Reports the precise PDF export stage on errors.
- Adds optional local font packaging with per-artboard font lists and a collection report.
- Shows the current build version in the panel header.

## 4.1.0 — in development

### Added

- Added a production handoff structure based on real agency delivery folders.
- Creates one folder per artboard or banner size.
- Adds an editable working file ending in `_AW.ai` and a separate `_OL.ai` copy with text converted to outlines.
- Places PNG/JPG/SVG/WebP previews at the size-folder root and PDFs inside a dedicated `PDF` folder.
- Collects the linked assets used by each artboard into that artboard's `Links` folder and relinks the packaged Illustrator copies.
- Keeps the open source document untouched while preparing editable and outlined copies.
- Exports vector production PDFs with PDF 1.4, no image downsampling, maximum JPEG quality, CCITT Group 4 monochrome compression, 0.25 pt Roman trim marks at a 6 pt offset, and document bleed settings.
- Fixes PDFs failing in mixed AW/OL/PNG handoffs when Illustrator marks the source modified during packaging. PDFs use the saved file validated at the start; completion messages include a separate PDF count and actual failure reasons.
- Fixes CEP startup when `$.fileName` is unavailable by passing the extension path explicitly from the panel. PDF errors now identify the failed export stage.
- Adds optional local font collection into each size's `Fonts` folder, PostScript-name matching, an extra font source folder, and a font collection report. Adobe activation caches and restricted fonts are excluded.

## 4.0.0

### Added

- Structured client approval with numbered artwork comments, open/resolved states, overall decisions, and a feedback-summary artboard.
- Previewable QA Auto-Fix for safe positioning, minimum text sizes, and Brand Kit colors.
- Production preflight for links, fonts, raster metadata, image color modes, thin strokes, spot colors, rich black, and overprint.
- Smart handoff packages with multi-format export, token-based names, layer passes, linked assets, document copy, font inventory, and delivery report.
- Reusable document template artboards and CSV-driven text/image variation generation.
- Reference-guided DesignPilot analysis that compares visual principles without asking the model to copy protected creative content.

## 3.7.0

- Added document-persistent named checkpoints.
- Added Jaiafa Undo and Redo with stable object identifiers.
- Added automatic pre-change states for applied DesignPilot plans.

## 3.6.0

- Added multi-size Campaign Resize with social, banner, and custom dimensions.
- Added Smart hierarchy, Fit, and Fill adaptation modes.
- Added optional safe-area guides.

## 3.5.0

- Added Design QA checks for bounds, safe margins, contrast, text, alignment, spacing, bleed, and mixed color modes.
- Added locally saved Brand Kits for approved colors, fonts, minimum sizes, and spacing.
- Added severity levels and a practical quality score.

## 3.4.0

- Added temporary live overlay previews for AI operations.
- Added editable move, scale, typography, fill, opacity, and replacement-copy values.
- Added rendered thumbnails for every AI variation direction.

## 3.3.1

- Rebuilt Client Review as a professional 16:9 presentation board.
- Improved meaningful-artwork detection, accent selection, type hierarchy, rationale, review request, palette, and footer.

## 3.3.0

- Added Client Review boards with project metadata, rationale, theme, palette, and optional DesignPilot before/after imagery.
- Added flattened client PDF export without resaving the Illustrator document.

## 3.2.0

- Added per-operation DesignPilot selection.
- Added Before, After, and Split comparison views.
- Added session restore points and non-destructive variant building.

## 3.1.5

- Added raw-byte artboard PNG reading through CEP Node.js.
- Added PNG signature, Base64, byte-length, round-trip, and serialized-payload validation.

## 3.1.2

- Replaced BrandMate AI with DesignPilot AI.
- Added visual art-direction analysis, structured Illustrator object metadata, safe proposed operations, and up to three layout directions.


# Jaiafa Tools 4.1.0

Version 4.1.0 rebuilds Production Handoff around a real agency delivery structure.

## Production folder per size

Every selected artboard receives its own named folder containing:

- an editable `_AW.ai` working file;
- a separate `_OL.ai` file with text converted to outlines;
- selected PNG, JPG, SVG, or WebP previews at the folder root;
- a `Links` folder containing the assets used by that artboard; and
- a `PDF` folder containing the artboard PDF.

The packaged Illustrator files retain only artwork intersecting the relevant artboard. Their placed artwork is relinked to the copied assets inside the size folder.

## Source safety

The open Illustrator document is never outlined or resaved. Jaiafa Tools creates a temporary copy, prepares the artboard-specific `_AW` document, saves it, then creates the outlined `_OL` version from that copy.

The source document must be saved with no pending changes before AI files or production PDFs can be packaged. This prevents the handoff from accidentally using an older disk version.

## Production PDF settings

Production PDFs preserve vectors and image resolution using the bundled Jaiafa Production Print v1 preset: PDF 1.4, no PDF/X standard, no bitmap downsampling, maximum automatic JPEG quality for color/grayscale, CCITT Group 4 for monochrome, and compressed text and line art. Roman trim marks use 0.25 pt strokes with a 6 pt (2.117 mm) offset. Other printer marks are disabled, and document bleed settings are honored, including unequal bleed values. The PDF includes artwork in the bleed area and exports one selected artboard per file.

## Reporting

Optional local font collection adds a `Fonts` folder to each size. It matches the artwork's PostScript font names against local OTF/TTF files (and font collections), with an optional additional font source folder. The user must confirm permission to share the fonts. Adobe activation caches and fonts with restricted embedding or bitmap-only flags are skipped; a separate font report lists copied and unavailable references.

`Package Report.txt` records the generated size folders, AW/OL files, exports, copied and missing links, outlined text count, outline failures, WebP availability, and font inventory.

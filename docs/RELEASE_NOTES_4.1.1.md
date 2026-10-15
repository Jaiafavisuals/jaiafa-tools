# Jaiafa Tools 4.1.1

This local test build fixes production PDFs failing with "undefined is not an object" when the CEP host loads the script without a filename. The panel now supplies its extension path directly, and missing files or native PDF errors identify the export stage.

The full mixed-format handoff workflow has been tested in Illustrator with two artboards, producing editable AW files, outlined OL files, PNG previews, and separate PDFs inside each size's PDF folder.

## Optional font collection

Enable **Include local fonts — I have permission to share them** to copy fonts used by each artboard into its Fonts folder. Fonts are matched by their internal PostScript names, including mixed-font text. Standard local font folders are searched; **Add folder** adds another font source.

Adobe Fonts activation caches and fonts with restricted embedding or bitmap-only flags are excluded. A font's metadata cannot establish redistribution permission; verify the license before enabling collection. Fonts Report.txt lists copied, unavailable, skipped, and failed references, and the package report includes font collection totals.

The panel header now shows v4.1.1 so an outdated installation is visible.

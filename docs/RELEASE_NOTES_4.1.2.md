# Jaiafa Tools 4.1.2

This local build makes production handoffs more resilient when Illustrator fails to export one requested file.

## Production handoff

- An individual artboard export failure no longer stops later artboards from packaging.
- Requested exports are checked for a created, non-empty file.
- Failed PDFs get a `PDF Export FAILED.txt` note in that size's `PDF` folder, with the reason.
- Partial handoffs still include `Package Report.txt` with export failures listed.
- Every size folder includes `Fonts/Fonts Report.txt`, listing the fonts used and explaining whether font files were collected.
- Enable **Include local fonts — I have permission to share them** to copy eligible, locally available fonts. Collection results are recorded in each size folder and in the package-level report.

## Notes

Font files are copied only when the user enables collection. Confirm the font license permits sharing. Adobe Fonts activation caches and restricted fonts are excluded.

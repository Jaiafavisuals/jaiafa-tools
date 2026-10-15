# How to use Formlane

Formlane is organized around a safe workflow: select or capture artwork, configure the operation, preview or review the result when available, then apply or build it.

## Grid and safe-area guides

1. Choose the active artboard, selection, or all artboards as the target.
2. Select thirds, golden ratio, 4 × 4, center, diagonal, or a custom grid.
3. Set a margin when a safe area is needed.
4. Create the guides.

Guides are placed on a dedicated `GridMate Guides` layer. You can hide, lock, or clear Jaiafa-created guides without deleting unrelated artwork.

## Typography

1. Select one or more editable text frames.
2. Choose a modular type scale or enter size, leading, and tracking values.
3. Apply the values to the selection.

Use **Read selection** to inspect the current type values. **Convert to Outlines** is destructive, just like Illustrator's native command, so save an editable copy first.

## Color palettes

1. Enter a HEX color or use the native color picker.
2. Choose a palette rule such as complementary, analogous, triadic, split complementary, monochrome, or tint/shade.
3. Apply a generated color to selected paths or text, or add the full palette as Illustrator swatches.

You can also extract supported fill colors from selected artwork.

## Campaign Resize and social artboards

1. Select the source artwork.
2. Choose one or more presets, or add a custom width and height.
3. Choose an adaptation mode:
   - **Smart hierarchy** maps object positions proportionally and adjusts scale for the new aspect ratio.
   - **Fit** keeps all source artwork visible.
   - **Fill** covers the destination and may crop outside its bounds.
4. Optionally add safe-area guides.
5. Build the campaign artboards and inspect every result.

Included presets cover common Instagram, Story/Reel, LinkedIn, X, YouTube, and web-banner formats. Verify current platform specifications before final delivery.

## Design QA, Brand Kits, and production preflight

### Run Design QA

1. Activate the artboard to inspect.
2. Set safe-margin, minimum text, and other relevant thresholds.
3. Run the check.
4. Review findings by severity and inspect the reported objects.

Checks include artwork outside the artboard, safe areas, low contrast, overset and small text, alignment, spacing rhythm, bleed, and mixed RGB/CMYK artwork.

### Save and use a Brand Kit

Save approved colors, fonts, minimum text and logo sizes, and a spacing unit. Run QA with the kit active to include brand-compliance findings. Brand Kits are stored on the current workstation, so export or record standards separately when moving to another computer.

### Preview Auto-Fix

Prepare the deterministic fixes, review their exact targets and values, then preview before applying. Auto-Fix intentionally focuses on safer corrections such as artboard/safe-area positioning, minimum text sizes, and approved Brand Kit colors. Always inspect the result.

### Production preflight

Before sending artwork to production, check links, fonts, available raster-resolution metadata, RGB images in CMYK documents, thin strokes, spot colors, rich black, and overprint. A clean report reduces risk but does not replace printer specifications or a final human proof.

## Professional client review and approval

1. Activate the design artboard.
2. Enter the client, project, round, design rationale, and review request.
3. Choose the presentation theme and optional color palette.
4. Include DesignPilot before/after imagery when a comparison is available.
5. Build the review board.
6. Add numbered comments to selected artwork where precise feedback is needed.
7. Track each comment as open or resolved and set the overall decision to **In Review**, **Changes Requested**, or **Approved**.
8. Build a feedback summary and export the active review board as a flattened client PDF.

Approval state and comments are stored in the Illustrator document. Save the `.ai` file after changes.

## DesignPilot AI

### Set up

1. Open the **AI** workspace.
2. Enter your OpenRouter API key.
3. Keep **Remember key** off on a shared computer.
4. Use the default vision model or enter another OpenRouter model that supports image input.

### Analyze or improve artwork

1. Activate the artboard and select the editable artwork.
2. Optionally add a PNG visual reference. Use references for transferable principles, not direct copying.
3. Capture the artboard, or run DesignPilot and allow it to capture automatically.
4. Choose **Analyze**, **Improve**, or **Variations**.
5. Choose a direction such as Minimal, Editorial, Bold, Corporate, Luxury, or Experimental.
6. Set whether copy, brand colors, and images should be preserved.
7. Review the design read and every proposed operation.

### Preview and apply

- Turn operations on or off individually.
- Edit supported values, for example changing a 20 pt movement to 12 pt.
- Use the live overlay preview to inspect position, size, type, fill, and opacity changes without committing them.
- Compare **Before**, **After**, and **Split** views.
- Choose **Apply to Current** only when the plan is correct.
- Use **Build as Variant** to preserve the source and create a new artboard.
- Review rendered direction thumbnails before building a variation.

DesignPilot can move and uniformly scale supported objects; edit text size, leading, and tracking; change supported fills and opacity; and replace copy only when copy preservation is disabled. It cannot run arbitrary model-generated code.

## Named checkpoints and Jaiafa Undo/Redo

Create a named checkpoint before a major design change. Jaiafa also creates a pre-change state when a DesignPilot plan is applied. Use Jaiafa Undo and Redo to move through supported saved artwork states.

History lives in a hidden `Jaiafa History Data` layer and persists only after the Illustrator document is saved. It complements Illustrator's native undo and is not a complete document version-control system.

## Mockups

Select artwork, choose phone, poster, billboard, laptop, or card, and choose Fit or Fill. MockupMate builds a clean vector presentation artboard. It does not create photorealistic PSD smart-object mockups.

## CSV Batch Builder

1. Prepare an artboard and save it as a reusable document template.
2. Name editable text placeholders with CSV column syntax such as `{{headline}}`.
3. Name placed-image placeholders with syntax such as `{{image:photo}}` and provide file paths in that CSV column.
4. Import the CSV and map/inspect its fields.
5. Optionally lock static brand elements.
6. Generate the artboard variations.

Generation is capped at 250 variations per run. Test with two or three rows before creating a large batch.

## Export and production handoff

For a quick export, choose a destination, active or all artboards, PNG/JPG/SVG, and the required scale. For a client or production delivery, use **Production Handoff**:

1. Save the Illustrator document and its latest changes.
2. Choose the parent destination and enter the campaign folder name.
3. Choose all artboards/sizes or only the active artboard.
4. Set the size-folder name with `{document}`, `{index}`, and `{artboard}` tokens. The default ends in `_AW`.
5. Keep **Editable working file** enabled for the `_AW.ai` document.
6. Keep **Outlined text copy** enabled for the separate `_OL.ai` document.
7. Select PNG, JPG, SVG, PDF, or runtime-supported WebP output.
8. Optionally generate visible-layer PNG passes.
9. Build the package and review `Package Report.txt` before delivery.

Each artboard becomes a self-contained delivery folder:

```text
Campaign Handoff/
└── Campaign_1080x1080_AW/
    ├── Campaign_1080x1080_AW.ai
    ├── Campaign_1080x1080_OL.ai
    ├── Campaign_1080x1080_AW.png
    ├── Links/
    └── PDF/
        └── Campaign_1080x1080_AW.pdf
```

The `_AW.ai` file remains editable. The `_OL.ai` file is produced from a safe temporary copy and has its text converted to outlines; the open source document is never outlined or resaved. Only artwork intersecting the target artboard is retained in that size's Illustrator copies. Linked assets used by that artboard are copied into its `Links` folder and the packaged files are relinked to those copies.

Production PDFs preserve vectors and source image resolution. They use the bundled **Jaiafa Production Print v1** preset, matching the requested High Quality Print settings:

- Standard: None; compatibility: Acrobat 5 (PDF 1.4).
- Color and grayscale images: Do Not Downsample; Automatic (JPEG), Maximum quality.
- Monochrome images: Do Not Downsample; CCITT Group 4.
- Compress Text and Line Art: enabled.
- Trim Marks: enabled; Roman type, 0.25 pt weight, 6 pt offset (displayed as 2.117 mm).
- Registration Marks, Color Bars, and Page Information: disabled.
- Use Document Bleed Settings: enabled; a document with zero bleed exports with zero bleed.

Save the document's latest changes before packaging PDFs. The PDF is generated from a temporary copy of the complete artwork, including objects in the bleed area, with only the chosen artboard exported. The preset is imported into Illustrator automatically. Client-review PDFs retain their separate flattened presentation workflow.

Enable **Include local fonts — I have permission to share them** to collect the fonts used on each artboard into its `Fonts` folder. Formlane searches standard local font folders and matches internal PostScript names, including mixed fonts within a text object. Use **Add folder** for another font location. `Fonts Report.txt` lists included, unavailable, restricted, or failed font references. Adobe Fonts activation caches are excluded; recipients need their own activation or license for unavailable fonts. Font licenses must permit sharing; embedding flags alone do not establish redistribution rights. Confirm linked-asset licensing before distribution. The package report records any missing links or text that Illustrator could not outline.

## Recommended professional workflow

1. Save an editable source document.
2. Create a named checkpoint.
3. Build layouts and campaign sizes.
4. Run Design QA and production preflight.
5. Build the client review board and record the decision.
6. Resolve feedback and run QA again.
7. Create a final named checkpoint.
8. Export a smart handoff package and inspect its report before delivery.


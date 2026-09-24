# How to use Jaiafa Tools

Jaiafa Tools is organized around a safe workflow: select or capture artwork, configure the operation, preview or review the result when available, then apply or build it.

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

## Export and smart handoff

For a quick export, choose a destination, active or all artboards, PNG/JPG/SVG, and the required scale. For delivery, build a handoff package:

1. Select the required formats: PNG, JPG, SVG, PDF, and runtime-supported WebP.
2. Configure token-based names using `{document}`, `{index}`, `{artboard}`, `{format}`, and `{layer}`.
3. Optionally generate visible-layer PNG passes.
4. Collect linked files and a copy of the saved Illustrator document when required.
5. Review the generated font inventory and handoff report.

Jaiafa Tools does not copy font files. Confirm font and linked-asset licensing before distribution.

## Recommended professional workflow

1. Save an editable source document.
2. Create a named checkpoint.
3. Build layouts and campaign sizes.
4. Run Design QA and production preflight.
5. Build the client review board and record the decision.
6. Resolve feedback and run QA again.
7. Create a final named checkpoint.
8. Export a smart handoff package and inspect its report before delivery.


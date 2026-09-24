# Jaiafa Tools

Jaiafa Tools is a productivity and design-assistance panel for Adobe Illustrator. It brings layout guides, typography, color, campaign resizing, presentation mockups, production QA, client review, batch generation, export handoff, persistent checkpoints, and AI-assisted art direction into one compact CEP extension.

**Current release:** [4.0.0](https://github.com/Jaiafavisuals/jaiafa-tools/releases/latest)  
**Compatibility:** Adobe Illustrator 2020 or newer (CEP/Extensions Legacy)  
**Platforms:** macOS and Windows

> Jaiafa Tools never changes artwork from an AI suggestion until you review and apply the proposed operations.

## Highlights

- **DesignPilot AI** — analyze artwork, preview changes as temporary overlays, edit operation values, compare before/after, and build non-destructive variants.
- **Design QA and Brand Kits** — check alignment, spacing, contrast, text, safe areas, bleed, color modes, links, fonts, print production, and brand compliance.
- **Campaign Resize** — adapt one design to Instagram, Stories, LinkedIn, banners, and custom sizes while preserving visual hierarchy.
- **Professional client review** — generate polished review boards, add numbered artwork comments, track decisions, and export a client-ready PDF.
- **Persistent history** — save named checkpoints plus Jaiafa Undo/Redo states inside the Illustrator document.
- **Smart handoff** — export multiple formats, collect linked assets, produce font inventories, and create a detailed delivery report.
- **CSV Batch Builder** — turn a reusable artboard template into up to 250 controlled content variations.
- **Everyday production tools** — grids, type scales, color palettes, social presets, vector mockups, and multi-artboard export.

## Install

1. [Download the latest release ZIP](https://github.com/Jaiafavisuals/jaiafa-tools/releases/latest) and extract it.
2. Quit Adobe Illustrator.
3. Run `install-macos.command` on macOS or `install-windows.bat` on Windows.
4. Restart Illustrator.
5. Open **Window > Extensions (Legacy) > Jaiafa Tools**.

See [Installation](docs/INSTALLATION.md) for manual installation, updating, uninstalling, and troubleshooting.

## Quick start

1. Open an Illustrator document and select the artwork you want to work with.
2. Open **Jaiafa Tools** from Illustrator's **Extensions (Legacy)** menu.
3. Choose a workspace:
   - **Grid, Type, Color** for everyday layout work.
   - **Social/Campaign** for new sizes and adapted artboards.
   - **QA** before client review or production.
   - **Review** for a presentation board and structured approval.
   - **Export/Handoff** when the design is ready to deliver.
   - **AI** for DesignPilot analysis, improvements, and variants.
4. Preview or review generated changes before applying them.
5. Save the Illustrator document to persist checkpoints, approval status, and document-level history.

The complete workflows are in [How to use Jaiafa Tools](docs/USAGE.md).

## DesignPilot privacy and safety

DesignPilot is optional and requires your own OpenRouter API key. It does **not** upload the `.ai` file. When run, it sends the configured model:

- a temporary, size-limited PNG rendering of the active artboard; and
- structured metadata for up to 80 visible, unlocked, top-level objects, which can include editable text.

Do not run DesignPilot on confidential artwork unless you are comfortable sending that material to your configured AI provider. If **Remember key** is enabled, the key is stored in CEP local browser storage on that computer; it is not stored in the Illustrator document or this repository.

DesignPilot uses a restricted set of supported operations. It cannot execute arbitrary Illustrator scripts returned by a model.

## Documentation

- [Installation and troubleshooting](docs/INSTALLATION.md)
- [Feature and workflow guide](docs/USAGE.md)
- [Release history](CHANGELOG.md)
- [Contributing](CONTRIBUTING.md)
- [Security policy](SECURITY.md)

## Known limitations

- This is an unsigned CEP extension, so Adobe CEP debug mode is required. The installers enable the common CEP runtime entries.
- Client approval is stored in the Illustrator document; it is not a hosted client portal.
- Brand Kits are stored locally on the workstation.
- Jaiafa history restores supported tagged artwork properties and does not replace Illustrator's native undo stack.
- Complex clipping groups, meshes, advanced appearances, perspective transforms, and third-party plugin objects may need manual review.
- WebP export depends on support in the installed Illustrator scripting runtime.
- Font files are inventoried but never copied automatically because redistribution rights vary.
- Platform dimensions and requirements can change. Treat the included social sizes as convenient presets and confirm final delivery specifications.

## Community

Bug reports and feature ideas are welcome through GitHub Issues. Please include your Illustrator version, operating system, a small reproducible example, and the exact steps that caused the problem. See [CONTRIBUTING.md](CONTRIBUTING.md) before submitting code changes.

Crafted with care by **Jingo Arafat**.

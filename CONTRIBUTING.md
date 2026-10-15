# Contributing

Thank you for helping improve Jaiafa Tools. Focused bug reports, reproducible examples, documentation fixes, and carefully scoped features are welcome.

## Report a bug

Use the bug-report issue form and include:

- Jaiafa Tools version;
- Illustrator version;
- macOS or Windows version;
- exact steps to reproduce;
- expected and actual behavior;
- the smallest non-confidential sample document or screenshot that explains the problem; and
- whether the issue happens in a new Illustrator document.

Remove client names, API keys, private artwork, fonts, and linked assets you do not have permission to share.

## Suggest a feature

Explain the designer pain point first, then describe the desired workflow. Include who benefits, how often the problem happens, and what a successful result looks like. A focused workflow is more useful than a long list of disconnected controls.

## Development notes

Jaiafa Tools is a CEP panel:

- `index.html` contains the panel interface.
- `css/` contains panel styling.
- `js/` contains panel-side JavaScript.
- `jsx/` contains Illustrator ExtendScript host operations.
- `presets/` contains the bundled production PDF settings imported by Illustrator.
- `CSXS/manifest.xml` defines extension compatibility and startup.
- `tests/` contains Node-based regression checks.

The project intentionally avoids a build step so the repository folder can be installed directly as a CEP extension.

## Validate a change

From the repository root, run:

```bash
node --check js/panel.js
node --check js/roadmap-features.js
node --check js/workflow-features.js
node --check js/handoff-fonts.js
tail -n +2 jsx/jaiafa-tools.jsx | node --check
node tests/test-image-data-url.js
node tests/test-release-features.js
node tests/test-handoff-pdf.js
node tests/test-handoff-fonts.js
node tests/test-cep-path.js
```

Also validate `CSXS/manifest.xml` and test the affected workflow in a supported Illustrator version on the relevant operating system. UI or document-changing features should be checked with a disposable copy of an Illustrator file.

## Pull requests

- Keep each pull request focused on one problem.
- Describe the user-facing change and the checks you ran.
- Update documentation and the changelog when behavior changes.
- Never commit API keys, client artwork, proprietary fonts, generated handoff packages, or private data.
- Preserve the preview/review-before-apply behavior for operations that change artwork.

By contributing, you confirm that you have the right to submit the contribution. A software license has not yet been selected for this project; contribution terms may be updated when the maintainer adds one.


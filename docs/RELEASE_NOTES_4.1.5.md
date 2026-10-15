# Jaiafa Tools 4.1.5

Fixes local font collection in Illustrator's CEP mixed-context runtime. Previously the font helper could export only to CommonJS, leaving the panel without its collection function. The helper now exposes both APIs.

The package captures the font-sharing selection when the build starts. Font reports distinguish disabled collection, pending collection, and collection errors. A missing helper or collection error now produces a visible error and a failure report.

Close and reopen Jaiafa Tools after installing. Confirm the header says **v4.1.5**, select **Copy local font files — I have permission to share them**, then build the package. Eligible fonts used on each artboard are copied into that size's `Fonts` folder, with `INCLUDED` entries in `Fonts Report.txt`.

# Installation

Jaiafa Tools 4.0.0 supports Adobe Illustrator 2020 or newer on macOS and Windows. It is a CEP extension, so it appears under **Extensions (Legacy)** rather than the newer UXP plugin menu.

## Before installing

- Quit Illustrator completely.
- Download and extract the Jaiafa Tools release ZIP.
- Keep the extracted folder name as `JaiafaTools`.
- Remove an older Jaiafa Tools installation before copying a new version. The included installers do this automatically.

## macOS — automatic installation

1. Extract the release ZIP.
2. Double-click `install-macos.command`.
3. If macOS blocks it, Control-click the file, choose **Open**, and confirm.
4. Wait for the success message, then restart Illustrator.
5. Open **Window > Extensions (Legacy) > Jaiafa Tools**.

The installer copies the extension to:

```text
~/Library/Application Support/Adobe/CEP/extensions/JaiafaTools/
```

It also enables CEP debug mode for the common CSXS 10, 11, and 12 runtimes, which is required for an unsigned extension.

## macOS — manual installation

1. Quit Illustrator.
2. In Finder, choose **Go > Go to Folder**.
3. Enter:

```text
~/Library/Application Support/Adobe/CEP/extensions/
```

4. Create the `extensions` folder if it does not exist.
5. Copy the complete `JaiafaTools` folder into it.
6. Enable debug mode in Terminal if needed:

```bash
defaults write com.adobe.CSXS.12 PlayerDebugMode 1
defaults write com.adobe.CSXS.11 PlayerDebugMode 1
defaults write com.adobe.CSXS.10 PlayerDebugMode 1
```

7. Restart Illustrator and open the panel from **Window > Extensions (Legacy)**.

## Windows — automatic installation

1. Extract the release ZIP.
2. Double-click `install-windows.bat`.
3. If Windows asks for confirmation, allow the script to run.
4. Restart Illustrator.
5. Open **Window > Extensions (Legacy) > Jaiafa Tools**.

The installer copies the extension to:

```text
%APPDATA%\Adobe\CEP\extensions\JaiafaTools\
```

It also enables CEP debug mode for the common CSXS 11 and 12 runtimes.

## Windows — manual installation

1. Quit Illustrator.
2. Press **Win + R**, enter `%APPDATA%\Adobe\CEP\extensions`, and press Enter.
3. Create the `extensions` folder if it does not exist.
4. Copy the complete `JaiafaTools` folder into it.
5. If the panel does not appear, enable CEP debug mode for the runtime used by Illustrator. In Registry Editor, create a string value named `PlayerDebugMode` with value `1` under the relevant key, for example:

```text
HKEY_CURRENT_USER\Software\Adobe\CSXS.12
```

6. Restart Illustrator and open the panel from **Window > Extensions (Legacy)**.

## Updating

1. Quit Illustrator.
2. Download and extract the new release.
3. Run the installer again, or replace the existing `JaiafaTools` extension folder manually.
4. Restart Illustrator.
5. Check the version shown by the release package or `CSXS/manifest.xml` if you need to confirm the installed build.

Updating the panel does not remove named checkpoints already saved inside Illustrator documents. Locally stored Brand Kits and a remembered API key belong to CEP browser storage; make a note of important settings before changing Adobe/CEP profiles.

## Uninstalling

Quit Illustrator, then delete only the `JaiafaTools` folder from the appropriate CEP extensions directory above. Restart Illustrator. This does not remove artwork, checkpoints, or approval information embedded in existing `.ai` documents.

## Troubleshooting

### The panel is not in the menu

- Confirm the extension folder contains `CSXS/manifest.xml` directly, not another nested `JaiafaTools` folder.
- Confirm CEP debug mode is enabled.
- Quit every Illustrator process and restart the application.
- Look under **Window > Extensions (Legacy)**, not **Plugins**.
- Confirm you are using Illustrator 2020 or newer.

### The installer will not run on macOS

Control-click `install-macos.command`, choose **Open**, and confirm. If required, make it executable in Terminal:

```bash
chmod +x /path/to/JaiafaTools/install-macos.command
```

### DesignPilot cannot connect

- Confirm the OpenRouter key is valid and has available credit.
- Confirm the selected model accepts image input.
- Try the included default model.
- Check your network, proxy, or firewall rules for `openrouter.ai`.
- Never post your API key in a public issue or screenshot.

### A feature does not affect the expected artwork

Check that the correct Illustrator document and artboard are active, the intended objects are selected, and relevant layers/objects are visible and unlocked. Save a copy before testing production files.


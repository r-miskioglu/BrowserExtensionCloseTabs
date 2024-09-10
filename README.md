# CloseTabsExtension
This browser extension helps you manage tabs efficiently. When you open a new tab, it prompts you to confirm if the tab should be tracked. If confirmed, the tab will automatically close after 5 minutes of inactivity.

This only works in Firefox Nightly!

## Package the Extension
Ensure your extension is packaged as a .xpi file (Firefox extension format). If you haven't done this yet:
Zip the extension folder (including manifest.json and all other necessary files).
Change the file extension from .zip to .xpi.

## Temporarily Install (for Testing) in Firefox Nig
Open Firefox.
Type about:debugging in the address bar.
Click "This Firefox" on the sidebar.
Click "Load Temporary Add-on..." and select your extension .xpi or any file from the extension folder.
This installs the extension temporarily. It will be removed when you restart Firefox.

## Permanently Install for Personal Use (via about)
To permanently install your extension for personal use without distributing it via the Firefox Add-ons site, follow these steps:

### Open Firefox and navigate to about:config
Type about:config in the address bar and press Enter.
Accept the risk warning.
### Change the Extension Installation Policy
Search for xpinstall.signatures.required.
Set it to false by double-clicking the preference.
### Install the Extension
Open Firefox’s Add-ons Manager by typing about:addons in the address bar.
Click the gear icon ⚙️ at the top-right of the page.
Select "Install Add-on From File..." and choose your .xpi file.

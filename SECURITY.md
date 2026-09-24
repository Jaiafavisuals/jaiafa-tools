# Security policy

## Reporting a vulnerability

Please do not disclose a suspected vulnerability in a public issue. Use the repository's **Security** tab and open a private vulnerability report through GitHub Security Advisories.

Include the affected Jaiafa Tools version, Illustrator/operating-system versions, reproduction steps, impact, and a minimal proof of concept that contains no client data or secrets. Allow reasonable time for investigation before public disclosure.

## API keys and private artwork

- Never include an OpenRouter API key in an issue, log, screenshot, sample document, pull request, or commit.
- DesignPilot sends a temporary artboard PNG and structured object metadata to the configured OpenRouter model. Do not use it with confidential material unless that processing is authorized.
- A remembered key is kept in CEP local browser storage on that workstation. It is not an encrypted credential vault.
- Jaiafa Tools does not require a key for its non-AI workspaces.

## Supported version

Security fixes are applied to the newest published release. Users should reproduce issues on the latest version before reporting when practical.


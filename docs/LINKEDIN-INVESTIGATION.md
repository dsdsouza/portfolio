# LinkedIn anonymous preview investigation

Goal remains open: display Daniel's actual LinkedIn profile inside the portfolio **without visitor sign-in**. A replacement profile assembled from portfolio data or a link to a new tab is not counted as success.

## Evidence — 2026-10-26

| Test | Observed result | Meaning |
| --- | --- | --- |
| Real browser, signed out, direct profile URL | Redirects to `/authwall`, presents Join LinkedIn / Sign in | The sign-in gate also exists outside the renderer. |
| Initial server response | HTTP 999 with JavaScript `window.onload` redirect mentioning authwall | The first HTTP code is not the final page state. |
| Original preview helper | Closed context immediately for HTTP >=400 | App bug: closed before LinkedIn's normal JavaScript redirect could complete. |
| Corrected preview helper | Initial 999 → final 200, URL `/authwall`, classified `sign-in` | The redirect now completes; anonymous access is still gated by LinkedIn. |
| Direct iframe | Browser shows LinkedIn refused to connect | Direct framing did not provide a working profile. No exact framing header is asserted from this test alone. |
| Official public profile badge | Loader executes, finds `danielsdsouza`, marks badge rendered, requests `badges.linkedin.com/profile`; no card appears | The loader is reachable in a browser, but a visible badge has not been verified. |
| Badge endpoint HTTP client | HTTP 999 | Another denial from LinkedIn; does not establish the exact account setting or prove every browser will fail. |
| Profile API | Official API requires approved developer access and authenticated member token | Not an anonymous general full-profile browser API. |

Only anonymous/public requests were tested. No credentials, cookies from an existing session, spoofed identities, challenge solving, or anti-detection packages were used. No cloud browser service was purchased or deployed.

## Fix implemented

`server/linkedin-access.mjs` lets LinkedIn's own 999 response finish its ordinary authwall redirect, then distinguishes public-page HTTP success, sign-in, browser verification, and access denial. The browser service records sanitized diagnostics (HTTP status codes and path only), and it now identifies HTTP-200 authwalls instead of calling them ready. Regression tests cover the redirect and access classifications. A success classification is not, by itself, proof the actual profile rendered; that still requires visual verification.

## Next dependency

Daniel needs to inspect **View Profile → Public profile & URL**:

- Is **Your profile's public visibility** enabled?
- Is **public visibility limits** disabled, if that setting is available?
- Are the desired profile sections eligible for public display?

LinkedIn's current help says even a public profile can prompt visitors to sign in, and explicitly suggests turning public visibility limits off to make anonymous access easier. This may increase what third parties can view. The investigation has not inspected or changed Daniel's settings and does not assume which values are currently selected.

After the owner reports the settings, retest the signed-out real browser first, then the local renderer, then the official badge. Do not treat a sign-in screen or empty badge as a working anonymous preview. If these settings are already correct and LinkedIn still gates access, there is no verified anonymous full-site solution in this environment; retain the working external link until an actual in-site solution is demonstrated.

## Local-only probes

These source HTML files are outside `public/`, so the normal production build doesn't ship them:

- `http://localhost:5173/research/linkedin/preview-probe.html`: calls the existing local browser helper and shows sanitized result packets. No credential fields.
- `http://localhost:5173/research/linkedin/badge-probe.html`: tests the official public-profile badge independently of the app's UI. LinkedIn scripts are loaded only on this test page.

The public LinkedIn contact link remains unchanged while the anonymous preview is unverified.

## Primary sources

- [Control your public LinkedIn profile](https://www.linkedin.com/help/linkedin/answer/a528138) — public visibility limits and sign-in caveat.
- [LinkedIn public profile visibility](https://www.linkedin.com/help/linkedin/answer/a518980) — simplified public profiles, badge visibility, and login caveat.
- [Profile API](https://learn.microsoft.com/en-us/linkedin/shared/integrations/people/profile-api) — authenticated and approved access requirements.
- [LinkedIn plugins](https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/plugins) — supported plugin categories; no claim of full-profile anonymous embedding.

## Follow-up verification

The local official-badge probe now observes the loader's follow-up script: the platform loader succeeds, but the browser reports an error loading the profile-card request. The sanitized local renderer probe was repaired and rerun; it again observed initial HTTP 999, final HTTP 200 at `/authwall`, and `access: sign-in`. No anonymous profile was rendered.

The user said they will ask Daniel to check the settings. Their actual values are still unknown. Further equivalent anonymous requests are deferred until that account-state information is available; repeating the same request does not test a new workaround.

## Owner report and resumed investigation

The user supplied a screenshot of Daniel stating that his public visibility is already on, with a Discord link-preview card for the correct profile. Treat public visibility as **reported enabled**; do not keep asking him to enable that same toggle. The screenshot does not report the separate **Public visibility limits** value. The preview card establishes that profile metadata was available to Discord when that preview was generated, not that an interactive signed-out profile is currently served to every browser.

New primary source: [Public visibility limits setting](https://www.linkedin.com/help/linkedin/answer/a16659373). LinkedIn explicitly distinguishes this from public visibility, explaining that eligible public fields may still be limited when public visibility is on. A new question asks only for this separate setting's value.

Additional verified results:

- The current `/authwall` response has `X-Frame-Options: sameorigin` and CSP `frame-ancestors 'self' *.www.linkedin.com:*`. This confirms why that response cannot be directly framed by the portfolio. It does not explain the streamed browser's sign-in gate, since the stream is not an iframe.
- The ordinary headless renderer was rerun: initial HTTP 999, final 200 at `/authwall`, classified sign-in.
- A **headed** Chromium comparison used a fresh, isolated context with the same renderer and no launch flags, saved cookies, credential injection, or sign-in. It also returned initial 999 → final 200 `/authwall`, classified sign-in. Switching off headless mode did not remove the anonymous-access gate in this environment.
- LinkedIn's [developer-program update](https://www.linkedin.com/blog/engineering/developer-experience-productivity/developer-program-updates) deprecated the legacy Member Profile plugin. Old `IN/MemberProfile` examples are not a supported full-profile workaround.

The headed comparison is reproducible locally with `node research/linkedin/headed-probe.mjs`, then opening its printed local URL. It is not part of production hosting. The investigation remains open; the actual anonymous profile is not working, and the profile-limit setting is still unreported.

## Retest after owner disabled Public visibility limits — October 26, 2026

The user confirms Public visibility limits is now Off; public visibility remains reported On. Do not ask them to change these settings again.

- A new ordinary IAB tab still redirected the actual profile to `/authwall` and displayed Join LinkedIn.
- A new renderer session returned initial 999 → final 200 `/authwall`, classified `sign-in`. The anonymous full profile still does not work.
- The official profile badge now succeeds: its iframe visibly displays Daniel’s portrait, name, ReWild Long Island, and Stony Brook University without sign-in. This is meaningful improvement over the previous failed card request, but only a small profile card, not the requested full-site renderer.
- The rendered badge itself warns: “This feature will no longer be available on 12/12/2026.” Do not introduce it as a durable full-profile solution or mark the anonymous full-site goal complete.

The site’s external LinkedIn link remains unchanged. Settings propagation time has not been established; do not promise that waiting will remove the authwall.

### Supported badge entry point and current documentation

Following the now-working badge's own View profile URL (`?trk=public-profile-badge-profile-badge-view-profile-cta`) also redirects to `/authwall` and renders Join LinkedIn in an ordinary tab. The badge's supported referral URL does not unlock the full profile.

Rechecked LinkedIn's current public-profile help: https://www.linkedin.com/help/linkedin/answer/a528138/showing-hiding-and-editing-your-public-profile?lang=en still states that public profiles can prompt nonmembers to sign up/sign in. API access documentation (https://learn.microsoft.com/en-gb/linkedin/shared/authentication/getting-access) requires member authentication for its ordinary profile permission and supplies limited member fields; this is not an anonymous interactive-site renderer. No supported, verified full-profile anonymous path has been found. This continuation follows the previous turn's genuine progress (newly working badge); the full-profile server gate is still the same unresolved condition.

## User-authorized temporary card implementation

The user explicitly chose the small official card while requesting further research. Implemented `LinkedInCard.jsx` and an on-demand local iframe document `public/linkedin-card.html`. Desktop opens the existing centered dialog; phones retain the direct link. No browser backend, owner credentials, API token, external vendor, or new service account is used. Verified actual Daniel photo/name/ReWild/Stony Brook card, provider retirement notice, close/reopen, production build, and content checks. Full-profile anonymous access remains unresolved; do not mark that original goal achieved.

Research alternatives from current primary documentation:

- Profile API: https://learn.microsoft.com/en-us/linkedin/shared/integrations/people/profile-api requires an access token on behalf of a user, approved developer access, and additional partner permissions for richer fields. It returns data, not an embeddable interactive site.
- OpenID Connect: https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/sign-in-with-linkedin-v2 supplies identity fields including name/photo/email after member authorization; no full job/education history.
- Verified on LinkedIn: https://www.linkedin.com/help/linkedin/answer/a9385085 documents consent, approval, pilot availability, and limited identity/professional fields. Not an unrestricted profile renderer.
- Current plugins catalog: https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/plugins lists Share, Follow Company, and AutoFill; no full-profile replacement.

An owner-authorized data integration could support a custom display, subject to permissions and storage terms, but would be a separate product choice. No supported alternative for the exact full-live-profile-without-visitor-sign-in requirement has been verified. Do not claim that no conceivable workaround exists, or promise a proxy/browser vendor will unlock it.

### Completion audit after the temporary card

The official limited card is implemented and visually verified per the user's explicit request. The original full anonymous profile objective is not complete: direct browser, streamed browser, headed comparison, and the official badge's View profile entry point all reached LinkedIn's sign-in gate. No current approved API documented above provides the live website. Browser-service messaging now avoids implying another visibility toggle will fix it, and reports only the redirect actually observed for that request. Repeating equivalent requests without an external access change would not advance that remaining requirement.

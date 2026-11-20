# Mythili's Portfolio — read this first

This repo is **Mythili's** portfolio website. It is *not* Eric's portfolio
(that's a separate repo, `ezpzmamasqz/eric-portfolio`; never copy its design
or settings over here unless asked).

Both Eric and Mythili work on this repo, from two different laptops. At the
start of every session, confirm you're in `mythili-portfolio` and say so.

## Every session: sync first, push last

1. **Before changing anything**, run `git pull` so you have the other
   laptop's latest work. If it fails or there are local uncommitted changes,
   stop and explain before doing anything else.
2. Make the changes.
3. **After every change**, commit and push straight to `main` so the live
   site and the other laptop get it right away (this is Eric and Mythili's
   standing preference — no need to ask first). If working on another
   branch, push that branch and also push to `main`. Don't leave work
   unpushed at the end of a session.

If a pull brings in conflicts, explain them in plain words and ask which
version to keep — don't silently pick one.

## How the site works

| | |
|---|---|
| Live site | https://mythili-portfolio.erickrieric.workers.dev |
| Repo | `ezpzmamasqz/mythili-portfolio` (public, branch `main`) |
| Hosting | Cloudflare Workers, on Eric's personal (Gmail) Cloudflare account |
| Deploy | Push to `main` → Cloudflare builds and deploys in ~1 minute. No manual step. |
| Stack | Plain HTML, CSS and vanilla JS. No build step. Everything served lives in `public/` (see `wrangler.jsonc`). |
| Limits | 25 MB per file. Keep the repo well under 1 GB — every old file stays in git history, so compress images/video before adding them. |

- Pushing to `main` publishes to the live site (and that's expected after
  every change).
- Don't change `wrangler.jsonc` or Cloudflare settings unless asked.

## Plan: move to Mythili's own accounts

For now the repo lives on Eric's GitHub and the site on Eric's Cloudflare.
Once the site is mostly done:

1. Transfer the GitHub repo to Mythili's account (repo Settings → Transfer ownership).
2. She imports the repo into her own Cloudflare account
   (Workers & Pages → Create → Import a repository; production branch `main`,
   build command blank, deploy command `npx wrangler deploy`).
3. Eric deletes the Worker on his account.

The `workers.dev` address will change after the move (it's tied to the
Cloudflare account). If she buys a domain, put it on her Cloudflare account.

## Working style

- Explain things in plain language; Eric and Mythili aren't developers.
- Don't run tests or open the live site to check things unless asked.

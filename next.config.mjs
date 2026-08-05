/** @type {import('next').NextConfig} */
const nextConfig = {
  // `trailingSlash` is a URL preference, not a hosting accommodation. It keeps
  // every route ending in a slash (/about/ rather than /about), which is how
  // every existing link in this site is written. It stays.
  trailingSlash: true,
};

// Removed 5 August 2026, when the site moved to Vercel and GitHub Pages was
// retired. See DECISIONS.md for the full reasoning. In short:
//
//   output: 'export'           Compiled the site to flat HTML files. That
//                              disables all server code -- no API routes, no
//                              server actions, no database calls, no Stripe.
//                              Every item in Phase 1 was blocked until it went.
//
//   basePath                   Let GitHub Pages serve the site from a subfolder.
//                              NEXT_PUBLIC_BASE_PATH must stay UNSET on Vercel:
//                              setting it breaks every link and every image, and
//                              it fails in a way that looks like a CSS problem.
//
//   images: { unoptimized }    A static export cannot run Next's image
//                              optimiser. Nothing here uses next/image anyway.

export default nextConfig;

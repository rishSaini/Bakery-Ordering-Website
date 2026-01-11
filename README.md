# Maya’s Cake Cafe — Bakery Ordering Website

A modern, mobile-first bakery website for **Maya’s Cake Cafe** that combines a clean marketing homepage with a real, database-backed **menu** and **cake portfolio gallery**. It’s designed to feel like a small business site customers can actually use: browse products quickly, filter/search, and view a curated gallery of past work.

---

## What this project includes

### Customer-facing pages
- **Homepage** with a hero section, feature highlights, best sellers, an “about” preview, and an Instagram-style grid.
- **Menu / Shop page** powered by the database (Prisma + Postgres) and rendered via Next.js App Router.
- **Gallery page** (portfolio) powered by the database, with category filtering and a masonry-style layout for images.

### Menu browsing experience (fast + “shop-like”)
The menu UI is built as a client component so it feels responsive and app-like:
- Search by name/category
- Category filter (Cakes / Cupcakes / Custom Made)
- Price range filter
- Sorting (popularity, price, name)
- Pagination (12 per page)
- “Showing X–Y of Z” toolbar

All of that is handled in `MenuClient` + supporting components.

### Gallery / portfolio experience
- Pulls images from the DB and renders them in a column-based masonry layout
- Category “pills” are generated dynamically from the DB categories
- Includes a small Cloudinary-friendly helper (`f_auto,q_auto`) to serve optimized formats when possible

### UI components included
- Sticky `Navbar` with nav links + cart badge placeholder
- Hero section
- Feature row and home sections (best sellers, about preview, Instagram grid, footer)

> Note: The current business flow is **pickup-only**. If any UI copy still mentions delivery, treat that as copy to update—not a core assumption of the system.

---

## Tech stack

- **Next.js (App Router)** + **React** + **TypeScript**
- **Tailwind CSS** for styling
- **PostgreSQL** for data
- **Prisma ORM** for queries/migrations
- **Cloudinary** for hosted images + optimization (used heavily in the gallery/logo)
- **Stripe Checkout** (if enabled) for online payments

# Building the "Tuttogusto" Coffee Shop Website

You are a senior full-stack developer. Build a premium, modern website for a coffee shop that functions as a full online store with catalog and cart (NOT a simple landing page).

## Project Context
"Tuttogusto" coffee shop (Irkutsk) sells ready-made dishes and drinks for takeout/delivery through the website. The site needs a modern design on par with premium restaurant brands — minimalism, large typography, generous whitespace, smooth micro-animations, and high-quality food photography presentation.

## Tech Stack (must be followed strictly)
- **Next.js 14+ (App Router) + TypeScript**
- **Tailwind CSS** for styling
- **Framer Motion** for animations (carousel, card hover states, page transitions)
- **next/image** for all images (lazy loading, automatic optimization)
- **PostgreSQL** as the primary database (SQLite is acceptable for local development/MVP — the schema should be compatible with both via the ORM)
- **Prisma ORM** for database access (type safety at the TypeScript boundary)
- A custom admin panel at `/admin` for managing menu items, categories, prices, and news — no third-party headless CMS

## Architecture Requirements (OOP Principles)
Even though React components are functional, all business logic (not UI) must follow OOP principles:

1. **Encapsulation** — domain entities (Product, Category, Order, CartItem, Cart) should be implemented as classes with private fields and public accessor/mutator methods. No direct external mutation of fields.
2. **Inheritance and polymorphism** — where appropriate (e.g., different product types: `Dish`, `Drink`, `Bakery` inherit from an abstract `Product` and calculate price/discount/prep time differently).
3. **Abstraction** — database access only through repository interfaces (`ProductRepository`, `OrderRepository`), never direct Prisma queries inside components or API routes.
4. **Single Responsibility Principle (SRP)** — separate service classes: `CartService` (add/remove/recalculate logic), `PricingService` (discounts, promo codes), `OrderService` (checkout).
5. **Dependency Injection** — services receive repositories via their constructor rather than creating dependencies themselves — this simplifies testing and future database swaps.
6. Layered architecture: `domain/` (entities and interfaces) → `application/` (services, use-cases) → `infrastructure/` (Prisma repository implementations) → `presentation/` (React components, API routes as a thin layer calling services).

## Functional Requirements
- Product catalog with categories (Kitchen / Drinks / Bakery), filtering and search
- Product card with photo, description, price, "Add to cart" button
- Full-featured cart: quantity changes, removal, subtotal, state persistence across sessions (localStorage + sync with DB for authenticated users)
- Checkout (no payment integration — just recording the order in the DB with status "new")
- Admin panel: CRUD for products/categories/news, order viewing
- Responsive layout (mobile-first)
- SEO: meta tags, semantic markup, Lighthouse optimization

## Design
- Premium aesthetic: restrained color palette (no more than 2-3 accent colors), large full-block food photos, smooth fade/slide animations on scroll
- Custom typography (not default system fonts)
- No templated Bootstrap patterns — unique grid, asymmetric blocks, large headings

## Response Format
Start with a proposed project folder structure (file tree), then implement the code layer by layer, bottom-up: `domain` → `infrastructure` → `application` → `presentation`. After each major block, pause briefly and ask whether to continue, to avoid exceeding context limits.

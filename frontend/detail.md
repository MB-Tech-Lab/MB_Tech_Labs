# MB Tech Labs Frontend Documentation

This document serves as the complete technical documentation for the MB Tech Labs frontend codebase. It outlines the architecture, routing, component structure, and design decisions to help new developers quickly onboard and confidently contribute to the project.

---

## 1. Project Overview
The MB Tech Labs frontend is a high-performance, conversion-optimized public website designed to showcase software engineering services, portfolios, and open-source contributions. 
The purpose of the website is to act as a primary marketing and client-acquisition funnel. It allows prospective clients to browse solutions, view past work, read about the company's vision, and submit detailed, multi-step project inquiries. The frontend leverages modern web technologies to deliver an ultra-fast, visually premium (glassmorphism, dark-mode focused) experience that aligns with the brand's identity as a cutting-edge software development agency.

---

## 2. Tech Stack
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Vanilla utilities + CSS variables for theme consistency)
- **Core Dependencies:** 
  - `next/link` for client-side routing without page reloads.
  - `next/image` for optimized image delivery.
  - React Hooks (`useState`) for local component state.

---

## 3. Folder Structure
The codebase follows standard Next.js App Router conventions:

- **/src/app**: The core routing directory.
  - `/(public)`: A route group that shares a common layout without affecting the URL path. Contains all public-facing pages (`/`, `/solutions`, `/work`, etc.).
  - `/login`: Dedicated route for authentication (acts as a gateway to private dashboards).
  - `layout.tsx`: The root or group layout that wraps all pages with common UI (like the Navbar and Footer).
  - `page.tsx`: The root homepage (`/`).
- **/src/components**: Stores all reusable React components.
  - `/public`: Contains components exclusively used on the public-facing website (e.g., `Hero.tsx`, `Solutions.tsx`, `ContactForm.tsx`).
- **/public**: Contains static assets served directly by the browser (e.g., `/img/MBTechLabsLogo.png`).
- **/src/middleware.ts**: The Next.js Edge Middleware responsible for route protection, ensuring unauthenticated users can only access specified `publicRoutes`.

---

## 4. Routing System
The project utilizes the **Next.js App Router** for a strictly isolated, multi-page architecture. 

- **How it works:** Each page lives in its own directory within `src/app` (e.g., `src/app/(public)/solutions/page.tsx` maps to `/solutions`).
- **Navigation:** All internal links use Next.js `<Link>` components, which prefetch the route in the background and perform client-side transitions. 
- **Strict Separation:** The application deliberately avoids single-page anchor scrolling (e.g., `#solutions`). Clicking a link in the navbar triggers a genuine route change, ensuring cleaner URLs, better SEO, and isolated analytics tracking per page.

---

## 5. Pages Breakdown

### `/` (Home)
- **Purpose:** Acts as a high-level teaser to hook visitors immediately.
- **Components Used:** `Hero`, `SolutionsPreview`, `WorkPreview`, `CTASection`.
- **UI Structure:** Starts with a strong value proposition, shows a condensed 2-item preview of services and portfolio, and ends with a strong call-to-action to request a quote.

### `/solutions`
- **Purpose:** A deep-dive into the technical services offered.
- **Components Used:** `Solutions` (full list), `ProjectTypes`, `Technologies`, `CTASection`.
- **UI Structure:** Lists core services, breaks down the types of projects handled (e.g., E-commerce, SaaS), highlights the tech stack via badges, and prompts conversion.

### `/work`
- **Purpose:** The main portfolio showcasing past success stories.
- **Components Used:** `Work` (full list), `CTASection`.
- **UI Structure:** A multi-column grid of projects with hover effects, tech tags, and descriptions.

### `/open-source`
- **Purpose:** Establishes engineering credibility.
- **Components Used:** `OpenSourceProjects`, `Community`, `CTASection`.
- **UI Structure:** Displays featured GitHub repositories alongside cards detailing community involvement and knowledge sharing.

### `/about`
- **Purpose:** Communicates the company's vision and operational maturity.
- **Components Used:** `Vision`, `Stats`, `WhyChooseUs`, `Process`, `CTASection`.
- **UI Structure:** Begins with a mission statement, displays impressive statistics (projects completed, uptime), details the development process, and provides reasons to partner.

### `/contact`
- **Purpose:** General inquiries.
- **Components Used:** `ContactForm`.
- **UI Structure:** A clean, centered form capturing standard user details and message content.

### `/request-quote`
- **Purpose:** The primary business conversion funnel.
- **Components Used:** `RequestQuoteForm`.
- **UI Structure:** A comprehensive, multi-step form capturing deep project requirements (budget, timeline, features).

---

## 6. Component Architecture
All public components live in `src/components/public/`.

- **`PublicNavbar.tsx`**: The global sticky header. Evaluates `usePathname()` to conditionally highlight the active route.
- **`Footer.tsx`**: Global footer containing secondary links and copyright information.
- **`Hero.tsx`**: The landing page splash screen with glowing background effects and primary CTA buttons.
- **`Solutions.tsx` & `SolutionsPreview.tsx`**: Full and condensed variants for rendering service cards.
- **`Work.tsx` & `WorkPreview.tsx`**: Full and condensed variants for rendering portfolio items.
- **`ProjectTypes.tsx`**: Displays categorical business solutions (Websites, Mobile Apps).
- **`Technologies.tsx`**: Renders tech stack badges categorized by Frontend, Backend, Database, and Cloud.
- **`Vision.tsx`, `Stats.tsx`, `Process.tsx`, `WhyChooseUs.tsx`, `Community.tsx`**: Informational display components focused on typography and layout.
- **`OpenSourceProjects.tsx`**: Renders a grid of featured open-source tools with star counts and repository links.
- **`CTASection.tsx`**: A highly reusable prompt placed at the bottom of most pages driving users to `/request-quote`.
- **`ContactForm.tsx` & `RequestQuoteForm.tsx`**: Interactive client-side forms managing user input state.

---

## 7. Layout System
The frontend utilizes nested layouts to ensure DRY (Don't Repeat Yourself) component usage:

- **`src/app/(public)/layout.tsx`**: Wraps all public pages. It imports and renders `<PublicNavbar />` at the top and `<Footer />` at the bottom.
- **`children` Prop**: Individual `page.tsx` files are injected between the Navbar and Footer, meaning developers never have to manually import headers or footers into new pages.

---

## 8. Styling System
- **Tailwind CSS:** Fully relies on Tailwind utility classes for layout, typography, and spacing.
- **Theme Variables:** Colors are centralized in `globals.css` via CSS variables (e.g., `var(--primary)`, `var(--secondary)`, `var(--text-secondary)`). This allows for sweeping color changes without hunting down hex codes.
- **Aesthetic Rules:** The design relies heavily on dark mode `#050A1A` backgrounds, nested glowing radial gradients (glassmorphism), specific border colors (`#1a2754`), and hover-scale transformations to feel premium and highly interactive.
- **Responsiveness:** All components employ a mobile-first approach, utilizing `md:` and `lg:` prefixes to reshape flexboxes and grids for larger viewports.

---

## 9. Form System
The **Request Quote** (`RequestQuoteForm.tsx`) is the most complex client-side component.

- **Fields:** Captures Name, Email, Phone, Business Name, Project Type (Dropdown), Budget Range (Dropdown), Timeline (Dropdown), Description, and Features.
- **State:** Uses a single `useState` object to track all form data inputs seamlessly via a unified `handleChange` function.
- **Submission UI:** Implements an `isSubmitted` boolean state to swap the form out for a "Success!" confirmation screen upon submission.
- **Future Integration:** Currently, the `handleSubmit` function logs to the console. It must be updated to dispatch a `POST` request to an API route (e.g., `/api/contact` or a Supabase Edge Function) to persist data and trigger email notifications.

---

## 10. Navigation Flow
The intended user journey is designed as a funnel:
1. **Landing (`/`)**: Hooks the user with aesthetics and high-level previews.
2. **Exploration (`/solutions` & `/work`)**: The user clicks "View All..." to validate the company's technical capabilities and past success.
3. **Trust Building (`/about` & `/open-source`)**: The user verifies company culture, scale, and engineering community presence.
4. **Conversion (`/request-quote`)**: Present at the bottom of almost every page via the `CTASection`, driving the user to provide detailed specs for a tailored proposal.

---

## 11. State Management
- **Local State:** `useState` is used exclusively for localized UI interactions (e.g., toggling the mobile menu in the Navbar, managing form inputs).
- **Global State:** Currently unnecessary. If future requirements dictate cross-page state (e.g., a multi-step wizard across different routes, or a global shopping cart), context providers or Zustand should be considered.
- **Routing State:** The `usePathname()` hook acts as dynamic state for the Navbar to determine which link is currently active.

---

## 12. Performance Considerations
- **Component Modularity:** By splitting the app into multiple pages rather than a single massive layout, initial load times and DOM size are drastically reduced.
- **Next/Image:** The `next/image` component is used for the logo and should be used for all future portfolio screenshots to ensure automatic WebP conversion and lazy loading.
- **Client vs Server:** Most informational components are Server Components by default. Forms and the Navbar explicitly declare `'use client'` to hydrate interactivity, keeping the Javascript bundle sent to the client minimal.

---

## 13. Known Issues / Improvements
- **Missing Images:** The `Work` and `WorkPreview` components currently use styled `div` blocks as placeholders. These must be replaced with actual `next/image` components once portfolio screenshots are available.
- **Form Validation:** The forms currently rely on native HTML5 `required` attributes. For a production environment, integrating `zod` alongside `react-hook-form` is recommended for robust error handling.
- **API Wiring:** The `onSubmit` handlers in forms are currently stubbed and need to be wired to a real backend.

---

## 14. Future Enhancements
- **Backend Connection:** Integrate Supabase Database to store quote requests in a `contact_submissions` table.
- **Admin Panel:** Build a protected route (`/dashboard/leads`) allowing internal staff to view and manage incoming quote requests.
- **Dynamic Content (CMS):** Transition the hardcoded arrays in `Work.tsx` and `Solutions.tsx` to fetch data from a headless CMS or Supabase, allowing non-developers to update the portfolio.
- **Email Triggers:** Hook form submissions up to Resend or SendGrid to fire auto-responder emails to the client and notification emails to the sales team.

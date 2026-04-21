import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/auth";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="max-w-md text-center">
        <p className="label-meta mb-6">Error · 404</p>
        <h1 className="font-display text-7xl text-ink">Lost passage.</h1>
        <p className="mt-6 text-ink-muted leading-relaxed">
          That entry has wandered off the registry, or never existed at all.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="font-mono text-xs uppercase tracking-widest border border-ink px-6 py-3 hover:bg-ink hover:text-paper transition-colors"
          >
            Return to the ledger
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Tend — Quiet passage on kept ground" },
      {
        name: "description",
        content:
          "Tend is a grassroots ledger for trusted, paid access to private land. Connecting careful wanderers with land stewards.",
      },
      { name: "author", content: "Tend" },
      { property: "og:title", content: "Tend — Quiet passage on kept ground" },
      {
        property: "og:description",
        content: "Trusted, paid access to private land, mediated by Tend.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Tend — Quiet passage on kept ground" },
      { name: "description", content: "A digital platform connecting landowners and visitors for managed access to private land." },
      { property: "og:description", content: "A digital platform connecting landowners and visitors for managed access to private land." },
      { name: "twitter:description", content: "A digital platform connecting landowners and visitors for managed access to private land." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/07b7ae38-5cab-4da9-86f0-96ae201221e3/id-preview-ff4f375d--4eaa22cf-6955-4e44-bd88-4f8dc2450869.lovable.app-1776770314356.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/07b7ae38-5cab-4da9-86f0-96ae201221e3/id-preview-ff4f375d--4eaa22cf-6955-4e44-bd88-4f8dc2450869.lovable.app-1776770314356.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;1,9..40,400&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,400&family=Space+Mono:wght@400;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <AuthProvider>
      <Outlet />
      <Toaster />
    </AuthProvider>
  );
}

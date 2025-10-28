import "./globals.css";
import { getCurrentUser } from "../../lib/auth";
import Link from "next/link";

export const metadata = {
  title: "Family Asset Registry",
  description: "Private family asset management system",
};

export default async function RootLayout({ children }) {
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        {user && (
          <nav className="navbar">
            <div className="container nav-inner">
              <Link href="/dashboard" style={{ fontWeight: "bold" }}>Dashboard</Link>
              <Link href="/assets">Assets</Link>
              <Link href="/people">People</Link>
              <div className="nav-spacer">
                {user.fullName} ({user.role})
              </div>
            </div>
          </nav>
        )}
        <main className="container">
          {children}
        </main>
      </body>
    </html>
  );
}

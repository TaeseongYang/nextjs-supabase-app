import Link from "next/link";

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <nav className="flex h-16 w-full justify-center border-b border-b-foreground/10">
        <div className="flex w-full max-w-5xl items-center p-3 px-5 text-sm">
          <Link href="/" className="font-semibold">
            모임
          </Link>
        </div>
      </nav>
      <main className="flex flex-1 flex-col items-center">
        <div className="flex w-full max-w-5xl flex-1 flex-col p-5">
          {children}
        </div>
      </main>
      <footer className="flex w-full items-center justify-center border-t py-6 text-xs text-muted-foreground">
        <p>© 2026 모임</p>
      </footer>
    </div>
  );
}

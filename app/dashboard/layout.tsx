export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="launch-theme min-h-screen bg-[var(--launch-bg)]">
      {children}
    </div>
  );
}

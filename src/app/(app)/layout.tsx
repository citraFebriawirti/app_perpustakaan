export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="app-container">
      {children}
    </div>
  );
}

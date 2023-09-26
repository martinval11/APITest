import './globals.css';

export const metadata = {
  title: 'ApiTest',
  description: 'Test your APIs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

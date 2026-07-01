export const metadata = {
  title: "Dar Zitoun Restaurant - Chat",
  description: "Chat with Dar Zitoun's virtual assistant",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}

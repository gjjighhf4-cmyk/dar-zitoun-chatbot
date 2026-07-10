import ChatWidget from "../components/ChatWidget";
import { businessConfig } from "../lib/config";

export default function Home() {
  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      background: `linear-gradient(135deg, ${businessConfig.colors.bg} 0%, ${businessConfig.colors.bgMid} 40%, ${businessConfig.colors.bg} 100%)`,
    }}>
      <ChatWidget />
    </main>
  );
}

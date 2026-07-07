import { businessConfig } from "@/lib/config";

export async function POST(request) {
  try {
    const { messages } = await request.json();
    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: "Invalid request" }, { status: 400 });
    }
    const recentMessages = messages.slice(-20);
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 600,
        system: businessConfig.systemPrompt,
        messages: recentMessages,
      }),
    });
    if (!response.ok) {
      return Response.json({ error: "AI service error" }, { status: 500 });
    }
    const data = await response.json();
    const reply = data.content?.map((b) => b.text || "").join("") || "";
    return Response.json({ reply });
  } catch (error) {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

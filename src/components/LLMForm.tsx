import { useState } from "react";
import jsPDF from "jspdf";

export function LLMForm() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("http://localhost:5000/api/llm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await res.json();
      setResponse(data.response);
    } catch (err) {
      console.error(err);
      setResponse("❌ Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const now = new Date();
    const dateStr = now.toLocaleDateString();

    doc.setFontSize(16);
    doc.text("📊 AURA Risk Analysis Report", 20, 20);

    doc.setFontSize(10);
    doc.text(`📅 Generated on: ${dateStr}`, 20, 30);

    doc.setFontSize(12);
    doc.text("📝 Prompt:", 20, 45);
    doc.text(input || "No prompt entered.", 20, 55, { maxWidth: 170 });

    doc.text("🤖 AI Response:", 20, 75);
    doc.text(response || "No response yet.", 20, 85, {
      maxWidth: 170,
    });

    doc.save(`AURA_Risk_Report_${now.toISOString().split("T")[0]}.pdf`);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-[hsl(var(--primary))]">
        Ask AURA AI
      </h2>

      <textarea
        className="w-full p-3 border border-border bg-muted/30 text-foreground rounded mb-2"
        rows={4}
        placeholder="E.g. What are the top credit risks from this report?"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <div className="flex gap-4 items-center">
        <button
          className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-4 py-2 rounded"
          onClick={handleSubmit}
        >
          {loading ? "Analyzing..." : "Ask"}
        </button>

        <button className="cyber-button" onClick={exportPDF}>
          Export to PDF
        </button>
      </div>

      {response && (
        <div className="mt-4 p-3 bg-card border border-border rounded text-foreground whitespace-pre-wrap">
          <strong>Response:</strong>
          <p className="mt-2">{response}</p>
        </div>
      )}
    </div>
  );
}


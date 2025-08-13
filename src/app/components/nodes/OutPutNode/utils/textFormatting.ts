/* eslint-disable @typescript-eslint/no-explicit-any */
export const extractContent = (text: any): string => {
  if (!text) return "";

  try {
    const parsed = JSON.parse(text);
    return (
      parsed.answer ||
      parsed.response ||
      parsed.content ||
      parsed.message ||
      text
    );
  } catch (e) {
    return text;
  }
};

export const formatText = (text: any): string => {
  if (!text) return "";

  const cleanText = extractContent(text);

  return (
    cleanText
      // Handle code blocks first (multiline)
      .replace(
        /```(\w+)?\n?([\s\S]*?)```/g,
        '<div class="code-block-container my-4"><div class="code-header bg-gray-800 text-gray-300 px-3 py-2 text-xs font-mono rounded-t-md">$1</div><pre class="bg-gray-900 text-gray-100 p-4 rounded-b-md overflow-x-auto font-mono text-sm"><code>$2</code></pre></div>'
      )
      // Handle inline code
      .replace(
        /`([^`\n]+)`/g,
        '<code class="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>'
      )
      // Handle bold text
      .replace(
        /\*\*(.*?)\*\*/g,
        '<strong class="font-semibold text-gray-900">$1</strong>'
      )
      // Handle italic text
      .replace(/\*(.*?)\*/g, '<em class="italic text-gray-700">$1</em>')
      // Handle headers - Remove trailing colons
      .replace(
        /^### (.*?):?\s*$/gm,
        '<h3 class="text-lg font-semibold mt-6 mb-3 text-gray-900 border-b border-gray-200 pb-2">$1</h3>'
      )
      .replace(
        /^## (.*?):?\s*$/gm,
        '<h2 class="text-xl font-semibold mt-8 mb-4 text-gray-900">$1</h2>'
      )
      .replace(
        /^# (.*?):?\s*$/gm,
        '<h1 class="text-2xl font-bold mt-8 mb-4 text-gray-900">$1</h1>'
      )
      // Handle numbered lists
      .replace(
        /^\d+\.\s+(.+)$/gm,
        '<div class="list-item numbered mb-2 pl-4">$1</div>'
      )
      // Handle bullet points
      .replace(
        /^\s*[\*\-\+]\s+(.+)$/gm,
        '<div class="list-item bullet mb-2 pl-4 relative"><span class="absolute -left-3 text-gray-600">•</span>$1</div>'
      )
      // Handle blockquotes
      .replace(
        /^>\s+(.+)$/gm,
        '<blockquote class="border-l-4 border-blue-400 pl-4 py-2 my-4 bg-blue-50 text-gray-700 italic rounded-r">$1</blockquote>'
      )
      // Clean up and create paragraphs
      .replace(/\n{3,}/g, "\n\n")
      .split("\n\n")
      .map((paragraph: string) => {
        const trimmed = paragraph.trim();
        if (!trimmed) return "";

        // Skip if already formatted as special element
        if (
          trimmed.includes('<div class="list-item"') ||
          trimmed.includes("<h1") ||
          trimmed.includes("<h2") ||
          trimmed.includes("<h3") ||
          trimmed.includes("<blockquote") ||
          trimmed.includes('<div class="code-block-container"')
        ) {
          return trimmed;
        }

        return `<p class="mb-4 leading-relaxed text-gray-800">${trimmed.replace(
          /\n/g,
          "<br>"
        )}</p>`;
      })
      .filter((p: string) => p)
      .join("")
  );
};

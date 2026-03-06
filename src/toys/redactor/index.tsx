import React from "react";
import toast from "react-hot-toast";
import { FaRegCopy } from "react-icons/fa";

import { ToyMainBox, ToyMainBoxesContainer } from "../../components/common.tsx";
import { useTitle } from "../../hooks/useTitle.ts";
import { toy } from "../../utils.ts";

function Redactor() {
  useTitle("Redactor");
  const [text, setText] = React.useState("");

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleSelection = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const { selectionStart: start, selectionEnd: end } = textarea;

    // Auto-redact on selection, but skip if entire text is selected
    if (start !== end && !(start === 0 && end === text.length)) {
      const before = text.slice(0, Math.max(0, start));
      const selected = text.slice(start, end);
      const after = text.slice(Math.max(0, end));

      // Only redact non-whitespace characters
      const replacement = [...selected].map((char) => (char === " " ? " " : "█")).join("");
      const result = before + replacement + after;

      setText(result);

      // Restore focus
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 0);
    }
  };

  const handleCopy = () => {
    if (text) {
      navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    }
  };

  const handleClear = () => {
    setText("");
  };

  return (
    <ToyMainBoxesContainer>
      <ToyMainBox title="Input">
        <textarea
          ref={textareaRef}
          className="textarea w-full min-w-xl min-h-64 font-mono text-sm"
          placeholder="Paste your text here, then select characters or ranges to redact them..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onSelect={handleSelection}
          onKeyUp={handleSelection}
        />
        <div className="flex gap-2 mt-2">
          <button className="btn btn-ghost" onClick={handleClear}>
            Clear
          </button>
          <button className="btn btn-ghost" disabled={!text} onClick={handleCopy}>
            <FaRegCopy /> Copy
          </button>
        </div>
      </ToyMainBox>
    </ToyMainBoxesContainer>
  );
}

export const redactor = toy("redactor", "Redactor", Redactor);

import React from "react";
import toast from "react-hot-toast";
import { FaRegCopy } from "react-icons/fa";

import { ToyMainBox, ToyMainBoxesContainer } from "../../components/common.tsx";
import { useTitle } from "../../hooks/useTitle.ts";
import { toy } from "../../utils.ts";

function rotN(text: string, n: number): string {
  return [...text]
    .map((ch) => {
      const code = ch.charCodeAt(0);
      if (code >= 65 && code <= 90) return String.fromCharCode(((code - 65 + n) % 26) + 65);
      if (code >= 97 && code <= 122) return String.fromCharCode(((code - 97 + n) % 26) + 97);
      return ch;
    })
    .join("");
}

function RotN() {
  useTitle("ROT-N");
  const [input, setInput] = React.useState("");
  const [n, setN] = React.useState(13);

  const output = React.useMemo(() => rotN(input, ((n % 26) + 26) % 26), [input, n]);

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      toast.success("Copied to clipboard");
    }
  };

  return (
    <ToyMainBoxesContainer>
      <ToyMainBox title="Input">
        <textarea
          className="textarea w-full sm:min-w-96 md:min-w-xl min-h-48 font-mono text-sm"
          placeholder="Enter text to rotate..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="flex gap-2 mt-2 items-center">
          <label className="label gap-2">
            N
            <input
              type="number"
              className="input input-bordered w-20 font-mono"
              min={0}
              max={25}
              value={n}
              onChange={(e) => setN(Number(e.target.value))}
            />
          </label>
          {n !== 13 && (
            <button className="btn btn-ghost btn-sm" onClick={() => setN(13)}>
              Reset to 13
            </button>
          )}
        </div>
      </ToyMainBox>
      <ToyMainBox title="Output">
        <textarea
          className="textarea w-full sm:min-w-96 md:min-w-xl min-h-48 font-mono text-sm"
          readOnly
          value={output}
        />
        <div className="flex gap-2 mt-2">
          <button className="btn btn-ghost" disabled={!output} onClick={handleCopy}>
            <FaRegCopy /> Copy
          </button>
        </div>
      </ToyMainBox>
    </ToyMainBoxesContainer>
  );
}

export const rotN = toy("rot-n", "ROT-N", RotN);

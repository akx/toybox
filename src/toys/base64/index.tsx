import React from "react";
import toast from "react-hot-toast";
import { FaRegCopy } from "react-icons/fa";

import { ToyMainBox, ToyMainBoxesContainer } from "../../components/common.tsx";
import { useTitle } from "../../hooks/useTitle.ts";
import { toy } from "../../utils.ts";

function toUrlSafe(b64: string): string {
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromUrlSafe(b64: string): string {
  let s = b64.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  return s;
}

function Base64Tool() {
  useTitle("Base64");
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");
  const [urlSafe, setUrlSafe] = React.useState(false);
  const [error, setError] = React.useState("");

  const encode = () => {
    try {
      const encoded = btoa(
        new TextEncoder()
          .encode(input)
          .reduce((acc, byte) => acc + String.fromCharCode(byte), ""),
      );
      setOutput(urlSafe ? toUrlSafe(encoded) : encoded);
      setError("");
    } catch (e) {
      setError(`Encode error: ${e instanceof Error ? e.message : e}`);
    }
  };

  const decode = () => {
    try {
      const b64 = urlSafe ? fromUrlSafe(input) : input;
      const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
      setOutput(new TextDecoder().decode(bytes));
      setError("");
    } catch (e) {
      setError(`Decode error: ${e instanceof Error ? e.message : e}`);
    }
  };

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
          placeholder="Enter text to encode or base64 to decode..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="flex gap-2 mt-2 items-center flex-wrap">
          <button className="btn btn-primary" onClick={encode}>
            Encode
          </button>
          <button className="btn btn-secondary" onClick={decode}>
            Decode
          </button>
          <label className="label cursor-pointer gap-2">
            <input
              type="checkbox"
              className="checkbox"
              checked={urlSafe}
              onChange={(e) => setUrlSafe(e.target.checked)}
            />
            URL-safe
          </label>
        </div>
      </ToyMainBox>
      <ToyMainBox title="Output">
        {error ? (
          <div className="alert alert-error">{error}</div>
        ) : (
          <textarea
            className="textarea w-full sm:min-w-96 md:min-w-xl min-h-48 font-mono text-sm"
            readOnly
            value={output}
          />
        )}
        <div className="flex gap-2 mt-2">
          <button className="btn btn-ghost" disabled={!output || !!error} onClick={handleCopy}>
            <FaRegCopy /> Copy
          </button>
        </div>
      </ToyMainBox>
    </ToyMainBoxesContainer>
  );
}

export const base64 = toy("base64", "Base64", Base64Tool);

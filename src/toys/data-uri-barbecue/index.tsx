import React from "react";
import { FaRegCopy, FaRegHandPointDown } from "react-icons/fa";

import { ToyMainBox, ToyMainBoxesContainer } from "../../components/common.tsx";
import { useTitle } from "../../hooks/useTitle.ts";
import { toy } from "../../utils.ts";

function CopiableTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="flex gap-1 min-h-32">
      <textarea {...props} className="textarea w-full" />
      <button
        className="btn"
        disabled={!props.value}
        onClick={() => navigator.clipboard.writeText(String(props.value) || "")}
      >
        <FaRegCopy />
      </button>
    </div>
  );
}

function DataURIDisplay({ dataURI, error }: { dataURI: string | null; error: string | null }) {
  if (error) {
    return <div className="alert alert-warning">{error}</div>;
  }

  if (!dataURI) {
    return <div className="alert alert-soft">Nothing generated...</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      <div>
        <CopiableTextarea rows={4} readOnly value={dataURI} placeholder="data:// URI" />
        <div className="p-1">{dataURI.length} chars</div>
      </div>
      {dataURI.startsWith("data:image") ? (
        <div className="flex justify-center">
          <img src={dataURI} alt="Preview" className="max-w-full max-h-64 object-contain" />
        </div>
      ) : null}
    </div>
  );
}

function TextConverter() {
  const [text, setText] = React.useState<string>("");
  const [mimeType, setMimeType] = React.useState<string>("text/plain");
  const [dataURI, error] = React.useMemo((): [string | null, string | null] => {
    if (!text.trim()) return [null, null];
    try {
      const encoded = btoa(unescape(encodeURIComponent(text)));
      return [`data:${mimeType};base64,${encoded}`, null];
    } catch (error_) {
      return [null, String(error_)];
    }
  }, [text, mimeType]);

  return (
    <>
      <input
        className="input w-full"
        placeholder="MIME type"
        value={mimeType}
        onChange={(e) => setMimeType(e.target.value)}
      />
      <textarea
        className="textarea w-full"
        rows={6}
        placeholder="Text to convert"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="text-center text-2xl">
        <FaRegHandPointDown className="mx-auto" />
      </div>
      <DataURIDisplay dataURI={dataURI} error={error} />
    </>
  );
}

function FileConverter() {
  const [dataURI, setDataURI] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);
    if (file) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setDataURI(reader.result as string);
      });
      reader.addEventListener("error", (e) => {
        setError(String(e));
      });
      reader.readAsDataURL(file);
    } else {
      setDataURI(null);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <input type="file" className="file-input w-full" onChange={handleFileChange} />
      </div>
      <div className="text-center text-2xl">
        <FaRegHandPointDown className="mx-auto" />
      </div>
      <DataURIDisplay dataURI={dataURI} error={error} />
    </>
  );
}

export const dataURIBarbecue = toy("data-uri-barbecue", "data:// URI Barbecue", () => {
  useTitle("data:// URI Barbecue");
  return (
    <ToyMainBoxesContainer>
      <ToyMainBox title="From Text">
        <TextConverter />
      </ToyMainBox>
      <ToyMainBox title="From File">
        <FileConverter />
      </ToyMainBox>
    </ToyMainBoxesContainer>
  );
});

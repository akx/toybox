import React from "react";
import toast from "react-hot-toast";
import { FaRegCopy } from "react-icons/fa";

import { ToyMainBox, ToyMainBoxesContainer } from "../../components/common.tsx";
import { useTitle } from "../../hooks/useTitle.ts";
import { toy } from "../../utils.ts";
import { CookieTxtOptions, formatCookieTxt, parseCookieHeader } from "./oven.ts";

interface OutputProps extends CookieTxtOptions {
  cookieHeader: string;
}

function Output({ cookieHeader, domain, path, includeSubdomains, secure, expiration }: OutputProps) {
  const output = React.useMemo(() => {
    const cookies = parseCookieHeader(cookieHeader);
    return formatCookieTxt(cookies, {
      domain: domain.trim() || "example.com",
      includeSubdomains,
      path: path || "/",
      secure,
      expiration,
    });
  }, [cookieHeader, domain, path, includeSubdomains, secure, expiration]);

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      toast.success("Copied to clipboard");
    }
  };

  return (
    <>
      <textarea
        className="textarea w-full min-h-48 font-mono text-sm grow"
        placeholder="Output will appear here. Yum!"
        readOnly
        value={output}
      />
      <button className="btn" disabled={!output} onClick={handleCopy}>
        <FaRegCopy /> Copy
      </button>
    </>
  );
}

function CookieOven() {
  useTitle("Cookie → cookie.txt");
  const [cookieHeader, setCookieHeader] = React.useState("");
  const [domain, setDomain] = React.useState("");
  const [path, setPath] = React.useState("/");
  const [includeSubdomains, setIncludeSubdomains] = React.useState(true);
  const [secure, setSecure] = React.useState(true);
  const [expiration, setExpiration] = React.useState(0);

  return (
    <ToyMainBoxesContainer>
      <ToyMainBox title="Input">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold">Cookie Header</span>
          <textarea
            className="textarea w-full font-mono text-sm"
            placeholder="Cookie: foo=bar; session=abc123"
            rows={3}
            value={cookieHeader}
            onChange={(e) => setCookieHeader(e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold">Domain</span>
          <input
            type="text"
            className="input w-full"
            placeholder="example.com"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          />
          {includeSubdomains && domain && !domain.startsWith(".") ? (
            <span className="text-xs text-gray-500">This may need to start with a dot, e.g., .example.com</span>
          ) : null}
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold">Path</span>
          <input
            type="text"
            className="input w-full"
            placeholder="/"
            value={path}
            onChange={(e) => setPath(e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold">Expiration (Unix timestamp, 0 = session)</span>
          <input
            type="number"
            className="input w-full"
            min={0}
            value={expiration}
            onChange={(e) => setExpiration(Number(e.target.value) || 0)}
          />
        </label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="checkbox"
              checked={includeSubdomains}
              onChange={(e) => setIncludeSubdomains(e.target.checked)}
            />
            <span className="text-sm">Include subdomains</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="checkbox"
              checked={secure}
              onChange={(e) => setSecure(e.target.checked)}
            />
            <span className="text-sm">Secure (HTTPS only)</span>
          </label>
        </div>
      </ToyMainBox>
      <ToyMainBox title="Output (cookie.txt)">
        <Output
          cookieHeader={cookieHeader}
          domain={domain}
          path={path}
          includeSubdomains={includeSubdomains}
          secure={secure}
          expiration={expiration}
        />
      </ToyMainBox>
    </ToyMainBoxesContainer>
  );
}

export const cookieTxtConverter = toy("cookie-oven", "Cookie → cookie.txt", CookieOven);

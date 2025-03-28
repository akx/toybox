import { formatISO } from "date-fns";
import React from "react";
import toast from "react-hot-toast";
import { FaRegCopy, FaRegHandPointDown } from "react-icons/fa";

import { toy } from "../../utils.ts";
import * as ulidx from "./ulidx.ts";

interface ULIDInfo {
  ulid: string;
  uuid: string;
  iso8601: string;
  timestampMillis: number;
  timestamp: number;
}

function getULIDInfo(ulid: string): ULIDInfo {
  ulid = ulidx.fixULIDBase32(ulid);
  const uuid = ulidx.ulidToUUID(ulid);
  const ts = ulidx.decodeTime(ulid);
  return { ulid, uuid, iso8601: formatISO(ts), timestampMillis: ts, timestamp: Math.round(ts / 1000) };
}

function CopiableInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex gap-1">
      <input {...props} className="input w-full" />
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

function ULIDInfoDump({ error, info }: { info: ULIDInfo | null; error: { error: string } | null }) {
  return (
    <>
      {error ? <div className="alert alert-warning">{error.error}</div> : null}
      <CopiableInput type="text" readOnly value={info?.iso8601 || ""} placeholder="ISO8601" />
      <CopiableInput type="text" readOnly value={info?.timestamp || ""} placeholder="Timestamp" />
      <CopiableInput type="text" readOnly value={info?.timestampMillis || ""} placeholder="Timestamp (millis)" />
      <CopiableInput type="text" readOnly value={info?.ulid || ""} placeholder="ULID (base32)" />
      <CopiableInput type="text" readOnly value={info?.uuid || ""} placeholder="ULID (as UUID)" />
    </>
  );
}

function Generator() {
  const [timestampMillis, setTimestampMillis] = React.useState<number | null>(null);
  const [generated, error] = React.useMemo((): [ULIDInfo, null] | [null, { error: string } | null] => {
    if (timestampMillis === null) return [null, null];
    try {
      return [getULIDInfo(ulidx.generate(timestampMillis)), null];
    } catch (error) {
      return [null, { error: String(error) }];
    }
  }, [timestampMillis]);
  const handleDateTimeInput = (value: string) => {
    if (!value.trim()) return;
    const date = new Date(value);
    if (Number.isNaN(+date)) {
      toast.error("That didn't parse. Try again.");
    } else {
      setTimestampMillis(date.getTime());
    }
  };
  return (
    <div className="bg-white rounded-xl p-2 mt-2 flex flex-col gap-2">
      <input
        type="number"
        min={0}
        className="input w-full"
        placeholder="UNIX timestamp (seconds)"
        value={timestampMillis === null ? "" : String(Math.round(timestampMillis / 1000))}
        onChange={(e) => {
          setTimestampMillis(Number(e.target.value) * 1000);
        }}
      />
      <input
        type="number"
        min={0}
        className="input w-full"
        placeholder="UNIX timestamp (milliseconds)"
        value={timestampMillis === null ? "" : String(timestampMillis)}
        onChange={(e) => {
          setTimestampMillis(Number(e.target.value));
        }}
      />
      <input
        type="datetime"
        className="input w-full"
        placeholder="Date and time"
        defaultValue={timestampMillis ? formatISO(timestampMillis) : ""}
        onBlur={(e) => handleDateTimeInput(e.target.value)}
        onKeyDown={(e) => (e.key === "Enter" ? handleDateTimeInput(e.currentTarget.value) : void 8)}
        onPaste={(e) => handleDateTimeInput(e.clipboardData.getData("text/plain"))}
      />
      <button
        className="btn"
        onClick={() => {
          setTimestampMillis(Math.round(Date.now()));
        }}
      >
        Now
      </button>
      <div className="text-center text-2xl">
        <FaRegHandPointDown className="mx-auto" />
      </div>
      <ULIDInfoDump info={generated} error={error} />
    </div>
  );
}

function Parser() {
  const [inputStr, setInputStr] = React.useState<string>("");
  const [parsed, error] = React.useMemo((): [ULIDInfo, null] | [null, { error: string } | null] => {
    const input = inputStr.trim();
    if (!input) return [null, null];
    try {
      if (ulidx.smellsLikeULID(inputStr)) {
        return [getULIDInfo(inputStr), null];
      }
      if (ulidx.smellsLikeUUID(inputStr)) {
        return [getULIDInfo(ulidx.uuidToULID(inputStr)), null];
      }
      return [null, { error: "Input does not parse as ULID or UUID" }];
    } catch (error) {
      return [null, { error: String(error) }];
    }
  }, [inputStr]);
  return (
    <div className="bg-white/80 rounded-xl p-2 mt-2 flex flex-col gap-2">
      <input
        className="input w-full"
        placeholder="ULID/UUID"
        value={inputStr}
        onChange={(e) => setInputStr(e.target.value)}
      />
      <div className="text-center text-2xl">
        <FaRegHandPointDown className="mx-auto" />
      </div>
      <ULIDInfoDump error={error} info={parsed} />
    </div>
  );
}

export const ulidConverter = toy("ulid-converter", "ULID converter", () => {
  return (
    <div className="flex grow justify-center items-center">
      <div className="flex gap-2 *:min-w-96">
        <div>
          <h2 className="text-xl">Generate</h2>
          <Generator />
        </div>
        <div>
          <h2 className="text-xl">Parse</h2>
          <Parser />
        </div>
      </div>
    </div>
  );
});

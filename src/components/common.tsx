import React from "react";
export const toyMainBoxStyle = "bg-white/80 rounded-xl p-2 mt-2 flex flex-col gap-2";

export function ToyMainBoxesContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex grow justify-center items-center">
      <div className="flex gap-2 *:min-w-96">{children}</div>
    </div>
  );
}

export function ToyMainBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xl">{title}</h2>
      <div className={toyMainBoxStyle}>{children}</div>
    </div>
  );
}

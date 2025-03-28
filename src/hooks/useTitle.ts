import React from "react";

const titleStack: string[] = [];

export function useTitle(title: string) {
  React.useEffect(() => {
    titleStack.push(title);
    document.title = `${titleStack.join(" / ")} *toybox!`.trim();
    return () => {
      titleStack.pop();
      document.title = `${titleStack.join(" / ")} *toybox!`.trim();
    };
  });
}

import cx from "clsx";
import React from "react";
import { Link, Route, Switch, useLocation } from "wouter";

import { Welcome } from "./components/Welcome.tsx";
import { ToyFunction } from "./types.ts";
import { getRandomToyColor, isToyFunction } from "./utils.ts";

async function loadToys(): Promise<ToyFunction[]> {
  const toys = [];
  const toyFiles = {
    ...import.meta.glob("./toys/*.tsx"),
    ...import.meta.glob("./toys/**/index.tsx"),
  };
  for (const path in toyFiles) {
    const mod = (await toyFiles[path]!()) as Record<string, unknown>;
    for (const ex of Object.keys(mod)) {
      const exp = mod[ex];
      if (isToyFunction(exp)) toys.push(exp);
    }
  }
  return toys;
}

function NavBar({ toys }: { toys: readonly ToyFunction[] }) {
  const [location] = useLocation();
  const [colorOfTheDay] = React.useState(() => getRandomToyColor());
  return (
    <div className="bg-white/60 py-2 px-2 rounded leading-tight flex gap-2 items-center">
      <Link to="/" className="font-mono font-bold hover:underline">
        <span style={{ color: colorOfTheDay.hex }}>*</span> toybox!
      </Link>
      {[...toys]
        .sort((a, b) => a.displayName.localeCompare(b.displayName))
        .map((toy) => (
          <Link
            key={toy.displayName}
            to={`/${toy.id}`}
            className={cx(
              "p-0.5 px-1.5 rounded transition-colors transition-transform hover:bg-primary hover:-translate-y-px border-black/20 border-b",
              location.startsWith(`/${toy.id}`) ? "bg-primary/50 !translate-y-0" : "bg-white/60",
            )}
          >
            {toy.displayName}
          </Link>
        ))}
    </div>
  );
}

function App() {
  const [toys, setToys] = React.useState<ToyFunction[]>([]);
  React.useEffect(() => {
    loadToys().then(setToys);
  }, []);
  return (
    <div className="flex flex-col w-full h-full p-2 gap-2">
      <NavBar toys={toys} />
      <Switch>
        {toys.map((toy) => (
          <Route key={toy.id} path={`/${toy.id}*`} component={toy} />
        ))}
        <Route>
          <Welcome />
        </Route>
      </Switch>
    </div>
  );
}

export default App;

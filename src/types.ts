export type ToyFunction = (() => React.ReactElement) & {
  id: string;
  displayName: string;
  $toy: true;
};

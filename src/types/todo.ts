export type Owner = {
  id: string;
  name: string | null;
};

export type TodoEntry = {
  id: number;
  title: string;
  description: string;
  owner: Owner;
};

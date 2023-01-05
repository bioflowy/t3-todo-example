export type Owner = {
  id: string;
  name: string | null;
};

export type TodoEntry = {
  id: number;
  title: string;
  description: string;
  owner: Owner;
  createdAt: Date;
  updatedAt: Date;
};

export type EditingTodo = {
  id: number | null;
  title: string;
  description: string;
};

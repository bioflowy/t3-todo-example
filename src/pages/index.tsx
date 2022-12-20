import { type NextPage } from "next";

import { Layout } from "../components/Layout";
import { trpc } from "../utils/trpc";
import { signIn, signOut, useSession } from "next-auth/react";
import TodoEdit from "../features/todo/edit";
import TodoItem from "../features/todo/item";

const Todo: NextPage = () => {
  const todos = trpc.todo.getAll.useQuery();
  return (
    <Layout title="Todo">
      <h1 className="">Todo</h1>
      <AuthShowcase />
      <TodoEdit />
      <div>
        {todos.data?.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </div>
    </Layout>
  );
};

export default Todo;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => signOut() : () => signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};

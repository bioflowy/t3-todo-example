import { ActionIcon, Card, Group, Text } from "@mantine/core";
import { type NextPage } from "next";
import { Trash } from "tabler-icons-react";
import { Layout } from "../components/Layout";

import { trpc } from "../utils/trpc";

const Todo: NextPage = () => {
  const todos = trpc.todo.getAll.useQuery();
  const utils = trpc.useContext();
  const deleteTodo = trpc.todo.delete.useMutation({
    onSettled: () => {
      utils.todo.getAll.invalidate();
    },
  });
  return (
    <Layout title="Todo">
      <h1 className="">Todo</h1>
      <div>
        {todos.data?.map((todo) => (
          <Card withBorder key={todo.id} mt={"sm"}>
            <Group position={"apart"}>
              <Text>{todo.title}</Text>
              <ActionIcon
                onClick={() => {
                  deleteTodo.mutate({ id: todo.id });
                }}
                color={"red"}
                variant={"transparent"}
              >
                <Trash />
              </ActionIcon>
            </Group>
          </Card>
        ))}
      </div>
    </Layout>
  );
};

export default Todo;

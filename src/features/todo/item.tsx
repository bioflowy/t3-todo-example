import React, { type FC } from "react";
import { ActionIcon, Card, Group, Text } from "@mantine/core";
import { trpc } from "../../utils/trpc";
import { type TodoEntry } from "../../types/todo";
import { Pencil, Trash } from "tabler-icons-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
type EditingTodo = {
  id: number | null;
  title: string;
  description: string;
};
type Props = {
  todo: TodoEntry;
  setEditingTodo: (editingTodo: EditingTodo) => void;
};
const TodoItem: FC<Props> = ({ todo, setEditingTodo }) => {
  const { data: sessionData } = useSession();

  const utils = trpc.useContext();
  const deleteTodo = trpc.todo.delete.useMutation({
    onSettled: () => {
      utils.todo.getAll.invalidate();
    },
  });

  return (
    <Card withBorder key={todo.id} mt={"sm"}>
      <Group position={"apart"}>
        <Text>
          <Link href={`/todo/${todo.id}`}>
            <span className="cursor-pointer">{todo.title}</span>
          </Link>
        </Text>
        {sessionData?.user?.id === todo.owner.id && (
          <Group>
            <ActionIcon
              onClick={() => {
                deleteTodo.mutate({ id: todo.id });
              }}
              color={"red"}
              variant={"transparent"}
            >
              <Trash />
            </ActionIcon>
            <ActionIcon
              onClick={() => {
                setEditingTodo(todo);
              }}
              color={"red"}
              variant={"transparent"}
            >
              <Pencil />
            </ActionIcon>
          </Group>
        )}
      </Group>
    </Card>
  );
};

export default TodoItem;

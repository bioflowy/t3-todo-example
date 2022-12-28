import React, { type FC } from "react";
import { ActionIcon, Card, Group, Text } from "@mantine/core";
import { trpc } from "../../utils/trpc";
import { type TodoEntry } from "../../types/todo";
import { Trash, TruckReturn } from "tabler-icons-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
type Props = {
  todo: TodoEntry;
};
const TodoItem: FC<Props> = ({ todo }) => {
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
          <ActionIcon
            onClick={() => {
              deleteTodo.mutate({ id: todo.id });
            }}
            color={"red"}
            variant={"transparent"}
          >
            <Trash />
          </ActionIcon>
        )}
      </Group>
    </Card>
  );
};

export default TodoItem;

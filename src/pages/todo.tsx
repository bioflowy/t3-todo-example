import {
  ActionIcon,
  Card,
  Group,
  Text,
  TextInput,
  Textarea,
  Button,
} from "@mantine/core";
import { type NextPage } from "next";
import { Trash } from "tabler-icons-react";
import { Layout } from "../components/Layout";
import { useForm } from "@mantine/form";
import { trpc } from "../utils/trpc";

const Todo: NextPage = () => {
  const utils = trpc.useContext();
  const form = useForm({
    initialValues: { title: "", description: "" },
  });
  const createTodo = trpc.todo.create.useMutation({
    onSettled: () => {
      utils.todo.getAll.invalidate();
    },
  });
  const todos = trpc.todo.getAll.useQuery();
  const deleteTodo = trpc.todo.delete.useMutation({
    onSettled: () => {
      utils.todo.getAll.invalidate();
    },
  });
  return (
    <Layout title="Todo">
      <h1 className="">Todo</h1>
      <div>
        <form
          onSubmit={form.onSubmit((data) => {
            createTodo.mutate(data);
            form.reset();
          })}
        >
          <TextInput
            label="Title"
            placeholder="Title"
            {...form.getInputProps("title")}
          />
          <Textarea
            label="Description"
            placeholder="Description"
            {...form.getInputProps("description")}
          />
          <Button type="submit" mt="sm">
            New Task
          </Button>
        </form>
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

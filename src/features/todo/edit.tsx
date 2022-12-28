import { useForm, zodResolver } from "@mantine/form";
import { TextInput, Textarea, Button, Group } from "@mantine/core";
import React, { type FC, useEffect } from "react";
import { createTodoSchema } from "../../schema/todo";
import { trpc } from "../../utils/trpc";
type Props = {
  editingTodo: {
    id: number | null;
    title: string;
    description: string;
  };
};

const TodoEdit: FC<Props> = ({ editingTodo }) => {
  const utils = trpc.useContext();
  const form = useForm({
    initialValues: {
      id: null as number | null,
      title: "",
      description: "",
    },
    validate: zodResolver(createTodoSchema),
  });
  useEffect(() => {
    form.setValues(editingTodo);
  }, [editingTodo]);

  const createTodo = trpc.todo.create.useMutation({
    onSettled: () => {
      utils.todo.getAll.invalidate();
    },
  });
  const updateTodo = trpc.todo.update.useMutation({
    onSettled: () => {
      utils.todo.getAll.invalidate();
    },
  });

  return (
    <form
      onSubmit={form.onSubmit((data) => {
        if (data.id) {
          updateTodo.mutate({
            id: data.id,
            title: data.title,
            description: data.description,
          });
        } else {
          createTodo.mutate(data);
        }
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
      <Group className="">
        <Button type="reset" mt="sm" onClick={form.reset}>
          Reset
        </Button>
        <Button type="submit" mt="sm">
          {form.values.id ? "Update Task" : "New Task"}
        </Button>
      </Group>
    </form>
  );
};

export default TodoEdit;

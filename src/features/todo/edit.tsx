import { useForm, zodResolver } from "@mantine/form";
import { TextInput, Textarea, Button } from "@mantine/core";
import React from "react";
import { createTodoSchema } from "../../schema/todo";
import { trpc } from "../../utils/trpc";

const TodoEdit = () => {
  const utils = trpc.useContext();
  const form = useForm({
    initialValues: { title: "", description: "" },
    validate: zodResolver(createTodoSchema),
  });
  const createTodo = trpc.todo.create.useMutation({
    onSettled: () => {
      utils.todo.getAll.invalidate();
    },
  });

  return (
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
  );
};

export default TodoEdit;

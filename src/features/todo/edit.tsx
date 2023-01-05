import { TextInput, Textarea, Button, Group } from "@mantine/core";
import React, { type FC } from "react";
import useTodoEdit from "../../hooks/todo";
import { type EditingTodo } from "../../types/todo";
type Props = {
  editingTodo: EditingTodo;
};

const TodoEdit: FC<Props> = ({ editingTodo }) => {
  const { form, createTodo, updateTodo } = useTodoEdit(editingTodo);

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

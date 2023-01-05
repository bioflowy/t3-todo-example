import { createTodoSchema } from "../schema/todo";
import { trpc } from "../utils/trpc";
import { useForm, zodResolver } from "@mantine/form";
import { useEffect } from "react";
import { type EditingTodo } from "../types/todo";

const useTodoEdit = (editingTodo: EditingTodo) => {
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
  return { form, createTodo, updateTodo };
};

export default useTodoEdit;

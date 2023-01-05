import { createTodoSchema } from "../schema/todo";
import { trpc } from "../utils/trpc";
import { useForm, zodResolver } from "@mantine/form";
import { useEffect } from "react";
import { type EditingTodo } from "../types/todo";

const useTodoEdit = (editingTodoId: EditingTodo) => {
  const utils = trpc.useContext();
  const form = useForm({
    initialValues: {
      id: null as number | null,
      title: "",
      description: "",
    },
    validate: zodResolver(createTodoSchema),
  });
  const { data } = trpc.todo.get.useQuery(
    { id: editingTodoId as number },
    { enabled: editingTodoId != null }
  );
  useEffect(() => {
    if (data) {
      form.setValues(data);
    }
  }, [data?.id]);

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

import { NextPage } from "next";
import { TruckReturn } from "tabler-icons-react";

import { format } from "date-fns";
import { useRouter } from "next/router";
import { Layout } from "../../components/Layout";
import { trpc } from "../../utils/trpc";
import Link from "next/link";

const SingleTodoPage: NextPage = () => {
  const router = useRouter();
  const taskId = Number(router.query.todoId);
  const { data, isLoading, error } = trpc.todo.get.useQuery({
    id: taskId,
  });
  if (isLoading) {
    return <Layout title="Task Detail">Loading single task...</Layout>;
  }
  if (error) {
    return <Layout title="Tak Detail">{error.message}</Layout>;
  }
  return (
    <Layout title="Task Detail">
      <div className="border-t">
        <dl>
          <div className="px4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-gray-500">Title</dt>
            <dd className="text-white-900 mt-1">{data?.title}</dd>
          </div>
          <div className="px py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-gray-500">Description</dt>
            <dd className="text-white-900 mt-1">{data?.description}</dd>
          </div>
          <div className="px4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-gray-500">Creted At</dt>
            <dd className="text-white-900 mt-1">
              {data && format(new Date(data.createdAt), "yyyy-MM-dd HH:mm:ss")}
            </dd>
          </div>
          <div className="px4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-gray-500">Updated At</dt>
            <dd className="text-white-900 mt-1">
              {data && format(new Date(data.updatedAt), "yyyy-MM-dd HH:mm:ss")}
            </dd>
          </div>
        </dl>
      </div>
      <Link href={`/`}>
        <TruckReturn className="mt-3 h-6 w-6 cursor-pointer text-blue-600" />
      </Link>
    </Layout>
  );
};
export default SingleTodoPage;

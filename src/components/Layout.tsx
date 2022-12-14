import Head from "next/head";
import type { FC, ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
};

export const Layout: FC<Props> = ({ children, title = "T3 Todo Example" }) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <header></header>
      <main className="flex flex-1 flex-col items-center justify-center p-4">
        {children}
      </main>
      <footer></footer>
    </div>
  );
};

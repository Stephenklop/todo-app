import Head from "next/head";
import Image from "next/image";
import { AiOutlinePlus } from "react-icons/ai";
import TodoApp from "../app/components/TodoApp";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <Head>
        <title>Todo App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md p-4 rounded-lg">
          <TodoApp />
        </div>
      </main>
    </div>
  );
}

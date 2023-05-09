import { useEffect, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface Todo {
  id: string;
  title: string;
  status: string;
}

const statuses = ["TODO", "INPROGRESS", "DONE"];

const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>("");
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const response = await fetch("http://localhost:3001/v1/todo");
    const data: Todo[] = await response.json();
    setTodos(data);
  };

  const createTodo = async () => {
    if (newTodo.trim() === "") return;

    const response = await fetch("http://localhost:3001/v1/todo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: newTodo, status: "TODO" }),
    });

    const newTodoItem: Todo = await response.json();
    setTodos([...todos, newTodoItem]);
    setNewTodo("");
  };

  const editTodo = async (id: string) => {
    if (editValue.trim() === "") return;

    const response = await fetch(`http://localhost:3001/v1/todo/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: editValue }),
    });

    const updatedTodo: Todo = await response.json();
    setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
    setEditMode(null);
  };

  const deleteTodo = async (id: string) => {
    await fetch(`http://localhost:3001/v1/todo/${id}`, {
      method: "DELETE",
    });

    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const DraggableTodo = ({ todo }: { todo: Todo }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: "TODO",
      item: todo,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }));

    const opacity = isDragging ? 0.5 : 1;

    return (
      <div
        ref={drag}
        style={{ opacity }}
        className="bg-white shadow-md p-4 mb-2 rounded-lg flex justify-between items-center"
      >
        <span>{todo.title}</span>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setEditMode(todo.id);
              setEditValue(todo.title);
            }}
            className="bg-yellow-500 text-white p-2 rounded-lg"
          >
            Edit
          </button>
          <button
            onClick={() => deleteTodo(todo.id)}
            className="bg-red-500 text-white p-2 rounded-lg"
          >
            Delete
          </button>
        </div>
      </div>
    );
  };

  const DroppableStatus = ({ status }: { status: string }) => {
    const [{ canDrop, isOver }, drop] = useDrop(() => ({
      accept: "TODO",
      drop: (item: Todo) => moveTodoToStatus(item.id, status),
      canDrop: (item: Todo) => item.status !== status,
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }));

    const isActive = canDrop && isOver;
    const backgroundColor = isActive ? "rgba(0, 255, 0, 0.1)" : "white";

    return (
      <div
        ref={drop}
        style={{ backgroundColor }}
        className="p-4 border-2 border-gray-300 rounded-lg flex-1"
      >
        <h2 className="text-2xl font-bold mb-4">{status}</h2>
        <div className="flex space-x-4">
          {todos
            .filter((todo) => todo.status === status)
            .map((todo) => (
              <DraggableTodo key={todo.id} todo={todo} />
            ))}
        </div>
      </div>
    );
  };

  const moveTodoToStatus = async (id: string, newStatus: string) => {
    const response = await fetch(`http://localhost:3001/v1/todo/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    });

    const updatedTodo: Todo = await response.json();
    setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-8 text-center">Todo List</h1>
        <div className="flex items-center mb-8">
          <input
            type="text"
            placeholder="New todo"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="border-2 border-gray-300 p-2 rounded-lg w-full"
          />
          <button
            onClick={createTodo}
            className="bg-blue-500 text-white p-2 rounded-lg ml-4"
          >
            Add
          </button>
        </div>
        <div className="flex gap-4">
          {statuses.map((status) => (
            <DroppableStatus key={status} status={status} />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default TodoApp;

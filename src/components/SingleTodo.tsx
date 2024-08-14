import React, { useEffect, useState, useRef } from "react";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { MdDone } from "react-icons/md";
import { Todo } from "../model";
import { Draggable } from "react-beautiful-dnd";
import axios from "axios";

const SingleTodo: React.FC<{
  index: number;
  todo: Todo;
  todos: Array<Todo>;
  setTodos: React.Dispatch<React.SetStateAction<Array<Todo>>>;
}> = ({ index, todo, todos, setTodos }) => {
  const [edit, setEdit] = useState<boolean>(false);
  const [editTodo, setEditTodo] = useState<string>(todo.todo);

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, [edit]);

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    setTodos(
      todos.map((t) => (t.id === todo.id ? { ...t, todo: editTodo } : t))
    );
    setEdit(false);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/delete-task/${todo.id}`);
      setTodos(todos.filter((t) => t.id !== todo.id));
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  const handleDone = () => {
    setTodos(
      todos.map((t) =>
        t.id === todo.id ? { ...t, isDone: !t.isDone } : t
      )
    );
  };

  return (
    <Draggable draggableId={todo.id.toString()} index={index}>
      {(provided, snapshot) => (
        <form
          onSubmit={handleEdit}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={`todos__single ${snapshot.isDragging ? "drag" : ""}`}
        >
          {edit ? (
            <input
              value={editTodo}
              onChange={(e) => setEditTodo(e.target.value)}
              className="todos__single--text"
              ref={inputRef}
            />
          ) : todo.isDone ? (
            <s className="todos__single--text">{todo.todo}</s>
          ) : (
            <span className="todos__single--text">{todo.todo}</span>
          )}
          <div>
            <span
              className="icon"
              onClick={() => {
                if (!edit && !todo.isDone) {
                  setEdit(!edit);
                }
              }}
            >
              <AiFillEdit />
            </span>
            <span className="icon" onClick={handleDelete}>
              <AiFillDelete />
            </span>
            <span className="icon" onClick={handleDone}>
              <MdDone />
            </span>
          </div>
        </form>
      )}
    </Draggable>
  );
};

export default SingleTodo;

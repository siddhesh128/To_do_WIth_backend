import React, { useRef, FormEvent } from "react";
import axios from "axios"; // Ensure axios is imported
import "./styles.css";

interface Props {
  todo: string;
  setTodo: React.Dispatch<React.SetStateAction<string>>;
  handleAdd: (e: React.FormEvent) => void;
}

const InputField: React.FC<Props> = ({ todo, setTodo, handleAdd }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (todo.trim() !== "") { 
        const response = await axios.post("http://localhost:8080/new", { task: todo });
        if (response.status === 200) {
          const newTask = response.data; 
console.log(newTask);

         
          handleAdd(e); 
          setTodo(""); 
        }
      } else {
        alert("Input should not be empty");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form
      className="input"
      onSubmit={(e) => {
        handleSubmit(e); 
        inputRef.current?.blur(); 
      }}
    >
      <input
        type="text"
        placeholder="Enter a Task, you can drag and drop tasks as needed"
        value={todo}
        ref={inputRef}
        onChange={(e) => setTodo(e.target.value)}
        className="input__box"
      />
      <button type="submit" className="input_submit">
        GO
      </button>
    </form>
  );
};

export default InputField;

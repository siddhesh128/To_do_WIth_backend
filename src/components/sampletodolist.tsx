import React, { useEffect, useState } from "react";
import axios from "axios";
import InputField from "./InputField";
import { TiTick } from "react-icons/ti";
import { MdDelete } from "react-icons/md";

interface Task {
  id: string;
  task: string;
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const activeResponse = await axios.get<Task[]>(
          "http://localhost:8080/tasks"
        );
        setTasks(activeResponse.data);

        const completedResponse = await axios.get<Task[]>(
          "http://localhost:8080/completed-tasks"
        );
        setCompletedTasks(completedResponse.data);
      } catch (err) {
        console.error("Error fetching tasks", err);
      }
    };

    fetchTasks();
  }, []);

  const addTaskToList = (task: Task) => {
    setTasks((prevTasks) => [...prevTasks, task]);
  };

  const deleteTask = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8080/delete-task/${id}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      setCompletedTasks((prevCompleted) =>
        prevCompleted.filter((task) => task.id !== id)
      );
    } catch (err) {
      console.log(err);
    }
  };

  const deleteCompletedTask = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8080/delete-task/completed/${id}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      setCompletedTasks((prevCompleted) =>
        prevCompleted.filter((task) => task.id !== id)
      );
    } catch (err) {
      console.log(err);
    }
  };

  const markTaskAsCompleted = async (id: string) => {
    try {
      await axios.post("http://localhost:8080/complete-task", { id });
      const activeResponse = await axios.get<Task[]>(
        "http://localhost:8080/tasks"
      );
      setTasks(activeResponse.data);

      const completedResponse = await axios.get<Task[]>(
        "http://localhost:8080/completed-tasks"
      );
      setCompletedTasks(completedResponse.data);
    } catch (err) {
      console.error("Error marking task as completed", err);
    }
  };

  return (
    <>
      <InputField addTask={addTaskToList} />
      <div className="container">
        <div className="list">
          <h2>Active Tasks</h2>
          <ul>
            {tasks.map((task) => (
              <li key={task.id}>
                {task.task}
                <button
                  id="todo-btn"
                  onClick={() => deleteTask(task.id)}
                  title="Delete Task"
                >
                  <MdDelete />
                </button>
                <button
                  id="todo-btn"
                  onClick={() => markTaskAsCompleted(task.id)}
                  title="Complete Task"
                >
                  <TiTick />
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="list">
          <h2>Completed Tasks</h2>
          <ul>
            {completedTasks.map((task) => (
              <li key={task.id}>
                {task.task}
                <button
                  id="todo-btn"
                  onClick={() => deleteCompletedTask(task.id)}
                  title="Delete Task"
                >
                  <MdDelete />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default TaskList;
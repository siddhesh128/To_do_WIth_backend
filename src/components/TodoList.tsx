import React, { useEffect, useState } from "react";
import { Todo } from "../model";
import SingleTodo from "./SingleTodo";
import { Droppable } from "react-beautiful-dnd";
import { chatSession } from "../service/AiModel"; // import your Gemini API ChatSession

interface Props {
  todos: Array<Todo>;
  setTodos: React.Dispatch<React.SetStateAction<Array<Todo>>>;
  setCompletedTodos: React.Dispatch<React.SetStateAction<Array<Todo>>>;
  CompletedTodos: Array<Todo>;
}

interface Suggestions {
  [key: string]: string; // Storing suggestions as HTML strings
}

const TodoList: React.FC<Props> = ({
  todos,
  setTodos,
  CompletedTodos,
  setCompletedTodos,
}) => {
  const [suggestions, setSuggestions] = useState<Suggestions>({});

  useEffect(() => {
    const fetchSuggestions = async () => {
      const newSuggestions: Suggestions = {};

      for (const todo of todos) {
        try {
          // Prepare input text based on the specific todo
          const inputText = `Here is my todo: "${todo.todo}". Can you suggest any related tasks?`;

          const result = await chatSession.sendMessage(inputText);
          // Process the plain text response
          const responseText = await result.response.text();
          // Clean up and format the suggestions as HTML strings
          const formattedSuggestions = responseText
            .split(/\n\n+/)
            .map((section, index) => {
              const [title, ...content] = section.split(/\n/);
              return `
                <div class="suggestion-section" key=${index}>
                  <div class="suggestion-title">${title.replace(/\*/g, ' ')}</div>
                  <ul class="suggestion-content">
                    ${content.map(line => `<li>${line.replace(/\*/g, ' ')}</li>`).join('')}
                  </ul>
                </div>
              `;
            })
            .join('');

          newSuggestions[todo.id] = formattedSuggestions;
        } catch (error) {
          console.error("Failed to fetch suggestions for todo:", todo.todo, error);
        }
      }

      setSuggestions(newSuggestions);
    };

    fetchSuggestions();
  }, [todos]);

  return (
    <div className="container">
      <Droppable droppableId="TodosList">
        {(provided, snapshot) => (
          <div
            className={`todos ${snapshot.isDraggingOver ? "dragactive" : ""}`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <span className="todos__heading">Active Tasks</span>
            {todos.map((todo, index) => (
              <div key={todo.id}>
                <SingleTodo
                  index={index}
                  todos={todos}
                  todo={todo}
                  setTodos={setTodos}
                />
                {/* Display suggestions as HTML */}
                {suggestions[todo.id] && (
                  <div
                    className="suggestions-container"
                    dangerouslySetInnerHTML={{ __html: suggestions[todo.id] }}
                  />
                )}
              </div>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <Droppable droppableId="TodosRemove">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`todos ${
              snapshot.isDraggingOver ? "dragcomplete" : "remove"
            }`}
          >
            <span className="todos__heading">Completed Tasks</span>
            {CompletedTodos.map((todo, index) => (
              <div key={todo.id}>
                <SingleTodo
                  index={index}
                  todos={CompletedTodos}
                  todo={todo}
                  setTodos={setCompletedTodos}
                />
                {/* Display suggestions as HTML */}
                {suggestions[todo.id] && (
                  <div
                    className="suggestions-container"
                    dangerouslySetInnerHTML={{ __html: suggestions[todo.id] }}
                  />
                )}
              </div>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default TodoList;

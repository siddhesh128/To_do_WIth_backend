import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const getTodos = async () => {
  const response = await axios.get(`${API_URL}/todos`);
  return response.data;
};

export const addTodo = async (todo: { todo: string; isDone: boolean }) => {
  const response = await axios.post(`${API_URL}/todos`, todo);
  return response.data;
};

export const updateTodo = async (id: number, todo: { todo?: string; isDone?: boolean }) => {
  const response = await axios.put(`${API_URL}/todos/${id}`, todo);
  return response.data;
};

export const deleteTodo = async (id: number) => {
  const response = await axios.delete(`${API_URL}/todos/${id}`);
  return response.data;
};

import { useState } from 'react'
import './App.css'
import TodoList from './features/TodoList/TodoList.jsx';
import TodoForm from './features/TodoForm.jsx';

function App() {
  const [todoList, setTodoList] = useState([]);

  const addTodo = (todoTitle) => {
    const newTodo = { id: Date.now(), title: todoTitle, isCompleted: false };
    setTodoList(previous => [newTodo, ...previous]);
  };

  const completeTodo = (id) => {
    const updatedTodos = todoList.map(todo => {
      if (todo.id === id) {
        return { ...todo, isCompleted: true };
      }
      return todo;
    });
    setTodoList(updatedTodos);
  };

  const filteredTodoList = todoList.filter(todo => !todo.isCompleted);

  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm onAddTodo={addTodo} />
      <TodoList todoList={filteredTodoList} onCompleteTodo={completeTodo} />
    </div>
  );
}

export default App

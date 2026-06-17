import TodoListItem from './TodoListItem.jsx';

function TodoList({ todos, onToggleTodo, onUpdateTodo, onDeleteTodo }) {
  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoListItem
          key={todo.id}
          todo={todo}
          onToggleTodo={onToggleTodo}
          onUpdateTodo={onUpdateTodo}
          onDeleteTodo={onDeleteTodo}
        />
      ))}
    </ul>
  );
}

export default TodoList;

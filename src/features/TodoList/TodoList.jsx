import TodoListItem from './TodoListItem.jsx';

function TodoList({ todoList, onCompleteTodo }) {
  return todoList.length === 0 ? (
    <p>Add todo above to get started</p>
  ) : (
    <ul>
      {todoList.map(todo => (
        <TodoListItem
          key={todo.id}
          todo={todo}
          onCompleteTodo={onCompleteTodo}
        />
      ))}
    </ul>
  );
}

export default TodoList;
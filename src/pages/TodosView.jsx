import { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import TodoList from '../features/todos/TodoList.jsx';
import EmptyState from '../shared/EmptyState.jsx';
import Spinner from '../shared/Spinner.jsx';
import { CheckIcon, InboxIcon, SearchIcon } from '../shared/icons.jsx';

const VIEW = {
  all: 'All tasks',
  active: 'Active tasks',
  completed: 'Completed tasks',
};

function filterByStatus(todos, status) {
  if (status === 'active') {
    return todos.filter((todo) => !todo.isCompleted);
  }
  if (status === 'completed') {
    return todos.filter((todo) => todo.isCompleted);
  }
  return todos;
}

function getEmptyState(status, isSearching) {
  if (isSearching) {
    return {
      icon: <SearchIcon />,
      title: 'No matching tasks',
      body: 'Try a different search term.',
    };
  }
  if (status === 'active') {
    return {
      icon: <CheckIcon />,
      title: 'All caught up',
      body: 'You have no active tasks right now.',
    };
  }
  if (status === 'completed') {
    return {
      icon: <InboxIcon />,
      title: 'Nothing completed yet',
      body: 'Completed tasks will appear here.',
    };
  }
  return {
    icon: <InboxIcon />,
    title: 'No tasks yet',
    body: 'Add your first task using the form above.',
  };
}

function TodosView({ status }) {
  const {
    todos,
    isLoading,
    isSearching,
    onToggleTodo,
    onUpdateTodo,
    onDeleteTodo,
  } = useOutletContext();

  const filtered = useMemo(
    () => filterByStatus(todos, status),
    [todos, status]
  );

  let body;
  if (isLoading && todos.length === 0) {
    body = (
      <div className="status-row" role="status">
        <Spinner />
        Loading your tasks...
      </div>
    );
  } else if (filtered.length === 0) {
    const empty = getEmptyState(status, isSearching);
    body = (
      <EmptyState icon={empty.icon} title={empty.title}>
        {empty.body}
      </EmptyState>
    );
  } else {
    body = (
      <TodoList
        todos={filtered}
        onToggleTodo={onToggleTodo}
        onUpdateTodo={onUpdateTodo}
        onDeleteTodo={onDeleteTodo}
      />
    );
  }

  return (
    <section className="glass panel" aria-label={VIEW[status]}>
      <div className="list-region__heading">
        <h2>{VIEW[status]}</h2>
        <span className="list-region__count">
          {filtered.length} {filtered.length === 1 ? 'task' : 'tasks'}
        </span>
      </div>
      {body}
    </section>
  );
}

export default TodosView;

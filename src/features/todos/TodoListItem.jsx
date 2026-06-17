import { useEffect, useRef, useState } from 'react';
import TextInputWithLabel from '../../shared/TextInputWithLabel.jsx';
import Button from '../../shared/Button.jsx';
import {
  CheckIcon,
  CloseIcon,
  PencilIcon,
  TrashIcon,
} from '../../shared/icons.jsx';
import {
  validateTodoTitle,
  isValidTodoTitle,
  TODO_TITLE_MAX,
} from '../../utils/todoSchemas.js';

function TodoListItem({ todo, onToggleTodo, onUpdateTodo, onDeleteTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [workingTitle, setWorkingTitle] = useState(todo.title);
  const [error, setError] = useState('');
  const editRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      editRef.current?.focus();
    }
  }, [isEditing]);

  const startEditing = () => {
    setWorkingTitle(todo.title);
    setError('');
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setWorkingTitle(todo.title);
    setError('');
    setIsEditing(false);
  };

  const handleChange = (event) => {
    setWorkingTitle(event.target.value);
    if (error) {
      setError('');
    }
  };

  const submitEdit = (event) => {
    event.preventDefault();
    const result = validateTodoTitle(workingTitle);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    if (result.data !== todo.title) {
      onUpdateTodo(todo.id, result.data);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      cancelEditing();
    }
  };

  if (isEditing) {
    return (
      <li className="todo-item">
        <form
          className="todo-item__edit"
          onSubmit={submitEdit}
          onKeyDown={handleKeyDown}
          noValidate
        >
          <div className="todo-item__edit-field">
            <TextInputWithLabel
              id={`edit-${todo.id}`}
              label="Edit task"
              hideLabel
              ref={editRef}
              value={workingTitle}
              onChange={handleChange}
              maxLength={TODO_TITLE_MAX}
              error={error}
              autoComplete="off"
            />
          </div>
          <div className="todo-item__actions">
            <Button
              type="button"
              iconOnly
              onClick={cancelEditing}
              aria-label="Cancel editing"
            >
              <CloseIcon />
            </Button>
            <Button
              type="submit"
              variant="primary"
              iconOnly
              disabled={!isValidTodoTitle(workingTitle)}
              aria-label="Save changes"
            >
              <CheckIcon />
            </Button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className={`todo-item${todo.isCompleted ? ' todo-item--done' : ''}`}>
      <label className="todo-item__label">
        <input
          type="checkbox"
          className="todo-check"
          checked={todo.isCompleted}
          onChange={() => onToggleTodo(todo.id)}
        />
        <span className="sr-only">
          {todo.isCompleted ? 'Mark as not complete' : 'Mark as complete'}:{' '}
          {todo.title}
        </span>
      </label>

      {todo.isCompleted ? (
        <span className="todo-item__title">{todo.title}</span>
      ) : (
        <button
          type="button"
          className="todo-item__title"
          onClick={startEditing}
          aria-label={`Edit task: ${todo.title}`}
        >
          {todo.title}
        </button>
      )}

      <div className="todo-item__actions">
        {!todo.isCompleted && (
          <Button
            iconOnly
            onClick={startEditing}
            aria-label={`Edit task: ${todo.title}`}
          >
            <PencilIcon />
          </Button>
        )}
        <Button
          variant="danger"
          iconOnly
          onClick={() => onDeleteTodo(todo.id)}
          aria-label={`Delete task: ${todo.title}`}
        >
          <TrashIcon />
        </Button>
      </div>
    </li>
  );
}

export default TodoListItem;

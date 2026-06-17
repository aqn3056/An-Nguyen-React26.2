import { useRef, useState } from 'react';
import Button from '../../shared/Button.jsx';
import { PlusIcon } from '../../shared/icons.jsx';
import {
  validateTodoTitle,
  isValidTodoTitle,
  TODO_TITLE_MAX,
} from '../../utils/todoSchemas.js';

function TodoForm({ onAddTodo }) {
  const inputRef = useRef(null);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const handleChange = (event) => {
    setTitle(event.target.value);
    if (error) {
      setError('');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const result = validateTodoTitle(title);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    onAddTodo(result.data);
    setTitle('');
    setError('');
    inputRef.current?.focus();
  };

  return (
    <form className="todo-form glass" onSubmit={handleSubmit} noValidate>
      <label htmlFor="todo-title">New task</label>
      <div className="todo-form__row">
        <div className="todo-form__field">
          <input
            id="todo-title"
            className="field-input"
            ref={inputRef}
            value={title}
            onChange={handleChange}
            placeholder="What needs to be done?"
            maxLength={TODO_TITLE_MAX}
            autoComplete="off"
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={error ? 'todo-title-error' : undefined}
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          disabled={!isValidTodoTitle(title)}
        >
          <PlusIcon />
          Add task
        </Button>
      </div>
      {error && (
        <p className="field-error" id="todo-title-error">
          {error}
        </p>
      )}
    </form>
  );
}

export default TodoForm;

import { CloseIcon } from '../../shared/icons.jsx';
import { TODO_TITLE_MAX } from '../../utils/todoSchemas.js';

function SearchField({ value, onChange }) {
  return (
    <div className="field-group">
      <label htmlFor="todo-search">Search tasks</label>
      <div className="search-field">
        <input
          id="todo-search"
          type="search"
          className="field-input"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search by title..."
          maxLength={TODO_TITLE_MAX}
          autoComplete="off"
        />
        {value && (
          <button
            type="button"
            className="search-field__clear"
            onClick={() => onChange('')}
            aria-label="Clear search"
          >
            <CloseIcon />
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchField;

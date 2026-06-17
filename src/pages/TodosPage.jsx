import { useCallback, useEffect, useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';
import TodoForm from '../features/todos/TodoForm.jsx';
import SortControls from '../features/todos/SortControls.jsx';
import SearchField from '../features/todos/SearchField.jsx';
import TodoNav from '../layout/TodoNav.jsx';
import Alert from '../shared/Alert.jsx';
import Button from '../shared/Button.jsx';
import useDebounce from '../utils/useDebounce.js';
import { sanitizeText } from '../utils/sanitize.js';
import {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from '../services/todosService.js';

const DEFAULT_SORT_BY = 'creationDate';
const DEFAULT_SORT_DIR = 'desc';

function TodosPage({ token, onSessionExpired }) {
  const [todoList, setTodoList] = useState([]);
  const [error, setError] = useState('');
  const [filterError, setFilterError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState(DEFAULT_SORT_BY);
  const [sortDirection, setSortDirection] = useState(DEFAULT_SORT_DIR);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  const handleAuthError = useCallback(
    (caught) => {
      if (caught.code === 'unauthorized') {
        onSessionExpired();
        return true;
      }
      return false;
    },
    [onSessionExpired]
  );

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      setIsLoading(true);
      try {
        const tasks = await fetchTodos({
          token,
          sortBy,
          sortDirection,
          search: debouncedSearch,
          signal: controller.signal,
        });
        setTodoList(tasks);
        setError('');
        setFilterError('');
      } catch (caught) {
        if (caught.name === 'AbortError') {
          return;
        }
        if (handleAuthError(caught)) {
          return;
        }
        const isFiltered =
          debouncedSearch !== '' ||
          sortBy !== DEFAULT_SORT_BY ||
          sortDirection !== DEFAULT_SORT_DIR;
        if (isFiltered) {
          setFilterError(caught.message);
        } else {
          setError(caught.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    load();
    return () => controller.abort();
  }, [token, sortBy, sortDirection, debouncedSearch, handleAuthError]);

  const handleAddTodo = async (validatedTitle) => {
    const title = sanitizeText(validatedTitle);
    if (!title) {
      return;
    }
    const tempId = `temp-${Date.now()}`;
    const optimisticTodo = { id: tempId, title, isCompleted: false };
    setTodoList((previous) => [optimisticTodo, ...previous]);

    try {
      const savedTodo = await createTodo({ token, title });
      setTodoList((previous) =>
        previous.map((todo) => (todo.id === tempId ? savedTodo : todo))
      );
    } catch (caught) {
      setTodoList((previous) => previous.filter((todo) => todo.id !== tempId));
      if (handleAuthError(caught)) {
        return;
      }
      setError(caught.message);
    }
  };

  const handleToggleTodo = async (id) => {
    const original = todoList.find((todo) => todo.id === id);
    if (!original) {
      return;
    }
    const nextCompleted = !original.isCompleted;
    setTodoList((previous) =>
      previous.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: nextCompleted } : todo
      )
    );

    try {
      await updateTodo({
        token,
        id,
        fields: { title: original.title, isCompleted: nextCompleted },
      });
    } catch (caught) {
      setTodoList((previous) =>
        previous.map((todo) => (todo.id === id ? original : todo))
      );
      if (handleAuthError(caught)) {
        return;
      }
      setError(caught.message);
    }
  };

  const handleUpdateTodo = async (id, validatedTitle) => {
    const original = todoList.find((todo) => todo.id === id);
    if (!original) {
      return;
    }
    const title = sanitizeText(validatedTitle);
    if (!title || title === original.title) {
      return;
    }
    setTodoList((previous) =>
      previous.map((todo) => (todo.id === id ? { ...todo, title } : todo))
    );

    try {
      await updateTodo({
        token,
        id,
        fields: {
          title,
          isCompleted: original.isCompleted,
        },
      });
    } catch (caught) {
      setTodoList((previous) =>
        previous.map((todo) => (todo.id === id ? original : todo))
      );
      if (handleAuthError(caught)) {
        return;
      }
      setError(caught.message);
    }
  };

  const handleDeleteTodo = async (id) => {
    const index = todoList.findIndex((todo) => todo.id === id);
    if (index === -1) {
      return;
    }
    const original = todoList[index];
    setTodoList((previous) => previous.filter((todo) => todo.id !== id));

    if (String(id).startsWith('temp-')) {
      return;
    }

    try {
      await deleteTodo({ token, id });
    } catch (caught) {
      setTodoList((previous) => {
        const next = [...previous];
        next.splice(index, 0, original);
        return next;
      });
      if (handleAuthError(caught)) {
        return;
      }
      setError(caught.message);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSortBy(DEFAULT_SORT_BY);
    setSortDirection(DEFAULT_SORT_DIR);
    setFilterError('');
  };

  const counts = useMemo(
    () => ({
      all: todoList.length,
      active: todoList.filter((todo) => !todo.isCompleted).length,
      completed: todoList.filter((todo) => todo.isCompleted).length,
    }),
    [todoList]
  );

  const outletContext = {
    todos: todoList,
    isLoading,
    isSearching: debouncedSearch !== '',
    onToggleTodo: handleToggleTodo,
    onUpdateTodo: handleUpdateTodo,
    onDeleteTodo: handleDeleteTodo,
  };

  return (
    <div className="todos">
      {error && (
        <Alert message={error}>
          <Button size="sm" onClick={() => setError('')}>
            Dismiss
          </Button>
        </Alert>
      )}
      {filterError && (
        <Alert message={filterError}>
          <Button size="sm" onClick={() => setFilterError('')}>
            Dismiss
          </Button>
          <Button size="sm" variant="primary" onClick={handleResetFilters}>
            Reset filters
          </Button>
        </Alert>
      )}

      <div className="toolbar glass">
        <div className="toolbar__search">
          <SearchField value={searchTerm} onChange={setSearchTerm} />
        </div>
        <div className="toolbar__sort">
          <SortControls
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSortByChange={setSortBy}
            onSortDirectionChange={setSortDirection}
          />
        </div>
      </div>

      <TodoForm onAddTodo={handleAddTodo} />
      <TodoNav counts={counts} />
      <Outlet context={outletContext} />
    </div>
  );
}

export default TodosPage;

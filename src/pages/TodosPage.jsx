import { useEffect, useReducer } from 'react';
import { useSearchParams } from 'react-router';
import TodoForm from '../features/Todos/TodoForm.jsx';
import TodoList from '../features/Todos/TodoList/TodoList.jsx';
import SortBy from '../shared/SortBy.jsx';
import FilterInput from '../shared/FilterInput.jsx';
import StatusFilter from '../shared/StatusFilter.jsx';
import useDebounce from '../utils/useDebounce.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import {
  todoReducer,
  initialTodoState,
  TODO_ACTIONS,
} from '../reducers/todoReducer';

function TodosPage() {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const [state, dispatch] = useReducer(todoReducer, initialTodoState);
  const {
    todoList,
    error,
    filterError,
    isTodoListLoading,
    sortBy,
    sortDirection,
    filterTerm,
    dataVersion,
  } = state;
  const debouncedFilterTerm = useDebounce(filterTerm, 300);
  const statusFilter = searchParams.get('status') || 'all';

  const handleFilterChange = (newTerm) => {
    dispatch({
      type: TODO_ACTIONS.SET_FILTER,
      payload: { filterTerm: newTerm },
    });
  };

  useEffect(() => {
    if (!token) return;

    const fetchTodos = async () => {
      dispatch({ type: TODO_ACTIONS.FETCH_START });

      const paramsObject = {
        sortBy,
        sortDirection,
      };
      if (debouncedFilterTerm) {
        paramsObject.find = debouncedFilterTerm;
      }
      const params = new URLSearchParams(paramsObject);

      try {
        const response = await fetch(`/api/tasks?${params}`, {
          method: 'GET',
          headers: { 'X-CSRF-TOKEN': token },
          credentials: 'include',
        });

        if (response.status === 401) {
          throw new Error('unauthorized');
        }
        if (!response.ok) {
          throw new Error('Failed to fetch todos');
        }

        const data = await response.json();
        dispatch({
          type: TODO_ACTIONS.FETCH_SUCCESS,
          payload: { todos: data.tasks },
        });
      } catch (err) {
        const isFilterError = !!(
          debouncedFilterTerm ||
          sortBy !== 'creationDate' ||
          sortDirection !== 'desc'
        );
        dispatch({
          type: TODO_ACTIONS.FETCH_ERROR,
          payload: {
            message: isFilterError
              ? `Error filtering/sorting todos: ${err.message}`
              : `Error fetching todos: ${err.message}`,
            isFilterError,
          },
        });
      }
    };

    fetchTodos();
  }, [token, sortBy, sortDirection, debouncedFilterTerm]);

  const addTodo = async (todoTitle) => {
    const newTodo = { id: Date.now(), title: todoTitle, isCompleted: false };
    dispatch({ type: TODO_ACTIONS.ADD_TODO_START, payload: { newTodo } });

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({
          title: newTodo.title,
          isCompleted: newTodo.isCompleted,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add todo');
      }

      const savedTodo = await response.json();
      dispatch({
        type: TODO_ACTIONS.ADD_TODO_SUCCESS,
        payload: { tempId: newTodo.id, savedTodo },
      });
    } catch (err) {
      dispatch({
        type: TODO_ACTIONS.ADD_TODO_ERROR,
        payload: { tempId: newTodo.id, message: `Error adding todo: ${err.message}` },
      });
    }
  };

  const completeTodo = async (id) => {
    const originalTodo = todoList.find((todo) => todo.id === id);
    if (!originalTodo) return;

    dispatch({ type: TODO_ACTIONS.COMPLETE_TODO_START, payload: { id } });

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({
          isCompleted: true,
          createdAt: originalTodo.createdAt,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to complete todo');
      }
      dispatch({ type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS });
    } catch (err) {
      dispatch({
        type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
        payload: { originalTodo, message: `Error completing todo: ${err.message}` },
      });
    }
  };

  const updateTodo = async (editedTodo) => {
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);
    if (!originalTodo) return;

    dispatch({ type: TODO_ACTIONS.UPDATE_TODO_START, payload: { editedTodo } });

    try {
      const response = await fetch(`/api/tasks/${editedTodo.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({
          title: editedTodo.title,
          isCompleted: editedTodo.isCompleted,
          createdAt: originalTodo.createdAt,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update todo');
      }
      dispatch({ type: TODO_ACTIONS.UPDATE_TODO_SUCCESS });
    } catch (err) {
      dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_ERROR,
        payload: { originalTodo, message: `Error updating todo: ${err.message}` },
      });
    }
  };

  return (
    <div>
      {error && (
        <div role="alert">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_ERROR })}
          >
            Clear Error
          </button>
        </div>
      )}
      {filterError && (
        <div role="alert">
          <p>{filterError}</p>
          <button
            type="button"
            onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_FILTER_ERROR })}
          >
            Clear Filter Error
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: TODO_ACTIONS.RESET_FILTERS })}
          >
            Reset Filters
          </button>
        </div>
      )}
      {isTodoListLoading && <p>Loading todos...</p>}
      <SortBy
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortByChange={(newSortBy) =>
          dispatch({
            type: TODO_ACTIONS.SET_SORT,
            payload: { sortBy: newSortBy, sortDirection },
          })
        }
        onSortDirectionChange={(newSortDirection) =>
          dispatch({
            type: TODO_ACTIONS.SET_SORT,
            payload: { sortBy, sortDirection: newSortDirection },
          })
        }
      />
      <StatusFilter />
      <FilterInput filterTerm={filterTerm} onFilterChange={handleFilterChange} />
      <TodoForm onAddTodo={addTodo} />
      <TodoList
        todoList={todoList}
        dataVersion={dataVersion}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        statusFilter={statusFilter}
      />
    </div>
  );
}

export default TodosPage;

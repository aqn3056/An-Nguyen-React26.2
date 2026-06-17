const TASKS_URL = '/api/tasks';

const NETWORK_ERROR =
  'We could not reach the server. Check your connection and try again.';

function authHeaders(token, hasBody) {
  const headers = { 'X-CSRF-TOKEN': token };
  if (hasBody) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
}

function ensureAuthorized(response) {
  if (response.status === 401) {
    const error = new Error('Your session has expired. Please log in again.');
    error.code = 'unauthorized';
    throw error;
  }
}

export async function fetchTodos({
  token,
  sortBy,
  sortDirection,
  search,
  signal,
}) {
  const params = new URLSearchParams({ sortBy, sortDirection });
  if (search) {
    params.set('find', search);
  }

  let response;
  try {
    response = await fetch(`${TASKS_URL}?${params}`, {
      method: 'GET',
      headers: authHeaders(token, false),
      credentials: 'include',
      signal,
    });
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error;
    }
    throw new Error(NETWORK_ERROR);
  }

  ensureAuthorized(response);
  if (!response.ok) {
    throw new Error('We could not load your tasks. Please try again.');
  }

  const data = await response.json();
  return data.tasks;
}

export async function createTodo({ token, title }) {
  let response;
  try {
    response = await fetch(TASKS_URL, {
      method: 'POST',
      headers: authHeaders(token, true),
      credentials: 'include',
      body: JSON.stringify({ title, isCompleted: false }),
    });
  } catch {
    throw new Error(NETWORK_ERROR);
  }

  ensureAuthorized(response);
  if (!response.ok) {
    throw new Error('We could not add your task. Please try again.');
  }

  return response.json();
}

export async function updateTodo({ token, id, fields }) {
  let response;
  try {
    response = await fetch(`${TASKS_URL}/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: authHeaders(token, true),
      credentials: 'include',
      body: JSON.stringify(fields),
    });
  } catch {
    throw new Error(NETWORK_ERROR);
  }

  ensureAuthorized(response);
  if (!response.ok) {
    throw new Error('We could not save your changes. Please try again.');
  }
}

export async function deleteTodo({ token, id }) {
  let response;
  try {
    response = await fetch(`${TASKS_URL}/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: authHeaders(token, false),
      credentials: 'include',
    });
  } catch {
    throw new Error(NETWORK_ERROR);
  }

  ensureAuthorized(response);
  if (!response.ok) {
    throw new Error('We could not delete your task. Please try again.');
  }
}

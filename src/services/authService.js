export async function logon({ email, password }) {
  let response;
  try {
    response = await fetch('/api/users/logon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
  } catch {
    throw new Error(
      'We could not reach the server. Check your connection and try again.'
    );
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (response.status === 200 && data?.name && data?.csrfToken) {
    return { name: data.name, csrfToken: data.csrfToken };
  }

  // Generic message so we never reveal whether the account exists or leak
  // server-side details.
  throw new Error('Invalid email or password. Please try again.');
}

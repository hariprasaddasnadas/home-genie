const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/+$/, '');

export const apiUrl = (path) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

const EMPTY_AUTH_STATE = { role: null, username: '', email: '', token: '' };

const parseStoredAuth = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
};

export const getAuthState = () => {
  const activeAuthType = localStorage.getItem('activeAuthType');
  const userAuth = parseStoredAuth('userAuth');
  const partnerAuth = parseStoredAuth('partnerAuth');

  const buildState = (role, payload) => ({
    role,
    username: payload?.user?.username || payload?.partner_profile?.full_name || 'Account',
    email: payload?.user?.email || '',
    token: payload?.user?.token || '',
    payload,
  });

  if (activeAuthType === 'partner' && partnerAuth?.user?.token) {
    return buildState('partner', partnerAuth);
  }
  if (activeAuthType === 'user' && userAuth?.user?.token) {
    return buildState('user', userAuth);
  }
  if (partnerAuth?.user?.token) {
    return buildState('partner', partnerAuth);
  }
  if (userAuth?.user?.token) {
    return buildState('user', userAuth);
  }

  return { ...EMPTY_AUTH_STATE, payload: null };
};

export const isLoggedIn = () => Boolean(getAuthState().token);

export const authHeaders = (extraHeaders = {}) => {
  const { token } = getAuthState();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Token ${token}` } : {}),
    ...extraHeaders,
  };
};

export const fetchJson = async (path, options = {}) => {
  const response = await fetch(apiUrl(path), options);
  const data = await response.json().catch(() => ({}));
  return { response, data };
};

export const extractApiError = (data, fallbackMessage = 'Something went wrong.') => {
  if (!data) return fallbackMessage;
  if (typeof data === 'string') return data;
  if (Array.isArray(data)) return data[0] || fallbackMessage;
  if (typeof data.detail === 'string') return data.detail;
  if (Array.isArray(data.non_field_errors) && data.non_field_errors.length > 0) {
    return data.non_field_errors[0];
  }

  for (const value of Object.values(data)) {
    if (typeof value === 'string') return value;
    if (Array.isArray(value) && value.length > 0) return value[0];
  }

  return fallbackMessage;
};

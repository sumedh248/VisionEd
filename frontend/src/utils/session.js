import { API_BASE_URL } from "./api";

const USER_STORAGE_KEY = "user";

const isBrowser = typeof window !== "undefined";

export const getStoredUser = () => {
  if (!isBrowser) {
    return null;
  }

  try {
    const rawUser = window.localStorage.getItem(USER_STORAGE_KEY);
    return rawUser ? JSON.parse(rawUser) : null;
  } catch (error) {
    window.localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
};

export const saveUserToStorage = (user) => {
  if (!isBrowser || !user) {
    return;
  }

  window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
};

export const clearStoredUser = () => {
  if (!isBrowser) {
    return;
  }

  window.localStorage.removeItem(USER_STORAGE_KEY);
};

export const fetchSessionUser = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/session`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      clearStoredUser();
      return null;
    }

    const data = await response.json();
    const user = data?.loggedIn ? data.user : null;

    if (user) {
      saveUserToStorage(user);
      return user;
    }

    clearStoredUser();
    return null;
  } catch (error) {
    clearStoredUser();
    return null;
  }
};

export const logoutSession = async () => {
  try {
    await fetch(`${API_BASE_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });
  } finally {
    clearStoredUser();
  }
};

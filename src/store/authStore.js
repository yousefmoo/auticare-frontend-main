import { create } from "zustand";
import { STORAGE_KEYS } from "../utils/constants";

// Mock users for demo purposes
export const MOCK_USERS = {
  doctor: {
    id: 1,
    email: "doctor@auticare.com",
    password: "doctor123",
    role: "doctor",
    name: "د. أحمد مصطفى",
    avatar: null,
  },
  therapist: {
    id: 2,
    email: "therapist@auticare.com",
    password: "therapist123",
    role: "therapist",
    name: "أماني إبراهيم",
    avatar: null,
  },
  parent: {
    id: 3,
    email: "parent@auticare.com",
    password: "parent123",
    role: "parent",
    name: "محمد أحمد",
    avatar: null,
  },
};

const normalizeRole = (value) => {
  if (!value) return null;
  return String(value).trim().toLowerCase();
};

const setPersistedAuth = (user, token, remember) => {
  const storage = remember ? localStorage : sessionStorage;
  const staleStorage = remember ? sessionStorage : localStorage;
  staleStorage.removeItem(STORAGE_KEYS.USER_DATA);
  staleStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  storage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
  storage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
};

const clearPersistedAuth = () => {
  localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  sessionStorage.removeItem(STORAGE_KEYS.USER_DATA);
  sessionStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
};

const getPersistedAuth = () => {
  const localUser = localStorage.getItem(STORAGE_KEYS.USER_DATA);
  const localToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  if (localUser && localToken) {
    return { userData: localUser, token: localToken };
  }

  const sessionUser = sessionStorage.getItem(STORAGE_KEYS.USER_DATA);
  const sessionToken = sessionStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  return { userData: sessionUser, token: sessionToken };
};

const normalizeAuthPayload = (data = {}) => {
  const source = data?.data || data;
  const rawUser =
    source?.user ||
    source?.User ||
    source?.profile ||
    source?.Profile ||
    (source?.email || source?.Email ? source : null);
  const token =
    source?.token ||
    source?.Token ||
    source?.accessToken ||
    source?.AccessToken ||
    source?.jwt ||
    source?.idToken ||
    null;

  if (!rawUser || !token) {
    return { user: null, role: null, token: null };
  }

  const role = normalizeRole(
    rawUser.role || rawUser.Role || rawUser.userRole || rawUser.UserRole
  );
  const user = {
    ...rawUser,
    id: rawUser.id || rawUser.Id || rawUser.userId || rawUser.UserId || null,
    email: rawUser.email || rawUser.Email || "",
    name:
      rawUser.name ||
      rawUser.Name ||
      rawUser.fullName ||
      rawUser.FullName ||
      "",
    role,
    avatar: rawUser.avatar || rawUser.Avatar || null,
  };

  return { user, role, token };
};

// Auth store using Zustand
export const useAuthStore = create((set) => ({
  // State
  isAuthenticated: false,
  user: null,
  role: null,
  loading: false,
  error: null,

  // Actions
  login: (data, options = {}) => {
    const { user, role, token } = normalizeAuthPayload(data);
    if (!user || !role || !token) {
      clearPersistedAuth();
      set({
        isAuthenticated: false,
        user: null,
        role: null,
        error: "Invalid server response. Please login again.",
        loading: false,
      });
      return;
    }

    set({
      isAuthenticated: true,
      user,
      role,
      loading: false,
      error: null,
    });

    // Persist to localStorage
    setPersistedAuth(user, token, Boolean(options.remember));
  },

  logout: () => {
    set({
      isAuthenticated: false,
      user: null,
      role: null,
      loading: false,
      error: null,
    });
    // Clear localStorage
    clearPersistedAuth();
  },

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  // Initialize from localStorage
  initAuth: () => {
    const { userData, token } = getPersistedAuth();
    
    if (userData && token) {
      try {
        const user = JSON.parse(userData);
        const role = normalizeRole(user?.role || user?.Role);
        if (!user?.email || !role) {
          throw new Error("Invalid persisted auth user shape");
        }

        set({
          isAuthenticated: true,
          user: { ...user, role },
          role,
          loading: false,
          error: null,
        });
      } catch (e) {
        clearPersistedAuth();
        set({
          isAuthenticated: false,
          user: null,
          role: null,
          loading: false,
        });
      }
    } else if (userData || token) {
      clearPersistedAuth();
      set({
        isAuthenticated: false,
        user: null,
        role: null,
        loading: false,
      });
    }
  },
}));

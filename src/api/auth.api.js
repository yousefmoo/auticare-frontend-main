import apiClient from "./client";
import { API_ENDPOINTS, STORAGE_KEYS } from "../utils/constants";

const toNormalizedRole = (role) => {
  if (!role) return null;
  return String(role).trim().toLowerCase();
};

const toBackendRole = (role) => {
  const normalizedRole = toNormalizedRole(role);
  switch (normalizedRole) {
    case "parent":
      return "Parent";
    case "doctor":
      return "Doctor";
    case "therapist":
      return "Therapist";
    default:
      return role || "";
  }
};

const buildRegisterPayload = (userData = {}) => {
  const role = toBackendRole(userData.role);
  const specializationCandidate =
    userData.specialization ||
    userData.therapyType ||
    null;

  return {
    fullName: userData.fullName || "",
    email: userData.email || "",
    password: userData.password || "",
    role: role || "",
    phone: userData.phone || "",
    specialization: specializationCandidate,
    licenseNumber: userData.licenseNumber || null,
    nationalId: userData.nationalId || null,
  };
};

const normalizeAuthResponse = (data = {}) => {
  const source = data?.data || data;
  const token =
    source?.token ||
    source?.accessToken ||
    source?.jwt ||
    source?.Token ||
    null;

  const userCandidate =
    source?.user ||
    source?.User ||
    source?.profile ||
    source?.Profile ||
    null;

  const user =
    userCandidate ||
    (source?.email || source?.Email || source?.role || source?.Role
      ? source
      : null);

  return { ...source, token, user };
};

/**
 * Login with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise} User data
 */
/**
 * Login with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise} Login result containing user and token
 */
export const login = async (email, password) => {
  const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
    email,
    password,
  });
  return normalizeAuthResponse(response);
};

/**
 * Register new user
 * @param {Object} userData
 * @returns {Promise} Registration result
 */
export const register = async (userData) => {
  const payload = buildRegisterPayload(userData);
  return apiClient.post(API_ENDPOINTS.AUTH.REGISTER, payload);
};

/**
 * Logout current user
 * @returns {Promise}
 */
export const logout = async () => {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  sessionStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  sessionStorage.removeItem(STORAGE_KEYS.USER_DATA);
  return Promise.resolve({ success: true });
};

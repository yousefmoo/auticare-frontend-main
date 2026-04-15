import apiClient from "./client";
import { API_ENDPOINTS } from "../utils/constants";

/**
 * Get all sessions, optionally filtered by role
 * @param {string} role 
 * @returns {Promise} Sessions list
 */
export async function getSessions(role) {
  const url = role ? `${API_ENDPOINTS.SESSIONS.LIST}?role=${role}` : API_ENDPOINTS.SESSIONS.LIST;
  return apiClient.get(url);
}

/**
 * Get upcoming sessions for a role
 * @param {string} role 
 * @returns {Promise} Upcoming sessions list
 */
export async function getUpcomingSessions(role) {
  return getSessions(role);
}

/**
 * Get session notes
 * @returns {Promise} Session notes list
 */
export async function getSessionNotes() {
  return apiClient.get(API_ENDPOINTS.NOTES.LIST); // Changed from SESSIONS.NOTES to NOTES.LIST maps to /notes/my-notes
}

/**
 * Get home follow-up notes
 * @returns {Promise} Home notes list
 */
export async function getHomeNotes() {
  return apiClient.get(API_ENDPOINTS.NOTES.LIST);
}

/**
 * Create a new home note
 * @param {Object} note 
 * @returns {Promise} Created note
 */
export async function addHomeNote(note) {
  return apiClient.post(API_ENDPOINTS.NOTES.CREATE, note);
}

/**
 * Cancel a session by ID
 * @param {string|number} sessionId 
 * @returns {Promise} success status
 */
export async function cancelSession(sessionId) {
  return apiClient.put(`${API_ENDPOINTS.SESSIONS.LIST}/${sessionId}/cancel`); // Using PUT based on standards, adjust if needed
}

/**
 * Send a session note
 * @param {string|number} sessionId 
 * @returns {Promise} success status
 */
export async function sendSessionNote(sessionId) {
  return apiClient.post(`${API_ENDPOINTS.SESSIONS.LIST}/${sessionId}/notes/send`);
}

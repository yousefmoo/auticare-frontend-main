import apiClient from "./client";

/**
 * Get parent dashboard overview
 * @returns {Promise} Dashboard data
 */
export const getParentDashboard = async () => {
  return apiClient.get('/dashboard/parent');
};

/**
 * Get specialist (Doctor/Therapist) dashboard overview
 * @returns {Promise} Dashboard data
 */
export const getSpecialistDashboard = async () => {
  return apiClient.get('/dashboard/specialist');
};

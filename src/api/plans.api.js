/**
 * Treatment Plans & Weekly Plans API
 * API functions for plan management
 */

import apiClient from './client';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * Get my treatment plans (for logged in role)
 * @returns {Promise} List of treatment plans
 */
export const getTreatmentPlans = async () => {
  return apiClient.get(API_ENDPOINTS.PLANS.LIST);
};

/**
 * Get treatment plan by ID
 * @param {string|number} planId - Treatment plan ID
 * @returns {Promise} Treatment plan details
 */
export const getTreatmentPlanById = async (planId) => {
  return apiClient.get(`${API_ENDPOINTS.PLANS.CREATE}/${planId}`);
};

/**
 * Create new treatment plan
 * @param {object} planData - Treatment plan data
 * @returns {Promise} Created treatment plan
 */
export const createTreatmentPlan = async (planData) => {
  return apiClient.post(API_ENDPOINTS.PLANS.CREATE, planData);
};

/**
 * Update treatment plan
 * @param {string|number} planId - Treatment plan ID
 * @param {object} updates - Plan updates
 * @returns {Promise} Updated treatment plan
 */
export const updateTreatmentPlan = async (planId, updates) => {
  return apiClient.put(`${API_ENDPOINTS.PLANS.UPDATE}/${planId}`, updates);
};

/**
 * Delete treatment plan
 * @param {string|number} planId - Treatment plan ID
 * @returns {Promise} Response
 */
export const deleteTreatmentPlan = async (planId) => {
  return apiClient.delete(`${API_ENDPOINTS.PLANS.DELETE}/${planId}`);
};

/**
 * Get treatment plan for child
 * @param {string|number} childId - Child ID
 * @returns {Promise} Treatment plan
 */
export const getWeeklyPlan = async (childId) => {
  // Replace mock weekly logic with child-specific plan pull
  return apiClient.get(`${API_ENDPOINTS.PLANS.BY_CHILD}/${childId}`);
};

import apiClient from "./client";
import { API_ENDPOINTS } from "../utils/constants";

/**
 * Get assessment questions by test ID
 * @param {string|number} testId 
 * @returns {Promise} Questions list
 */
export const getQuestions = async (testId = 1) => {
  return apiClient.get(`${API_ENDPOINTS.ASSESSMENT.QUESTIONS}/${testId}`);
};

/**
 * Submit assessment answers
 * @param {Object} assessmentData 
 * @returns {Promise} Submission result
 */
export const submitAssessment = async (assessmentData) => {
  return apiClient.post(API_ENDPOINTS.ASSESSMENT.SUBMIT, assessmentData);
};

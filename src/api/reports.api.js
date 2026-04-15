import apiClient from "./client";

/**
 * Get reports overview summary
 * @returns {Promise} Reports overview data
 */
export async function getReportsOverview() {
  return apiClient.get('/reports/overview');
}

/**
 * Get re-test schedule and guidance
 * @returns {Promise} Retest overview data
 */
export async function getRetestOverview() {
  return apiClient.get('/reports/retest-overview');
}

/**
 * Export reports as PDF
 * @returns {Promise} Success status and file metadata
 */
export async function exportReportsPdf() {
  return apiClient.get('/reports/export-pdf', { responseType: 'blob' });
}

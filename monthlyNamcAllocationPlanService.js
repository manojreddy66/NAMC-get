/**
 * @description Service file for GET monthly NAMC allocation plan API
 */

const { BadRequest } = require("utils/api_response_utils");
const { validateInput } = require("./validateRequest");
const {
  getMonthlyNamcAllocNScenarioStepData,
} = require("./monthlyNamcAllocationPlan");
const { prepareResponse } = require("./utils");

/**
 * @description Function to validate input and fetch monthly NAMC allocation plan response
 * @param {Object} event - lambda event
 * @returns {Object} formatted response
 */
async function getMonthlyNamcAllocationPlan(event) {
  try {
    const queryParams = event?.queryStringParameters || {};
    console.log("queryParams:", queryParams);
    /**
     * @description Validate input params
     * @param {Object} queryParams - request query params
     * @return {Object} response object containing validation errors if any
     */
    const errorMessages = await validateInput(queryParams);
    /* If validation errors exist, throw BadRequest error */
    if (errorMessages.length > 0) {
      throw new BadRequest(errorMessages);
    }
    const { scenarioId, userEmail } = queryParams;
    /**
     * @description Fetch monthly NAMC allocation plan data and scenario step status data
     * @param {String} scenarioId - scenario id
     * @param {String} userEmail - user email
     */
    const { monthlyNamcAllocationPlanData, scenarioStepStatusData } =
      await getMonthlyNamcAllocNScenarioStepData(scenarioId, userEmail);
    /**
     * @description Prepare final response
     */
    return prepareResponse(
      scenarioId,
      monthlyNamcAllocationPlanData,
      scenarioStepStatusData
    );
  } catch (err) {
    console.log("Error in getMonthlyNamcAllocationPlan:", err);
    throw err;
  }
}

module.exports = {
  getMonthlyNamcAllocationPlan,
};

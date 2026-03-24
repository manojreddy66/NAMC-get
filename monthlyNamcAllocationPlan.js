/**
 * @description DB operations to fetch monthly NAMC allocation plan and scenario step status
 */

const { dbConnect } = require("prismaORM/index");
const {
  namcAllocationPlanData,
} = require("prismaORM/services/namcAllocationPlanService");
const { getScenarioStepStatusData } = require("utils/scenario_step_status_utils");

/**
 * @description Function to fetch monthly NAMC allocation plan and scenario steps status details
 * @param {*} scenarioId - scenarioId from input
 * @param {*} userEmail - userEmail from input
 * @returns {Object} - monthlyNamcAllocationPlanData, scenarioStepStatusData
 */
async function getMonthlyNamcAllocNScenarioStepData(scenarioId, userEmail) {
  const rdb = await dbConnect();
  const namcAllocationPlanDataService = new namcAllocationPlanData(rdb);
  try {
    /**
     * @description Fetch monthly NAMC allocation plan data by scenarioId
     */
    const monthlyNamcAllocationPlanData =
      await namcAllocationPlanDataService.getMonthlyNamcAllocationPlanByScenarioId(
        scenarioId
      );
    /**
     * @description Fetch scenario steps data by scenarioId
     * @returns {Object} scenarioStepStatusData - scenario steps data returned by shared utility
     */
    const scenarioStepStatusData = await getScenarioStepStatusData(
      scenarioId,
      userEmail,
      rdb
    );
    return { monthlyNamcAllocationPlanData, scenarioStepStatusData };
  } catch (err) {
    console.log("Error in getMonthlyNamcAllocNScenarioStepData:", err);
    throw err;
  }
}

module.exports = {
  getMonthlyNamcAllocNScenarioStepData,
};

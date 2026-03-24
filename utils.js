/**
 * @description this file contains monthly NAMC allocation plan common utils
 */

const { formatMonthYear } = require("utils/common_utils");

/**
 * @description Function to prepare monthly NAMC allocation plan response
 * @param {String} scenarioId - scenarioId from input
 * @param {Array} monthlyNamcAllocationPlanData - monthly NAMC allocation plan details
 * @param {Object} scenarioStepStatusData - scenario step status details
 * @returns {Object} response - Formatted response
 */
function prepareResponse(
  scenarioId,
  monthlyNamcAllocationPlanData,
  scenarioStepStatusData
) {
  return {
    scenarioId,
    data: formatMonthlyNamcAllocationPlanDetails(monthlyNamcAllocationPlanData),
    scenarioSteps: scenarioStepStatusData,
  };
}

/**
 * @description Function to format monthly NAMC allocation plan data
 * @param {Array} monthlyNamcAllocationPlanData - flat records fetched from DB
 * @returns {Array} formatted monthly NAMC allocation plan array grouped by month
 */
function formatMonthlyNamcAllocationPlanDetails(monthlyNamcAllocationPlanData) {
  const dataByMonth = {};

  monthlyNamcAllocationPlanData.forEach((item) => {
    const monthYearKey = item.monthYear;
    if (!dataByMonth[monthYearKey]) {
      /**
       * @description isEditable is derived from the first row of the month
       */
      dataByMonth[monthYearKey] = {
        monthYear: formatMonthYear(monthYearKey), //"2025-01" to "Jan-25"
        totalMonthlyVolume: 0,
        isEditable: Boolean(item.editable),
        subSeries: [],
      };
    }

    dataByMonth[monthYearKey].subSeries.push({
      name: item.name,
      monthlyVolume: Number(item.monthlyVolume || 0),
    });

    dataByMonth[monthYearKey].totalMonthlyVolume += Number(
      item.monthlyVolume || 0
    );
  });

  return Object.keys(dataByMonth).map((monthYear) => dataByMonth[monthYear]);
}

module.exports = {
  prepareResponse,
};

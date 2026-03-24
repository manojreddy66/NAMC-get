const { BaseService } = require("./BaseService");

class namcAllocationPlanData extends BaseService {
  constructor(db) {
    super(db);
  }

  /**
   * @description Function to get monthly NAMC allocation plan by scenarioId
   * @param {String} scenarioId - scenario id
   * @returns {Array} monthly NAMC allocation plan rows
   */
  async getMonthlyNamcAllocationPlanByScenarioId(scenarioId) {
    try {
      return await this.prisma.$queryRaw`
        select
          production_month as "monthYear",
          sub_series_description as "name",
          monthly_volume as "monthlyVolume",
          editable as "editable"
        from supply_planning.namc_allocation_plan
        where scenario_id = ${scenarioId}::uuid
        order by production_month, sub_series_description;
      `;
    } catch (err) {
      console.log("Error in getMonthlyNamcAllocationPlanByScenarioId:", err);
      throw err;
    }
  }
}

module.exports.namcAllocationPlanData = namcAllocationPlanData;

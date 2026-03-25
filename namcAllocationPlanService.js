const { BaseService } = require("./BaseService");

class namcAllocationPlanData extends BaseService {
  constructor(db) {
    super(db);
  }

  /**
   * @description Function to fetch monthly NAMC allocation plan by scenarioId
   */
  async getMonthlyNamcAllocationPlanByScenarioId(scenarioId) {
    try {
      console.log(
        "*********query***********",
        `select production_month as "monthYear", sub_series_description as "name", monthly_volume as "monthlyVolume", editable as "editable" from supply_planning.namc_allocation_plan where scenario_id = ${scenarioId}::uuid order by production_month, sub_series_description;`
      );

      if (process.env.VALIDATION === "dberror") {
        throw new Error("getMonthlyNamcAllocationPlanByScenarioId DB error");
      }

      if (process.env.VALIDATION === "nodata") {
        return [];
      }

      if (process.env.VALIDATION === "nullmonthlyvolume") {
        return [
          {
            monthYear: "Mar-25",
            name: "RAV4 Gas",
            monthlyVolume: null,
            editable: true,
          },
        ];
      }

      return [
        {
          monthYear: "2025-01",
          name: "RAV4 Gas",
          monthlyVolume: 200,
          editable: false,
        },
        {
          monthYear: "2025-01",
          name: "RAV4 HV",
          monthlyVolume: 150,
          editable: true,
        },
        {
          monthYear: "2025-02",
          name: "CAMRY",
          monthlyVolume: 100,
          editable: true,
        },
      ];
    } catch (err) {
      console.log("Error in getMonthlyNamcAllocationPlanByScenarioId:", err);
      throw err;
    }
  }
}

module.exports.namcAllocationPlanData = namcAllocationPlanData;

/**
 * @name monthly-namc-allocation-plan
 * @description Returns scenario monthly NAMC allocation plan by scenarioId
 * @createdOn Mar 17th, 2026
 * @author Priyadarshini Gangone
 * @modifiedBy
 * @modifiedOn
 * @modificationSummary
 */

const {
  sendResponse,
  BadRequest,
  HTTP_RESPONSE_CODES,
} = require("utils/api_response_utils");
const {
  getMonthlyNamcAllocationPlan,
} = require("./monthlyNamcAllocationPlanService");
const { API_ERROR_MESSAGE } = require("constants/customConstants");

/**
 * @description Lambda handler for monthly NAMC allocation plan API.
 * @param {Object} event: API event with query params:
   {
     "scenarioId": "uniqueScenarioId",
     "userEmail": "userEmail"
   }
 * @returns {Object}: response sample is detailed below.
 * Success response with status code 200:
   {
     "scenarioId": "uniqueScenarioId",
     "data": [
       {
         "monthYear": "Jan-25",
         "totalMonthlyVolume": 350,
         "isEditable": true,
         "subSeries": [
           {
             "name": "RAV4 Gas",
             "monthlyVolume": 200
           },
           {
             "name": "RAV4 HV",
             "monthlyVolume": 150
           }
         ]
       }
     ],
   "scenarioSteps": { 
    "Line Level Inputs": {
      "Model Change Dates": "COMPLETED",
      "NAMC Allocation Plan": "COMPLETED",
      "NAMC Production Calendar": "COMPLETED"
    },
    "Vanning Center Inputs": {
      "Shipping Pattern": "COMPLETED",
      "Vanning Lead Time": "COMPLETED",
      "TMC Working Day Calendar": "COMPLETED"
    },
    "Grouping Settings": {
      "Grouping": "COMPLETED",
      "Min Max Stock": "IN PROGRESS",
      "Fluctuation Allowance": "NOT STARTED"
    },
    "other": [
      "Simulation",
      "Review",
      "Reports"
    ]
   } 
  }
 * In-valid input error with status 400:
  {
    "errorMessage": [<"ValidationError: validation error message">]
  }
 * Internal server error with status code 500:
  {
    "errorMessage": "Internal Server Error"
  }
 */
exports.handler = async (event) => {
  try {
    /**
     * @description Function to validate input and fetch monthly NAMC allocation plan response.
     * @param {Object} event: Input parameters
     * @returns {Object} monthlyNamcAllocationPlanData - monthly NAMC allocation plan details
     */
    const monthlyNamcAllocationPlanData =
      await getMonthlyNamcAllocationPlan(event);
    console.log("response:", monthlyNamcAllocationPlanData);
    return sendResponse(
      HTTP_RESPONSE_CODES.SUCCESS,
      monthlyNamcAllocationPlanData
    );
  } catch (err) {
    console.log("Handler Error:", err);
    let errorMessage = API_ERROR_MESSAGE.INTERNAL_SERVER_ERROR;
    let statusCode = HTTP_RESPONSE_CODES.INTERNAL_SERVER_ERROR;
    /**
     * @description If error is BadRequest, return 400 with validation messages
     */
    if (err instanceof BadRequest) {
      statusCode = HTTP_RESPONSE_CODES.BAD_REQUEST;
      errorMessage = err.message
        .split(/,(?=ValidationError:)/)
        .map((e) => e.trim());
      console.log("Validation error messages: ", errorMessage);
    }
    return sendResponse(statusCode, { errorMessage: errorMessage });
  }
};

/**
 * @description this file contains request validation methods
 */

const { dbConnect } = require("prismaORM/index");
const { scenariosData } = require("prismaORM/services/scenariosService");
const {
  getValidationSchema,
} = require("schemaValidator/supplyPlanning/namcAllocationPlan/getMonthlyNamcAllocationPlanSchema");

/**
 * @description Function to validate input request query params
 * @param {Object} queryParams: API input query params
 * @returns {Array} errorMessages - Validation errors if any
 */
async function validateInput(queryParams) {
  const errMessages = [];
  /**
   * @description Validate request query params using Joi schema
   * @param {Object} queryParams - request query params
   * @param {Array} errMessages - array of validation errors
   */
  await validateParams(queryParams, errMessages);
  /* If Joi input validation was successful, check if scenario exists or not*/
  if (errMessages.length === 0) {
    /**
     * @description Function to check if a scenario exists
     * @param {Object} params: Input request payload
     */
    await checkForInvalidScenario(queryParams, errMessages);
  }
  return errMessages;
}

/**
 * @description Function to validate request params using Joi schema
 * @param {Object} queryParams - request query params
 * @param {Array} errMessages - array to collect validation errors
 */
async function validateParams(queryParams, errMessages) {
  // Validation options to collect all error messages
  const options = { abortEarly: false };
  const schema = await getValidationSchema();
  const { error } = await schema.validate(queryParams, options);
  if (error) {
    error.details.forEach((detail) => {
      errMessages.push(detail.message);
    });
  }
}

/**
 * @description Function to check if a scenario exists
 * @param {Object} queryParams: Input request payload
 * @param {Array} errMessages - array to collect validation errors
 */
async function checkForInvalidScenario(queryParams, errMessages) {
  /* Connecting to DB instance */
  const rdb = await dbConnect();
  const scenariosDataService = new scenariosData(rdb);
  try {
    /**
     * @description Get scenario data by scenarioId
     */
    const scenarioData = await scenariosDataService.getScenarioDataById(
      queryParams.scenarioId
    );
    /* Check if scenario doesn't exist */
    if (!scenarioData || scenarioData.length === 0) {
      errMessages.push(`ValidationError: Scenario doesn't exist.`);
    }
  } catch (err) {
    console.log("Error in checkForInvalidScenario:", err);
    throw err;
  }
}

module.exports = {
  validateInput,
};

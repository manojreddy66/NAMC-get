const lambda = require("../../../../../../../src/sp/namcAllocationPlan/monthlyAllocationPlan/getMonthlyAllocationPlan/v1/1/app");
const assert = require("assert");

describe("SP Monthly NAMC Allocation Plan GET API Lambda Test Suite", () => {
  beforeEach(() => {
    delete process.env.VALIDATION;
    jest.resetModules();
    jest.mock("utils/api_response_utils");
    jest.mock("utils/common_utils");
    jest.mock("utils/scenario_step_status_utils");
    jest.mock("constants/customConstants");
    jest.mock("prismaORM/index");
    jest.mock("prismaORM/services/namcAllocationPlanService");
    jest.mock("prismaORM/services/scenariosService");
  });

  it("Unit Test Case 1: The API should return success response with a 200 status code.", async () => {
    console.log(
      "*****************Unit Test Case 1: The API should return success response with a 200 status code.*****************"
    );
    const event = {
      queryStringParameters: {
        scenarioId: "a2940022-37f7-46ba-9fac-11fdb213914c",
        userEmail: "gangone.priyadarshini@toyota.com",
      },
    };
    const response = {
      scenarioId: "a2940022-37f7-46ba-9fac-11fdb213914c",
      data: [
        {
          monthYear: "Jan-25",
          totalMonthlyVolume: 350,
          isEditable: false,
          subSeries: [
            {
              name: "RAV4 Gas",
              monthlyVolume: 200,
            },
            {
              name: "RAV4 HV",
              monthlyVolume: 150,
            },
          ],
        },
        {
          monthYear: "Feb-25",
          totalMonthlyVolume: 100,
          isEditable: true,
          subSeries: [
            {
              name: "CAMRY",
              monthlyVolume: 100,
            },
          ],
        },
      ],
      scenarioSteps: {
        "Grouping Settings": {
          "Fluctuation Allowance": "Completed",
          Grouping: "Completed",
          "Min Max Stock": "Completed",
        },
        "Line Level Inputs": {
          "Model Change Dates": "Completed",
          "NAMC Allocation Plan": "Completed",
          "NAMC Production Calendar": "Completed",
        },
        "Vanning Center Inputs": {
          "Shipping Pattern": "Completed",
          "TMC Working Day Calendar": "Completed",
          "Vanning Lead Time": "Completed",
        },
        other: ["Simulation", "Review", "Reports"],
      },
    };
    const result = await lambda.handler(event);
    assert.equal(result.statusCode, 200);
    assert.deepEqual(response, JSON.parse(result.body));
  });

  it("Unit Test Case 2: The API should return success response with a 200 status code when NAMC Allocation Plan data doesn't exist.", async () => {
    console.log(
      "*****************Unit Test Case 2: The API should return success response with a 200 status code when NAMC Allocation Plan data doesn't exist.*****************"
    );
    process.env.VALIDATION = "nodata";
    const event = {
      queryStringParameters: {
        scenarioId: "a2940022-37f7-46ba-9fac-11fdb213914c",
        userEmail: "gangone.priyadarshini@toyota.com",
      },
    };
    const response = {
      scenarioId: "a2940022-37f7-46ba-9fac-11fdb213914c",
      data: [],
      scenarioSteps: {
        "Grouping Settings": {
          "Fluctuation Allowance": "Completed",
          Grouping: "Completed",
          "Min Max Stock": "Completed",
        },
        "Line Level Inputs": {
          "Model Change Dates": "Completed",
          "NAMC Allocation Plan": "Completed",
          "NAMC Production Calendar": "Completed",
        },
        "Vanning Center Inputs": {
          "Shipping Pattern": "Completed",
          "TMC Working Day Calendar": "Completed",
          "Vanning Lead Time": "Completed",
        },
        other: ["Simulation", "Review", "Reports"],
      },
    };
    const result = await lambda.handler(event);
    assert.equal(result.statusCode, 200);
    assert.deepEqual(response, JSON.parse(result.body));
  });

  it("Unit Test Case 3: The API should return validation error with a 400 status code - Scenario doesn't exist.", async () => {
    console.log(
      "*****************Unit Test Case 3: The API should return validation error with a 400 status code - Scenario doesn't exist.*****************"
    );
    process.env.VALIDATION = "scenarionotfound";
    const event = {
      queryStringParameters: {
        scenarioId: "a2940022-37f7-46ba-9fac-11fdb213914c",
        userEmail: "gangone.priyadarshini@toyota.com",
      },
    };
    const result = await lambda.handler(event);
    assert.equal(result.statusCode, 400);
    const response = JSON.parse(result.body);
    assert.deepEqual(response, {
      errorMessage: ["ValidationError: Scenario doesn't exist."],
    });
  });

  it("Unit Test Case 4: The API should return validation error with a 400 status code when accessed with an empty event.", async () => {
    console.log(
      "*****************Unit Test Case 4: The API should return validation error with a 400 status code when accessed with an empty event.*****************"
    );
    const event = {};
    const result = await lambda.handler(event);
    assert.equal(result.statusCode, 400);
    const response = JSON.parse(result.body);
    assert.deepEqual(response, {
      errorMessage: [
        "ValidationError: scenarioId is required and must be a uuid.",
        "ValidationError: userEmail is required and must be a string.",
      ],
    });
  });

  it("Unit Test Case 5: The API should return a validation error (400) - scenarioId is missing.", async () => {
    console.log(
      "*****************Unit Test Case 5: The API should return a validation error with a 400 status code - scenarioId is missing.*****************"
    );
    const event = {
      queryStringParameters: {
        userEmail: "gangone.priyadarshini@toyota.com",
      },
    };
    const result = await lambda.handler(event);
    assert.equal(result.statusCode, 400);
    const response = JSON.parse(result.body);
    assert.deepEqual(response, {
      errorMessage: [
        "ValidationError: scenarioId is required and must be a uuid.",
      ],
    });
  });

  it("Unit Test Case 6: The API should return a validation error (400) - userEmail is missing.", async () => {
    console.log(
      "*****************Unit Test Case 6: The API should return a validation error with a 400 status code - userEmail is missing.*****************"
    );
    const event = {
      queryStringParameters: {
        scenarioId: "a2940022-37f7-46ba-9fac-11fdb213914c",
      },
    };
    const result = await lambda.handler(event);
    assert.equal(result.statusCode, 400);
    const response = JSON.parse(result.body);
    assert.deepEqual(response, {
      errorMessage: [
        "ValidationError: userEmail is required and must be a string.",
      ],
    });
  });

  it("Unit Test Case 7: The API should return a validation error (400) - invalid scenarioId and userEmail type.", async () => {
    console.log(
      "*****************Unit Test Case 7: The API should return a validation error with a 400 status code - invalid scenarioId and userEmail type.*****************"
    );
    const event = {
      queryStringParameters: {
        scenarioId: "niqueuuid_1234567891",
        userEmail: 123,
      },
    };
    const result = await lambda.handler(event);
    assert.equal(result.statusCode, 400);
    const response = JSON.parse(result.body);
    assert.deepEqual(response, {
      errorMessage: [
        "ValidationError: scenarioId is required and must be a uuid.",
        "ValidationError: userEmail is required and must be a string.",
      ],
    });
  });

  it("Unit Test Case 8: The API should return a validation error (400) - invalid userEmail format.", async () => {
    console.log(
      "*****************Unit Test Case 8: The API should return a validation error with a 400 status code - invalid userEmail format.*****************"
    );
    const event = {
      queryStringParameters: {
        scenarioId: "a2940022-37f7-46ba-9fac-11fdb213914c",
        userEmail: "not-an-email",
      },
    };
    const result = await lambda.handler(event);
    assert.equal(result.statusCode, 400);
    const response = JSON.parse(result.body);
    assert.deepEqual(response, {
      errorMessage: ["ValidationError: Invalid userEmail."],
    });
  });

  it("Unit Test Case 9: The API should return internal server error with a 500 status code - DB error during scenario validation.", async () => {
    console.log(
      "*****************Unit Test Case 9: The API should return internal server error with a 500 status code - DB error during scenario validation.*****************"
    );
    process.env.VALIDATION = "error";
    const event = {
      queryStringParameters: {
        scenarioId: "a2940022-37f7-46ba-9fac-11fdb213914c",
        userEmail: "gangone.priyadarshini@toyota.com",
      },
    };
    const result = await lambda.handler(event);
    assert.equal(result.statusCode, 500);
    assert.deepEqual(
      JSON.parse(result.body).errorMessage,
      "Internal Server Error"
    );
  });

  it("Unit Test Case 10: The API should return internal server error with a 500 status code - DB error during NAMC Allocation Plan fetch.", async () => {
    console.log(
      "*****************Unit Test Case 10: The API should return internal server error with a 500 status code - DB error during NAMC Allocation Plan fetch.*****************"
    );
    process.env.VALIDATION = "dberror";
    const event = {
      queryStringParameters: {
        scenarioId: "a2940022-37f7-46ba-9fac-11fdb213914c",
        userEmail: "gangone.priyadarshini@toyota.com",
      },
    };
    const result = await lambda.handler(event);
    assert.equal(result.statusCode, 500);
    assert.deepEqual(
      JSON.parse(result.body).errorMessage,
      "Internal Server Error"
    );
  });

  it("Unit Test Case 11: The API should return internal server error with a 500 status code - error during scenario steps fetch.", async () => {
    console.log(
      "*****************Unit Test Case 11: The API should return internal server error with a 500 status code - error during scenario steps fetch.*****************"
    );
    process.env.VALIDATION = "dbError";
    const event = {
      queryStringParameters: {
        scenarioId: "a2940022-37f7-46ba-9fac-11fdb213914c",
        userEmail: "gangone.priyadarshini@toyota.com",
      },
    };
    const result = await lambda.handler(event);
    assert.equal(result.statusCode, 500);
    assert.deepEqual(
      JSON.parse(result.body).errorMessage,
      "Internal Server Error"
    );
  });

  it("Unit Test Case 12: The API should default monthlyVolume and totalMonthlyVolume to 0 when monthlyVolume is null.", async () => {
    console.log(
      "*****************Unit Test Case 12: The API should default monthlyVolume and totalMonthlyVolume to 0 when monthlyVolume is null.*****************"
    );
    process.env.VALIDATION = "nullmonthlyvolume";
    const event = {
      queryStringParameters: {
        scenarioId: "a2940022-37f7-46ba-9fac-11fdb213914c",
        userEmail: "gangone.priyadarshini@toyota.com",
      },
    };
    const response = {
      scenarioId: "a2940022-37f7-46ba-9fac-11fdb213914c",
      data: [
        {
          monthYear: "Mar-25",
          totalMonthlyVolume: 0,
          isEditable: true,
          subSeries: [
            {
              name: "RAV4 Gas",
              monthlyVolume: 0,
            },
          ],
        },
      ],
      scenarioSteps: {
        "Grouping Settings": {
          "Fluctuation Allowance": "Completed",
          Grouping: "Completed",
          "Min Max Stock": "Completed",
        },
        "Line Level Inputs": {
          "Model Change Dates": "Completed",
          "NAMC Allocation Plan": "Completed",
          "NAMC Production Calendar": "Completed",
        },
        "Vanning Center Inputs": {
          "Shipping Pattern": "Completed",
          "TMC Working Day Calendar": "Completed",
          "Vanning Lead Time": "Completed",
        },
        other: ["Simulation", "Review", "Reports"],
      },
    };
    const result = await lambda.handler(event);
    assert.equal(result.statusCode, 200);
    assert.deepEqual(response, JSON.parse(result.body));
  });
});

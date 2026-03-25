/** Common Utilities */
const { BadRequest } = require("utils/api_response_utils");
const {
  MONTH_MAP,
  SCENARIO_TYPES,
  SCENARIO_TABLE_TABS,
  INIT_SCENARIO_STEP_STATUS_DATA,
  MONTHS,
} = require("constants/customConstants");
const moment = require("moment-timezone");
const { Prisma } = require("@prisma/client");

/* Check if body is not empty */
function emptyInputCheck(body) {
  /* Validate the requestId from input - if no errors, returns the transformed request body */
  if (!body || Object.keys(body).length === 0) {
    throw new BadRequest("ValidationError: Request body cannot be empty.");
  }
}

/**
 * @description Function to format cycle to YYYYMM
 * @param {*} cycle: Scenario cycle (Jan26)
 * @returns {*} formattedCycle - YYYYMM (202501)
 */
function formatScenarioCycle(cycle) {
  const month = cycle.slice(0, 3); // "Jan"
  const year = cycle.slice(3); // "26"

  const formattedMonth = MONTH_MAP[month];
  const formattedYear = `20${year}`; // "2026"

  return `${formattedYear}${formattedMonth}`;
}

/**
 * @description Function to format date to given format
 * @param {*} inputDate: input date value
 * @param {*} dateFormat: Expected date format
 * @returns {*} formatted date
 */
function formatDate(inputDate, dateFormat) {
  return moment(inputDate).format(dateFormat);
}

/**
 * @description Function to get query condition based on tab
 * @param {*} tab: Scenario table tab
 * @returns {*} query condition
 */
function getConditionByTab(tab) {
  if (tab === SCENARIO_TABLE_TABS.ALL) {
    return Prisma.empty;
  }
  return Prisma.sql` AND plan_type = ${SCENARIO_TYPES.GETSUDO}`;
}

/**
 * Build month filter condition using SIMILAR TO
 * Example: ["Jan","Feb"] -> AND scenario_cycle similar to '(Jan|Feb)%'
 */
function buildScenarioCycleMonthCondition(months) {
  const pattern = `(${months.join("|")})%`;
  return Prisma.sql` AND scenario_cycle SIMILAR TO ${pattern}`;
}

/**
 * Build filter conditions (common for All + Getsudo tabs)
 * @param {Object} params Input request params
 * @param {*} queryConditionForDataNCountByTab base condition (Prisma.empty or Prisma.sql`...`)
 * @returns {*} Prisma SQL fragment safe for $queryRaw
 */
function getFilterConditions(params, queryConditionForDataNCountByTab) {
  const conditions = [queryConditionForDataNCountByTab || Prisma.empty];

  if (params.month && !params.month.includes("all")) {
    conditions.push(buildScenarioCycleMonthCondition(params.month));
  }

  if (params.namc && !params.namc.includes("all")) {
    conditions.push(Prisma.sql` AND namc IN (${Prisma.join(params.namc)})`);
  }

  if (params.status && !params.status.includes("all")) {
    conditions.push(
      Prisma.sql` AND scenario_status IN (${Prisma.join(params.status)})`
    );
  }

  if (params.createdBy && !params.createdBy.includes("all")) {
    conditions.push(
      Prisma.sql` AND user_email IN (${Prisma.join(params.createdBy)})`
    );
  }

  return Prisma.join(conditions, "");
}

/**
 * @description Function to get step name from substep name by looking into INIT_SCENARIO_STEP_STATUS_DATA
 * @param {string} substepName - e.g. "NAMC Production Calendar" or "Grouping"
 * @returns {string|null} stepName - e.g. "Line Level Inputs" or "Grouping Settings"
 */
function getStepNameFromSubstep(substepName) {
  for (const [stepName, stepValue] of Object.entries(
    INIT_SCENARIO_STEP_STATUS_DATA
  )) {
    if (
      stepValue &&
      typeof stepValue === "object" &&
      !Array.isArray(stepValue)
    ) {
      if (Object.hasOwn(stepValue, substepName)) {
        return stepName;
      }
    }
  }
  return null; // not found
}

/**
 * @description Helper to extract model year number from modelYear string - "MY 25" / "MY25" -> 25
 * @param {String} modelYear - model year in format "MY YY"
 * @returns {Number} model year number (YY) as integer
 */
function getModelYearNumber(modelYear) {
  const match = new RegExp(/(\d{2})$/).exec(String(modelYear));
  // Joi already validates format, so match will exist.
  return Number.parseInt(match[1], 10);
}

/**
 * @description Helper to add days to a date object.
 * Used for validating continuity rule (next start = prev end + 1 day).
 * @param {Date} dateObj - base date
 * @param {Number} days - number of days to add
 * @returns {Date} new date with days added
 */
function addDays(dateObj, days) {
  const dt = new Date(dateObj.getTime());
  dt.setDate(dt.getDate() + days);
  return dt;
}

/**
 * @description Helper to convert a "YYYY-MM-DD" date string to "YYYYMM" format.
 * Used for month-level scenario timeframe comparisons.
 * Example: "2026-03-15" -> "202603"
 * @param {String|Date} dateStr - date value in "YYYY-MM-DD" or Date object
 * @returns {String} YYYYMM
 */
function dateStringToYearMonth(dateStr) {
  if (dateStr instanceof Date && !Number.isNaN(dateStr.getTime())) {
    return dateStr.toISOString().slice(0, 7).replace("-", "");
  }

  const value = String(dateStr || "").trim();
  const ymdMatch = new RegExp(/^(\d{4})-(\d{2})-\d{2}$/).exec(value);
  if (ymdMatch) {
    return `${ymdMatch[1]}${ymdMatch[2]}`;
  }

  const parsedDate = new Date(value);
  if (!Number.isNaN(parsedDate.getTime())) {
    return parsedDate.toISOString().slice(0, 7).replace("-", "");
  }

  return "";
}

/**
 * @description Function to format monthYear from YYYY-MM to Mon-YY
 * @param {String} monthYear - monthYear value from DB
 * @returns {String} formatted monthYear
 */
function formatMonthYear(monthYear) {
  const [year, month] = monthYear.split("-");
  const monthIndex = Number(month) - 1;

  if (!year || Number.isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) {
    return monthYear;
  }

  return `${MONTHS[monthIndex]}-${year.slice(-2)}`;
}

module.exports = {
  emptyInputCheck,
  formatScenarioCycle,
  formatDate,
  getConditionByTab,
  getFilterConditions,
  getStepNameFromSubstep,
  getModelYearNumber,
  addDays,
  dateStringToYearMonth,
  formatMonthYear,
};

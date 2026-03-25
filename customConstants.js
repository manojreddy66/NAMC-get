/* Put constant variable here */

const HTTP_METHOD = {
  GET: "GET",
  POST: "POST",
};

const API_ERROR_MESSAGE = {
  ACCESS_DENIED: "Access denied",
  INTERNAL_SERVER_ERROR: "Internal Server Error",
};

const DB_CLOSE_CONNECTION_STMT = `DB connection closed successfully!`;

const CT_TIME_ZONE = "America/Chicago";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const MONTH_MAP = {
  Jan: "01",
  Feb: "02",
  Mar: "03",
  Apr: "04",
  May: "05",
  Jun: "06",
  Jul: "07",
  Aug: "08",
  Sep: "09",
  Oct: "10",
  Nov: "11",
  Dec: "12",
};

const SCENARIO_TYPES = {
  AP: "AP",
  GETSUDO: "Getsudo",
  CUSTOM: "Custom",
};

const SCENARIO_STATUSES = {
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};

const SCENARIO_TABLE_TABS = {
  ALL: "all",
  GETSUDO: "getsudo",
};

const MONTH_FILTER_VALID_VALUES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
  "all",
];

const STATUS_FILTER_VALID_VALUES = [
  "Not Started",
  "In Progress",
  "Completed",
  "all",
];

const NAMC_FILTER_VALID_VALUES = [
  "TMMGT",
  "TMMBC",
  "TMMI",
  "TMMK",
  "MTM",
  "TMMMS",
  "TMMTX",
  "TMMC",
  "all",
];

const SCENARIO_STEP_STATUSES = {
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  ERROR: "Error",
};

const JOB_EXECUTION_STATUSES = {
  SUCCESS: "success",
  ERROR: "error",
};

const INIT_SCENARIO_STEP_STATUS_DATA = {
  "Line Level Inputs": {
    "NAMC Production Calendar": "Not Started",
    "Model Change Dates": "Not Started",
    "NAMC Allocation Plan": "Not Started",
  },
  "Vanning Center Inputs": {
    "Shipping Pattern": "Not Started",
    "Vanning Lead Time": "Not Started",
    "TMC Working Day Calendar": "Not Started",
  },
  "Grouping Settings": {
    Grouping: "Not Started",
    "Min Max Stock": "Not Started",
    "Fluctuation Allowance": "Not Started",
  },
  other: ["Simulation", "Review", "Reports"],
};

const VALID_STEP_NAMES = [
  "NAMC Production Calendar",
  "Model Change Dates",
  "NAMC Allocation Plan",
  "Shipping Pattern",
  "Vanning Lead Time",
  "TMC Working Day Calendar",
  "Grouping",
  "Min Max Stock",
  "Fluctuation Allowance",
];

module.exports = {
  HTTP_METHOD,
  API_ERROR_MESSAGE,
  DB_CLOSE_CONNECTION_STMT,
  CT_TIME_ZONE,
  MONTHS,
  SCENARIO_TYPES,
  MONTH_MAP,
  SCENARIO_TABLE_TABS,
  SCENARIO_STATUSES,
  MONTH_FILTER_VALID_VALUES,
  NAMC_FILTER_VALID_VALUES,
  STATUS_FILTER_VALID_VALUES,
  SCENARIO_STEP_STATUSES,
  JOB_EXECUTION_STATUSES,
  INIT_SCENARIO_STEP_STATUS_DATA,
  VALID_STEP_NAMES,
};

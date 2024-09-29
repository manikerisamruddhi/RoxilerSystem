// import express from "express";
// import { allTransactions, getBarChartStats, getCombinedStatistics, getPieChartStats, searchTransaction, statisticsByMonth } from "../controller/transactions.controller.js";

// const router = express.Router();

// router.get('/all/:month', allTransactions);

// router.get("/search", searchTransaction)

// router.get("/statistics/:month", statisticsByMonth) //statastic bu month 2nd

// router.get("/statistics/bar-chart/:month", getBarChartStats) 

// router.get("/statistics/pie-chart/:month", getPieChartStats)


// router.get("/combinedStatistics/:month", getCombinedStatistics)

// export default router;


import express from "express";
import {
  allTransactions,
  searchTransaction,
  statisticsByMonth,
  getBarChartStats,
  getCombinedStatistics,
  getPieChartStats,
} from "../controller/transactions.controller.js";

const router = express.Router();

// Get all transactions for a specific month
router.get('/all/:month', allTransactions);

// Search transactions based on search text and month
router.get("/search", searchTransaction);

// Additional routes for statistics
router.get("/statistics/:month", statisticsByMonth);
router.get("/statistics/bar-chart/:month", getBarChartStats);
router.get("/statistics/pie-chart/:month", getPieChartStats);
router.get("/combinedStatistics/:month", getCombinedStatistics);

export default router;

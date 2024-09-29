import connectToMongoDB from "../db/connectToDb.js";
import { 
    getAllTransactionsService, 
    getBarChartStatsService, 
    getCombinedStatisticsService, 
    getMonthlyStatisticsService, 
    getPieChartStatsService, 
    searchTransactionsService 
} from "../services/transactions.services.js";

// Fetch all transactions by month
export const allTransactions = async (req, res) => {
    try {
        await connectToMongoDB();
        const { month } = req.params;

        try {
            const transactions = await getAllTransactionsService(month);
            return res.status(200).json(transactions);
        } catch (error) {
            console.error("Error fetching transactions:", error);
            return res.status(500).json({ error: "Server error" });
        }
    } catch (error) {
        console.error("Database connection error:", error);
        return res.status(500).json({ error: "Database connection error" });
    }
}

// Search transactions
// Search transactions
// Search transactions
export const searchTransaction = async (req, res) => {
    const { searchText } = req.query; // Get search text from query parameters
    const { month } = req.query; // Get month from query parameters

    if (!month) {
        return res.status(400).json({ error: "Month is required" });
    }

    try {
        const { products, currentPage, totalPages, totalRecords } = await searchTransactionsService(month, searchText);
        return res.status(200).json({
            products,
            currentPage,
            totalPages,
            totalRecords,
        });
    } catch (error) {
        console.error("Error searching transactions:", error);
        return res.status(500).json({ error: "Server error" });
    }
};



// Fetch statistics by month
export const statisticsByMonth = async (req, res) => {
    const { month } = req.params;
    console.log(`Fetching statistics for month: ${month}`); // Debugging line
    if (!month) {
        return res.status(400).json({ error: "Month is required" });
    }

    try {
        const { success, saleAmount, soldItemCount, unSoldItemCount } = await getMonthlyStatisticsService(month);
        return res.json({
            success,
            saleAmount,
            soldItemCount,
            unSoldItemCount,
        });
    } catch (error) {
        console.error("Error calculating statistics:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
// Get bar chart stats
export const getBarChartStats = async (req, res) => {
    const { month } = req.params;
    if (!month) {
        return res.status(400).json({ error: "Month is required" });
    }

    try {
        const barChartData = await getBarChartStatsService(month);
        console.log(month);
        
        return res.json({ success: true, data: barChartData });
    } catch (error) {
        console.error("Error generating bar chart data:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get pie chart stats
export const getPieChartStats = async (req, res) => {
    const { month } = req.params;
    if (!month) {
        return res.status(400).json({ error: "Month is required" });
    }

    try {
        const pieChartData = await getPieChartStatsService(month);
        return res.json({ success: true, data: pieChartData });
    } catch (error) {
        console.error("Error generating pie chart data:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get combined statistics
export const getCombinedStatistics = async (req, res) => {
    const { month } = req.params;
    if (!month) {
        return res.status(400).json({ error: "Month is required" });
    }

    try {
        const combinedData = await getCombinedStatisticsService(month);
        return res.json({ success: true, data: combinedData });
    } catch (error) {
        console.error("Error fetching combined statistics:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

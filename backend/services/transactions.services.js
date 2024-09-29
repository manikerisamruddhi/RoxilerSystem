import connectToMongoDB from "../db/connectToDb.js";
import Product from "../models/product.model.js";

// Fetch all transactions for a specific month
export const getAllTransactionsService = async (month) => {
    await connectToMongoDB();
    if (!month) {
        throw new Error("Month is required");
    }

    const monthNumber = new Date(Date.parse(month + " 1, 2022")).getMonth();
    return await Product.find({
        dateOfSale: {
            $gte: new Date(2022, monthNumber, 1),
            $lt: new Date(2022, monthNumber + 1, 1),
        },
    });
};

// Search transactions by filter and month
export const searchTransactionsService = async (search, page = 1, perPage = 10, month) => {
    await connectToMongoDB();
    let filter = {};
    if (search) {
        filter = {
            $or: [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { price: { $regex: search } },
            ],
        };
    }
    if (month) {
        const monthNumber = new Date(Date.parse(month + " 1, 2022")).getMonth();
        filter.dateOfSale = {
            $gte: new Date(2022, monthNumber, 1),
            $lt: new Date(2022, monthNumber + 1, 1),
        };
    }
    const skip = (page - 1) * perPage;
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter).skip(skip).limit(parseInt(perPage));
    return {
        products,
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / perPage),
        totalRecords: total,
    };
};

// Get monthly statistics (sale amount, sold, unsold count)
export const getMonthlyStatisticsService = async (month) => {
    await connectToMongoDB();
    if (!month) {
        throw new Error("Month is required");
    }

    const monthNumber = new Date(Date.parse(month + " 1, 2022")).getMonth();
    const transactions = await Product.find({
        dateOfSale: {
            $gte: new Date(2022, monthNumber, 1),
            $lt: new Date(2022, monthNumber + 1, 1),
        },
    });

    let saleAmount = 0;
    let soldItemCount = 0;
    let unSoldItemCount = 0;
    transactions.forEach((t) => {
        saleAmount += t.price;
        t.sold ? soldItemCount++ : unSoldItemCount++;
    });

    return {
        success: true,
        saleAmount,
        soldItemCount,
        unSoldItemCount,
    };
};

// Get bar chart data based on price range
export const getBarChartStatsService = async (month) => {
    await connectToMongoDB();
    if (!month) {
        throw new Error("Month is required");
    }

    const monthNumber = new Date(Date.parse(month + " 1, 2000")).getMonth();
    const priceRanges = [
        { range: "0-100", min: 0, max: 100 },
        { range: "101-200", min: 101, max: 200 },
        { range: "201-300", min: 201, max: 300 },
        { range: "301-400", min: 301, max: 400 },
        { range: "401-500", min: 401, max: 500 },
        { range: "501-600", min: 501, max: 600 },
        { range: "601-700", min: 601, max: 700 },
        { range: "701-800", min: 701, max: 800 },
        { range: "801-900", min: 801, max: 900 },
        { range: "901-above", min: 901, max: Number.MAX_VALUE },
    ];

    const barChartData = [];
    for (const priceRange of priceRanges) {
        const count = await Product.countDocuments({
            price: { $gte: priceRange.min, $lt: priceRange.max },
            $expr: {
                $eq: [{ $month: "$dateOfSale" }, monthNumber + 1],
            },
        });

        barChartData.push({ range: priceRange.range, count });
        
    }
    console.log("this is bar chart",barChartData);
    

    return barChartData;
};

// Get pie chart data by category
export const getPieChartStatsService = async (month) => {
    await connectToMongoDB();
    if (!month) {
        throw new Error("Month is required");
    }

    const monthNumber = new Date(Date.parse(month + " 1, 2000")).getMonth();
    const result = await Product.aggregate([
        {
            $match: {
                $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber + 1] },
            },
        },
        {
            $group: {
                _id: "$category",
                count: { $sum: 1 },
            },
        },
    ]);

    return result.map((r) => ({ category: r._id, count: r.count }));
};

// Get combined statistics
export const getCombinedStatisticsService = async (month) => {
    await connectToMongoDB();
    const pieData = await getPieChartStatsService(month);
    const barData = await getBarChartStatsService(month);

    return { pieData, barData };
};

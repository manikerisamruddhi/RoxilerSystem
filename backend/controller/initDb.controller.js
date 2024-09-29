
import { initDbService } from "../services/initDb.services.js";

const initDbController = async (req, res) => {

    try {

        const response = await initDbService();
        if (response) {
            res.json({
                success: true,
                message: "Data initialized successfully"
            })
        } else {
            res.json({
                success: false,
                message: "Internal Server Error"
            })
        }

    } catch (error) {
        console.error("Error fetching data from URL:", error);
        res.json({
            success: false,
            error: "Internal Server Error"
        })
    }
};

export default initDbController;

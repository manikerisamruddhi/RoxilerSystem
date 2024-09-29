import connectToMongoDB from "../db/connectToDb.js";
import Product from "../models/product.model.js";
import axios from "axios";

export const initDbService = async () => {
    const url = 'https://s3.amazonaws.com/roxiler.com/product_transaction.json'; // Replace with the correct URL if needed.

    try {
        await connectToMongoDB();

        await Product.deleteMany({});
        const response = await axios.get(url);
        const data = response.data;

        const insertedProducts = await Promise.all(data.map(async (product) => {
            try {
                const newProduct = new Product({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    description: product.description,
                    category: product.category,
                    image: product.image,
                    sold: product.sold,
                    dateOfSale: new Date(product.dateOfSale)
                });

                await newProduct.save();
            } catch (err) {
                console.error(`Error saving product with id: ${product.id}. Error: ${err}`);

            }
        }));

        console.log(`Inserted ${insertedProducts.length} products into the database.`);
        return true

    } catch (error) {
        console.error("Error fetching data from URL:", error);
        res.json({
            success: false,
            error: "Internal Server Error"
        })
    }
}
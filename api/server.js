const express = require('express');
const cors = require('cors');
const app = express();

const corsOptions = {
    origin: 'http://localhost:8080',
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Example endpoint for fetching "In Stock" recipes
app.get('/api/recipes', async (req, res) => {
    try {
        const { inStock } = req.query;

        // If "inStock" filter is applied, fetch recipes with all ingredients in stock
        if (inStock === 'true') {
            const recipes = await getInStockRecipes(); // Replace with actual logic
            return res.json(recipes);
        }

        // Otherwise, fetch all recipes
        const recipes = await getAllRecipes(); // Replace with actual logic
        res.json(recipes);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Example function to fetch "In Stock" recipes
async function getInStockRecipes() {
    // Replace this with actual database query or logic
    // Ensure it checks that all ingredients for a recipe are in stock
    return []; // Placeholder: Replace with actual implementation
}

// Example function to fetch all recipes
async function getAllRecipes() {
    // Replace this with actual database query or logic
    return []; // Placeholder: Replace with actual implementation
}

app.listen(process.env.PORT || 3000, () => {
    console.log(`API server running on port ${process.env.PORT || 3000}`);
});
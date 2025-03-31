import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RecipeList = ({ filterInStock }) => {
    const [recipes, setRecipes] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const query = filterInStock ? '?inStock=true' : '';
                const response = await axios.get(`/api/recipes${query}`);
                setRecipes(response.data);
            } catch (error) {
                console.error('Error fetching recipes:', error);
            }
        };

        fetchRecipes();
    }, [filterInStock]);

    const sortedRecipes = [...recipes].sort((a, b) => {
        if (!sortConfig.key) return 0;
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
    });

    const handleSort = (key) => {
        setSortConfig((prevConfig) => {
            const direction =
                prevConfig.key === key && prevConfig.direction === 'ascending'
                    ? 'descending'
                    : 'ascending';
            return { key, direction };
        });
    };

    return (
        <div>
            <h1>Recipes</h1>
            <table>
                <thead>
                    <tr>
                        {/* Ensure onClick handlers are properly attached */}
                        <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                            Name
                        </th>
                        <th onClick={() => handleSort('category')} style={{ cursor: 'pointer' }}>
                            Category
                        </th>
                        <th onClick={() => handleSort('inStock')} style={{ cursor: 'pointer' }}>
                            In Stock
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sortedRecipes.map((recipe) => (
                        <tr key={recipe.id}>
                            <td>{recipe.name}</td>
                            <td>{recipe.category}</td>
                            <td>{recipe.inStock ? 'Yes' : 'No'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RecipeList;

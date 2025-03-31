// /new-ui/src/pages/RecipeList.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, List, Plus, Filter, Star, CheckCircle, Search } from 'lucide-react';

import RecipeCard from '../components/recipes/RecipeCard';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import { getAllRecipes, getRecipesWithAllInStock, getRecipesWithAllButThreshold } from '../services/recipeService';

const RecipeList = () => {
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [view, setView] = useState('grid');
    const [searchTerm, setSearchTerm] = useState('');

    // Filter states
    const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
    const [showOnlyInStock, setShowOnlyInStock] = useState(false);
    const [missingThreshold, setMissingThreshold] = useState(null);

    // Fetch recipes
    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                setLoading(true);
                let data;

                if (showOnlyInStock) {
                    data = await getRecipesWithAllInStock();
                } else if (missingThreshold !== null) {
                    data = await getRecipesWithAllButThreshold(missingThreshold);
                } else {
                    data = await getAllRecipes();
                }

                setRecipes(data);
                setFilteredRecipes(data);
            } catch (err) {
                console.error('Failed to fetch recipes:', err);
                setError('Failed to load recipes. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, [showOnlyInStock, missingThreshold]);

    // Apply filters and search
    useEffect(() => {
        let result = [...recipes];

        // Apply search filter
        if (searchTerm) {
            result = result.filter(recipe =>
                recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply favorites filter
        if (showOnlyFavorites) {
            result = result.filter(recipe => recipe.favorite);
        }

        setFilteredRecipes(result);
    }, [recipes, searchTerm, showOnlyFavorites]);

    const handleCreateRecipe = () => {
        navigate('/recipes/new');
    };

    const resetFilters = () => {
        setSearchTerm('');
        setShowOnlyFavorites(false);
        setShowOnlyInStock(false);
        setMissingThreshold(null);
    };

    if (loading) return <Loading />;
    if (error) return <ErrorMessage message={error} retry={() => window.location.reload()} fullPage />;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Recipes</h1>
                <button
                    onClick={handleCreateRecipe}
                    className="flex items-center px-4 py-2 bg-emerald-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-emerald-700"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    New Recipe
                </button>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                {/* Search and Filters */}
                <div className="mb-6">
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search recipes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                    <div className="flex items-center space-x-4 overflow-x-auto pb-2">
                        <span className="text-gray-700 flex items-center whitespace-nowrap">
                            <Filter className="h-5 w-5 mr-1" />
                            Filters:
                        </span>

                        <button
                            className={`px-3 py-1.5 rounded-full text-sm flex items-center whitespace-nowrap ${showOnlyFavorites
                                ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                        >
                            <Star className={`h-4 w-4 mr-1 ${showOnlyFavorites ? 'fill-current' : ''}`} />
                            Favorites
                        </button>

                        <button
                            className={`px-3 py-1.5 rounded-full text-sm flex items-center whitespace-nowrap ${showOnlyInStock
                                ? 'bg-green-100 text-green-800 border border-green-300'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            onClick={() => setShowOnlyInStock(!showOnlyInStock)}
                        >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            In Stock
                        </button>

                        <select
                            className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm appearance-none cursor-pointer"
                            value={missingThreshold === null ? '' : missingThreshold}
                            onChange={(e) => {
                                const value = e.target.value === '' ? null : parseInt(e.target.value);
                                setMissingThreshold(value);
                            }}
                        >
                            <option value="">Missing Ingredients</option>
                            <option value="0">None missing</option>
                            <option value="1">≤ 1 missing</option>
                            <option value="2">≤ 2 missing</option>
                            <option value="3">≤ 3 missing</option>
                            <option value="5">≤ 5 missing</option>
                        </select>

                        {(showOnlyFavorites || showOnlyInStock || missingThreshold !== null || searchTerm) && (
                            <button
                                className="text-sm text-gray-600 hover:text-gray-900"
                                onClick={resetFilters}
                            >
                                Clear all
                            </button>
                        )}
                    </div>
                </div>

                {/* View Toggle and Create Button */}
                <div className="flex justify-end mb-4">
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setView('grid')}
                            className={`p-2 rounded ${view === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                        >
                            <Grid className="h-5 w-5 text-gray-600" />
                        </button>
                        <button
                            onClick={() => setView('list')}
                            className={`p-2 rounded ${view === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                        >
                            <List className="h-5 w-5 text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Recipe List */}
                {filteredRecipes.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No recipes found</p>
                    </div>
                ) : (
                    <div>
                        {view === 'grid' ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {filteredRecipes.map(recipe => (
                                    <div key={recipe.id} className="h-full">
                                        <RecipeCard recipe={recipe} view="grid" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {filteredRecipes.map(recipe => (
                                    <RecipeCard key={recipe.id} recipe={recipe} view="list" />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecipeList;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Clock, Users, CheckCircle } from 'lucide-react';

const RecipeCard = ({ recipe, view = 'grid' }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/recipes/${recipe.id}`);
    };

    if (view === 'grid') {
        return (
            <div
                onClick={handleClick}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer h-full"
            >
                <div className="p-4">
                    <div className="flex items-start justify-between">
                        <h3 className="text-lg font-medium text-gray-900 truncate">{recipe.name}</h3>
                        {recipe.favorite && (
                            <Star className="h-5 w-5 text-yellow-400 fill-current flex-shrink-0" />
                        )}
                    </div>

                    <div className="mt-4 space-y-2">
                        {recipe.ingredients && (
                            <div className="flex items-center text-sm text-gray-600">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                {recipe.ingredients.length} ingredients
                                {recipe.allIngredientsInStock && (
                                    <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                                        All in stock
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            onClick={handleClick}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
        >
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-medium text-gray-900">{recipe.name}</h3>
                        {recipe.favorite && (
                            <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        )}
                    </div>

                    <div className="flex items-center space-x-4">
                        {recipe.ingredients && (
                            <div className="flex items-center text-sm text-gray-600">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                {recipe.ingredients.length} ingredients
                                {recipe.allIngredientsInStock && (
                                    <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                                        All in stock
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeCard;

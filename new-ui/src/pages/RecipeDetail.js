import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Star, Edit, Save, Copy, Trash2, ShoppingCart, Plus,
    ArrowLeft, Check, X
} from 'lucide-react';
import toast from 'react-hot-toast';

import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import ConfirmationDialog from '../components/common/ConfirmationDialog';
import IngredientItem from '../components/recipes/IngredientItem';
import AddIngredientForm from '../components/recipes/AddIngredientForm';
import {
    getRecipeById,
    updateRecipeName,
    toggleFavorite,
    deleteRecipe,
    duplicateRecipe,
    createRecipe
} from '../services/recipeService';

const RecipeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    console.log('RecipeDetail render', { id });

    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState('');
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [showAddIngredient, setShowAddIngredient] = useState(false);

    // Fetch recipe data
    useEffect(() => {
        console.log('RecipeDetail fetching recipe', { id });
        const fetchRecipe = async () => {
            try {
                setLoading(true);
                if (!id || id === 'new') {
                    console.log('Initializing new recipe');
                    // For new recipe, initialize with empty state
                    setRecipe({
                        id: null,
                        name: '',
                        favorite: false,
                        ingredients: []
                    });
                    setEditedName('');
                    setLoading(false);
                    return;
                }

                const data = await getRecipeById(id);
                console.log('Recipe fetched:', data);
                setRecipe(data);
                setEditedName(data.name);
            } catch (err) {
                console.error('Failed to fetch recipe:', err);
                setError('Failed to load recipe. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [id]);

    const handleToggleFavorite = async () => {
        if (!recipe.id) return; // Don't allow toggling favorite for new recipe
        try {
            const updatedRecipe = await toggleFavorite(recipe.id);
            setRecipe({
                ...recipe,
                favorite: updatedRecipe.favorite
            });
            toast.success(`${recipe.name} ${updatedRecipe.favorite ? 'added to' : 'removed from'} favorites`);
        } catch (err) {
            toast.error('Failed to update favorite status');
        }
    };

    const handleEditName = () => {
        setIsEditing(true);
    };

    const handleSaveName = async () => {
        if (editedName.trim() === '') {
            toast.error('Recipe name cannot be empty');
            return;
        }

        try {
            if (!recipe.id || id === 'new') {
                // Create new recipe
                const newRecipe = await createRecipe(editedName);
                setRecipe(newRecipe);
                setIsEditing(false);
                toast.success('Recipe created successfully');
                navigate(`/recipes/${newRecipe.id}`);
            } else {
                // Update existing recipe
                const updatedRecipe = await updateRecipeName(recipe.id, editedName);
                setRecipe({
                    ...recipe,
                    name: updatedRecipe.name
                });
                setIsEditing(false);
                toast.success('Recipe name updated');
            }
        } catch (err) {
            toast.error('Failed to save recipe name');
        }
    };

    const handleCancelEdit = () => {
        setEditedName(recipe.name);
        setIsEditing(false);
    };

    const handleDuplicate = async () => {
        if (!recipe.id) return; // Don't allow duplicating new recipe
        try {
            const newRecipe = await duplicateRecipe(recipe.id);
            toast.success('Recipe duplicated successfully');
            navigate(`/recipes/${newRecipe.id}`);
        } catch (err) {
            toast.error('Failed to duplicate recipe');
        }
    };

    const handleDelete = async () => {
        if (!recipe.id) return; // Don't allow deleting new recipe
        try {
            await deleteRecipe(recipe.id);
            toast.success('Recipe deleted successfully');
            navigate('/');
        } catch (err) {
            toast.error('Failed to delete recipe');
            setShowDeleteConfirmation(false);
        }
    };

    const goToShoppingList = () => {
        if (!recipe.id) return; // Don't allow adding new recipe to shopping list
        navigate('/shopping-list', { state: { selectedRecipeIds: [recipe.id] } });
    };

    if (loading) return <Loading />;
    if (error) return <ErrorMessage message={error} retry={() => window.location.reload()} fullPage />;

    return (
        <div>
            {/* Back button */}
            <button
                onClick={() => navigate('/')}
                className="mb-4 text-gray-600 hover:text-gray-900 flex items-center"
            >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Recipes
            </button>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                {/* Recipe Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            {isEditing ? (
                                <div className="flex items-center">
                                    <input
                                        type="text"
                                        value={editedName}
                                        onChange={(e) => setEditedName(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        autoFocus
                                        placeholder="Enter recipe name"
                                    />
                                    <button
                                        onClick={handleSaveName}
                                        className="ml-2 p-2 text-green-600 hover:text-green-800"
                                        aria-label="Save"
                                    >
                                        <Check className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={handleCancelEdit}
                                        className="ml-1 p-2 text-red-600 hover:text-red-800"
                                        aria-label="Cancel"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            ) : (
                                <h1 className="text-2xl font-bold text-gray-900 break-words">
                                    {recipe.name || 'New Recipe'}
                                    <button
                                        onClick={handleEditName}
                                        className="ml-2 text-gray-400 hover:text-gray-700"
                                        aria-label="Edit recipe name"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </button>
                                </h1>
                            )}
                        </div>

                        <div className="flex items-center space-x-2">
                            {recipe.id && (
                                <button
                                    onClick={handleToggleFavorite}
                                    className={`p-2 rounded-full ${recipe.favorite
                                        ? 'text-yellow-500 hover:text-yellow-600'
                                        : 'text-gray-400 hover:text-gray-700'
                                        }`}
                                    aria-label={recipe.favorite ? 'Remove from favorites' : 'Add to favorites'}
                                >
                                    <Star className={`h-6 w-6 ${recipe.favorite ? 'fill-current' : ''}`} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Recipe Actions */}
                <div className="bg-gray-50 px-6 py-3 flex items-center justify-between">
                    <div className="flex-1">
                        <h2 className="text-lg font-semibold text-gray-900">Ingredients</h2>
                    </div>

                    <div className="flex items-center space-x-2">
                        {recipe.id && (
                            <>
                                <button
                                    onClick={goToShoppingList}
                                    className="flex items-center px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                >
                                    <ShoppingCart className="h-4 w-4 mr-1.5" />
                                    Add to Shopping List
                                </button>

                                <button
                                    onClick={handleDuplicate}
                                    className="flex items-center px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                >
                                    <Copy className="h-4 w-4 mr-1.5" />
                                    Duplicate
                                </button>

                                <button
                                    onClick={() => setShowDeleteConfirmation(true)}
                                    className="flex items-center px-3 py-1.5 text-sm bg-white border border-red-300 rounded-lg text-red-600 hover:bg-red-50"
                                >
                                    <Trash2 className="h-4 w-4 mr-1.5" />
                                    Delete
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Ingredients List */}
                <div className="p-6">
                    {recipe.id && recipe.ingredients && recipe.ingredients.length > 0 ? (
                        <div className="space-y-3">
                            {recipe.ingredients.map((ingredient) => (
                                <IngredientItem
                                    key={ingredient.id}
                                    ingredient={ingredient}
                                    recipeId={recipe.id}
                                    onUpdate={(updatedIngredient) => {
                                        setRecipe({
                                            ...recipe,
                                            ingredients: recipe.ingredients.map(ing =>
                                                ing.id === updatedIngredient.id ? updatedIngredient : ing
                                            )
                                        });
                                    }}
                                    onRemove={(ingredientId) => {
                                        setRecipe({
                                            ...recipe,
                                            ingredients: recipe.ingredients.filter(ing => ing.id !== ingredientId)
                                        });
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-8">
                            <p className="text-gray-500 mb-4">
                                {recipe.id
                                    ? "This recipe doesn't have any ingredients yet."
                                    : "Add ingredients after saving the recipe name."}
                            </p>
                        </div>
                    )}

                    {recipe.id && (
                        showAddIngredient ? (
                            <AddIngredientForm
                                key={recipe.id}
                                recipeId={recipe.id}
                                onAdd={(newIngredient) => {
                                    console.log('AddIngredientForm onAdd called', { newIngredient, recipe });
                                    if (recipe && recipe.ingredients) {
                                        setRecipe({
                                            ...recipe,
                                            ingredients: [...recipe.ingredients, newIngredient]
                                        });
                                        setShowAddIngredient(false);
                                    }
                                }}
                                onCancel={() => {
                                    console.log('AddIngredientForm onCancel called');
                                    setShowAddIngredient(false);
                                }}
                            />
                        ) : (
                            <button
                                onClick={() => {
                                    console.log('Show add ingredient clicked');
                                    setShowAddIngredient(true);
                                }}
                                className="mt-6 w-full flex items-center justify-center px-4 py-2 border border-dashed border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                <Plus className="h-5 w-5 mr-2" />
                                Add Ingredient
                            </button>
                        )
                    )}
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            {recipe.id && (
                <ConfirmationDialog
                    isOpen={showDeleteConfirmation}
                    onClose={() => setShowDeleteConfirmation(false)}
                    onConfirm={handleDelete}
                    title="Delete Recipe"
                    message={`Are you sure you want to delete "${recipe.name}"? This action cannot be undone.`}
                    confirmText="Delete"
                    isDangerous={true}
                />
            )}
        </div>
    );
};

export default RecipeDetail;
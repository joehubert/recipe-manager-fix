import React, { useState, useEffect } from 'react';
import { Plus, Filter, Search, Upload, Check, CheckSquare, Square, X, ArrowUp, ArrowDown } from 'lucide-react';
import toast from 'react-hot-toast';

import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import IngredientList from '../components/ingredients/IngredientList';
import AddIngredientModal from '../components/ingredients/AddIngredientModal';
import ImportIngredientsModal from '../components/ingredients/ImportIngredientsModal';
import { getAllIngredients, bulkUpdateInStock } from '../services/ingredientService';

const IngredientManagement = () => {
    const [ingredients, setIngredients] = useState([]);
    const [filteredIngredients, setFilteredIngredients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);

    // Sorting state
    const [sortConfig, setSortConfig] = useState({
        key: 'name',
        direction: 'asc'
    });

    // Category options from the enum in database
    const categoryOptions = [
        'all',
        'meat',
        'produce',
        'starch',
        'extra'
    ];

    // Fetch all ingredients
    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                setLoading(true);
                const data = await getAllIngredients();
                setIngredients(data);
                setFilteredIngredients(data);
            } catch (err) {
                console.error('Failed to fetch ingredients:', err);
                setError('Failed to load ingredients. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchIngredients();
    }, []);

    // Apply filters, search, and sorting
    useEffect(() => {
        let result = [...ingredients];

        // Apply category filter
        if (activeCategory !== 'all') {
            result = result.filter(ingredient => ingredient.category === activeCategory);
        }

        // Apply search filter
        if (searchTerm) {
            result = result.filter(ingredient =>
                ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply sorting
        result.sort((a, b) => {
            if (sortConfig.key === 'in_stock') {
                return sortConfig.direction === 'asc'
                    ? (a.in_stock === b.in_stock ? 0 : a.in_stock ? 1 : -1)
                    : (a.in_stock === b.in_stock ? 0 : a.in_stock ? -1 : 1);
            }

            const aValue = a[sortConfig.key].toLowerCase();
            const bValue = b[sortConfig.key].toLowerCase();
            return sortConfig.direction === 'asc'
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        });

        setFilteredIngredients(result);
    }, [ingredients, searchTerm, activeCategory, sortConfig]);

    const handleSort = (key) => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
    };

    const handleAddIngredient = (newIngredient) => {
        setIngredients([...ingredients, newIngredient]);
        toast.success(`${newIngredient.name} added successfully`);
        setShowAddModal(false);
    };

    const handleImportIngredients = (importedIngredients) => {
        setIngredients([...ingredients, ...importedIngredients]);
        toast.success(`${importedIngredients.length} ingredients imported successfully`);
        setShowImportModal(false);
    };

    const handleSelectIngredient = (id) => {
        if (selectedIngredients.includes(id)) {
            setSelectedIngredients(selectedIngredients.filter(item => item !== id));
        } else {
            setSelectedIngredients([...selectedIngredients, id]);
        }
    };

    const handleSelectAll = () => {
        if (selectedIngredients.length === filteredIngredients.length) {
            setSelectedIngredients([]);
        } else {
            setSelectedIngredients(filteredIngredients.map(ingredient => ingredient.id));
        }
    };

    const handleBulkUpdateInStock = async (inStock) => {
        if (selectedIngredients.length === 0) return;

        try {
            await bulkUpdateInStock(selectedIngredients, inStock);

            // Update local state
            setIngredients(ingredients.map(ingredient =>
                selectedIngredients.includes(ingredient.id)
                    ? { ...ingredient, in_stock: inStock }
                    : ingredient
            ));

            toast.success(`Updated ${selectedIngredients.length} ingredients`);
            setSelectedIngredients([]);
        } catch (err) {
            console.error('Failed to update ingredients:', err);
            toast.error('Failed to update ingredients');
        }
    };

    if (loading) return <Loading />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Ingredients</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowImportModal(true)}
                        className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        <Upload className="h-4 w-4 mr-2" />
                        Import
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center px-4 py-2 bg-emerald-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-emerald-700"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Ingredient
                    </button>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg">
                <div className="p-4 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search ingredients..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleBulkUpdateInStock(true)}
                                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                <Check className="h-4 w-4 mr-2" />
                                Mark Selected In Stock
                            </button>
                            <button
                                onClick={() => handleBulkUpdateInStock(false)}
                                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                <X className="h-4 w-4 mr-2" />
                                Mark Selected Out of Stock
                            </button>
                        </div>
                    </div>
                </div>

                {/* Category filters */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center space-x-4 overflow-x-auto pb-2">
                        <span className="text-gray-700 flex items-center whitespace-nowrap">
                            <Filter className="h-5 w-5 mr-1" />
                            Categories:
                        </span>
                        {categoryOptions.map(category => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-3 py-1.5 rounded-full text-sm capitalize whitespace-nowrap ${activeCategory === category
                                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table headers */}
                <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200">
                    <div className="col-span-1">
                        <button
                            onClick={handleSelectAll}
                            className="flex items-center justify-center w-4 h-4"
                        >
                            {selectedIngredients.length === filteredIngredients.length ? (
                                <CheckSquare className="h-4 w-4 text-emerald-600" />
                            ) : (
                                <Square className="h-4 w-4 text-gray-400" />
                            )}
                        </button>
                    </div>
                    <div className="col-span-4">
                        <button
                            onClick={() => handleSort('name')}
                            className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
                        >
                            Name
                            {getSortIcon('name')}
                        </button>
                    </div>
                    <div className="col-span-3">
                        <button
                            onClick={() => handleSort('category')}
                            className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
                        >
                            Category
                            {getSortIcon('category')}
                        </button>
                    </div>
                    <div className="col-span-2">
                        <button
                            onClick={() => handleSort('in_stock')}
                            className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
                        >
                            Status
                            {getSortIcon('in_stock')}
                        </button>
                    </div>
                    <div className="col-span-2 text-right text-sm font-medium text-gray-700">
                        Actions
                    </div>
                </div>

                {/* Ingredient list */}
                <IngredientList
                    ingredients={filteredIngredients}
                    selectedIngredients={selectedIngredients}
                    onSelect={handleSelectIngredient}
                    onUpdate={handleBulkUpdateInStock}
                    onDelete={() => { }}
                />
            </div>

            <AddIngredientModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onAdd={handleAddIngredient}
                categoryOptions={categoryOptions}
            />

            <ImportIngredientsModal
                isOpen={showImportModal}
                onClose={() => setShowImportModal(false)}
                onImport={handleImportIngredients}
                categoryOptions={categoryOptions}
            />
        </div>
    );
};

export default IngredientManagement;
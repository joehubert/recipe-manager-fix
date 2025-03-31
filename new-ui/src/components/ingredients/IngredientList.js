import React from 'react';
import IngredientRow from './IngredientRow';

const IngredientList = ({
    ingredients,
    selectedIngredients,
    onSelect,
    onUpdate,
    onDelete
}) => {
    if (ingredients.length === 0) {
        return (
            <tr>
                <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                    No ingredients found matching your criteria
                </td>
            </tr>
        );
    }

    return (
        <>
            {ingredients.map(ingredient => (
                <IngredientRow
                    key={ingredient.id}
                    ingredient={ingredient}
                    isSelected={selectedIngredients.includes(ingredient.id)}
                    onSelect={onSelect}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                />
            ))}
        </>
    );
};

export default IngredientList;
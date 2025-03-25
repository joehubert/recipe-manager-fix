-- Update ingredient categories enum type
-- First, create a new enum type
CREATE TYPE ingredient_category_new AS ENUM (
    'meat',
    'produce',
    'starch',
    'extra'
);

-- Update the ingredient table to use the new enum type
ALTER TABLE ingredient 
    ALTER COLUMN category TYPE ingredient_category_new 
    USING CASE category::text
        WHEN 'dairy' THEN 'extra'::ingredient_category_new
        WHEN 'bakery' THEN 'starch'::ingredient_category_new
        WHEN 'canned goods' THEN 'extra'::ingredient_category_new
        WHEN 'dry goods' THEN 'starch'::ingredient_category_new
        WHEN 'frozen' THEN 'extra'::ingredient_category_new
        WHEN 'spices' THEN 'extra'::ingredient_category_new
        WHEN 'condiments' THEN 'extra'::ingredient_category_new
        WHEN 'beverages' THEN 'extra'::ingredient_category_new
        WHEN 'other' THEN 'extra'::ingredient_category_new
        ELSE category::text::ingredient_category_new
    END;

-- Drop the old enum type
DROP TYPE ingredient_category;

-- Rename the new enum type to the original name
ALTER TYPE ingredient_category_new RENAME TO ingredient_category; 
# Recipe Manager Database Documentation

## Technical Requirements

### Database System
- **PostgreSQL** will be used as the database management system for the Recipe Manager application.
- The database will be containerized with Docker for ease of deployment and consistent environments.

### Schema Design

The database schema consists of three main tables:
- `recipe`: Stores recipe information
- `ingredient`: Stores ingredient information
- `recipe_ingredient`: Junction table connecting recipes and ingredients

### Data Types

- **Primary Keys**: All tables use auto-generated SERIAL primary keys
- **Enumerations**: Two custom enumerated types are implemented:
  - `ingredient_category`: Categorizes ingredients (meat, produce, starch, extra)
  - `unit_type`: Standardizes units of measurement (g, kg, oz, lb, ml, l, tsp, tbsp, cup, etc.)
- **Standard Types**:
  - Text: VARCHAR(255) for names
  - Boolean: For true/false flags
  - Numeric: For ingredient amounts

## Database Requirements

### Recipe Table
The recipe table tracks individual recipes with:
- `id`: SERIAL PRIMARY KEY
- `name`: VARCHAR(255) NOT NULL - Name of the recipe
- `favorite`: BOOLEAN DEFAULT FALSE - Flag for marking recipes as favorites

### Ingredient Table
The ingredient table stores food items with:
- `id`: SERIAL PRIMARY KEY
- `name`: VARCHAR(255) NOT NULL UNIQUE - Name of the ingredient
- `category`: ingredient_category NOT NULL - Type of ingredient (meat, produce, starch, extra)
- `in_stock`: BOOLEAN DEFAULT FALSE - Flag indicating if ingredient is currently available

### Recipe_Ingredient Junction Table
This table connects recipes to their ingredients with:
- `id`: SERIAL PRIMARY KEY
- `recipe_id`: INTEGER NOT NULL REFERENCES recipe(id) ON DELETE CASCADE
- `ingredient_id`: INTEGER NOT NULL REFERENCES ingredient(id) ON DELETE CASCADE
- `seq`: INTEGER NOT NULL - Display order of ingredients
- `amount`: NUMERIC - Quantity of ingredient
- `units`: unit_type - Unit of measurement

## Design Considerations

### Relationships
- A recipe can have multiple ingredients (one-to-many)
- An ingredient can be used in multiple recipes (many-to-one)
- The junction table handles the many-to-many relationship between recipes and ingredients

### Constraints
- Cascading deletes ensure referential integrity (deleting a recipe removes its ingredient associations)
- Unique constraints prevent duplicate ingredients in a recipe
- Required fields ensure data integrity

### Performance Optimizations
- Indexes are created on:
  - `favorite` flag for efficient filtering of favorite recipes
  - `category` to quickly filter ingredients by type
  - `in_stock` to efficiently find available ingredients
  - Junction table foreign keys for optimized joins

### Migration Strategy
- The database uses an incremental migration approach with sequentially numbered scripts
- A `schema_migrations` table tracks applied migrations
- Migration files are stored in the `/migrations` directory

## Future Considerations

The schema supports the following required operations:
- Creating, reading, updating, and deleting recipes and ingredients
- Marking recipes as favorites
- Tracking ingredient stock status
- Finding recipes with all ingredients in stock
- Finding recipes with a threshold of missing ingredients
- Generating shopping lists of missing ingredients
import { z } from 'zod'
// remove duplicates
export const knownIngredientsSchema = z.enum([
    'Salt',
    'Sugar',
    'Pepper',
    'Garlic',
    'Onion',
    'Olive Oil',
    'Butter',
    'Flour',
    'Baking Powder',
    'Baking Soda',
    'Cinnamon',
    'Nutmeg',
    'Vanilla Extract',
    'Cocoa Powder',
    'Yeast',
    'Egg',
    'Milk',
    'Heavy Cream',
    'Cheese',
    'Mozzarella',
    'Parmesan',
    'Cheddar',
    'Gouda',
    'Brie',
    'Cream Cheese',
    'Yogurt',
    'Almond Milk',
    'Coconut Milk',
    'Rice',
    'Brown Rice',
    'White Rice',
    'Quinoa',
    'Oats',
    'Pasta',
    'Spaghetti',
    'Macaroni',
    'Lasagna',
    'Tomato',
    'Tomato Paste',
    'Tomato Sauce',
    'Carrot',
    'Celery',
    'Zucchini',
    'Cucumber',
    'Potato',
    'Sweet Potato',
    'Lettuce',
    'Spinach',
    'Kale',
    'Broccoli',
    'Cauliflower',
    'Mushroom',
    'Peas',
    'Green Beans',
    'Bell Pepper',
    'Chili Pepper',
    'Lemon',
    'Lime',
    'Orange',
    'Apple',
    'Banana',
    'Grapes',
    'Strawberry',
    'Blueberry',
    'Raspberry',
    'Peach',
    'Plum',
    'Pineapple',
    'Mango',
    'Watermelon',
    'Avocado',
    'Almond',
    'Walnut',
    'Cashew',
    'Pecan',
    'Hazelnut',
    'Peanut',
    'Chia Seeds',
    'Flax Seeds',
    'Sunflower Seeds',
    'Pumpkin Seeds',
    'Coconut',
    'Chickpeas',
    'Black Beans',
    'Kidney Beans',
    'Lentils',
    'Tofu',
    'Tempeh',
    'Chicken',
    'Beef',
    'Pork',
    'Lamb',
    'Turkey',
    'Fish',
    'Salmon',
    'Tuna',
    'Shrimp',
    'Bacon',
    'Sausage',
    'Ham',
    'Duck',
    'Goat Cheese',
    'Ricotta',
    'Feta',
    'Goat',
    'Butter Milk',
    'Sour Cream',
    'Worcestershire Sauce',
    'Soy Sauce',
    'Vinegar',
    'White Vinegar',
    'Apple Cider Vinegar',
    'Red Wine Vinegar',
    'Balsamic Vinegar',
    'Honey',
    'Maple Syrup',
    'Agave Syrup',
    'Molasses',
    'Cornstarch',
    'Arrowroot Powder',
    'Panko',
    'Breadcrumbs',
    'Tapioca Starch',
    'Potato Starch',
    'Coconut Flour',
    'Almond Flour',
    'Rice Flour',
    'Cornmeal',
    'Sesame Seeds',
    'Poppy Seeds',
    'Mustard Seeds',
    'Cumin',
    'Turmeric',
    'Ginger',
    'Paprika',
    'Cayenne Pepper',
    'Oregano',
    'Basil',
    'Thyme',
    'Rosemary',
    'Parsley',
    'Sage',
    'Tarragon',
    'Bay Leaves',
    'Dill',
    'Chives',
    'Mint',
    'Chili Powder',
    'Garlic Powder',
    'Onion Powder',
    'Ground Pepper',
    'Saffron',
    'Cardamom',
    'Cloves',
    'Allspice',
    'Fennel Seeds',
    'Lemon Zest',
    'Orange Zest',
    'Coriander',
    'Fennel',
    'Star Anise',
    'Rose Water',
    'Orange Blossom Water',
    'Rice Vinegar',
    'Hot Sauce',
    'Tabasco',
    "Frank's RedHot",
    'Miso',
    'Tahini',
    'Pesto',
    'Hummus',
])

export type knownIngredientsType = z.infer<typeof knownIngredientsSchema>

export const knownUnitsSchema = z.enum([
    'cup',
    'tbsp',
    'tsp',
    'ml',
    'l',
    'qt',
    'gal',
    'g',
    'kg',
    'oz',
    'lbs',
    'pinch',
    'dash',
    'toTaste',
    'count',
])

export type knownUnitsType = z.infer<typeof knownUnitsSchema>

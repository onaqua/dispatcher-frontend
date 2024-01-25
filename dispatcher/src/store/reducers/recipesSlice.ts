import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import ProductionRecipeDTO from "../../entities/ProductionRecipeDTO";

type RecipesState = {
    recipes: Array<ProductionRecipeDTO>;
};

const initialState: RecipesState = {
    recipes: [],
};

const recipesSlice = createSlice({
    name: "recipes",
    initialState: initialState,
    reducers: {
        setRecipes(state, action: PayloadAction<Array<ProductionRecipeDTO>>) {
            state.recipes = action.payload;
        },
        addRecipe: (state, action: PayloadAction<ProductionRecipeDTO>) => {
            state.recipes.push(action.payload);
        },
        removeRecipe: (state, action: PayloadAction<number>) => {
            const recipeId = action.payload;

            state.recipes = state.recipes.filter(
                (recipe) => recipe.id !== recipeId
            );
        },
        updateRecipe: (state, action: PayloadAction<ProductionRecipeDTO>) => {
            const recipe = action.payload;
            const recipeId = recipe.id;

            state.recipes = state.recipes.map((item) =>
                item.id === recipeId ? recipe : item
            );
        },
    },
});

export default recipesSlice.reducer;

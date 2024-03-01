import { RecipeBase } from "./RecipeBase";
import { RecipeHumidity } from "./RecipeHumidity";
import { RecipeTimesSet } from "./RecipeTimesSet";
import { RecipeMixerSet } from "./RecipeMixerSet";


export interface RecipeLayer extends RecipeBase
{
    recipeHumidity: RecipeHumidity;
    recipeTimesSet: RecipeTimesSet;
    recipeMixerSet: RecipeMixerSet;
}

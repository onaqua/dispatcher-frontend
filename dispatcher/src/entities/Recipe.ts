import { LevelHumidity } from "./LevelHumidity";
import { TableRecipeHumidity } from "./TableRecipeHumidity";
import { RecipeTimesSetBase } from "./RecipeTimesSetBase";
import { RecipeMixerSetBase } from "./RecipeMixerSetBase";
import { RecipeBase } from "./RecipeBase";


export interface Recipe extends RecipeBase
{
    calibLevelHumidity: Array<Record<LevelHumidity, TableRecipeHumidity>>;
    recipeTimesSet: RecipeTimesSetBase;
    recipeMixerSet: RecipeMixerSetBase;
}

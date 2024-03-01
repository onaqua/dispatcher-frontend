import { BaseInfo } from "./BaseInfo";
import { RecipeStructure } from "./RecipeStructure";
import { RecipeCategory } from "./RecipeCategory";


export interface RecipeBase extends BaseInfo
{
    consider: boolean;
    isUseAutoCorrection: boolean;
    userId: number;
    editDate: string;
    isHiding: boolean;
    recipeCategory: RecipeCategory;
    structures: RecipeStructure[];
}

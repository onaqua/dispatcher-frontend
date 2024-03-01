import { BaseInfo } from "./BaseInfo";
import { ComponentType } from "./ComponentType";


export interface Component extends BaseInfo
{
    humidity: number;
    impurity: number;
    density: number;
    isDeleted: boolean;
    isUsedInRecipes: boolean;
    recipesConnect: number;
    typeComp: ComponentType;
}

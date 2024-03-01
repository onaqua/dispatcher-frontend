import { BaseInfo } from "./BaseInfo";


export interface RecipeTimesSetBase extends BaseInfo
{
    lineNumber: number;
    mixerNumber: number;
    isUsed: boolean;
}

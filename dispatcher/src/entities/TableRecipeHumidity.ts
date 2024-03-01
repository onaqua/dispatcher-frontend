import { BaseInfo } from "./BaseInfo";
import { LevelHumidity } from "./LevelHumidity";


export interface TableRecipeHumidity extends BaseInfo
{
    recipeId: number;
    calibLevelHumidity: LevelHumidity;
    mixerHumidity: number;
    mixerHumidityKoef: number;
    volumeBatch: number;
    steep: number;
    ofset: number;
}

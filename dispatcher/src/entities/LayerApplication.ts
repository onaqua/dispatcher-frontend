import { BaseInfo } from "./BaseInfo";
import { LayerStatus } from "./LayerStatus";
import { RecipeLayer } from "./RecipeLayer";


export interface LayerApplication extends BaseInfo
{
    applicationNumber: number;
    number: number;
    volume: number;
    curVolume: number;
    factVolume: number;
    status: LayerStatus;
    batcherPerformed: number;
    recipe: RecipeLayer;
}

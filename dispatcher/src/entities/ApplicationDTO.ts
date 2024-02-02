import { ProductionCarDTO } from "./ProductionCarDTO";
import ProductionClientDTO from "./ProductionClientDTO";
import ProductionRecipeDTO from "./ProductionRecipeDTO";

export interface ProductionLayerDTO {
    volume: number;
    currentVolume: number;
    status: LayerStatus;
    recipe: ProductionRecipeDTO;
}

export enum LayerStatus {
    Wait = 0,
    WaitForDosing = 1,
    Dosing = 2,
    Complete = 3,
}

export interface ProductionApplicationDTO {
    id: number;
    order: number;
    volume: number;
    currentVolume: number;
    car: ProductionCarDTO;
    layers: Array<ProductionLayerDTO>;
    client: ProductionClientDTO;
    status: ApplicationStatus;
    isDeleted: boolean;
}

export enum ApplicationStatus {
    Wait = 0,
    WaitForDosing = 1,
    Dosing = 2,
    DosingIsCompleted = 3,
    UnloadingIntoMixer = 4,
    Mixing = 5,
    Run = 6,
    Complete = 7,
}

export default ApplicationStatus;
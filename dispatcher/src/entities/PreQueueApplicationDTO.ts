import { ProductionCarDTO } from "./ProductionCarDTO";
import ProductionClientDTO from "./ProductionClientDTO";


export type PreQueueApplicationDTO = {
    // key: string;
    applicationId: number;
    order: string;
    recipeName: string;
    volume: number;
    mixerNumber: number;
    client?: ProductionClientDTO;
    car?: ProductionCarDTO;
};

export default PreQueueApplicationDTO;

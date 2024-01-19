import { CarDTO } from "./Car";
import ClientDTO from "./Client";


export type PreQueueApplicationDTO = {
    // key: string;
    applicationId: number;
    order: string;
    recipeName: string;
    volume: number;
    mixerNumber: number;
    client?: ClientDTO;
    car?: CarDTO;
};

export default PreQueueApplicationDTO;

import { CarDTO } from "./Car";
import ClientDTO from "./Client";

export type QueueApplicationDTO = {
    id: number;
    recipe: string;
    volume: number;
    mixerNumber: number;
    client?: ClientDTO;
    car?: CarDTO;
    status: ApplicationStatus;
};

export type ApplicationStatus = {
    currentStatus: "wait" | "inProcess" | "completed";
    currentProgress: number;
};

export default QueueApplicationDTO;

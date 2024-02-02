export interface ProductionEventDTO {
    id: number;
    valueBefore: string;
    valueAfter: string;
    appearanceDateTime: string;
    eventType: ProductionEventTypeDTO;
    object: ProductionEventObjectDTO;
    user: ProductionUserDTO;
}

export interface ProductionUserDTO {
    id: number;
    oldId: number;
    name: string;
}

export interface ProductionEventTypeDTO {
    id: number | null;
    eventLevel: EventLevel;
    description: string;
    details: string;
}

export interface ProductionEventObjectDTO {
    id: number;
    name: string;
}

export enum EventLevel {
    Accident = 10,
    SystemError = 20,
    Information = 30,
    Settings = 40,
}

export enum EventStatus {
    None,
    AccidentConfirmed,
    AccidentNotConfirmed,
}
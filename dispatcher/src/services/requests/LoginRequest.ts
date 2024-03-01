export type LoginRequest = {
    email: string;
    password: string;
};

export type AddApplicationInPreQueueRequest = {
    carId: number;
    clientId: number;
    recipeId: number;
    volume: number;
    mixerNumber: number;
    isQuickApplication: boolean;
    invoice: string;
};

export type UpdateCarRequest = {
    volume?: number;
    name?: string;
};

export type UpdateClientRequest = {
    name?: string;
    address?: string;
};

export type CreateCarRequest = {
    volume?: number;
    name?: string;
};

export type CreateClientRequest = {
    name?: string;
    address?: string;
};

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

type Layer = {
    id: -1;
    number: 1;
    volume: number;
    recipeId: number;
};

type Product = {
    id: number;
    name: string;
};

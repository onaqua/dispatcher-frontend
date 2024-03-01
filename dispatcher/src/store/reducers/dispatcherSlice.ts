import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Car } from "../../entities/Car";
import { RecipeCategory } from "../../entities/RecipeCategory";
import { Client } from "../../entities/Client";
import { Application } from "../../entities/Application";

export type DispatcherState = {
    mixer: number;
    volume: number;
    invoice?: string;
    car: Car;
    client?: Client;
    recipeId?: number;
    category: RecipeCategory;
    isQuickApplication: boolean;
    application?: Application;
};

const initialState: DispatcherState = {
    mixer: 1,
    volume: 1,
    invoice: "",
    car: { id: 0, name: "(не выбран)", volume: 0 },
    recipeId: 0,
    client: { id: 0, name: "(не выбран)", address: "(не выбран)" },
    category: { id: 1, name: "Без категории" },
    isQuickApplication: false,
};

const dispatcherSlice = createSlice({
    name: "dispatcher",
    initialState: initialState,
    reducers: {
        setInvoice(state, action: PayloadAction<string>) {
            state.invoice = action.payload;
        },
        setMixer(state, action: PayloadAction<number>) {
            state.mixer = action.payload;
        },
        setVolume(state, action: PayloadAction<number>) {
            state.volume = action.payload;
        },
        setCar(state, action: PayloadAction<Car>) {
            state.car = action.payload;
        },
        setRecipe(state, action: PayloadAction<number>) {
            state.recipeId = action.payload;
        },
        setCategory(state, action: PayloadAction<RecipeCategory>) {
            state.category = action.payload;
        },
        setClient(state, action: PayloadAction<Client>) {
            state.client = action.payload;
        },
        setApplication(state, action: PayloadAction<Application>) {
            state.application = action.payload;
        },
        setQuickApplication(state, action: PayloadAction<boolean>) {
            state.isQuickApplication = action.payload;
        },
    },
});

export const {
    setCar,
    setClient,
    setInvoice,
    setMixer,
    setRecipe,
    setVolume,
    setCategory,
    setApplication,
    setQuickApplication,
} = dispatcherSlice.actions;

export default dispatcherSlice.reducer;

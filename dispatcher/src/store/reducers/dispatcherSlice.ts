import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ProductionCarDTO } from "../../entities/ProductionCarDTO";
import ProductionClientDTO from "../../entities/ProductionClientDTO";
import ProductionRecipeDTO from "../../entities/ProductionRecipeDTO";

export type DispatcherState = {
    mixer: number;
    volume: number;
    invoice?: string;
    carId?: number;
    recipeId?: number;
    clientId?: number;
};

const initialState: DispatcherState = {
    mixer: 1,
    volume: 1,
    invoice: "",
    carId: 0,
    recipeId: 0,
    clientId: 0,
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
        setCar(state, action: PayloadAction<number>) {
            state.carId = action.payload;
        },
        setRecipe(state, action: PayloadAction<number>) {
            state.recipeId = action.payload;
        },
        setClient(state, action: PayloadAction<number>) {
            state.clientId = action.payload;
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
} = dispatcherSlice.actions;

export default dispatcherSlice.reducer;

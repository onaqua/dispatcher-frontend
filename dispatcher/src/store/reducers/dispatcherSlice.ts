import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ProductionApplicationDTO } from "../../entities/ApplicationDTO";
import { ProductionCarDTO } from "../../entities/ProductionCarDTO";
import ProductionClientDTO from "../../entities/ProductionClientDTO";
import { ProductionCategoryDTO } from "../../entities/ProductionCategoryDTO";

export type DispatcherState = {
    mixer: number;
    volume: number;
    invoice?: string;
    car: ProductionCarDTO;
    client?: ProductionClientDTO;
    recipeId?: number;
    category: ProductionCategoryDTO;
    isQuickApplication: boolean;
    application?: ProductionApplicationDTO;
};

const initialState: DispatcherState = {
    mixer: 1,
    volume: 1,
    invoice: "",
    car: { id: 0, plateNumber: "Не выбрана", volume: 0 },
    recipeId: 0,
    client: { id: 0, name: "Не выбран", address: "Не выбран" },
    category: { id: 0, name: "Без категории" },
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
        setCar(state, action: PayloadAction<ProductionCarDTO>) {
            state.car = action.payload;
        },
        setRecipe(state, action: PayloadAction<number>) {
            state.recipeId = action.payload;
        },
        setCategory(state, action: PayloadAction<ProductionCategoryDTO>) {
            state.category = action.payload;
        },
        setClient(state, action: PayloadAction<ProductionClientDTO>) {
            state.client = action.payload;
        },
        setApplication(state, action: PayloadAction<ProductionApplicationDTO>) {
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

import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ProductionCarDTO } from "../../entities/ProductionCarDTO";

type CarsState = {
    cars: Array<ProductionCarDTO>;
};

const initialState: CarsState = {
    cars: [],
};

const carsSlice = createSlice({
    name: "cars",
    initialState: initialState,
    reducers: {
        setCars(state, action: PayloadAction<Array<ProductionCarDTO>>) {
            state.cars = action.payload;
        },
        addCar: (state, action: PayloadAction<ProductionCarDTO>) => {
            state.cars.push(action.payload);
        },
        removeCar: (state, action: PayloadAction<number>) => {
            const carId = action.payload;

            state.cars = state.cars.filter((car) => car.id !== carId);
        },
        updateCar: (state, action: PayloadAction<ProductionCarDTO>) => {
            const car = action.payload;
            const carId = car.id;

            state.cars = state.cars.map((item) =>
                item.id === carId ? car : item
            );
        },
    },
});

export default carsSlice.reducer;

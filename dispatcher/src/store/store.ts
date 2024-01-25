import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";
import applicationsInQueueSlice from "./reducers/applicationsInQueueSlice";
import carsSlice from "./reducers/carsSlice";
import recipesSlice from "./reducers/recipesSlice";
import applicationsInPreQueueSlice from "./reducers/applicationsInPreQueueSlice";
import dispatcherSlice from "./reducers/dispatcherSlice";

const store = configureStore({
    reducer: {
        cars: carsSlice,
        recipes: recipesSlice,
        dispatcher: dispatcherSlice,
        applicationsInQueue: applicationsInQueueSlice,
        applicationsInPreQueue: applicationsInPreQueueSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;

export default store;

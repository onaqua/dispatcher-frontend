import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";
import applicationsInQueueSlice from "./reducers/applicationsInQueueSlice";
import carsSlice from "./reducers/carsSlice";
import recipesSlice from "./reducers/recipesSlice";
import applicationsInPreQueueSlice from "./reducers/applicationsInPreQueueSlice";
import dispatcherSlice from "./reducers/dispatcherSlice";
import userSlice from "./reducers/userSlice";
import authorizationSlice from "./reducers/authorizationSlice";
import themeSlice from "./reducers/themeSlice";

const store = configureStore({
    reducer: {
        user: userSlice,
        cars: carsSlice,
        themes: themeSlice,
        recipes: recipesSlice,
        dispatcher: dispatcherSlice,
        authorization: authorizationSlice,
        applicationsInQueue: applicationsInQueueSlice,
        applicationsInPreQueue: applicationsInPreQueueSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;

export default store;

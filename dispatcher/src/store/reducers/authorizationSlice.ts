import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type AuthorizationState = {
    authorization: AuthorizationType;
};

export enum AuthorizationType {
    none,
    refreshing,
}
const initialState: AuthorizationState = {
    authorization: AuthorizationType.none,
};

const authorizationSlice = createSlice({
    name: "authorization",
    initialState: initialState,
    reducers: {
        setState(state, action: PayloadAction<AuthorizationType>) {
            state.authorization = action.payload;
        },
    },
});

export const { setState } = authorizationSlice.actions;

export default authorizationSlice.reducer;

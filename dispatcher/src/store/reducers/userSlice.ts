import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import UserStateDTO from "../../entities/UserStateDTO";

type UsersState = {
    currentUser: UserStateDTO | undefined;
};

const initialState: UsersState = {
    currentUser: undefined,
};

const userSlice = createSlice({
    name: "users",
    initialState: initialState,
    reducers: {
        setUser(state, action: PayloadAction<UserStateDTO | undefined>) {
            state.currentUser = action.payload;
        },
    },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;

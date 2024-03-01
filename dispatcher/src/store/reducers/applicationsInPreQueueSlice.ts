import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ApplicationOrderDTO } from "../../entities/ApplicationOrderDTO";
import { Application } from "../../entities/Application";

export type ApplicationsState = {
    applications: Array<Application>;
};

const initialState: ApplicationsState = {
    applications: [],
};

const applicationsInPreQueueSlice = createSlice({
    name: "applicationsInPreQueue",
    initialState: initialState,
    reducers: {
        setApplications(
            state,
            action: PayloadAction<Array<Application>>
        ) {
            state.applications = action.payload.sort(
                (a, b) => a.order - b.order
            );
        },
        addApplication: (
            state,
            action: PayloadAction<Application>
        ) => {
            if (
                state.applications.find(
                    (application) => application.id === action.payload.id
                )
            ) {
                updateApplicationInPreQueue(action.payload);
            } else {
                state.applications.push(action.payload);
            }
        },
        removeApplication: (state, action: PayloadAction<number>) => {
            const applicationId = action.payload;

            state.applications = state.applications.filter(
                (application) => application.id !== applicationId
            );
        },
        updateApplication: (
            state,
            action: PayloadAction<Application>
        ) => {
            const application = action.payload;
            const applicationId = application.id;

            state.applications = state.applications.map((item) =>
                item.id === applicationId ? application : item
            );
        },
        updateOrder: (
            state,
            action: PayloadAction<Array<ApplicationOrderDTO>>
        ) => {
            state.applications = state.applications
                .map((item) => {
                    const applicationOrderDTO = action.payload.find(
                        (applicationOrderDTO) =>
                            applicationOrderDTO.id === item.id
                    );

                    if (applicationOrderDTO) {
                        item.order = applicationOrderDTO.order;
                    }

                    return item;
                })
                .sort((a, b) => a.order - b.order);
        },
    },
});

export const {
    setApplications: setApplicationsInPreQueue,
    updateOrder: updateOrderInPreQueue,
    addApplication: addApplicationInPreQueue,
    removeApplication: removeApplicationInPreQueue,
    updateApplication: updateApplicationInPreQueue,
} = applicationsInPreQueueSlice.actions;

export default applicationsInPreQueueSlice.reducer;

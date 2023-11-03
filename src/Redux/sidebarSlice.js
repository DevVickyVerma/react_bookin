import { createSlice } from "@reduxjs/toolkit";

// Define the initial state for the sidebar
const initialState = {
    isVerticalSidebarOpen: false, // You can add more sidebar-related state properties as needed
};

// Create the sidebar slice
const sidebarSlice = createSlice({
    name: "sidebar",
    initialState,
    reducers: {
        openVerticalSidebar: (state) => {
            state.isVerticalSidebarOpen = true;
        },
        closeVerticalSidebar: (state) => {
            state.isVerticalSidebarOpen = false;
        },
        toggleVerticalSidebar: (state) => {
            state.isVerticalSidebarOpen = !state.isVerticalSidebarOpen;
        },
    },
});

// Export the actions generated by the sidebar slice
export const {
    openVerticalSidebar,
    closeVerticalSidebar,
    toggleVerticalSidebar,
} = sidebarSlice.actions;

// Export the sidebar reducer
export default sidebarSlice.reducer;

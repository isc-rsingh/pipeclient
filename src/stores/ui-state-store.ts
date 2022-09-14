import { createSlice } from "@reduxjs/toolkit";

export interface IUiState {
    showAddNewTaskDialog:boolean;
}

const uiState:IUiState = {
    showAddNewTaskDialog: false
}

export const uiStateSlice = createSlice({
    name:'uiState',
    initialState: {value: uiState},
    reducers: {
      openAddNewTaskDialog: (state,action) => {
        state.value.showAddNewTaskDialog = true;
      },
      closeAddNewTaskDialog: (state, action) => {
        state.value.showAddNewTaskDialog = false;
      }
    }
})

export const {
    openAddNewTaskDialog,
    closeAddNewTaskDialog,
} = uiStateSlice.actions;

export default uiStateSlice.reducer;
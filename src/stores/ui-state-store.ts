import { createSlice } from "@reduxjs/toolkit";

export interface IUiState {
    showAddNewTaskDialog:boolean;
    showTaskPropertiesPanel:boolean;
    showDataPreviewPanel:boolean;
}

const uiState:IUiState = {
    showAddNewTaskDialog: false,
    showTaskPropertiesPanel: false,
    showDataPreviewPanel: false,
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
      },
      showTaskPropertiesPanel: (state, action) => {
        state.value.showTaskPropertiesPanel = true;
      },
      hideTaskPropertiesPanel: (state, action) => {
        state.value.showTaskPropertiesPanel = false;
      },
      showDataPreviewPanel: (state, action) => {
        state.value.showDataPreviewPanel = true;
      },
      hideDataPreviewPanel: (state, action) => {
        state.value.showDataPreviewPanel = false;
      },
    }
})

export const {
    openAddNewTaskDialog,
    closeAddNewTaskDialog,
    showTaskPropertiesPanel,
    hideTaskPropertiesPanel,
    showDataPreviewPanel,
    hideDataPreviewPanel,
} = uiStateSlice.actions;

export default uiStateSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";
import { Task } from "../models/task";

export interface IUiState {
    showAddNewTaskDialog:boolean;
    showTaskPropertiesPanel:boolean;
    showDataPreviewPanel:boolean;
    fullscreenPipelineEditor:boolean;
    selectedTask:Task | null;
    previewData:any[];
}

const uiState:IUiState = {
    showAddNewTaskDialog: false,
    showTaskPropertiesPanel: false,
    showDataPreviewPanel: false,
    fullscreenPipelineEditor: false,
    selectedTask:null,
    previewData:[],
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
      setSelectedTask: (state, action) => {
        state.value.selectedTask = action.payload;
      },
      setDataPreview: (state, action) => {
        state.value.previewData = action.payload;
      },
      showFullscreenPipelineEditor: (state, action) => {
        state.value.fullscreenPipelineEditor = true;
      },
      removeFullscreenPipelineEditor: (state, action) => {
        state.value.fullscreenPipelineEditor = false;
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
    setSelectedTask,
    setDataPreview,
    showFullscreenPipelineEditor,
    removeFullscreenPipelineEditor,
} = uiStateSlice.actions;

export default uiStateSlice.reducer;
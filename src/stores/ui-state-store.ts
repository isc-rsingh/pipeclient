import { createSlice } from "@reduxjs/toolkit";
import { Task } from "../models/task";

export interface IUiState {
    showAddNewTaskDialog:boolean;
    showRecipePropertiesPanel:boolean;
    showDataPreviewPanel:boolean;
    fullscreenPipelineEditor:boolean;
    selectedTask:Task | null;
    taskBeingEditted: Task | null;
    previewData:any[];
}

const uiState:IUiState = {
    showAddNewTaskDialog: false,
    showRecipePropertiesPanel: false,
    showDataPreviewPanel: false,
    fullscreenPipelineEditor: false,
    selectedTask:null,
    taskBeingEditted:null,
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
      showRecipePropertiesPanel: (state, action) => {
        state.value.showRecipePropertiesPanel = true;
      },
      hideRecipePropertiesPanel: (state, action) => {
        state.value.showRecipePropertiesPanel = false;
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
      setTaskBeingEdited: (state, action) => {
        state.value.taskBeingEditted = action.payload
      }
    }
})

export const {
    openAddNewTaskDialog,
    closeAddNewTaskDialog,
    showRecipePropertiesPanel,
    hideRecipePropertiesPanel,
    showDataPreviewPanel,
    hideDataPreviewPanel,
    setSelectedTask,
    setDataPreview,
    showFullscreenPipelineEditor,
    removeFullscreenPipelineEditor,
    setTaskBeingEdited,
} = uiStateSlice.actions;

export default uiStateSlice.reducer;
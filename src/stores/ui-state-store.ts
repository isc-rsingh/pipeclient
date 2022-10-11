import { createSlice } from "@reduxjs/toolkit";

export interface IUiState {
    showAddNewTaskDialog:boolean;
    showRecipePropertiesPanel:boolean;
    showDataPreviewPanel:boolean;
    fullscreenPipelineEditor:boolean;
    selectedTaskId:string | null;
    taskIdBeingEditted: string | null;
    previewData:any[];
}

const uiState:IUiState = {
    showAddNewTaskDialog: false,
    showRecipePropertiesPanel: false,
    showDataPreviewPanel: false,
    fullscreenPipelineEditor: false,
    selectedTaskId:null,
    taskIdBeingEditted:null,
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
      setSelectedTaskId: (state, action) => {
        state.value.selectedTaskId = action.payload;
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
      setTaskIdBeingEdited: (state, action) => {
        state.value.taskIdBeingEditted = action.payload
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
    setSelectedTaskId,
    setDataPreview,
    showFullscreenPipelineEditor,
    removeFullscreenPipelineEditor,
    setTaskIdBeingEdited,
} = uiStateSlice.actions;

export default uiStateSlice.reducer;
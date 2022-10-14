import { createSlice } from "@reduxjs/toolkit";

export interface IUiState {
    showAddNewTaskDialog:boolean;
    showRecipePropertiesPanel:boolean;
    showDataPreviewPanel:boolean;
    fullscreenPipelineEditor:boolean;
    selectedTaskId:string | null;
    taskIdBeingEditted: string | null;
    previewData:any[];
    runningTasks:string[];
}

const uiState:IUiState = {
    showAddNewTaskDialog: false,
    showRecipePropertiesPanel: false,
    showDataPreviewPanel: false,
    fullscreenPipelineEditor: false,
    selectedTaskId:null,
    taskIdBeingEditted:null,
    previewData:[],
    runningTasks:[],
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
      },
      setTaskRunning: (state, action) => {
        if (!state.value.runningTasks.includes(action.payload.taskid)) {
          state.value.runningTasks.push(action.payload.taskid);
        }
      },
      setTaskNotRunning: (state, action) => {
        const idx = state.value.runningTasks.indexOf(action.payload.taskid)
        if (idx>=0) {
          state.value.runningTasks.splice(idx,1);
        }
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
    setTaskRunning,
    setTaskNotRunning,
} = uiStateSlice.actions;

export default uiStateSlice.reducer;
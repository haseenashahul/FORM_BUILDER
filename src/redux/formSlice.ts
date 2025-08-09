import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { FieldConfig, FormSchema } from "../types/form";


interface FormState {
  currentForm: FieldConfig[];
  savedForms: FormSchema[];
}

const initialState: FormState = {
  currentForm: [],
  savedForms: [],
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    addField: (state, action: PayloadAction<FieldConfig>) => {
      state.currentForm.push(action.payload);
    },
    updateField: (state, action: PayloadAction<FieldConfig>) => {
      const index = state.currentForm.findIndex(f => f.id === action.payload.id);
      if (index !== -1) state.currentForm[index] = action.payload;
    },
    deleteField: (state, action: PayloadAction<string>) => {
      state.currentForm = state.currentForm.filter(f => f.id !== action.payload);
    },
    reorderFields: (state, action: PayloadAction<FieldConfig[]>) => {
      state.currentForm = action.payload;
    },
    saveForm: (state, action: PayloadAction<FormSchema>) => {
      state.savedForms.push(action.payload);
    },
    setSavedForms: (state, action: PayloadAction<FormSchema[]>) => {
      state.savedForms = action.payload;
    },
    resetCurrentForm: state => {
      state.currentForm = [];
    },
  },
});

export const {
  addField,
  updateField,
  deleteField,
  reorderFields,
  saveForm,
  setSavedForms,
  resetCurrentForm,
} = formSlice.actions;

export default formSlice.reducer;

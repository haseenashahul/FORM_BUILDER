import type { FormSchema } from "../types/form";


const STORAGE_KEY = "forms";

export const saveFormToStorage = (form: FormSchema) => {
  const forms = getFormsFromStorage();
  forms.push(form);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(forms));
};

export const getFormsFromStorage = (): FormSchema[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

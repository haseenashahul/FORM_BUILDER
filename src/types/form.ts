export type FieldType = "text"|"number"|"textarea"|"select"|"radio"|"checkbox"|"date";

export interface ValidationRule {
  value?: number | string | RegExp;
  errorMessage?: string;
}

export interface FieldValidations {
  notEmpty?: ValidationRule;      // Applies to all field types
  minLength?: ValidationRule;     // Text/Textarea
  maxLength?: ValidationRule;     // Text/Textarea
  email?: ValidationRule;         // Text/Textarea
  passwordRule?: ValidationRule;  // Text/Textarea (custom logic)
}

export interface FieldConfig {
  id: string;
  type: FieldType;
  label: string;
  required?: boolean; // You can keep this OR rely on validations.notEmpty
  defaultValue?: string;
  options?: string[];  // For select/radio/checkbox
  validations?: FieldValidations;
  isDerived?: boolean;
  parentIds?: string[];
  formula?: string;
}

export interface FormSchema {
  id: string;
  name: string;
  createdAt: string;
  fields: FieldConfig[];
}

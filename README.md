# React Form Builder

A dynamic React form builder application that allows users to create custom forms with various field types, save them locally, preview with validations, and manage forms.

## Features

- Add multiple field types: Text, Number, Textarea, Select, Radio, Checkbox, Date
- Set field properties: label, default value, required, validations (min/max length, email format, password rules)
- Create derived fields with formulas based on other fields
- Save forms to localStorage
- View all saved forms in a responsive card layout
- Preview forms with live validation and submit functionality
- User-friendly UI built with Material-UI (MUI)
- Form state management using Redux Toolkit
- Routing with React Router DOM

## Installation

1. Clone the repository:

git clone https://github.com/haseenashahul/FORM_BUILDER.git
cd FORM_BUILDER

## Install dependencies:

npm install

## Start the development server:

npm run dev

## Technologies Used

React 18+ , Redux Toolkit , React Router DOM , Material-UI (MUI) , TypeScript , Vite

## Project Structure

-src/components - Reusable React components like FieldList

-src/pages - Main pages like CreateForm, PreviewForm, MyForms

-src/redux - Redux slices and store configuration

-src/types - TypeScript types/interfaces

-src/utils - Utility functions for localStorage and validation

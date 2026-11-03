"use client";

import type { ComponentProps } from "react";
import {
  IonInput,
  IonInputPasswordToggle,
  IonSelect,
  IonSelectOption,
  IonTextarea,
} from "@ionic/react";

type Autocomplete = ComponentProps<typeof IonInput>["autocomplete"];

export function TextField({
  label,
  value,
  onChange,
  type = "text",
  inputMode,
  placeholder,
  error,
  autoComplete,
  maxLength,
  passwordToggle = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "password" | "tel" | "number";
  inputMode?: "text" | "email" | "tel" | "numeric" | "decimal";
  placeholder?: string;
  error?: string;
  autoComplete?: Autocomplete;
  maxLength?: number;
  passwordToggle?: boolean;
}) {
  return (
    <div className="field">
      <IonInput
        label={label}
        labelPlacement="stacked"
        fill="solid"
        mode="md"
        value={value}
        type={type}
        inputMode={inputMode}
        placeholder={placeholder}
        autocomplete={autoComplete}
        maxlength={maxLength}
        onIonInput={(event) => onChange(event.detail.value ?? "")}
      >
        {type === "password" && passwordToggle ? (
          <IonInputPasswordToggle slot="end" aria-label="Show password" />
        ) : null}
      </IonInput>
      {error ? <span className="field__error">{error}</span> : null}
    </div>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  error,
  placeholder,
  disabled,
  interfaceOption = "action-sheet",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  interfaceOption?: "action-sheet" | "popover" | "alert";
}) {
  return (
    <div className="field">
      <IonSelect
        label={label}
        labelPlacement="stacked"
        fill="solid"
        mode="md"
        value={value}
        placeholder={placeholder}
        interface={interfaceOption}
        disabled={disabled}
        cancelText="Cancel"
        okText="Select"
        onIonChange={(event) => onChange(String(event.detail.value ?? ""))}
      >
        {options.map((option) => (
          <IonSelectOption key={option.value} value={option.value}>
            {option.label}
          </IonSelectOption>
        ))}
      </IonSelect>
      {error ? <span className="field__error">{error}</span> : null}
    </div>
  );
}

export function UnitField({
  label,
  value,
  onChange,
  unit,
  error,
  inputMode = "decimal",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  unit: string;
  error?: string;
  inputMode?: "decimal" | "numeric";
}) {
  return (
    <div className="field field--unit">
      <IonInput
        label={label}
        labelPlacement="stacked"
        fill="solid"
        mode="md"
        value={value}
        inputMode={inputMode}
        onIonInput={(event) => onChange(event.detail.value ?? "")}
      />
      <span className="field__unit" aria-hidden="true">
        {unit}
      </span>
      {error ? <span className="field__error">{error}</span> : null}
    </div>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  error,
  rows = 4,
  maxLength = 600,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  rows?: number;
  maxLength?: number;
}) {
  return (
    <div className="field">
      <IonTextarea
        label={label}
        labelPlacement="stacked"
        fill="solid"
        mode="md"
        value={value}
        rows={rows}
        maxlength={maxLength}
        autoGrow
        onIonInput={(event) => onChange(event.detail.value ?? "")}
      />
      {error ? <span className="field__error">{error}</span> : null}
    </div>
  );
}

import validator from "validator";

export const required = (value: string) => (value ? undefined : "Wymagane!");

export const mustBeNumber = (value: number) =>
  isNaN(value) ? "Wpisz liczbę!" : undefined;

export const isMonth = (value: number) => {
  if (isNaN(value)) return "Wpisz liczbę!";
  if (value > 12) return "Zły miesiąc!";
  if (value < 1) return "Zły miesiąc!";
  return undefined;
};

export const isYear = (value: number) => {
  if (isNaN(value)) return "Wpisz liczbę!";
  if (value < 1920) return "Zły rok!";
  if (value > 2020) return "Zły rok!";
  return undefined;
};

export const isDay = (value: number) => {
  if (isNaN(value)) return "Wpisz liczbę!";
  if (value < 1) return "Zły dzień!";
  if (value > 31) return "Zły dzień!";
  return undefined;
};

export const passwordLength = (value: string) => {
  if (value.length < 6) return "Minimum 6 znaków!";
  if (value.length > 30) return "Max 30 znaków!";
  return undefined;
};

export const textMaxLength = (value: string) => {
  if (value.length > 30) return "Max 30 znaków!";
  return undefined;
};

export const checkEmail = (value: string) => {
  if (!validator.isEmail(value)) return "Zły format!";
  return undefined;
};

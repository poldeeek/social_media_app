import React from "react";
import styles from "./registerDesktopForm.module.scss";
import TextInput from "../../../components/publicPage/form/registerTextInput";
import { Form, Field } from "react-final-form";
import { ISignUp, signUp } from "../../../store/actions/authActions";

import * as validation from "../../../validations/registerValidation";
import { useDispatch } from "react-redux";

const RegisterDesktopForm: React.FC = () => {
  const dispatch = useDispatch();

  const onSubmit = async (values: ISignUp) => {
    dispatch(signUp(values));
  };

  const composeValidators = (...validators: Function[]) => (value: string) =>
    validators.reduce(
      (error, validator) => error || validator(value),
      undefined
    );

  return (
    <div className={styles.registerForm}>
      <h1>Dołącz do nas!</h1>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit, form, submitting, pristine, values }) => (
          <form onSubmit={handleSubmit}>
            <Field<string>
              type="text"
              name="name"
              component={TextInput}
              placeholder="Imię"
              validate={composeValidators(
                validation.required,
                validation.textMaxLength
              )}
            />
            <Field<string>
              type="text"
              name="surname"
              component={TextInput}
              placeholder="Nazwisko"
              validate={composeValidators(
                validation.required,
                validation.textMaxLength
              )}
            />
            <Field<string>
              type="email"
              name="email"
              component={TextInput}
              placeholder="E-mail"
              validate={composeValidators(
                validation.required,
                validation.checkEmail
              )}
            />
            <Field<string>
              type="password"
              name="password"
              component={TextInput}
              placeholder="Hasło"
              validate={composeValidators(
                validation.required,
                validation.passwordLength
              )}
            />
            <label>Data urodzenia</label>
            <div className={styles.birthInputs}>
              <Field<string>
                type="number"
                name="birthDay"
                component={TextInput}
                placeholder="Dzień"
                style={{ marginRight: "1rem" }}
                validate={composeValidators(
                  validation.required,
                  validation.isDay
                )}
              />
              <Field<string>
                type="number"
                name="birthMonth"
                component={TextInput}
                placeholder="Miesiąc"
                style={{ marginRight: "1rem" }}
                validate={composeValidators(
                  validation.required,
                  validation.isMonth
                )}
              />
              <Field<string>
                type="number"
                name="birthYear"
                component={TextInput}
                placeholder="Rok"
                validate={composeValidators(
                  validation.required,
                  validation.isYear
                )}
              />
            </div>
            <Field<string>
              type="text"
              name="city"
              component={TextInput}
              placeholder="Miasto"
              validate={composeValidators(
                validation.required,
                validation.textMaxLength
              )}
            />
            <button type="submit" disabled={submitting || pristine}>
              Załóż konto
            </button>
          </form>
        )}
      />
    </div>
  );
};

export default RegisterDesktopForm;

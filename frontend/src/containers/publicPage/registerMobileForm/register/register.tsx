import React from "react";
import { Field } from "react-final-form";
import Wizard, { WizardPage } from "./wizard";
import TextInput from "../../../../components/publicPage/form/registerTextInput";
import { ISignUp, signUp } from "../../../../store/actions/authActions";
import * as validation from "../../../../validations/registerValidation";

import styles from "./register.module.scss";
import { useDispatch } from "react-redux";

const Register: React.FC = () => {
  const dispatch = useDispatch();

  const onSubmit = (values: ISignUp) => {
    dispatch(signUp(values));
  };

  const composeValidators = (...validators: Function[]) => (value: string) =>
    validators.reduce(
      (error, validator) => error || validator(value),
      undefined
    );

  return (
    <Wizard onSubmit={onSubmit}>
      <WizardPage>
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
      </WizardPage>
      <WizardPage>
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
      </WizardPage>
      <WizardPage>
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
        <label>Data urodzenia:</label>
        <div className={styles.birthdayInputs}>
          <Field<string>
            type="number"
            name="birthDay"
            component={TextInput}
            placeholder="Dzień"
            validate={composeValidators(validation.required, validation.isDay)}
          />
          <Field<string>
            type="number"
            name="birthMonth"
            component={TextInput}
            placeholder="Miesiąc"
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
            validate={composeValidators(validation.required, validation.isYear)}
          />
        </div>
      </WizardPage>
    </Wizard>
  );
};

export default Register;

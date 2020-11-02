import React from "react";
import styles from "./loginForm.module.scss";
import LoginTextInput from "../../../components/publicPage/form/loginTextInput";
import { Form, Field } from "react-final-form";
import { signIn } from "../../../store/actions/authActions";
import { ILoginCreds } from "../../../store/actions/authActions";
import { useDispatch, useSelector } from "react-redux";
import { IRoot } from "../../../store/reducers/rootReducer";

const LoginForm: React.FC = () => {
  const authError = useSelector((state: IRoot) => state.auth.authError);
  const dispatch = useDispatch();

  const onSubmit = (values: ILoginCreds) => {
    dispatch(signIn(values));
  };

  return (
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit, form, submitting, pristine, values }) => (
        <form onSubmit={handleSubmit}>
          <div className={styles.loginForm}>
            <div className={styles.email}>
              <div className={styles.emailLabel}>E-mail:</div>
              <div style={{ flex: "3", width: "100%" }}>
                <Field<string>
                  type="email"
                  name="email"
                  component={LoginTextInput}
                />
              </div>
            </div>
            <div className={styles.password}>
              <div className={styles.passwordLabel}>Hasło:</div>
              <div style={{ flex: "3", width: "100%" }}>
                <Field<string>
                  type="password"
                  name="password"
                  component={LoginTextInput}
                />
              </div>
            </div>
            {authError && <div className={styles.errorInfo}>{authError}</div>}
            <div className={styles.submit}>
              <div className={styles.submitRemember}>Nie pamiętasz hasła ?</div>
              <button
                type="submit"
                disabled={submitting || pristine}
                className={styles.submitButton}
              >
                Zaloguj
              </button>
            </div>
          </div>
        </form>
      )}
    />
  );
};

export default LoginForm;

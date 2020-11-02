import React, { useState } from "react";
import { useSelector } from "react-redux";
import { IRoot } from "../../../store/reducers/rootReducer";
import styles from "./editProfile.module.scss";
import { Form, Field } from "react-final-form";
import * as validation from "../../../validations/registerValidation";
import TextInput from "../../../components/publicPage/form/registerTextInput";
import { api, authenticationHeader } from "../../../config/apiHost";
import ClipLoader from "react-spinners/ClipLoader";

const ChangePassword: React.FC = () => {
  const user = useSelector((state: IRoot) => state.auth.user);
  const [show, setShow] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [message, setMessage] = useState<null | string>(null);

  const composeValidators = (...validators: Function[]) => (value: string) =>
    validators.reduce(
      (error, validator) => error || validator(value),
      undefined
    );

  const onSubmit = async (values: any) => {
    if (loading) return;

    setLoading(true);
    if (values.password !== values.newPassword) {
      setLoading(false);
      setMessage(null);
      setError("Hasła różnią się.");
      return;
    }

    if (!user) {
      setLoading(false);
      return;
    }
    api
      .post(
        `http://localhost:5000/api/users/update/password/${user._id}`,
        {
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        },
        {
          headers: authenticationHeader(),
        }
      )
      .then((resp) => {
        setLoading(false);
        setMessage("Hasło zostało zmienione.");
        setError(null);
      })
      .catch((err) => {
        setLoading(false);
        if (err.response.data.error === "Wrong password.")
          setError("Złe hasło.");
        else setError("Problem połączenia z serwerem.");
        setMessage(null);
      });
  };

  return (
    <div className={styles.passwordChange}>
      <p onClick={() => setShow(!show)}>
        Zmiana hasła{" "}
        {show ? (
          <i className="fas fa-angle-up"></i>
        ) : (
          <i className="fas fa-angle-down"></i>
        )}
      </p>
      {show && (
        <>
          <Form
            onSubmit={onSubmit}
            render={({ handleSubmit, form, submitting, pristine, values }) => (
              <form onSubmit={handleSubmit}>
                <div className={styles.inputArea}>
                  <label>Stare hasło: </label>
                  <Field<string>
                    type="password"
                    name="oldPassword"
                    component={TextInput}
                    validate={composeValidators(
                      validation.required,
                      validation.passwordLength
                    )}
                  />
                </div>
                <div className={styles.inputArea}>
                  <label>Nowe hasło: </label>
                  <Field<string>
                    type="password"
                    name="password"
                    component={TextInput}
                    validate={composeValidators(
                      validation.required,
                      validation.passwordLength
                    )}
                  />
                </div>
                <div className={styles.inputArea}>
                  <label>Nowe hasło: </label>
                  <Field<string>
                    type="password"
                    name="newPassword"
                    component={TextInput}
                    validate={composeValidators(
                      validation.required,
                      validation.passwordLength
                    )}
                  />
                </div>
                <button type="submit" disabled={submitting || pristine}>
                  Zaktualizuj
                </button>
              </form>
            )}
          />
          <div>
            {loading && (
              <div className={styles.message}>
                <ClipLoader color={"#276a39"} />
              </div>
            )}
            {message && <div className={styles.message}>{message}</div>}
            {error && <div className={styles.error}>{error}</div>}
          </div>
        </>
      )}
    </div>
  );
};

export default ChangePassword;

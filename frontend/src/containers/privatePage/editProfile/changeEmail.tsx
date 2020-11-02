import React, { useState } from "react";
import { useSelector } from "react-redux";
import { IRoot } from "../../../store/reducers/rootReducer";
import styles from "./editProfile.module.scss";
import { Form, Field } from "react-final-form";
import * as validation from "../../../validations/registerValidation";
import TextInput from "../../../components/publicPage/form/registerTextInput";
import { api, authenticationHeader } from "../../../config/apiHost";
import ClipLoader from "react-spinners/ClipLoader";

const ChangeEmail: React.FC = () => {
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
    if (!user) {
      setLoading(false);
      return;
    }
    api
      .post(
        `http://localhost:5000/api/users/update/email/${user._id}`,
        {
          email: values.email,
          password: values.password,
        },
        {
          headers: authenticationHeader(),
        }
      )
      .then((resp) => {
        setError(null);
        setMessage("E-mail został zaktualizowany.");
        setLoading(false);
      })
      .catch((err) => {
        if (err.response.data.error === "Wrong password.")
          setError("Złe hasło.");
        else setError("Problem połączenia z serwerem.");
        setMessage(null);
        setLoading(false);
      });
  };

  return (
    <div className={styles.emailChange}>
      <p onClick={() => setShow(!show)}>
        Zmiana adresu e-mail{" "}
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
            initialValues={{
              email: user?.email,
            }}
            render={({ handleSubmit, form, submitting, pristine, values }) => (
              <form onSubmit={handleSubmit}>
                <div className={styles.inputArea}>
                  <label>E-mail: </label>
                  <Field<string>
                    type="email"
                    name="email"
                    component={TextInput}
                    validate={composeValidators(
                      validation.required,
                      validation.checkEmail
                    )}
                  />
                </div>
                <div className={styles.inputArea}>
                  <label>Hasło: </label>
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

export default ChangeEmail;

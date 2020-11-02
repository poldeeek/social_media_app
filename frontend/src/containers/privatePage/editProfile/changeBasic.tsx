import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IRoot } from "../../../store/reducers/rootReducer";
import styles from "./editProfile.module.scss";
import { Form, Field } from "react-final-form";
import * as validation from "../../../validations/registerValidation";
import TextInput from "../../../components/publicPage/form/registerTextInput";
import { api, authenticationHeader } from "../../../config/apiHost";
import { updateProfileBasic } from "../../../store/actions/authActions";
import ClipLoader from "react-spinners/ClipLoader";

const ChangeBasic: React.FC = () => {
  const user = useSelector((state: IRoot) => state.auth.user);
  const [show, setShow] = useState(false);

  const dispatch = useDispatch();

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
    user &&
      api
        .post(
          `http://localhost:5000/api/users/update/basic/${user._id}`,
          {
            name: values.name,
            surname: values.surname,
            city: values.city,
          },
          {
            headers: authenticationHeader(),
          }
        )
        .then((resp) => {
          setError(null);
          setMessage("Dane zostały zaktualizowane.");
          dispatch(
            updateProfileBasic(values.name, values.surname, values.city)
          );
          setLoading(false);
        })
        .catch((err) => {
          setError("Błąd połączenia z serwerm.");
          setMessage(null);
          setLoading(false);
        });
  };

  return (
    <div className={styles.basicChange}>
      <p onClick={() => setShow(!show)}>
        Zmiana informacji{" "}
        {show ? (
          <i className="fas fa-angle-up"></i>
        ) : (
          <i className="fas fa-angle-down"></i>
        )}
      </p>
      {user && show && (
        <>
          <Form
            onSubmit={onSubmit}
            initialValues={{
              name: user.name,
              surname: user.surname,
              city: user.city,
            }}
            render={({ handleSubmit, form, submitting, pristine, values }) => (
              <form onSubmit={handleSubmit}>
                <div className={styles.inputArea}>
                  <label>Imię: </label>
                  <div className={styles.fieldInput}>
                    <Field<string>
                      type="text"
                      name="name"
                      component={TextInput}
                      validate={composeValidators(
                        validation.required,
                        validation.textMaxLength
                      )}
                    />
                  </div>
                </div>
                <div className={styles.inputArea}>
                  <label>Nazwisko: </label>
                  <div className={styles.fieldInput}>
                    <Field<string>
                      type="text"
                      name="surname"
                      component={TextInput}
                      validate={composeValidators(
                        validation.required,
                        validation.textMaxLength
                      )}
                    />
                  </div>
                </div>
                <div className={styles.inputArea}>
                  <label>Miasto: </label>
                  <div className={styles.fieldInput}>
                    <Field<string>
                      type="text"
                      name="city"
                      component={TextInput}
                      validate={composeValidators(
                        validation.required,
                        validation.textMaxLength
                      )}
                    />
                  </div>
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

export default ChangeBasic;

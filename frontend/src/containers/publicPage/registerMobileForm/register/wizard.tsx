import React, { useState, ReactNode } from "react";
import { Form } from "react-final-form";
import styles from "./register.module.scss";
import { ISignUp } from "../../../../store/actions/authActions";

type Wizard = {
  onSubmit: (values: ISignUp) => void;
};

export const WizardPage: React.FC = (props) => (
  <div className={styles.wizard}>{props.children}</div>
);

// 3-steps form
const Wizard: React.FC<Wizard> = ({ onSubmit, children }) => {
  const [page, setPage] = useState(0);
  const [values, setValues] = useState<ISignUp | undefined>(undefined);
  const activePage = React.Children.toArray(children)[page];
  const isLastPage = page === React.Children.count(children) - 1;

  // next page
  const next = (values: ISignUp) => {
    setPage(Math.min(page + 1, React.Children.count(children)));
    setValues(values);
  };

  // previous page
  const previous = () => {
    setPage(Math.max(page - 1, 0));
  };

  const handleSubmit = (values: ISignUp) => {
    const isLastPage = page === React.Children.count(children) - 1;
    if (isLastPage) {
      return onSubmit(values);
    } else {
      next(values);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {({ handleSubmit, submitting, values }) => {
        return (
          <form className={styles.moblieForm} onSubmit={handleSubmit}>
            {activePage}
            <div
              className={styles.buttons}
              style={page === 0 ? { justifyContent: "flex-end" } : {}}
            >
              {page > 0 && (
                <button type="button" onClick={previous}>
                  Powrót
                </button>
              )}
              {!isLastPage && <button type="submit">Dalej</button>}
              {isLastPage && (
                <button type="submit" disabled={submitting}>
                  Zakończ
                </button>
              )}
            </div>
          </form>
        );
      }}
    </Form>
  );
};

export default Wizard;

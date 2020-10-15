import axios from "axios";
import * as actions from "../actions/actionTypes";
import { setAccessToken } from "../../accessToken";
import { useHistory } from "react-router";

// Check refresh token and get user
export const loadUser = () => (dispatch: Function, getState: Function) => {
  // User loading
  dispatch({ type: actions.USER_LOADING });

  axios
    .get("http://localhost:5000/api/auth/refresh", {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    .then((response) => {
      setAccessToken(response.data.accessToken);
      dispatch({
        type: actions.USER_LOADED,
        user: response.data.user,
      });
    })
    .catch((err) => {
      console.log("error", err);
      dispatch({
        type: actions.AUTH_ERROR,
      });
    });
};

export interface ILoginCreds {
  email: string;
  password: string;
}

// log in user
export const signIn = (creds: ILoginCreds) => (
  dispatch: Function,
  getState: Function
) => {
  const emailLowercase = creds.email.toLowerCase();

  axios
    .post(
      "http://localhost:5000/api/auth/login",
      {
        email: emailLowercase,
        password: creds.password,
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      console.log(response);
      setAccessToken(response.data.accessToken);
      dispatch({
        type: actions.SIGN_IN_SUCCESS,
        user: response.data.user,
      });
    })
    .catch((err) => {
      console.log("error", err.response);
      dispatch({
        type: actions.SIGN_IN_ERROR,
      });
    });
};

export interface ISignUp {
  name: string;
  surname: string;
  email: string;
  password: string;
  city: string;
  birthDay: number;
  birthMonth: number;
  birthYear: number;
}

export const signUp = (creds: ISignUp) => (
  dispatch: Function,
  getState: Function
) => {
  let birthDate;

  if (Math.floor(creds.birthMonth / 10) === 0) {
    birthDate =
      creds.birthDay +
      "/0" +
      creds.birthMonth
        .toString()
        .charAt(creds.birthMonth.toString().length - 1) +
      "/" +
      creds.birthYear;
  } else {
    birthDate = creds.birthDay + "/" + creds.birthMonth + "/" + creds.birthYear;
  }

  const cityCapitalized =
    creds.city.charAt(0).toUpperCase() + creds.city.slice(1);

  const nameCapitalized =
    creds.name.charAt(0).toUpperCase() + creds.name.slice(1);

  const surnameCapitalized =
    creds.surname.charAt(0).toUpperCase() + creds.surname.slice(1);

  const emailLowercase = creds.email.toLowerCase();

  axios
    .post(
      "http://localhost:5000/api/auth/register",
      {
        email: emailLowercase,
        password: creds.password,
        name: nameCapitalized,
        surname: surnameCapitalized,
        city: cityCapitalized,
        birth: birthDate,
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      console.log(response);
      setAccessToken(response.data.accessToken);
      dispatch({
        type: actions.SIGN_UP_SUCCESS,
        user: response.data.user,
      });
    })
    .catch((err) => {
      console.log("error", err.response);
      dispatch({
        type: actions.SIGN_UP_ERROR,
      });
    });
};

export const signOut = () => (dispatch: Function, getState: Function) => {
  axios
    .post(
      "http://localhost:5000/api/auth/logout",
      {},
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((resp) => {
      console.log(resp);
      setAccessToken("");
      dispatch({
        type: actions.SIGN_OUT_SUCCESS,
      });
      const history = useHistory();
      history.push("/");
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: actions.SIGN_OUT_ERROR,
      });
    });
};

import * as actions from "../actions/actionTypes";

export interface IAuth {
  user: {
    birth: string;
    city: string;
    email: string;
    _id: string;
    name: string;
    surname: string;
    avatar: string;
  } | null;
  authError: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUpError: string | null;
}

const initState = {
  user: null,
  authError: null,
  isLoading: true,
  isAuthenticated: false,
  signUpError: null
};

const authReducer = (state: IAuth = initState, action: any) => {
  switch (action.type) {
    case actions.USER_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case actions.USER_LOADED:
    case actions.SIGN_IN_SUCCESS:
    case actions.SIGN_UP_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.user,
      };
      case actions.SIGN_IN_ERROR:
        return {
          user: null,
          authError: action.error,
          signUpError: null,
          isLoading: false,
          isAuthenticated: false,
        }
    case actions.AUTH_ERROR:
    case actions.SIGN_OUT_SUCCESS:
      return {
        user: null,
        authError: null,
        isLoading: false,
        isAuthenticated: false,
        signUpError: null,
      };
    case actions.SIGN_UP_ERROR:
      return {
        user: null,
        authError: null,
        isLoading: false,
        isAuthenticated: false,
        signUpError: action.error,
      }
    case actions.SIGN_OUT_ERROR:
      return state;
    case actions.UPDATE_PROFILE_PHOTO:
      return {
        ...state,
        user: {
          ...state.user,
          avatar: action.photo,
        }
      }
    case actions.UPDATE_PROFILE_PHOTO:
      return {
        ...state,
        user: {
          ...state.user,
          name: action.name,
          surname: action.surname,
          city: action.city,
        }
      }
    default:
      return state;
  }
};

export default authReducer;

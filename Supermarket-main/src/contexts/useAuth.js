import { createContext, useContext, useReducer, useEffect } from "react";
import apiService from "../app/apiService";
import { jwtDecode } from "jwt-decode"; // <-- thêm dòng này

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  token: null,
  user: null, // <-- thêm user
};

const INITIALIZE = "INITIALIZE";
const LOGIN_SUCCESS = "LOGIN_SUCCESS";
const LOGOUT = "LOGOUT";
const UPDATE_PROFILE = "UPDATE_PROFILE";

const reducer = (state, action) => {
  switch (action.type) {
    case INITIALIZE: {
      const { isAuthenticated, token } = action.payload;
      const user = token ? jwtDecode(token) : null; // decode user từ token
      return {
        ...state,
        isAuthenticated,
        isInitialized: true,
        token,
        user,
      };
    }
    case LOGIN_SUCCESS: {
      const decodedUser = jwtDecode(action.payload.token);
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.token,
        user: decodedUser,
      };
    }
    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        user: null,
      };
    case UPDATE_PROFILE:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    default:
      return state;
  }
};

export const AuthContext = createContext({ ...initialState });

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        const token = window.localStorage.getItem("token");
        if (token) {
          dispatch({
            type: INITIALIZE,
            payload: { isAuthenticated: true, token },
          });
        } else {
          dispatch({
            type: INITIALIZE,
            payload: { isAuthenticated: false, token: null },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: INITIALIZE,
          payload: { isAuthenticated: false, token: null },
        });
      }
    };
    initialize();
  }, []);

  const login = async (username, password, callback) => {
    try {
      const res = await apiService.post("/auth/login", { username, password });

      localStorage.setItem("token", res.data.token);

      dispatch({ type: LOGIN_SUCCESS, payload: { token: res.data.token } });

      callback(); // gọi callback để chuyển trang
    } catch (error) {
      return error.response?.data || "Login failed";
    }
  };

  const signup = async (
    { username, password, email, phonenumber, address, role },
    callback
  ) => {
    try {
      const res = await apiService.post("/auth/register", {
        username,
        password,
        email,
        phonenumber,
        address,
        role,
      });

      localStorage.setItem("token", res.data.token);

      dispatch({ type: LOGIN_SUCCESS, payload: { token: res.data.token } });

      callback();
    } catch (error) {
      return error.response?.data || "Register failed";
    }
  };

  const updateProfile = async (updatedUser, callback) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("User is not authenticated");
      }

      const res = await apiService.put(
        `/todos/profile/customer/${updatedUser.id}`,
        updatedUser,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      dispatch({ type: UPDATE_PROFILE, payload: updatedUser });

      callback();
    } catch (error) {
      console.error("Failed to update profile:", error);
      return error.response?.data || "Update failed";
    }
  };

  const logout = (callback) => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("cart");
    dispatch({ type: LOGOUT });
    callback();
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

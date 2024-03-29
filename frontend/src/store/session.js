//This file will contain all the actions specific to the session 
//user's information and the session user's Redux reducer.
//Order: [[‘createdAt’, ‘DESC’]]
import { csrfFetch } from './csrf';

const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';
////////////   Actions   //////////////////////
const setUser = (user) => {
  return {
    type: SET_USER,
    payload: user,
  };
};

const removeUser = () => {
  return {
    type: REMOVE_USER,
  };
};

///////////    Thunks    ///////////////////////////
//Login
export const login = (user) => async (dispatch) => {
  const { credential, password } = user;
  const response = await csrfFetch('/api/session', {
    method: 'POST',
    body: JSON.stringify({
      credential,
      password,
    }),
  });
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};
//restoreUser
export const restoreUser = () => async dispatch => {
  const response = await csrfFetch('/api/session');
  const data = await response.json();
  //console.log('restoreUser', data);
  dispatch(setUser(data.user));
  return response;
};
//signup
export const signup = (user) => async dispatch => {
  const { username, firstName, lastName, email, password } = user;
  const response = await csrfFetch("/api/users", {
    method: "POST",
    body: JSON.stringify({
      username,
      firstName,
      lastName,
      email,
      password,
    }),
  });
  const data = await response.json();
  //console.log('signup', data)
  dispatch(setUser(data.user));
  return response;
};

//logout
export const logout = () => async (dispatch) => {
  const response = await csrfFetch('/api/session', {
    method: 'DELETE',
  });
  dispatch(removeUser());
  return response;
};

const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case SET_USER:
      newState = Object.assign({}, state);
      newState.user = action.payload;
      return newState;
    case REMOVE_USER:
      newState = Object.assign({}, state);
      newState.user = null;
      return newState;
    default:
      return state;
  }
};

export default sessionReducer;





//session Reducer
//it holds the current session user's information.
//slice of state should look like this 
// {
//   user: {
//     id,
//     email,
//     username,
//     firstName,
//     lastName,
//     createdAt,
//     updatedAt
//   }
// }

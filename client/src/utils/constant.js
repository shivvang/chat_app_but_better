export const HOST = import.meta.env.VITE_SERVER_URL;
export const AUTH_ROUTES = "/api/auth";
export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const GET_USER_DETAILS = `${AUTH_ROUTES}/userDetails`;
export const UPDATE_PASS = `${AUTH_ROUTES}/updatePass`;
export const ADD_PFP = `${AUTH_ROUTES}/add-pfp`;
export const REMOVE_PFP = `${AUTH_ROUTES}/remove-pfp`;
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`;

export const CONTACTS_ROUTES = "/api/contacts";
export const SEARCH_CONTACT = `${CONTACTS_ROUTES}/search`;

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

export const MESSAGE_ROUTES = "/api/messages";
export const GET_MESSAGE_ROUTE = `${MESSAGE_ROUTES}/get-messages`;
export const UPLOAD_FILE_ROUTE = `${MESSAGE_ROUTES}/upload-file`;

export const ROOM_ROUTES = "/api/rooms";
export const CREATE_ROOM = `${ROOM_ROUTES}/create-room`;

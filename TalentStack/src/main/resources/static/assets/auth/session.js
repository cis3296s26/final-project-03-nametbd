import { me } from "../services/authService.js";

//Get and load the user based on the session

let cachedUser = undefined;

export function getCachedUser() {
  return cachedUser;
}

export async function loadSessionUser() {
  try {
    const user = await me();
    cachedUser = user;
    return user;
  } catch (err) {
    cachedUser = null;
    return null;
  }
}

export function setCachedUser(userOrNull) {
  cachedUser = userOrNull;
}
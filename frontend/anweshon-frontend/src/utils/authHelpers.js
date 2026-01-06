// src/utils/authHelpers.js
export function getRoles() {
  const rolesJson = localStorage.getItem("roles");
  try {
    return rolesJson ? JSON.parse(rolesJson) : [];
  } catch {
    return [];
  }
}

export function isClubAdmin() {
  const roles = getRoles();
  return roles.includes("ClubAdmin");
}

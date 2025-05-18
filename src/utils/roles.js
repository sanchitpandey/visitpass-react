// src/utils/roles.js
export const ROLES = {
  ADMIN: "admin",
  SECURITY: "security",
  VISITOR: "visitor",
};

export const isAdmin = (user) => user?.role === ROLES.ADMIN;
export const isSecurity = (user) => user?.role === ROLES.SECURITY;
export const isVisitor = (user) => user?.role === ROLES.VISITOR;

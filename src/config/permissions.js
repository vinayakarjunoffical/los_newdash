// Define all available permissions in your app
export const PERMISSIONS = {
  dashboard: ["view"],
  users: ["view", "create", "edit", "delete", "assign_owner"],
  reports: ["view"],
  table_a: ["view", "create", "edit", "delete", "assign_owner"],
  table_b: ["view", "create", "edit", "delete"],
  table_c: ["view", "create", "edit", "delete"],
};


// You can also define role defaults if you want
export const ROLE_PERMISSIONS = {
  admin: Object.values(PERMISSIONS), // admin can access everything
  supervisor: [PERMISSIONS.DASHBOARD, PERMISSIONS.TABLE_A],
};


// // src/config/permissions.js
// export const PERMISSIONS = {
//   dashboard: ["view"],
//   reports: ["view", "export"],
//   table_a: ["view", "create", "edit", "delete", "assign_owner"],
//   table_b: ["view", "create", "edit", "delete", "assign_owner"],
//   table_c: ["view", "create", "edit", "delete", "assign_owner"],
// };

// Dependency rules: if you enable one, also enable others
export const PERMISSION_DEPENDENCIES = {
  create: ["edit", "delete", "assign_owner","view"], // enabling "create" enables all
  edit: ["view"], // edit requires view
  delete: ["view"], // delete requires view
  assign_owner: ["view"], // assign_owner requires view
};

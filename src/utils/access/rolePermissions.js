import { verify } from "jsonwebtoken";

export const rolePermissions = {
  admin: ["*"], 
  fi: ["/dashboard", "/dashboard/field_investigation", "/dashboard/audit"], 
  credit: ["/dashboard", "/dashboard/credit", "/dashboard/audit"], 
  verification: ["/dashboard", "/dashboard/applicationid", "/dashboard/audit"], 
  risk_ssessment: ["/dashboard", "/dashboard/riskassessment", "/dashboard/audit"], 
};

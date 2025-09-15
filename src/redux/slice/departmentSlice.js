import { createSlice } from "@reduxjs/toolkit"

const initialState = [
  {
    id: "dept-1",
    name: "Loan Processing",
    description: "Handles all loan applications and processing.",
  },
  {
    id: "dept-2",
    name: "Risk Management",
    description: "Evaluates financial risks and ensures compliance.",
  },
  {
    id: "dept-3",
    name: "Customer Service",
    description: "Assists customers with inquiries and support.",
  },
  {
    id: "dept-4",
    name: "Collections",
    description: "Manages overdue accounts and debt recovery.",
  },
  {
    id: "dept-5",
    name: "IT Support",
    description: "Maintains software systems and infrastructure.",
  },
]

const departmentSlice = createSlice({
  name: "departments",
  initialState,
  reducers: {
    addDepartment: (state, action) => {
      state.push(action.payload)
    },
    removeDepartment: (state, action) =>
      state.filter((dept) => dept.id !== action.payload),
    updateDepartment: (state, action) => {
      const index = state.findIndex((dept) => dept.id === action.payload.id)
      if (index !== -1) {
        state[index] = action.payload
      }
    },
  },
})

export const { addDepartment, removeDepartment, updateDepartment } = departmentSlice.actions
export default departmentSlice.reducer

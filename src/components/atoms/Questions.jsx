"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { PlusCircle, Send, Trash2, X, Pencil } from "lucide-react"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
} from "@/components/ui/command"
import { toast } from "sonner"
import { QdataTable } from "./tables/QdataTable"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

const USERS = ["FI", "PD"]
const PRODUCTS = ["Home Loan", "Bike Loan", "Car Loan", "Personal Loan"]

// -------------------- DataTable Columns --------------------
const getColumns = (onEdit, onDelete) => [
  {
    accessorKey: "text",
    header: "Question",
  },
  {
    accessorKey: "required",
    header: "Required",
    cell: ({ row }) => (row.getValue("required") ? "Yes" : "No"),
  },
  {
    accessorKey: "length",
    header: "Length",
  },
  {
    accessorKey: "assignedTo",
    header: "Assign To",
    cell: ({ row }) => row.getValue("assignedTo")?.join(", ") || "-",
  },
  {
    accessorKey: "products",
    header: "Products",
    cell: ({ row }) => row.getValue("products")?.join(", ") || "-",
  },
  {
    accessorKey: "documents",
    header: "Documents",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const rowIndex = row.index
      return (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onEdit(rowIndex)}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onDelete(rowIndex)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    },
  },
]

// -------------------- Questionnaire Component --------------------
const Questions = () => {
  const [questions, setQuestions] = useState([
    {
      text: "",
      required: false,
      assignedTo: [],
      products: [],
      length: "",
      documents: "",
    },
  ])

  const [savedQuestions, setSavedQuestions] = useState([])

  // edit dialog state
  const [editingIndex, setEditingIndex] = useState(null)
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [isEditOpen, setIsEditOpen] = useState(false)

  // -------------------- Form Handlers --------------------
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        required: false,
        assignedTo: [],
        products: [],
        length: "",
        documents: "",
      },
    ])
  }

  const updateQuestion = (index, field, value) => {
    const updated = [...questions]
    updated[index][field] = value
    setQuestions(updated)
  }

  const toggleRequired = (index) => {
    const updated = [...questions]
    updated[index].required = !updated[index].required
    setQuestions(updated)
  }

  const addPreference = (index, value) => {
    const updated = [...questions]
    if (!updated[index].assignedTo.includes(value)) {
      updated[index].assignedTo.push(value)
    }
    setQuestions(updated)
  }

  const removePreference = (index, value) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === index
          ? { ...q, assignedTo: q.assignedTo.filter((v) => v !== value) }
          : q
      )
    )
  }

  const addProduct = (index, value) => {
    const updated = [...questions]
    if (!updated[index].products.includes(value)) {
      updated[index].products.push(value)
    }
    setQuestions(updated)
  }

  const removeProduct = (index, value) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === index
          ? { ...q, products: q.products.filter((v) => v !== value) }
          : q
      )
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSavedQuestions([...savedQuestions, ...questions])
    setQuestions([
      {
        text: "",
        required: false,
        assignedTo: [],
        products: [],
        length: "",
        documents: "",
      },
    ])
    toast.success("Questionnaire submitted successfully!")
  }

  // -------------------- Table Handlers --------------------
  const handleDelete = (index) => {
    setSavedQuestions((prev) => prev.filter((_, i) => i !== index))
    toast.success("Question deleted")
  }

  const handleEdit = (index) => {
    setEditingIndex(index)
    setEditingQuestion({ ...savedQuestions[index] })
    setIsEditOpen(true)
  }

  const handleSaveEdit = () => {
    const updated = [...savedQuestions]
    updated[editingIndex] = editingQuestion
    setSavedQuestions(updated)
    setIsEditOpen(false)
    setEditingIndex(null)
    setEditingQuestion(null)
    toast.success("Question updated successfully!")
  }

  // -------------------- UI --------------------
  return (
    <div className="max-w-full mx-auto p-6 space-y-10">
      {/* Form Section */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <AnimatePresence>
          {questions.map((q, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-4 shadow-md rounded-2xl border">
                <CardHeader className="flex justify-between items-center">
                  <CardTitle className="text-lg">
                    Question {index + 1}
                  </CardTitle>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setQuestions(questions.filter((_, i) => i !== index))
                    }
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </Button>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* First Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
                    <div className="col-span-2">
                      <Label className="font-medium pb-3">Question</Label>
                      <Input
                        placeholder="Enter your question..."
                        value={q.text}
                        onChange={(e) =>
                          updateQuestion(index, "text", e.target.value)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-center gap-2 pt-6">
                      <Checkbox
                        checked={q.required}
                        onCheckedChange={() => toggleRequired(index)}
                      />
                      <Label>Required</Label>
                    </div>

                    <div>
                      <Label className="font-medium pb-3">Answer Length</Label>
                      <Input
                        type="number"
                        placeholder="Max length"
                        value={q.length}
                        onChange={(e) =>
                          updateQuestion(index, "length", e.target.value)
                        }
                        className="no-spinner"
                      />
                    </div>
                  </div>

                  {/* Second Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Assign To */}
                    <div>
                      <Label className="font-medium pb-2">Assign To</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <div className="w-full border rounded-md px-2 py-1.5 flex items-center flex-wrap gap-2 cursor-pointer">
                            {q.assignedTo.length > 0 ? (
                              q.assignedTo.map((role) => (
                                <span
                                  key={role}
                                  className="flex items-center gap-1 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full text-sm"
                                >
                                  {role}
                                  <X
                                    className="w-3 h-3 cursor-pointer hover:text-red-500"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      removePreference(index, role)
                                    }}
                                  />
                                </span>
                              ))
                            ) : (
                              <span className="text-muted-foreground">
                                + Assign people/roles
                              </span>
                            )}
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="lg:w-xl w-64 md:w-96 p-2">
                          <Command>
                            <CommandInput placeholder="Search people..." />
                            <CommandList>
                              <CommandEmpty>No results found.</CommandEmpty>
                              {USERS.filter(
                                (u) => !q.assignedTo.includes(u)
                              ).map((user) => (
                                <CommandItem
                                  key={user}
                                  onSelect={() => addPreference(index, user)}
                                >
                                  {user}
                                </CommandItem>
                              ))}
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Products */}
                    <div>
                      <Label className="font-medium pb-2">Products</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <div className="w-full border rounded-md px-2 py-1.5 flex items-center flex-wrap gap-2 cursor-pointer">
                            {q.products.length > 0 ? (
                              q.products.map((p) => (
                                <span
                                  key={p}
                                  className="flex items-center gap-1 bg-blue-200 dark:bg-blue-700 px-2 py-0.5 rounded-full text-sm"
                                >
                                  {p}
                                  <X
                                    className="w-3 h-3 cursor-pointer hover:text-red-500"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      removeProduct(index, p)
                                    }}
                                  />
                                </span>
                              ))
                            ) : (
                              <span className="text-muted-foreground">
                                + Select products
                              </span>
                            )}
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="lg:w-xl w-64 md:w-96 p-2">
                          <Command>
                            <CommandInput placeholder="Search products..." />
                            <CommandList>
                              <CommandEmpty>No results found.</CommandEmpty>
                              {PRODUCTS.filter(
                                (prod) => !q.products.includes(prod)
                              ).map((prod) => (
                                <CommandItem
                                  key={prod}
                                  onSelect={() => addProduct(index, prod)}
                                >
                                  {prod}
                                </CommandItem>
                              ))}
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Documents */}
                    <div>
                      <Label className="font-medium pb-2">
                        Supported Document
                      </Label>
                      <Input
                        placeholder="Enter document name..."
                        value={q.documents}
                        onChange={(e) =>
                          updateQuestion(index, "documents", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        <div className="grid lg:grid-cols-4 grid-cols-1 gap-4 lg:gap-1">
          <Button
            type="button"
            onClick={addQuestion}
            variant="outline"
            className="lg:w-[250px] w-full flex items-center gap-2 rounded-2xl"
          >
            <PlusCircle className="w-5 h-5" />
            Add Question
          </Button>

          <Button
            type="submit"
            className="lg:w-[250px] flex items-center gap-2 text-lg rounded-2xl"
          >
            <Send className="w-5 h-5" />
            Submit Questionnaire
          </Button>
        </div>
      </form>

      {/* Data Table Section */}
      {savedQuestions.length > 0 && (
        <Card className="shadow-lg border rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">Saved Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <QdataTable
              columns={getColumns(handleEdit, handleDelete)}
              data={savedQuestions}
            />
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Question</DialogTitle>
          </DialogHeader>

          {editingQuestion && (
            <div className="space-y-6">
              <div>
                <Label>Question</Label>
                <Input
                  value={editingQuestion.text}
                  onChange={(e) =>
                    setEditingQuestion({
                      ...editingQuestion,
                      text: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  checked={editingQuestion.required}
                  onCheckedChange={(val) =>
                    setEditingQuestion({
                      ...editingQuestion,
                      required: val,
                    })
                  }
                />
                <Label>Required</Label>
              </div>

              <div>
                <Label>Answer Length</Label>
                <Input
                  type="number"
                  value={editingQuestion.length}
                  onChange={(e) =>
                    setEditingQuestion({
                      ...editingQuestion,
                      length: e.target.value,
                    })
                  }
                />
              </div>

              {/* Assign To in Edit */}
              <div>
                <Label className="font-medium pb-2">Assign To</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="w-full border rounded-md px-2 py-1.5 flex items-center flex-wrap gap-2 cursor-pointer">
                      {editingQuestion.assignedTo?.length > 0 ? (
                        editingQuestion.assignedTo.map((role) => (
                          <span
                            key={role}
                            className="flex items-center gap-1 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full text-sm"
                          >
                            {role}
                            <X
                              className="w-3 h-3 cursor-pointer hover:text-red-500"
                              onClick={(e) => {
                                e.stopPropagation()
                                setEditingQuestion({
                                  ...editingQuestion,
                                  assignedTo: editingQuestion.assignedTo.filter(
                                    (r) => r !== role
                                  ),
                                })
                              }}
                            />
                          </span>
                        ))
                      ) : (
                        <span className="text-muted-foreground">
                          + Assign people/roles
                        </span>
                      )}
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="lg:w-xl w-64 md:w-96 p-2">
                    <Command>
                      <CommandInput placeholder="Search people..." />
                      <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        {USERS.filter(
                          (u) => !editingQuestion.assignedTo.includes(u)
                        ).map((user) => (
                          <CommandItem
                            key={user}
                            onSelect={() =>
                              setEditingQuestion({
                                ...editingQuestion,
                                assignedTo: [
                                  ...editingQuestion.assignedTo,
                                  user,
                                ],
                              })
                            }
                          >
                            {user}
                          </CommandItem>
                        ))}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Products in Edit */}
              <div>
                <Label className="font-medium pb-2">Products</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="w-full border rounded-md px-2 py-1.5 flex items-center flex-wrap gap-2 cursor-pointer">
                      {editingQuestion.products?.length > 0 ? (
                        editingQuestion.products.map((p) => (
                          <span
                            key={p}
                            className="flex items-center gap-1 bg-blue-200 dark:bg-blue-700 px-2 py-0.5 rounded-full text-sm"
                          >
                            {p}
                            <X
                              className="w-3 h-3 cursor-pointer hover:text-red-500"
                              onClick={(e) => {
                                e.stopPropagation()
                                setEditingQuestion({
                                  ...editingQuestion,
                                  products: editingQuestion.products.filter(
                                    (r) => r !== p
                                  ),
                                })
                              }}
                            />
                          </span>
                        ))
                      ) : (
                        <span className="text-muted-foreground">
                          + Select products
                        </span>
                      )}
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="lg:w-xl w-64 md:w-96 p-2">
                    <Command>
                      <CommandInput placeholder="Search products..." />
                      <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        {PRODUCTS.filter(
                          (prod) => !editingQuestion.products.includes(prod)
                        ).map((prod) => (
                          <CommandItem
                            key={prod}
                            onSelect={() =>
                              setEditingQuestion({
                                ...editingQuestion,
                                products: [...editingQuestion.products, prod],
                              })
                            }
                          >
                            {prod}
                          </CommandItem>
                        ))}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>Supported Document</Label>
                <Input
                  value={editingQuestion.documents}
                  onChange={(e) =>
                    setEditingQuestion({
                      ...editingQuestion,
                      documents: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Questions



//************************************05-09-25 11:18****************************************** */

// "use client";

// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
// import { PlusCircle, Send, Trash2, X } from "lucide-react";
// import {
//   Popover,
//   PopoverTrigger,
//   PopoverContent,
// } from "@/components/ui/popover";
// import {
//   Command,
//   CommandInput,
//   CommandList,
//   CommandEmpty,
//   CommandItem,
// } from "@/components/ui/command";
// import { toast } from "sonner";

// const USERS = ["FI", "PD"];
// const PRODUCTS = ["Home Loan", "Bike Loan", "Car Loan", "Personal Loan"];

// const Questions = () => {
//   const [questions, setQuestions] = useState([
//     { text: "", required: false, assignedTo: [], products: [], length: "", documents: "" },
//   ]);

//   const addQuestion = () => {
//     setQuestions([
//       ...questions,
//       { text: "", required: false, assignedTo: [], products: [], length: "", documents: "" },
//     ]);
//   };

//   const updateQuestion = (index, field, value) => {
//     const updated = [...questions];
//     updated[index][field] = value;
//     setQuestions(updated);
//   };

//   const toggleRequired = (index) => {
//     const updated = [...questions];
//     updated[index].required = !updated[index].required;
//     setQuestions(updated);
//   };

//   // ===== ASSIGN TO HANDLERS =====
//   const addPreference = (index, value) => {
//     const updated = [...questions];
//     if (!updated[index].assignedTo.includes(value)) {
//       updated[index].assignedTo.push(value);
//     }
//     setQuestions(updated);
//   };

//   const removePreference = (index, value) => {
//     setQuestions((prev) =>
//       prev.map((q, i) =>
//         i === index
//           ? { ...q, assignedTo: q.assignedTo.filter((v) => v !== value) }
//           : q
//       )
//     );
//   };

//   // ===== PRODUCT HANDLERS =====
//   const addProduct = (index, value) => {
//     const updated = [...questions];
//     if (!updated[index].products.includes(value)) {
//       updated[index].products.push(value);
//     }
//     setQuestions(updated);
//   };

//   const removeProduct = (index, value) => {
//     setQuestions((prev) =>
//       prev.map((q, i) =>
//         i === index
//           ? { ...q, products: q.products.filter((v) => v !== value) }
//           : q
//       )
//     );
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Submitted Questions:", questions);
//     toast.success("Questionnaire submitted successfully!");
//   };

//   return (
//     <form onSubmit={handleSubmit} className="max-w-full mx-auto p-6 space-y-6">
//       <AnimatePresence>
//         {questions.map((q, index) => (
//           <motion.div
//             key={index}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             transition={{ duration: 0.3 }}
//           >
//             <Card className="p-4 shadow-md rounded-2xl border">
//               <CardHeader className="flex justify-between items-center">
//                 <CardTitle className="text-lg">Question {index + 1}</CardTitle>
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="icon"
//                   onClick={() =>
//                     setQuestions(questions.filter((_, i) => i !== index))
//                   }
//                 >
//                   <Trash2 className="w-5 h-5 text-red-500" />
//                 </Button>
//               </CardHeader>

//               <CardContent className="space-y-6">
//                 {/* First Row: 4 Inputs */}
//                 <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
//                   {/* Question */}
//                   <div className="col-span-2">
//                     <Label className="font-medium pb-3">Question</Label>
//                     <Input
//                       placeholder="Enter your question..."
//                       value={q.text}
//                       onChange={(e) => updateQuestion(index, "text", e.target.value)}
//                     />
//                   </div>

//                   {/* Required */}
//                   <div className="flex items-center justify-center gap-2 pt-6">
//                     <Checkbox
//                       checked={q.required}
//                       onCheckedChange={() => toggleRequired(index)}
//                     />
//                     <Label>Required</Label>
//                   </div>

//                   {/* Length Input */}
//                   <div>
//                     <Label className="font-medium pb-3">Answer Length</Label>
//                     <Input
//                       type="number"
//                       placeholder="Max length"
//                       value={q.length}
//                       onChange={(e) => updateQuestion(index, "length", e.target.value)}
//                       className="no-spinner"
//                     />
//                   </div>
//                 </div>

//                 {/* Second Row: Assign To, Products, Documents */}
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                   {/* Assign To */}
//                   <div>
//                     <Label className="font-medium pb-2">Assign To</Label>
//                     <Popover>
//                       <PopoverTrigger asChild>
//                         <div className="w-full border rounded-md px-2 py-1.5 flex items-center flex-wrap gap-2 cursor-pointer">
//                           {q.assignedTo.length > 0 ? (
//                             q.assignedTo.map((role) => (
//                               <span
//                                 key={role}
//                                 className="flex items-center gap-1 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full text-sm"
//                               >
//                                 {role}
//                                 <X
//                                   className="w-3 h-3 cursor-pointer hover:text-red-500"
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     removePreference(index, role);
//                                   }}
//                                 />
//                               </span>
//                             ))
//                           ) : (
//                             <span className="text-muted-foreground">
//                               + Assign people/roles
//                             </span>
//                           )}
//                         </div>
//                       </PopoverTrigger>
//                       <PopoverContent className="lg:w-xl w-64 md:w-96 p-2">
//                         <Command>
//                           <CommandInput placeholder="Search people..." />
//                           <CommandList>
//                             <CommandEmpty>No results found.</CommandEmpty>
//                             {USERS.filter((u) => !q.assignedTo.includes(u)).map(
//                               (user) => (
//                                 <CommandItem
//                                   key={user}
//                                   onSelect={() => addPreference(index, user)}
//                                 >
//                                   {user}
//                                 </CommandItem>
//                               )
//                             )}
//                           </CommandList>
//                         </Command>
//                       </PopoverContent>
//                     </Popover>
//                   </div>

//                   {/* Products */}
//                   <div>
//                     <Label className="font-medium pb-2">Products</Label>
//                     <Popover>
//                       <PopoverTrigger asChild>
//                         <div className="w-full border rounded-md px-2 py-1.5 flex items-center flex-wrap gap-2 cursor-pointer">
//                           {q.products.length > 0 ? (
//                             q.products.map((p) => (
//                               <span
//                                 key={p}
//                                 className="flex items-center gap-1 bg-blue-200 dark:bg-blue-700 px-2 py-0.5 rounded-full text-sm"
//                               >
//                                 {p}
//                                 <X
//                                   className="w-3 h-3 cursor-pointer hover:text-red-500"
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     removeProduct(index, p);
//                                   }}
//                                 />
//                               </span>
//                             ))
//                           ) : (
//                             <span className="text-muted-foreground">
//                               + Select products
//                             </span>
//                           )}
//                         </div>
//                       </PopoverTrigger>
//                       <PopoverContent className="lg:w-xl w-64 md:w-96 p-2">
//                         <Command>
//                           <CommandInput placeholder="Search products..." />
//                           <CommandList>
//                             <CommandEmpty>No results found.</CommandEmpty>
//                             {PRODUCTS.filter(
//                               (prod) => !q.products.includes(prod)
//                             ).map((prod) => (
//                               <CommandItem
//                                 key={prod}
//                                 onSelect={() => addProduct(index, prod)}
//                               >
//                                 {prod}
//                               </CommandItem>
//                             ))}
//                           </CommandList>
//                         </Command>
//                       </PopoverContent>
//                     </Popover>
//                   </div>

//                   {/* Supported Documents */}
//                   <div>
//                     <Label className="font-medium pb-2">Supported Document</Label>
//                     <Input
//                       placeholder="Enter document name..."
//                       value={q.documents}
//                       onChange={(e) => updateQuestion(index, "documents", e.target.value)}
//                     />
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>
//         ))}
//       </AnimatePresence>

//       <div className="grid lg:grid-cols-4 grid-cols-1 gap-4 lg:gap-1">
//         <Button
//           type="button"
//           onClick={addQuestion}
//           variant="outline"
//           className="lg:w-[250px] w-full flex items-center gap-2 rounded-2xl"
//         >
//           <PlusCircle className="w-5 h-5" />
//           Add Question
//         </Button>

//         <Button
//           type="submit"
//           className="lg:w-[250px] flex items-center gap-2 text-lg rounded-2xl"
//         >
//           <Send className="w-5 h-5" />
//           Submit Questionnaire
//         </Button>
//       </div>
//     </form>
//   );
// };

// export default Questions;

"use client"

import React, { useState } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, ArrowRight, Plus, Search, Pencil } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"

import { useDispatch, useSelector } from "react-redux"
import {
  addDepartment,
  updateDepartment,
} from "@/redux/slice/departmentSlice"

export default function DepartmentPage() {
  const departments = useSelector((state) => state.departments)
  const dispatch = useDispatch()

  const [globalFilter, setGlobalFilter] = useState("")
  const [count, setCount] = useState(departments.length + 1)
  const [newDept, setNewDept] = useState({ name: "", description: "" })
  const [open, setOpen] = useState(false)

  const [editOpen, setEditOpen] = useState(false)
  const [selectedDept, setSelectedDept] = useState({ id: "", name: "", description: "" })

  const handleAdd = () => {
    const newEntry = {
      id: `dept-${count}`,
      name: newDept.name,
      description: newDept.description,
    }
    dispatch(addDepartment(newEntry))
    setCount(count + 1)
    setNewDept({ name: "", description: "" })
    setOpen(false)
  }

  const handleEditSave = () => {
    dispatch(updateDepartment(selectedDept))
    setEditOpen(false)
  }

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <div className="text-muted-foreground">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "name",
      header: "Department Name",
      cell: ({ row }) => <div className="font-semibold text-primary">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => <div className="text-sm">{row.getValue("description")}</div>,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setSelectedDept(row.original)
            setEditOpen(true)
          }}
        >
          <Pencil className="w-4 h-4 mr-1" />
          Edit
        </Button>
      ),
    },
  ]

  const table = useReactTable({
    data: departments,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="p-6 space-y-6 w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight"> Departments</h2>   
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search departments..."
              className="pl-10 w-64"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </div>

          {/* Add Department Dialog 📚 */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Department
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Department</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <Input
                  placeholder="Department Name"
                  value={newDept.name}
                  onChange={(e) =>
                    setNewDept({ ...newDept, name: e.target.value })
                  }
                />
                <Input
                  placeholder="Description"
                  value={newDept.description}
                  onChange={(e) =>
                    setNewDept({ ...newDept, description: e.target.value })
                  }
                />
              </div>

              <DialogFooter>
                <Button onClick={handleAdd}>Submit</Button>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8">
                  No departments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-4">
        <p className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </p>
        <div className="space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Input
              placeholder="Department Name"
              value={selectedDept.name}
              onChange={(e) =>
                setSelectedDept({ ...selectedDept, name: e.target.value })
              }
            />
            <Input
              placeholder="Description"
              value={selectedDept.description}
              onChange={(e) =>
                setSelectedDept({ ...selectedDept, description: e.target.value })
              }
            />
          </div>

          <DialogFooter>
            <Button onClick={handleEditSave}>Update</Button>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

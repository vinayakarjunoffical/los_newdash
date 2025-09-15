"use client"

import React, { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { addRole, updateRole } from "@/redux/slice/roleSlice"
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table"
import { useRouter } from "next/navigation"
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
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"

export default function RoleCode() {
  const data = useSelector((state) => state.roles)
  const dispatch = useDispatch()

  const [globalFilter, setGlobalFilter] = useState("")
  const [count, setCount] = useState(data.length + 1)
  const [newRole, setNewRole] = useState({ name: "", role: "", description: "" })
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [currentEditIndex, setCurrentEditIndex] = useState(null)
  const [editRole, setEditRole] = useState({ id: "", name: "", role: "", description: "" })

  const handleAdd = () => {
    const newEntry = {
      id: `role-${count}`,
      name: newRole.name,
      role: newRole.role,
      description: newRole.description,
    }
    dispatch(addRole(newEntry))
    setCount(count + 1)
    setNewRole({ name: "", role: "", description: "" })
  }

  const openEditDialog = (index) => {
    const roleToEdit = data[index]
    setEditRole({ ...roleToEdit })
    setCurrentEditIndex(index)
    setEditDialogOpen(true)
  }

  const handleUpdate = () => {
    if (currentEditIndex !== null) {
      dispatch(updateRole(editRole))
    }
    setEditDialogOpen(false)
  }

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <div className="text-muted-foreground">{row.getValue("id")}</div>
      ),
    },
    {
  accessorKey: "role",
  header: "Role",
  cell: ({ row }) => {
    const router = useRouter()
    const roleValue = row.getValue("role")
    const roleId = row.getValue("id")

    return (
      <button
        onClick={() => router.push(`/dashboard/department&role/roles/${roleId}`)}
        className="uppercase cursor-pointer font-semibold text-blue-600 hover:underline"
      >
        {roleValue}
      </button>
    )
  },
},
,
    {
      accessorKey: "description",
      header: "Role Description",
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue("description")}</div>
      ),
    },
    {
      header: "Action",
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => openEditDialog(row.index)}
        >
          <Pencil className="w-4 h-4 mr-1" />
          Edit
        </Button>
      ),
    },
  ]

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="p-6 space-y-6 w-full">
      {/* Header 🧑‍💼 */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight"> Roles</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search roles..."
              className="pl-10 w-64"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Role
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Role</DialogTitle>
              </DialogHeader>

              <div className="p-4 space-y-4">
                <Input
                  placeholder="Name"
                  value={newRole.name}
                  onChange={(e) =>
                    setNewRole({ ...newRole, name: e.target.value })
                  }
                />
                <Input
                  placeholder="Role (e.g. admin)"
                  value={newRole.role}
                  onChange={(e) =>
                    setNewRole({ ...newRole, role: e.target.value })
                  }
                />
                <Input
                  placeholder="Role Description"
                  value={newRole.description}
                  onChange={(e) =>
                    setNewRole({ ...newRole, description: e.target.value })
                  }
                />
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button onClick={handleAdd}>Submit</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
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
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
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
                  No roles found.
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
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
          </DialogHeader>
          <div className="p-4 space-y-4">
            <Input
              placeholder="Name"
              value={editRole.name}
              onChange={(e) => setEditRole({ ...editRole, name: e.target.value })}
            />
            <Input
              placeholder="Role"
              value={editRole.role}
              onChange={(e) => setEditRole({ ...editRole, role: e.target.value })}
            />
            <Input
              placeholder="Description"
              value={editRole.description}
              onChange={(e) =>
                setEditRole({ ...editRole, description: e.target.value })
              }
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button onClick={handleUpdate}>Update</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

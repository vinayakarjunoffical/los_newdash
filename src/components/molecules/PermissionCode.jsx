
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { toast } from "sonner";
import allUsers from "@/data/users.json";
import { PERMISSIONS } from "@/config/permissions";

import {
  Eye,
  Pencil,
  Plus,
  Trash2,
  UserPlus,
  FileText,
  LayoutDashboard,
  Table2,
  Save,
   RotateCcw,
} from "lucide-react";

export default function UserPermissionPage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [originalUser, setOriginalUser] = useState(null);

  useEffect(() => {
    if (!id) return;
    const foundUser = allUsers.find((u) => String(u.id) === String(id)) || null;
    setUser(foundUser);
    setOriginalUser(foundUser ? { ...foundUser } : null); // save original state for reset
  }, [id]);

  const togglePermission = (permKey) => {
    if (!permKey || typeof permKey !== "string") return;

    const [module, action] = permKey.split(":");

    setUser((prev) => {
      if (!prev) return prev;
      let updatedPermissions = [...prev.permissions];

      const addPerm = (key) => {
        if (!updatedPermissions.includes(key)) updatedPermissions.push(key);
      };
      const removePerm = (key) => {
        updatedPermissions = updatedPermissions.filter((p) => p !== key);
      };

      const isOn = updatedPermissions.includes(permKey);

      if (isOn) {
        removePerm(permKey);

        if (action === "create") {
          ["edit", "delete", "assign_owner"].forEach((child) =>
            removePerm(`${module}:${child}`)
          );
          const stillHasOther = updatedPermissions.some(
            (p) => p.startsWith(`${module}:`) && p !== `${module}:view`
          );
          if (!stillHasOther) removePerm(`${module}:view`);
        }

        if (["edit", "delete", "assign_owner"].includes(action)) {
          const dependentsStillOn = ["edit", "delete", "assign_owner"].some((child) =>
            updatedPermissions.includes(`${module}:${child}`)
          );
          if (!dependentsStillOn) removePerm(`${module}:view`);
        }
      } else {
        addPerm(permKey);

        if (action === "create") {
          addPerm(`${module}:view`);
          ["edit", "delete", "assign_owner"].forEach((child) =>
            addPerm(`${module}:${child}`)
          );
        }

        if (["edit", "delete", "assign_owner"].includes(action)) {
          addPerm(`${module}:view`);
        }
      }

      return { ...prev, permissions: updatedPermissions };
    });
  };

   const savePermissions = () => {
    console.log("Saving updated permissions:", user);
    toast.success("Permissions saved");
  };

  // Reset permissions to original
  const resetPermissions = () => {
    if (originalUser) {
      setUser({ ...originalUser });
      toast.success("Permissions reset to original!");
    }
  };

  // Lucide icons for actions
  const actionIcons = {
    view: <Eye className="h-4 w-4 text-blue-500" />,
    create: <Plus className="h-4 w-4 text-green-500" />,
    edit: <Pencil className="h-4 w-4 text-yellow-500" />,
    delete: <Trash2 className="h-4 w-4 text-red-500" />,
    assign_owner: <UserPlus className="h-4 w-4 text-purple-500" />,
  };

  // Lucide icons for modules
  const moduleIcons = {
    dashboard: <LayoutDashboard className="h-5 w-5 text-primary" />,
    reports: <FileText className="h-5 w-5 text-primary" />,
    table_a: <Table2 className="h-5 w-5 text-primary" />,
    table_b: <Table2 className="h-5 w-5 text-primary" />,
    table_c: <Table2 className="h-5 w-5 text-primary" />,
  };

  function renderModule(module) {
    return (
      <Card key={module} className="border shadow-sm rounded-2xl mb-6">
        <CardHeader>
          <CardTitle className="capitalize flex items-center gap-2">
            {moduleIcons[module] || null}
            {module.replace("_", " ")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: `repeat(auto-fit, minmax(120px, 1fr))` }}
          >
            {PERMISSIONS[module]?.map((action) => {
              const permKey = `${module}:${action}`;
              return (
                <div
                  key={permKey}
                  className="flex flex-col items-center justify-center p-3 rounded-lg bg-muted hover:bg-muted/50 transition"
                >
                  <span className="flex items-center gap-1 text-xs font-medium capitalize mb-2">
                    {actionIcons[action] || null}
                    {action.replace("_", " ")}
                  </span>
                  <Switch
                    checked={user?.permissions.includes(permKey)}
                    onCheckedChange={() => togglePermission(permKey)}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="p-6 text-center">
        <CardHeader>
          <CardTitle className="text-red-500 text-xl">User not found</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
        <LayoutDashboard className="h-6 w-6 text-primary" />
        Manage Permissions for <span className="text-primary">{user.name}</span>
      </h2>

      {/* --- Global Modules at Top --- */}
      <div className="grid gap-6 sm:grid-cols-2">
        {["dashboard", "reports"].map((module) => renderModule(module))}
      </div>

      {/* --- Table Modules Inside Accordion --- */}
      <Accordion type="multiple" className="w-full mt-6">
        <AccordionItem value="tables">
          <AccordionTrigger>Show Table Permissions</AccordionTrigger>
          <AccordionContent>
            {["table_a", "table_b", "table_c"].map((m) => renderModule(m))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* --- Save & Reset Buttons --- */}
      <div className="flex justify-end gap-4 mt-4">
        <Button
          className="px-6 py-2 text-sm rounded-xl shadow-md hover:shadow-lg flex items-center gap-2"
          onClick={savePermissions}
        >
          <Save className="h-4 w-4" />
          Save Changes
        </Button>

        <Button
          variant="outline"
          className="px-6 py-2 text-sm rounded-xl shadow-md hover:shadow-lg flex items-center gap-2"
          onClick={resetPermissions}
        >
         <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </div>
    </div>
  );
}

///***************************************13-09-25 11:48 with out grid *********************************** */


// "use client";

// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Switch } from "@/components/ui/switch";
// import { Separator } from "@/components/ui/separator";
// import allUsers from "@/data/users.json";
// import { PERMISSIONS } from "@/config/permissions";
// import {
//   Eye,
//   Pencil,
//   Plus,
//   Trash2,
//   UserPlus,
//   FileText,
//   LayoutDashboard,
//   Save,
//   RotateCcw,
// } from "lucide-react";

// export default function UserPermissionPage() {
//   const { id } = useParams();
//   const [user, setUser] = useState(null);
//   const [originalPermissions, setOriginalPermissions] = useState([]);

//   useEffect(() => {
//     if (!id) return;
//     const foundUser = allUsers.find((u) => String(u.id) === String(id)) || null;
//     setUser(foundUser);
//     setOriginalPermissions(foundUser?.permissions || []);
//   }, [id]);

// function togglePermission(permKey) {
//   if (!permKey || typeof permKey !== "string") return;

//   const [module, action] = permKey.split(":");

//   setUser((prev) => {
//     if (!prev) return prev;
//     let updatedPermissions = [...prev.permissions];

//     const addPerm = (key) => {
//       if (!updatedPermissions.includes(key)) updatedPermissions.push(key);
//     };

//     const removePerm = (key) => {
//       updatedPermissions = updatedPermissions.filter((p) => p !== key);
//     };

//     const isOn = updatedPermissions.includes(permKey);

//     if (isOn) {
//       // === TURNING OFF ===
//       removePerm(permKey);

//       if (action === "create") {
//         // If turning off create → also turn off edit, delete, assign_owner
//         ["edit", "delete", "assign_owner"].forEach((child) =>
//           removePerm(`${module}:${child}`)
//         );

//         // If no other permission exists for this module, turn off view
//         const stillHas = updatedPermissions.some(
//           (p) => p.startsWith(`${module}:`) && p !== `${module}:view`
//         );
//         if (!stillHas) removePerm(`${module}:view`);
//       }

//       if (["edit", "delete", "assign_owner"].includes(action)) {
//         // If no edit/delete/assign_owner left → turn off view
//         const stillHasChild = ["edit", "delete", "assign_owner"].some((child) =>
//           updatedPermissions.includes(`${module}:${child}`)
//         );
//         if (!stillHasChild) removePerm(`${module}:view`);
//       }
//     } else {
//       // === TURNING ON ===
//       addPerm(permKey);

//       if (action === "create") {
//         // Create ON → also enable view, edit, delete, assign_owner
//         addPerm(`${module}:view`);
//         ["edit", "delete", "assign_owner"].forEach((child) =>
//           addPerm(`${module}:${child}`)
//         );
//       }

//       if (["edit", "delete", "assign_owner"].includes(action)) {
//         // Edit/Delete/Assign requires view
//         addPerm(`${module}:view`);
//       }
//     }

//     return { ...prev, permissions: updatedPermissions };
//   });
// }


//   function savePermissions() {
//     console.log("Saving updated permissions:", user);
//     alert("✅ Permissions saved successfully!");
//     setOriginalPermissions(user?.permissions || []);
//   }

//   function resetPermissions() {
//     setUser((prev) => (prev ? { ...prev, permissions: [...originalPermissions] } : prev));
//     alert("🔄 Permissions reset to last saved state.");
//   }

//   // Icon mapping for each action
//   const actionIcons = {
//     view: <Eye className="h-4 w-4 text-blue-500" />,
//     create: <Plus className="h-4 w-4 text-green-500" />,
//     edit: <Pencil className="h-4 w-4 text-yellow-500" />,
//     delete: <Trash2 className="h-4 w-4 text-red-500" />,
//     assign_owner: <UserPlus className="h-4 w-4 text-purple-500" />,
//     dashboard: <LayoutDashboard className="h-4 w-4 text-primary" />,
//     reports: <FileText className="h-4 w-4 text-primary" />,
//   };

//   function renderModule(module) {
//     return (
//       <Card
//         key={module}
//         className="border shadow-sm rounded-2xl mb-6 hover:shadow-md transition-shadow"
//       >
//         <CardHeader className="flex flex-row items-center justify-between">
//           <CardTitle className="capitalize text-lg font-semibold flex items-center gap-2">
//             {actionIcons[module] || null}
//             {module.replace("_", " ")}
//           </CardTitle>
//         </CardHeader>
//         <Separator />
//         <CardContent>
//           <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 p-4">
//             {PERMISSIONS[module]?.map((action) => {
//               const permKey = `${module}:${action}`;
//               return (
//                 <div
//                   key={permKey}
//                   className="flex flex-col items-center justify-center p-3 rounded-lg bg-muted hover:bg-muted/50 transition"
//                 >
//                   <span className="flex items-center gap-1 text-xs font-medium capitalize mb-2">
//                     {actionIcons[action] || null}
//                     {action.replace("_", " ")}
//                   </span>
//                   <Switch
//                     checked={user?.permissions.includes(permKey)}
//                     onCheckedChange={() => togglePermission(permKey)}
//                   />
//                 </div>
//               );
//             })}
//           </div>
//         </CardContent>
//       </Card>
//     );
//   }

//   if (!user) {
//     return (
//       <Card className="p-6 text-center">
//         <CardHeader>
//           <CardTitle className="text-red-500 text-xl">User not found</CardTitle>
//         </CardHeader>
//       </Card>
//     );
//   }

//   return (
//     <div className="p-6 space-y-6">
//       <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
//         <LayoutDashboard className="h-6 w-6 text-primary" />
//         Manage Permissions for <span className="text-primary">{user.name}</span>
//       </h2>

//       {Object.keys(PERMISSIONS).map((module) => renderModule(module))}

//       <div className="flex justify-end gap-4">
//         <Button
//           onClick={resetPermissions}
//           variant="outline"
//           className="px-5 py-2 rounded-xl shadow-sm hover:shadow-md flex items-center gap-2"
//         >
//           <RotateCcw className="h-4 w-4" />
//           Reset
//         </Button>

//         <Button
//           onClick={savePermissions}
//           className="px-6 py-2 text-lg rounded-xl shadow-md hover:shadow-lg flex items-center gap-2"
//         >
//           <Save className="h-4 w-4" />
//           Save Changes
//         </Button>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { departmentService } from "../../../api";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import type { Department } from "../../../types";

export default function ManageDepartments() {
  const [deps, setDeps]     = useState<Department[]>([]);
  const [form, setForm]     = useState({ name: "", description: "" });
  const [editing, setEditing] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () =>
    departmentService.getAll()
      .then(setDeps)
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!form.name) return toast.error("Name required");
    try {
      await departmentService.create(form);
      setForm({ name: "", description: "" });
      load();
      toast.success("Created");
    } catch { toast.error("Failed"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this department?")) return;
    try {
      await departmentService.delete(id);
      setDeps(deps.filter(d => d.id !== id));
      toast.success("Deleted");
    } catch { toast.error("Failed"); }
  };

  const handleEdit = async (id: string) => {
    if (!editing) return;
    try {
      await departmentService.update(id, {
        name: editing.name,
        description: editing.description,
      });
      setDeps(deps.map(d => d.id === id ? { ...d, ...editing } : d));
      setEditing(null);
      toast.success("Updated");
    } catch { toast.error("Failed"); }
  };

  if (loading) return <div className="text-center py-8 text-gray-400 text-sm">Loading…</div>;

  return (
    <div className="max-w-2xl space-y-4">
      <h3 className="text-base font-semibold text-gray-900">Departments</h3>

      {/* Create */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3">
        <p className="text-sm font-medium text-gray-700">Add Department</p>
        <div className="flex gap-2">
          <input
            placeholder="Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            placeholder="Description"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleCreate}
            className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition whitespace-nowrap"
          >
            <Plus size={14} /> Add
          </button>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {deps.map((d, i) => (
          <div key={d.id} className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? "border-t border-gray-50" : ""} hover:bg-gray-50`}>
            {editing?.id === d.id ? (
              <>
                <input
                  value={editing.name}
                  onChange={e => setEditing({ ...editing, name: e.target.value })}
                  className="flex-1 px-2 py-1 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <input
                  value={editing.description}
                  onChange={e => setEditing({ ...editing, description: e.target.value })}
                  className="flex-1 px-2 py-1 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button onClick={() => handleEdit(d.id)} className="p-1 text-green-600 hover:bg-green-50 rounded"><Check size={15} /></button>
                <button onClick={() => setEditing(null)} className="p-1 text-gray-400 hover:bg-gray-100 rounded"><X size={15} /></button>
              </>
            ) : (
              <>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{d.name}</p>
                  <p className="text-xs text-gray-400">{d.description || "—"}</p>
                </div>
                <button onClick={() => setEditing({ ...d })} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"><Pencil size={14} /></button>
                <button onClick={() => handleDelete(d.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 size={14} /></button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
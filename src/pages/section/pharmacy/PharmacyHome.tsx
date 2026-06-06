import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Pill, AlertTriangle, CheckCircle, Package } from "lucide-react";
import StatCard from "../../../components/dashboard/StatCard";
import { pharmacyService } from "../../../api";
import type { PharmacyMedicinePayload } from "../../../api/services/pharmacyService";
import type { PharmacyMedicine, User } from "../../../types";

export default function PharmacyHome({ user }: { user: User | null }) {
  const [medicines, setMedicines] = useState<PharmacyMedicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PharmacyMedicinePayload>({
    medicineName: "",
    genericName: "",
    category: "",
    quantity: 0,
    unitPrice: 0,
    lowStockThreshold: 10,
    active: true,
  });

  const load = async () => {
    try {
      const data = search.trim()
        ? await pharmacyService.search(search)
        : await pharmacyService.getAll();
      setMedicines(data);
    } catch {
      toast.error("Failed to load medicines");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!loading) load();
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const handleSave = async () => {
    try {
      if (editingId) {
        await pharmacyService.update(editingId, form);
        toast.success("Updated");
      } else {
        await pharmacyService.create(form);
        toast.success("Added");
      }
      setShowAdd(false);
      setEditingId(null);
      setForm({
        medicineName: "",
        genericName: "",
        category: "",
        quantity: 0,
        unitPrice: 0,
        lowStockThreshold: 10,
        active: true,
      });
      load();
    } catch {
      toast.error("Save failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete medicine?")) return;
    try {
      await pharmacyService.delete(id);
      toast.success("Deleted");
      load();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleAdjust = async (id: string, change: number) => {
    try {
      await pharmacyService.adjustStock(id, change);
      load();
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  const loadLowStock = async () => {
    try {
      setMedicines(await pharmacyService.lowStock());
      toast.success("Showing low stock items");
    } catch {
      toast.error("Failed");
    }
  };

  const lowStock = medicines.filter((m) => m.lowStock);

  if (loading) {
    return <div className="text-center py-8 text-gray-400 text-sm">Loading…</div>;
  }

  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl p-5 text-white">
        <p className="text-sm text-amber-200">Pharmacy</p>
        <h3 className="text-xl font-bold mt-0.5">Welcome, {user?.firstName}</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total Medicines" value={medicines.length} icon={Pill} color="amber" />
        <StatCard label="Low Stock" value={lowStock.length} icon={AlertTriangle} color="rose" />
        <StatCard label="Active" value={medicines.filter((m) => m.active).length} icon={CheckCircle} color="green" />
        <StatCard label="Categories" value={[...new Set(medicines.map((m) => m.category))].length} icon={Package} color="blue" />
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          placeholder="Search medicines (API)…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 text-sm border rounded-lg w-56"
        />
        <button onClick={loadLowStock} className="px-3 py-2 bg-amber-100 text-amber-800 text-sm rounded-lg">
          Low stock API
        </button>
        <button onClick={() => { setShowAdd(true); setEditingId(null); }} className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg">
          + Add Medicine
        </button>
      </div>

      {showAdd && (
        <div className="bg-gray-50 rounded-xl p-4 border grid grid-cols-2 gap-3">
          {(
            [
              ["medicineName", "Medicine Name"],
              ["genericName", "Generic Name"],
              ["category", "Category"],
              ["quantity", "Quantity"],
              ["unitPrice", "Unit Price"],
              ["lowStockThreshold", "Low Stock Threshold"],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <label className="text-xs text-gray-500">{label}</label>
              <input
                type={key === "quantity" || key === "unitPrice" || key === "lowStockThreshold" ? "number" : "text"}
                value={form[key as keyof PharmacyMedicinePayload] as string | number}
                onChange={(e) =>
                  setForm({
                    ...form,
                    [key]:
                      key === "quantity" || key === "unitPrice" || key === "lowStockThreshold"
                        ? Number(e.target.value)
                        : e.target.value,
                  })
                }
                className="w-full mt-1 px-3 py-2 text-sm border rounded-lg"
              />
            </div>
          ))}
          <div className="col-span-2 flex gap-2">
            <button onClick={handleSave} className="flex-1 py-2 bg-blue-600 text-white text-sm rounded-lg">Save</button>
            <button onClick={() => setShowAdd(false)} className="flex-1 py-2 bg-gray-200 text-sm rounded-lg">Cancel</button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {["Medicine", "Qty", "Price", "Status", "Stock", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {medicines.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{m.medicineName}</td>
                <td className={`px-4 py-3 ${m.lowStock ? "text-red-600 font-semibold" : ""}`}>{m.quantity}</td>
                <td className="px-4 py-3">LKR {m.unitPrice}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${m.lowStock ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                    {m.lowStock ? "Low" : "OK"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => handleAdjust(m.id, -1)} className="w-6 h-6 rounded bg-red-50 text-red-600 text-xs font-bold">−</button>
                  <button onClick={() => handleAdjust(m.id, 1)} className="w-6 h-6 rounded bg-green-50 text-green-600 text-xs font-bold ml-1">+</button>
                </td>
                <td className="px-4 py-3 space-x-2">
                  <button onClick={() => { setEditingId(m.id); setForm({ medicineName: m.medicineName, genericName: m.genericName, category: m.category, quantity: m.quantity || 0, unitPrice: m.unitPrice || 0, lowStockThreshold: m.lowStockThreshold || 10, active: m.active }); setShowAdd(true); }} className="text-xs text-teal-600">Edit</button>
                  <button onClick={() => handleDelete(m.id)} className="text-xs text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

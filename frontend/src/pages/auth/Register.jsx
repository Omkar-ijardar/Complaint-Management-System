import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", password: "", hostel: "", roomNumber: "", phone: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await register({ ...form, role: "student" });
      toast.success(`Account created! Welcome, ${user.name}`);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-white dark:from-gray-900 dark:to-gray-950 px-4 py-10">
      <div className="card w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-6">
          <ShieldCheck className="text-primary-600" size={36} />
          <h1 className="text-xl font-bold mt-2 text-gray-800 dark:text-gray-100">Create Student Account</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input required placeholder="Full Name" className="input-field"
            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input required type="email" placeholder="Email" className="input-field"
            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input required type="password" placeholder="Password" className="input-field"
            value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Hostel (e.g. Block A)" className="input-field"
              value={form.hostel} onChange={(e) => setForm({ ...form, hostel: e.target.value })} />
            <input placeholder="Room No." className="input-field"
              value={form.roomNumber} onChange={(e) => setForm({ ...form, roomNumber: e.target.value })} />
          </div>
          <input placeholder="Phone" className="input-field"
            value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>
        <p className="text-sm text-center mt-4 text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-primary-600 font-medium">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

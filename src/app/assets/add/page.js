import { getCurrentUser } from "../../../../lib/auth";
import { connectDB } from "../../../../lib/db";
import { redirect } from "next/navigation";
import DashboardLayout from "../../components/DashboardLayout";
import AddAssetForm from "../AddAssetForm";

export default async function AddAssetPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  
  // Only admins can add assets
  if (user.role !== "admin") {
    redirect("/assets");
  }

  await connectDB();

  return (
    <DashboardLayout userName={user.fullName}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ margin: "0 0 0.5rem 0", color: "#2c3e50" }}>➕ Add New Asset</h1>
        <p style={{ margin: 0, color: "#666", fontSize: "0.95rem" }}>
          Fill in the basic information to create a new asset. You can add more details later.
        </p>
      </div>
      
      <div className="card">
        <AddAssetForm />
      </div>
    </DashboardLayout>
  );
}

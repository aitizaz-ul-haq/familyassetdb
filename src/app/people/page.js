import { getCurrentUser } from "../../../lib/auth";
import { connectDB } from "../../../lib/db";
import User from "../../../models/User";
import { redirect } from "next/navigation";
import DashboardLayout from "../components/DashboardLayout";
import UsersList from "./UsersList";

export default async function PeoplePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  await connectDB();

  const users = await User.find().select("-passwordHash").sort({ fullName: 1 });

  const usersData = users.map(u => ({
    _id: u._id.toString(),
    fullName: u.fullName,
    email: u.email,
    relationToFamily: u.relationToFamily || "N/A",
    cnic: u.cnic || "N/A",
    status: u.status,
    role: u.role,
  }));

  return (
    <DashboardLayout 
      userName={user.fullName} 
      userRole={user.role}
      userCnic={user.cnic}
    >
      <h1 style={{ marginBottom: "2rem" }}>People</h1>

      <UsersList users={usersData} currentUserRole={user.role} currentUserId={user._id} />
    </DashboardLayout>
  );
}
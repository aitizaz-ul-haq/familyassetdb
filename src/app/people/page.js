import { getCurrentUser } from "../../../lib/auth";
import { connectDB } from "../../../lib/db";
import Person from "../../../models/Person";
import { redirect } from "next/navigation";
import AddPersonForm from "./AddPersonForm";

export default async function PeoplePage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/login");
  }

  await connectDB();

  const people = await Person.find().sort({ fullName: 1 });

  return (
    <div>
      <h1 style={{ marginBottom: "2rem" }}>People</h1>

      {user.role === "admin" && <AddPersonForm />}

      <div className="card">
        <div className="table-responsive">
          <table className="table-sm table-nowrap">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Relation</th>
                <th>CNIC</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {people.map((person) => (
                <tr key={person._id.toString()}>
                  <td>{person.fullName}</td>
                  <td>{person.relationToFamily || "N/A"}</td>
                  <td>{person.cnic || "N/A"}</td>
                  <td>
                    <span style={{
                      padding: "0.25rem 0.5rem",
                      borderRadius: "4px",
                      fontSize: "0.875rem",
                      background: person.status === "deceased" ? "#ffebee" : "#e8f5e9",
                      color: person.status === "deceased" ? "#c62828" : "#2e7d32",
                    }}>
                      {person.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
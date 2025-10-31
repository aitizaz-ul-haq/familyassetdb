"use client";

import { useState } from "react";
import EditUserModal from "./EditUserModal";

export default function UsersList({ users, currentUserRole, currentUserId }) {
  const [editingUser, setEditingUser] = useState(null);

  const handleDelete = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        window.location.reload();
      } else {
        alert("Failed to delete user");
      }
    } catch (error) {
      alert("Error deleting user");
    }
  };

  return (
    <>
      <div className="card">
        <div className="table-responsive">
          <table className="table-sm table-nowrap">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Relation</th>
                <th>CNIC</th>
                <th>Status</th>
                <th>Role</th>
                {currentUserRole === "admin" && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.fullName}</td>
                  <td>{user.relationToFamily}</td>
                  <td>{user.cnic}</td>
                  <td>
                    <span
                      className={`badge ${
                        user.status === "deceased"
                          ? "badge-danger"
                          : "badge-success"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: "0.25rem 0.5rem",
                        background:
                          user.role === "admin" ? "#e3f2fd" : "#f5f5f5",
                        borderRadius: "4px",
                        fontSize: "0.85rem",
                      }}
                    >
                      {user.role}
                    </span>
                  </td>
                  {currentUserRole === "admin" && (
                    <td>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          onClick={() => setEditingUser(user)}
                          style={{
                            padding: "0.25rem 0.75rem",
                            fontSize: "0.85rem",
                          }}
                        >
                          Edit
                        </button>
                        {user._id !== currentUserId && (
                          <button
                            onClick={() => handleDelete(user._id)}
                            style={{
                              padding: "0.25rem 0.75rem",
                              fontSize: "0.85rem",
                              background: "#ef5350",
                            }}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
        />
      )}
    </>
  );
}

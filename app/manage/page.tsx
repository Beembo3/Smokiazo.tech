"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IonIcon, IonList } from "@ionic/react";
import { arrowBack, addCircle, personAdd } from "ionicons/icons";
import { Button } from "@/components/ui";
import { useSession } from "@/lib/use-session";

export default function ManagePage() {
  const router = useRouter();
  const { session, signOut } = useSession();

  // Check if user is admin
  if (!session?.role || session.role !== "admin") {
    router.push("/admin");
    return null;
  }

  // Load users from localStorage on mount
  const [users, setUsers] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem("2go.users");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Save users to localStorage on change
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("2go.users", JSON.stringify(users));
    } catch {
      /* ignore */
    }
  }, [users]);

  const [newUserEmail, setNewUserEmail] = useState("");

  const addUser = () => {
    if (!newUserEmail.trim()) return;
    setUsers([...users, newUserEmail.trim()]);
    setNewUserEmail("");
  };

  const removeUser = (email: string) => {
    setUsers(users.filter((u) => u !== email));
  };

  const clearAllUsers = () => {
    if (window.confirm("Are you sure you want to clear all users?")) {
      setUsers([]);
    }
  };

  return (
    <div className="screen">
      <div className="header-bar">
        <IonIcon icon={arrowBack} className="back-btn" onClick={() => router.push("/admin")} />
        <h1 className="page-title">Admin Panel</h1>
      </div>

      <div className="admin-content mt-16">
        <h2>Manage Users</h2>

        <div className="input-row">
          <input
            type="email"
            placeholder="Add new user email"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
            readOnly
          />
          <Button variant="outline" onClick={addUser}>Add User</Button>
        </div>

        <div className="users-list mt-12">
          {users.length > 0 ? (
            <IonList>
              {users.map((email, index) => (
                <div key={email} className="user-item">
                  <span>{email}</span>
                  <Button variant="ink" onClick={() => removeUser(email)}>
                    Remove
                  </Button>
                </div>
              ))}
            </IonList>
          ) : (
            <p className="empty-state">No users yet. Add your first user above.</p>
          )}
        </div>

        <div className="mt-8">
          <Button variant="outline" onClick={clearAllUsers}>
            <IonIcon icon="trash" className="icon-small" /> Clear All
          </Button>
        </div>
      </div>

      <div className="mt-24">
        <Button variant="outline" onClick={signOut}>
          <IonIcon icon="log-out" /> Sign Out
        </Button>
      </div>
    </div>
  );
}
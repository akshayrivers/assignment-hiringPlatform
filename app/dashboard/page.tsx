"use client";
import { useSession } from "next-auth/react";
// for now we just verify if the credentials we have in session is correct or not ?
export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div>
      <h1>Dashboard</h1>
      {session && (
        <div>
          <p>User ID: {session.user._id}</p>
          <p>Username: {session.user.username}</p>
          <p>Role: {session.user.role}</p>
          <p>Verified: {session.user.isVerified ? "Yes" : "No"}</p>
        </div>
      )}
    </div>
  );
}

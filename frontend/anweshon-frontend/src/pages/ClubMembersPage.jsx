import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { clubsApi } from "../api/clubsApi";
import { isClubAdmin } from "../utils/authHelpers";

export default function ClubMembersPage() {
  const { id } = useParams(); // /clubs/:id/members
  const [club, setClub] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const clubAdmin = isClubAdmin();

  useEffect(() => {
    if (!token || !clubAdmin) {
      navigate("/login");
      return;
    }

    let isMounted = true;

    async function load() {
      try {
        const [clubRes, membersRes] = await Promise.all([
          clubsApi.getById(id),
          clubsApi.getMembers(id),
        ]);

        if (!isMounted) return;
        setClub(clubRes.data);
        setMembers(membersRes.data);
      } catch (err) {
        console.error("Error loading club members", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [id, token, clubAdmin, navigate]);

  if (!token || !clubAdmin) return null;
  if (loading) return <div className="text-black">Loading members...</div>;
  if (!club) return <div className="text-black">Club not found.</div>;

  return (
    <div className="text-black">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{club.name} members</h1>
          <div className="text-xs text-slate-700">Total: {members.length}</div>
        </div>
        <Link to={`/clubs/${id}`} className="text-sky-400 text-sm">
          ← Back to club
        </Link>
      </div>

      {members.length === 0 && (
        <div className="text-sm text-slate-700">
          No members yet. Ask students to join this club.
        </div>
      )}

      {members.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-slate-800 text-slate-200">
              <tr>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Role</th>
                <th className="px-3 py-2">Joined</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.membershipId} className="border-b border-slate-800">
                  <td className="px-3 py-2">{m.fullName || "Unknown"}</td>
                  <td className="px-3 py-2 text-slate-800">{m.email}</td>
                  <td className="px-3 py-2">{m.roleInClub || "Member"}</td>
                  <td className="px-3 py-2 text-slate-700">
                    {new Date(m.joinedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

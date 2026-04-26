import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../lib/api";
import type { User, Gig } from "../lib/api";

export default function UserProfile() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      api.get<{ user: User }>(`/users/${id}`).then((r) => setUser(r.data.user)),
      api.get<{ gigs: Gig[] }>(`/gigs`, { params: { student: id } }).then((r) => setGigs(r.data.gigs)),
    ]).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="max-w-7xl mx-auto px-6 py-10 text-gray-400">Loading...</p>;
  if (!user) return <p className="max-w-7xl mx-auto px-6 py-10 text-red-400">User not found</p>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[#18c29c] text-black font-bold text-2xl flex items-center justify-center">
          {user.name[0]?.toUpperCase()}
        </div>
        <div>
          <h1 className="text-white text-2xl font-semibold">{user.name}</h1>
          <p className="text-gray-400 text-sm capitalize">{user.role}</p>
        </div>
      </div>

      {user.role === "student" && user.studentProfile && (
        <div className="mt-6 rounded-xl border border-[#0f3d34] bg-[#062a23] p-6">
          {user.studentProfile.college && (
            <p className="text-gray-300"><span className="text-gray-400">College:</span> {user.studentProfile.college}</p>
          )}
          {user.studentProfile.bio && (
            <p className="text-gray-300 mt-2 whitespace-pre-line">{user.studentProfile.bio}</p>
          )}
          {user.studentProfile.skills && user.studentProfile.skills.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {user.studentProfile.skills.map((s) => (
                <span key={s} className="text-xs px-2 py-1 rounded-full border border-[#0f3d34] text-gray-300">{s}</span>
              ))}
            </div>
          )}
          {user.studentProfile.portfolioLinks && user.studentProfile.portfolioLinks.length > 0 && (
            <div className="mt-4 space-y-1">
              {user.studentProfile.portfolioLinks.map((u) => (
                <a
                  key={u}
                  href={u}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-[#18c29c] hover:underline text-sm"
                >
                  {u}
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {user.role === "client" && user.clientProfile && (
        <div className="mt-6 rounded-xl border border-[#0f3d34] bg-[#062a23] p-6">
          {user.clientProfile.companyName && (
            <p className="text-white font-semibold">{user.clientProfile.companyName}</p>
          )}
          {user.clientProfile.description && (
            <p className="text-gray-300 mt-2 whitespace-pre-line">{user.clientProfile.description}</p>
          )}
        </div>
      )}

      {user.role === "student" && (
        <>
          <h2 className="text-white text-xl font-semibold mt-10 mb-4">Gigs</h2>
          {gigs.length === 0 ? (
            <p className="text-gray-400">No gigs yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {gigs.map((g) => (
                <Link
                  key={g._id}
                  to={`/gigs/${g._id}`}
                  className="rounded-xl border border-[#0f3d34] bg-[#062a23] p-5 hover:border-[#18c29c]"
                >
                  <span className="text-xs text-[#18c29c] uppercase">{g.category}</span>
                  <h3 className="text-white font-semibold mt-1 line-clamp-2">{g.title}</h3>
                  <p className="text-gray-400 text-sm mt-2 line-clamp-2">{g.description}</p>
                  <p className="text-white font-semibold mt-3">₹{g.price}</p>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

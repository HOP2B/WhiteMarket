import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";
import { getUserById, getGigs } from "../../api/mockApi";

const UserProfile: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState<any>(null);
  const [userGigs, setUserGigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchUserData = async () => {
        try {
          const userData = await getUserById(id as string);
          const allGigs = (await getGigs()) as any[];
          const gigsByUser = allGigs.filter((gig: any) => gig.userId === id);
          setUser(userData);
          setUserGigs(gigsByUser);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setLoading(false);
        }
      };

      fetchUserData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-gray-900">User not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3">
              <img
                src={user.avatar || "/default-avatar.jpg"}
                alt={user.name}
                className="w-48 h-48 rounded-full mx-auto mb-4 object-cover"
              />
              <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
                {user.name}
              </h1>
              <p className="text-gray-600 text-center mb-4">{user.email}</p>
              <div className="flex justify-center space-x-4 mb-6">
                <button className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700">
                  Contact Me
                </button>
                <button className="border border-gray-300 px-6 py-2 rounded-md hover:bg-gray-50">
                  Hire Me
                </button>
              </div>
            </div>
            <div className="w-full md:w-2/3">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About Me
              </h2>
              <p className="text-gray-700 mb-6">{user.bio}</p>

              <h3 className="text-xl font-bold text-gray-900 mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {user.skills &&
                  user.skills.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-4">
                My Services
              </h3>
              {userGigs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userGigs.map((gig) => (
                    <div
                      key={gig.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {gig.title}
                      </h4>
                      <p className="text-gray-600 text-sm mb-2">
                        {gig.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-green-600 font-bold">
                          ${gig.price}
                        </span>
                        <button className="text-green-600 hover:text-green-700 text-sm">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No services offered yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";
import { getGigById, getUserById } from "../../api/mockApi";
import { useAuth } from "../../context/AuthContext";

const GigDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [gig, setGig] = useState<any>(null);
  const [seller, setSeller] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const handleContactSeller = () => {
    if (user && gig) {
      router.push(`/messages?contact=${gig.userId}`);
    } else {
      router.push("/login");
    }
  };

  useEffect(() => {
    if (id) {
      const fetchGigData = async () => {
        try {
          const gigData = (await getGigById(id as string)) as any;
          if (gigData) {
            const sellerData = await getUserById(gigData.userId);
            setGig(gigData);
            setSeller(sellerData);
          }
          setLoading(false);
        } catch (error) {
          console.error("Error fetching gig data:", error);
          setLoading(false);
        }
      };

      fetchGigData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!gig) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-gray-900">Gig not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-2/3">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {gig.title}
                </h1>
                <div className="flex items-center mb-6">
                  <img
                    src={seller?.avatar || "/default-avatar.jpg"}
                    alt={seller?.name || "Seller"}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">
                      {seller?.name}
                    </p>
                    <div className="flex items-center">
                      <span className="text-yellow-500">★</span>
                      <span className="ml-1 text-gray-700">{gig.rating}</span>
                      <span className="ml-1 text-gray-500">
                        ({gig.reviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <img
                    src="/placeholder-gig.jpg"
                    alt={gig.title}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                  <p className="text-gray-700 text-lg">{gig.description}</p>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    About This Gig
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <span className="text-gray-600 mr-2">Category:</span>
                      <span className="font-semibold text-gray-900">
                        {gig.category}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 mr-2">Delivery Time:</span>
                      <span className="font-semibold text-gray-900">
                        3 Days
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 mr-2">Revisions:</span>
                      <span className="font-semibold text-gray-900">
                        Unlimited
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:w-1/3">
                <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-600">Starting at</span>
                    <span className="text-3xl font-bold text-green-600">
                      ${gig.price}
                    </span>
                  </div>

                  <button className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 mb-4">
                    Continue (${gig.price})
                  </button>

                  <div className="space-y-3">
                    <button
                      onClick={handleContactSeller}
                      className="w-full border border-gray-300 py-3 px-4 rounded-md hover:bg-gray-50 transition-colors duration-200"
                    >
                      Contact Seller
                    </button>
                    <button className="w-full border border-gray-300 py-3 px-4 rounded-md hover:bg-gray-50 transition-colors duration-200">
                      Add to Favorites
                    </button>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      What's Included
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center">
                        <span className="text-green-600 mr-2">✓</span>
                        Basic Package
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-600 mr-2">✓</span>3
                        Revisions
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-600 mr-2">✓</span>3 Days
                        Delivery
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GigDetail;

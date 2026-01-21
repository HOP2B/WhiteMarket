import React from "react";
import Link from "next/link";

interface GigCardProps {
  gig: {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    userName: string;
    userAvatar: string;
    rating: number;
    reviews: number;
  };
}

const GigCard: React.FC<GigCardProps> = ({ gig }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 border border-green-200">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <img
            src={gig.userAvatar}
            alt={gig.userName}
            className="w-12 h-12 rounded-full mr-4 border-2 border-green-200"
          />
          <div>
            <h3 className="text-lg font-semibold text-green-800">
              {gig.title}
            </h3>
            <p className="text-sm text-green-600">by {gig.userName}</p>
          </div>
        </div>
        <p className="text-gray-700 mb-4 line-clamp-3">{gig.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-green-600 font-bold text-xl">
              ${gig.price}
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-yellow-500">★</span>
            <span className="ml-1 text-gray-700">{gig.rating}</span>
            <span className="ml-1 text-gray-500">({gig.reviews})</span>
          </div>
        </div>
        <div className="mt-4">
          <Link
            href={`/gigs/${gig.id}`}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 text-center block transition-all duration-200 hover:scale-105 shadow-md"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GigCard;

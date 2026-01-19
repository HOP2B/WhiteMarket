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
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <img
            src={gig.userAvatar}
            alt={gig.userName}
            className="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{gig.title}</h3>
            <p className="text-sm text-gray-600">by {gig.userName}</p>
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
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 text-center block"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GigCard;

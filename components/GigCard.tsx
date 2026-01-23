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
    <div className="card group">
      <div className="p-6">
        {/* User Info */}
        <div className="flex items-center mb-4">
          <div className="relative">
            <img
              src={gig.userAvatar}
              alt={gig.userName}
              className="w-12 h-12 rounded-full mr-4 border-2 border-blue-600 group-hover:border-green-600 transition-all duration-300"
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-gray-900 group-hover:text-gray-900-color transition-all duration-200">
              {gig.title}
            </h3>
            <p className="text-sm text-text-gray-600">by {gig.userName}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-text-gray-600 mb-4 line-clamp-3 leading-relaxed">
          {gig.description}
        </p>

        {/* Category Badge */}
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-bg-gray-100 text-text-gray-600 text-xs font-medium rounded-full">
            {gig.category}
          </span>
        </div>

        {/* Price and Rating */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <span className="text-gray-900-color font-bold text-xl">
              ${gig.price}
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-yellow-500">★</span>
            <span className="ml-1 text-text-gray-900 font-medium">
              {gig.rating}
            </span>
            <span className="ml-1 text-text-gray-600">({gig.reviews})</span>
          </div>
        </div>

        {/* Action Button */}
        <Link
          href={`/gigs/${gig.id}`}
          className="w-full btn-primary py-3 px-4 text-center block text-sm font-semibold"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default GigCard;

import { supabase } from "../lib/supabase";

export const getGigs = async () => {
  const { data, error } = await supabase
    .from("gigs")
    .select(
      `
      *,
      user:users!user_id(name, avatar),
      reviews:reviews(rating)
    `,
    )
    .order("id", { ascending: false });

  if (error) {
    throw error;
  }
  return data.map((gig) => {
    const reviews = gig.reviews || [];
    const rating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
    return {
      ...gig,
      userName: gig.user?.name || "Unknown",
      userAvatar: gig.user?.avatar || "/default-avatar.jpg",
      userId: gig.user_id,
      rating: Math.round(rating * 10) / 10, // round to 1 decimal
      reviews: reviews.length,
    };
  });
};

export const getGigById = async (id: string) => {
  const { data, error } = await supabase
    .from("gigs")
    .select(`
      *,
      user:users!user_id(name, avatar),
      reviews:reviews(rating)
    `)
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }
  const reviews = data.reviews || [];
  const rating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
  return {
    ...data,
    userName: data.user?.name || "Unknown",
    userAvatar: data.user?.avatar || "/default-avatar.jpg",
    userId: data.user_id,
    rating: Math.round(rating * 10) / 10,
    reviews: reviews.length,
  };
};

export const getUserById = async (id: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    // If user not found in database, return a default user
    // This handles cases where user signed up but no record in users table
    return {
      id,
      name: "Unknown User",
      email: "unknown@example.com",
      avatar: "/default-avatar.jpg",
      bio: "User profile not available",
      skills: [],
    };
  }
  return data;
};

export const getMessages = async (userId: string) => {
  const { data, error } = await supabase
    .from("messages")
    .select(
      `
      *,
      sender:users!sender_id(name, avatar),
      receiver:users!receiver_id(name, avatar)
    `,
    )
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order("timestamp", { ascending: true });

  if (error) throw error;
  return data.map((msg) => ({
    id: msg.id,
    senderId: msg.sender_id,
    receiverId: msg.receiver_id,
    content: msg.content,
    timestamp: msg.timestamp,
    status: msg.status || "sent",
    file: msg.file,
    sender: msg.sender,
    receiver: msg.receiver,
  }));
};

export const sendMessage = async (message: any) => {
  const dbMessage = {
    id: message.id,
    sender_id: message.senderId,
    receiver_id: message.receiverId,
    content: message.content,
    timestamp: message.timestamp,
    ...(message.file && { file: message.file }),
  };

  const { data, error } = await supabase
    .from("messages")
    .insert(dbMessage)
    .select()
    .single();

  if (error) throw error;
  return {
    id: data.id,
    senderId: data.sender_id,
    receiverId: data.receiver_id,
    content: data.content,
    timestamp: data.timestamp,
    status: data.status || "sent",
    file: data.file,
  };
};

export const searchUsers = async (query: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .ilike("name", `%${query}%`)
    .limit(20);

  if (error) throw error;
  return data;
};

export const markMessagesAsRead = async (messageIds: string[]) => {
  const { error } = await supabase
    .from("messages")
    .update({ status: "read" })
    .in("id", messageIds);

  if (error) throw error;
};

export const createOrder = async (order: any) => {
  // Simulate order creation (database not set up yet)
  return { ...order, id: Date.now().toString() };
};

export const getOrders = async (userId: string) => {
  // Return mock orders for development
  return [
    {
      id: "1",
      gig_id: "1",
      buyer_id: userId,
      seller_id: "user1",
      amount: 50000,
      status: "completed",
      created_at: "2024-01-15T10:00:00Z",
      gigs: { title: "Logo Design", price: 50000, user_id: "user1" },
      users: { name: "John Doe", avatar: "/avatars/john-doe.jpg" },
    },
    {
      id: "2",
      gig_id: "2",
      buyer_id: userId,
      seller_id: "user2",
      amount: 75000,
      status: "in_progress",
      created_at: "2024-01-18T14:30:00Z",
      gigs: { title: "Web Development", price: 75000, user_id: "user2" },
      users: { name: "Jane Smith", avatar: "/avatars/jane-smith.jpg" },
    },
  ];
};

// New API functions for enhanced functionality
export const getReviews = async (gigId: string) => {
  const { data, error } = await supabase
    .from("reviews")
    .select(
      `
      *,
      user:users(name, avatar)
    `,
    )
    .eq("gig_id", gigId)
    .order("date", { ascending: false });

  if (error) {
    throw error;
  }

  return data.map((review) => ({
    ...review,
    userName: review.user?.name || "Unknown",
    userAvatar: review.user?.avatar || "/default-avatar.jpg",
  }));
};

export const getAllReviews = async (limit: number = 10) => {
  const { data, error } = await supabase
    .from("reviews")
    .select(
      `
      *,
      user:users(name, avatar),
      gig:gigs(title)
    `,
    )
    .order("date", { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return data.map((review) => ({
    ...review,
    userName: review.user?.name || "Unknown",
    userAvatar: review.user?.avatar || "/default-avatar.jpg",
    gigTitle: review.gig?.title || "Unknown Gig",
  }));
};

export const createReview = async (review: any) => {
  const newReview = {
    id: Date.now().toString(),
    gig_id: review.gig_id,
    user_id: review.user_id,
    rating: review.rating,
    comment: review.comment,
    date: new Date().toISOString().split("T")[0],
  };

  const { data, error } = await supabase
    .from("reviews")
    .insert(newReview)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const createNotification = async (notification: any) => {
  const { data, error } = await supabase
    .from("notifications")
    .insert({
      user_id: notification.userId,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      action_url: notification.actionUrl,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getNotifications = async (userId: string) => {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false });

  if (error) throw error;
  return data;
};

export const markNotificationAsRead = async (notificationId: string) => {
  const { data, error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getFavorites = async (userId: string) => {
  const { data, error } = await supabase
    .from("favorites")
    .select(
      `
      *,
      gig:gigs(title, description, price, category, userName, userAvatar)
    `,
    )
    .eq("user_id", userId);

  if (error) throw error;
  return data;
};

export const addToFavorites = async (userId: string, gigId: string) => {
  const newFavorite = {
    id: Date.now().toString(),
    user_id: userId,
    gig_id: gigId,
    created_at: new Date().toISOString(),
  };
  const { data, error } = await supabase
    .from("favorites")
    .insert(newFavorite)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const removeFromFavorites = async (userId: string, gigId: string) => {
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", userId)
    .eq("gig_id", gigId);

  if (error) throw error;
  return true;
};

export const searchGigs = async (query: string, filters: any = {}) => {
  let queryBuilder = supabase.from("gigs").select(`
      *,
      user:users!user_id(name, avatar),
      reviews:reviews(rating)
    `);

  // Text search
  if (query) {
    queryBuilder = queryBuilder.or(
      `title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`,
    );
  }

  // Category filter
  if (filters.category) {
    queryBuilder = queryBuilder.eq("category", filters.category);
  }

  // Price range filter
  if (filters.minPrice) {
    queryBuilder = queryBuilder.gte("price", filters.minPrice);
  }
  if (filters.maxPrice) {
    queryBuilder = queryBuilder.lte("price", filters.maxPrice);
  }

  // Rating filter
  if (filters.minRating) {
    queryBuilder = queryBuilder.gte("rating", filters.minRating);
  }

  // Sort
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case "price_low":
        queryBuilder = queryBuilder.order("price", { ascending: true });
        break;
      case "price_high":
        queryBuilder = queryBuilder.order("price", { ascending: false });
        break;
      case "rating":
        queryBuilder = queryBuilder.order("rating", { ascending: false });
        break;
      case "newest":
        queryBuilder = queryBuilder.order("created_at", { ascending: false });
        break;
      default:
        queryBuilder = queryBuilder.order("created_at", { ascending: false });
        break;
    }
  } else {
    queryBuilder = queryBuilder.order("id", { ascending: false });
  }

  const { data, error } = await queryBuilder;

  if (error) {
    throw error;
  }
  return data.map((gig) => {
    const reviews = gig.reviews || [];
    const rating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
    return {
      ...gig,
      userName: gig.user?.name || "Unknown",
      userAvatar: gig.user?.avatar || "/default-avatar.jpg",
      userId: gig.user_id,
      rating: Math.round(rating * 10) / 10, // round to 1 decimal
      reviews: reviews.length,
    };
  });
};

export const getCategories = async () => {
  const { data, error } = await supabase.from("gigs").select("category");

  if (error) throw error;
  const categoryCount: { [key: string]: number } = {};
  data.forEach((gig) => {
    categoryCount[gig.category] = (categoryCount[gig.category] || 0) + 1;
  });
  return Object.entries(categoryCount).map(([name, count]) => ({
    name,
    count,
  }));
};

export const getUserStats = async (userId: string) => {
  const { data: userGigs, error: gigsError } = await supabase
    .from("gigs")
    .select("rating")
    .eq("user_id", userId);

  if (gigsError) throw gigsError;

  const userOrders = await getOrders(userId);

  return {
    totalGigs: userGigs.length,
    totalOrders: userOrders.length,
    completedOrders: userOrders.filter((order) => order.status === "completed")
      .length,
    totalEarnings: userOrders
      .filter(
        (order) => order.seller_id === userId && order.status === "completed",
      )
      .reduce((sum, order) => sum + order.amount, 0),
    averageRating:
      userGigs.length > 0
        ? userGigs.reduce((sum, gig) => sum + gig.rating, 0) / userGigs.length
        : 0,
  };
};

export const updateUserProfile = async (userId: string, updates: any) => {
  // In a real app, this would update the database
  return { ...updates, id: userId };
};

export const createGig = async (gigData: any) => {
  const {
    title,
    description,
    price,
    category,
    images,
    tags,
    packages,
    userId,
    userName,
    userAvatar,
  } = gigData;

  // Ensure user exists in users table
  const { data: existingUser } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (!existingUser) {
    await supabase
      .from("users")
      .insert({ id: userId, name: userName, email: "", avatar: userAvatar });
  }

  const newGig = {
    id: Date.now().toString(),
    user_id: userId,
    title,
    description,
    price,
    category,
    images: images || [],
    tags: tags || [],
    packages: packages || [],
    rating: 0,
    reviews: 0,
  };
  const { data, error } = await supabase
    .from("gigs")
    .insert(newGig)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateGig = async (gigId: string, updates: any) => {
  const { data, error } = await supabase
    .from("gigs")
    .update(updates)
    .eq("id", gigId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Mock data for homepage
export const getJobCategories = () => {
  return [
    { id: "in-demand", name: "In Demand", icon: "🔥" },
    { id: "high-pay", name: "High Pay", icon: "💰" },
    { id: "part-time", name: "Part-Time", icon: "⏰" },
    { id: "freelance", name: "Freelance", icon: "💼" },
    { id: "remote", name: "Remote", icon: "🏠" },
    { id: "new-jobs", name: "New Jobs", icon: "🆕" },
  ];
};

export const getTestimonials = () => {
  return [
    {
      id: "1",
      name: "Sarah Johnson",
      role: "Graphic Designer",
      review:
        "Found amazing freelance opportunities that perfectly match my skills. The platform is easy to use and connects me with great clients.",
      rating: 5,
      avatar: "/avatars/sarah.jpg",
    },
    {
      id: "2",
      name: "Mike Chen",
      role: "Web Developer",
      review:
        "As a freelancer, this platform has been a game-changer. I get paid quickly and the job quality is consistently high.",
      rating: 5,
      avatar: "/avatars/mike.jpg",
    },
    {
      id: "3",
      name: "Emma Davis",
      role: "Content Writer",
      review:
        "The variety of jobs available is incredible. I've been able to build a steady income stream through consistent, well-paying projects.",
      rating: 4,
      avatar: "/avatars/emma.jpg",
    },
  ];
};

export const getFeaturedJobs = async () => {
  // For now, return the latest gigs as featured jobs
  const gigs = await getGigs();
  return gigs.slice(0, 6).map((gig) => ({
    id: gig.id,
    title: gig.title,
    description: gig.description,
    budget: gig.price,
    jobType: gig.category,
    company: gig.userName,
    location: "Remote", // Mock location
    postedDate: "2 days ago", // Mock date
  }));
};

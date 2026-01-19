import { supabase } from "../lib/supabase";
import { mockGigs, mockUsers } from "../data/mockData";

export const getGigs = async () => {
  // Use mock data for development
  return mockGigs.map((gig) => {
    const mockUser = mockUsers.find((user) => user.id === gig.userId);
    return {
      ...gig,
      userName: mockUser?.name || gig.userName,
      userAvatar: mockUser?.avatar || gig.userAvatar,
      userId: gig.userId,
    };
  });
};

export const getGigById = async (id: string) => {
  // Use mock data for development
  const mockGig = mockGigs.find((gig) => gig.id === id);
  if (mockGig) {
    const mockUser = mockUsers.find((user) => user.id === mockGig.userId);
    return {
      ...mockGig,
      userName: mockUser?.name || mockGig.userName,
      userAvatar: mockUser?.avatar || mockGig.userAvatar,
      userId: mockGig.userId,
    };
  }

  throw new Error(`Gig with id ${id} not found`);
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
  return data;
};

export const sendMessage = async (message: any) => {
  const { data, error } = await supabase
    .from("messages")
    .insert(message)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const createOrder = async (order: any) => {
  // Simulate order creation (database not set up yet)
  console.log("Simulating order creation:", order);
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
  ];
};

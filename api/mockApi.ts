import { supabase } from "../lib/supabase";

export const getGigs = async () => {
  const { data, error } = await supabase
    .from("gigs")
    .select(
      `
      *,
      users!inner(name, avatar)
    `,
    )
    .order("id");

  if (error) throw error;

  // Transform to match mock data structure
  return data.map((gig) => ({
    ...gig,
    userName: gig.users.name,
    userAvatar: gig.users.avatar,
  }));
};

export const getGigById = async (id: string) => {
  const { data, error } = await supabase
    .from("gigs")
    .select(
      `
      *,
      users!inner(name, avatar)
    `,
    )
    .eq("id", id)
    .single();

  if (error) throw error;

  return {
    ...data,
    userName: data.users.name,
    userAvatar: data.users.avatar,
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

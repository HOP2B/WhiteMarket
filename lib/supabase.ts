import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper to get currently authenticated user's id (returns null if no user)
export async function getCurrentUserId(): Promise<string | null> {
	try {
		const { data, error } = await supabase.auth.getUser();
		if (error) return null;
		return data?.user?.id ?? null;
	} catch (err) {
		return null;
	}
}

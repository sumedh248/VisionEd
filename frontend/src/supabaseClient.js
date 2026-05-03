import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://dmbcwefbuhdmparaaivr.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtYmN3ZWZidWhkbXBhcmFhaXZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMzIxNDAsImV4cCI6MjA5MjcwODE0MH0.JLGI5PwsKHM-ZUi6xor6IsFVXHuj1zHOFqZoZVpan68";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const upsertCurrentUser = async (user) => {
  if (!user) return null;

  const fallbackProfile = {
    id: user.id,
    email: user.email,
    name:
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split("@")[0],
    profile_image: user.user_metadata?.avatar_url || null,
  };

  const { data: existing, error: fetchError } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (fetchError) throw fetchError;
  if (existing) return existing;

  // Check if email already exists (orphaned public user from deleted auth user)
  const { data: existingByEmail } = await supabase
    .from("users")
    .select("*")
    .eq("email", user.email)
    .maybeSingle();

  if (existingByEmail) {
    // Attempt to update the orphaned record's ID to the new auth user ID
    const { data: updated, error: updateError } = await supabase
      .from("users")
      .update({ id: user.id })
      .eq("email", user.email)
      .select()
      .maybeSingle();

    if (!updateError && updated) {
      return updated;
    } else {
      console.warn("Could not update orphaned user ID, attempting to delete and recreate.", updateError);
      // If update fails (e.g. due to FK constraints), try deleting the old record
      await supabase.from("users").delete().eq("email", user.email);
      // Proceed to insert new record below
    }
  }

  const { data, error } = await supabase
    .from("users")
    .insert(fallbackProfile)
    .select()
    .single();

  if (error) throw error;

  return data;
};

export const completeUserOnboarding = async (user, profile) => {
  if (!user) return null;

  const role = profile.role;
  const payload = {
    id: user.id,
    name:
      profile.name ||
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split("@")[0],
    email: user.email,
    role,
    profile_image: user.user_metadata?.avatar_url || null,
    current_class: role === "student" ? profile.current_class : null,
    interests: role === "student" ? profile.interests : null,
    graduation_year: role === "alumni" ? profile.graduation_year : null,
    current_company: role === "alumni" ? profile.current_company : null,
    job_role: role === "alumni" ? profile.job_role : null,
  };

  const { data, error } = await supabase
    .from("users")
    .upsert(payload)
    .select()
    .single();

  if (error) throw error;

  if (role === "alumni") {
    const alumniProfile = {
      user_id: user.id,
      college_id: profile.college_id,
      degree: profile.degree?.trim() || null,
      field_of_study: profile.field_of_study?.trim() || null,
    };

    const { data: existingAlumniProfile, error: fetchAlumniError } = await supabase
      .from("alumni_profiles")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (fetchAlumniError) throw fetchAlumniError;

    const alumniQuery = existingAlumniProfile
      ? supabase
          .from("alumni_profiles")
          .update(alumniProfile)
          .eq("id", existingAlumniProfile.id)
      : supabase.from("alumni_profiles").insert({
          ...alumniProfile,
          verified: false,
        });

    const { error: alumniError } = await alumniQuery;

    if (alumniError) throw alumniError;
  }

  return data;
};

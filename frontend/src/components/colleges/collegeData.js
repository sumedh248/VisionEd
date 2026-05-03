import { supabase } from "../../supabaseClient";

const COLLEGE_FIELDS = "id,name,location,description,website,image";

export const collegeSortOptions = [
  { value: "name-asc", label: "Name A-Z" },
  { value: "name-desc", label: "Name Z-A" },
  { value: "location-asc", label: "Location A-Z" },
  { value: "courses-desc", label: "Most courses" },
];

export function getCollegeImage(image) {
  return (
    image ||
    "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1400&q=80"
  );
}

export function sortColleges(colleges, sortBy) {
  const sorted = [...colleges];

  sorted.sort((a, b) => {
    if (sortBy === "name-desc") {
      return String(b.name || "").localeCompare(String(a.name || ""));
    }

    if (sortBy === "location-asc") {
      return String(a.location || "").localeCompare(String(b.location || ""));
    }

    if (sortBy === "courses-desc") {
      return (b.coursesCount || 0) - (a.coursesCount || 0);
    }

    return String(a.name || "").localeCompare(String(b.name || ""));
  });

  return sorted;
}

export async function fetchColleges() {
  const { data, error } = await supabase
    .from("colleges")
    .select(`${COLLEGE_FIELDS}, college_courses(id)`);

  if (error) throw error;

  return (data || []).map((college) => ({
    ...college,
    coursesCount: Array.isArray(college.college_courses)
      ? college.college_courses.length
      : 0,
  }));
}

export async function fetchCollegeDetails(collegeId) {
  const { data: college, error: collegeError } = await supabase
    .from("colleges")
    .select(COLLEGE_FIELDS)
    .eq("id", collegeId)
    .maybeSingle();

  if (collegeError) throw collegeError;

  if (!college) {
    return null;
  }

  const [{ data: courses, error: coursesError }, alumniResult] =
    await Promise.all([
      supabase
        .from("college_courses")
        .select("id,course_name,duration,career_id")
        .eq("college_id", collegeId)
        .order("course_name", { ascending: true }),
      supabase
        .from("alumni_profiles")
        .select(
          "id,user_id,degree,field_of_study,verified,users(name,email,profile_image,graduation_year,current_company,job_role)"
        )
        .eq("college_id", collegeId)
        .eq("verified", true)
        .order("verified", { ascending: false }),
    ]);

  if (coursesError) throw coursesError;

  let alumni = alumniResult.data || [];

  if (alumniResult.error) {
    alumni = await fetchAlumniWithUserFallback(collegeId);
  }

  return {
    ...college,
    courses: courses || [],
    alumni,
  };
}

async function fetchAlumniWithUserFallback(collegeId) {
  const { data: profiles, error } = await supabase
    .from("alumni_profiles")
    .select("id,user_id,degree,field_of_study,verified")
    .eq("college_id", collegeId)
    .eq("verified", true)
    .order("verified", { ascending: false });

  if (error) throw error;

  const userIds = [...new Set((profiles || []).map((profile) => profile.user_id))].filter(Boolean);

  if (!userIds.length) {
    return profiles || [];
  }

  const { data: users, error: usersError } = await supabase
    .from("users")
    .select("id,name,email,profile_image,graduation_year,current_company,job_role")
    .in("id", userIds);

  if (usersError) throw usersError;

  const usersById = new Map((users || []).map((user) => [user.id, user]));

  return (profiles || []).map((profile) => ({
    ...profile,
    users: usersById.get(profile.user_id) || null,
  }));
}

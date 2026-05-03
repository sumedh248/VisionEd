import { createClient } from '@supabase/supabase-js'

export const supabaseUrl = "https://dmbcwefbuhdmparaaivr.supabase.co"
export const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtYmN3ZWZidWhkbXBhcmFhaXZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMzIxNDAsImV4cCI6MjA5MjcwODE0MH0.JLGI5PwsKHM-ZUi6xor6IsFVXHuj1zHOFqZoZVpan68"

export const supabase = createClient(supabaseUrl, supabaseKey)

export const createSupabaseForToken = (accessToken) =>
  createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  })

create extension if not exists "uuid-ossp";

create table if not exists public.users (
  id uuid primary key default uuid_generate_v4(),
  name text,
  email text unique not null,
  role text check (role in ('student', 'alumni', 'admin')),
  profile_image text,

  current_class text,
  interests text[],

  graduation_year int,
  current_company text,
  job_role text,

  created_at timestamp default now()
);

alter table public.users disable row level security;

create table if not exists student_profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  age int not null,
  grade int not null check (grade in (1, 2)),
  avatar text,
  created_at timestamptz default now()
);

create table if not exists lessons (
  id text primary key,
  grade int not null check (grade in (1, 2)),
  lesson_order int not null,
  title text not null,
  description text not null,
  image_url text,
  audio_url text,
  video_url text
);

create table if not exists vocabulary_items (
  id text primary key,
  lesson_id text references lessons(id) on delete cascade,
  word text not null,
  meaning text not null,
  example text not null,
  image_url text,
  audio_url text
);

create table if not exists quiz_questions (
  id text primary key,
  lesson_id text references lessons(id) on delete cascade,
  question_type text not null,
  prompt text not null,
  options jsonb not null,
  answer text not null
);

create table if not exists student_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references student_profiles(id) on delete cascade,
  lesson_id text references lessons(id) on delete cascade,
  score int not null default 0,
  stars int not null default 0,
  attempts int not null default 0,
  completed boolean not null default false,
  last_study timestamptz default now(),
  unique(student_id, lesson_id)
);

create table if not exists quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references student_profiles(id) on delete cascade,
  lesson_id text references lessons(id) on delete cascade,
  score int not null,
  answers jsonb not null,
  created_at timestamptz default now()
);

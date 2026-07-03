# Hng dn deploy Vercel + Supabase

## 1. Supabase

1. To project mi trn Supabase.
2. M SQL Editor.
3. Chy file `supabase/migrations/001_initial_schema.sql`.
4. Chy file `supabase/seed/seed_lessons.sql`.
5. Copy `Project URL` v `anon public key`.

## 2. Vercel

1. y project ln GitHub.
2. Vo Vercel, chn `Add New Project`.
3. Import repository.
4. Thm bin mi trng:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Bm Deploy.

## Ghi ch MVP

Bn hin ti chy local bng seed trong `lib/seed-data.ts` v lu tin  bng `localStorage`.
V dng c nhn nn khng c ng nhp/mt khu. Khi ni Supabase tht, ch cn lu h s b v tin  hc.

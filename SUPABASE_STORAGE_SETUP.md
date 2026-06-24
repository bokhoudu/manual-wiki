# Supabase Storage Setup

Manual Wiki uses Supabase Storage for uploaded manual files.

## Bucket

- Bucket name: `manual-files`
- Start as a public bucket.
- Allowed files in the app: PDF, JPG, PNG, WEBP.
- Stored path format: `user_id/YYYY-MM-DD-random-file-name`.

## SQL

Run `supabase-schema.sql` in the Supabase SQL editor. It includes:

- `manuals.file_url`
- `manuals.file_path`
- `manuals.file_type`
- `manuals.file_name`
- `manual-files` bucket creation
- public read policy
- authenticated upload policy scoped to the user's own folder

## Private Bucket Later

The app stores both `file_url` and `file_path`.

For a private bucket later:

1. Change the bucket to private in Supabase.
2. Keep storing `file_path`.
3. Replace public URL display with signed URL generation from `file_path`.
4. Keep `file_url` nullable or use it only as a cached public URL while the bucket is public.

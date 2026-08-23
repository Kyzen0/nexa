-- 1. Add the column to the profiles table
ALTER TABLE public.profiles 
ADD COLUMN has_password BOOLEAN DEFAULT false;

-- 2. Backfill existing users
-- For any user that currently has a password hash in the internal auth.users table, set their profile to true
UPDATE public.profiles p
SET has_password = true
FROM auth.users u
WHERE p.id = u.id AND u.encrypted_password IS NOT NULL;

-- 3. Update the handle_new_user() trigger so new email/password signups get it set to true
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    new_workspace_id UUID;
    business_name TEXT;
    has_pwd BOOLEAN;
BEGIN
    -- Extract business_name from the user's metadata
    business_name := new.raw_user_meta_data->>'business_name';
    
    -- Fallback if the business_name wasn't provided for some reason
    IF business_name IS NULL OR business_name = '' THEN
        business_name := 'My Business';
    END IF;

    -- If they have an encrypted_password, they signed up with email/password
    has_pwd := new.encrypted_password IS NOT NULL;

    -- Generate a new UUID for the workspace
    new_workspace_id := gen_random_uuid();

    -- Create the new workspace row for this user
    INSERT INTO public.workspaces (id, name)
    VALUES (new_workspace_id, business_name);

    -- Create the profile linking the new user to their unique workspace
    INSERT INTO public.profiles (id, workspace_id, email, has_password)
    VALUES (
        new.id, 
        new_workspace_id, 
        new.email,
        has_pwd
    );
    
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

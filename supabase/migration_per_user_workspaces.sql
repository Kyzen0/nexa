-- Update the trigger function to create a unique workspace per new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    new_workspace_id UUID;
    business_name TEXT;
BEGIN
    -- Extract business_name from the user's metadata (passed via options.data during signUp)
    business_name := new.raw_user_meta_data->>'business_name';
    
    -- Fallback if the business_name wasn't provided for some reason
    IF business_name IS NULL OR business_name = '' THEN
        business_name := 'My Business';
    END IF;

    -- Generate a new UUID for the workspace
    new_workspace_id := gen_random_uuid();

    -- Create the new workspace row for this user
    INSERT INTO public.workspaces (id, name)
    VALUES (new_workspace_id, business_name);

    -- Create the profile linking the new user to their unique workspace
    INSERT INTO public.profiles (id, workspace_id, email)
    VALUES (
        new.id, 
        new_workspace_id, 
        new.email
    );
    
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

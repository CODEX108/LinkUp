'use server'

import { supabaseServerClient } from "@/supabase/supabaseServer"

export async function regiserWithEmail({email}:{email:string}){
    const supabase = await supabaseServerClient();
    const currentOrigin = process.env.NEXT_PUBLIC_CURRENT_ORIGIN;
    const response = await supabase.auth.signInWithOtp({
        email,
        options:{
            emailRedirectTo: process.env.NEXT_PUBLIC_CURRENT_ORIGIN
        }
    });

    return JSON.stringify(response);
}
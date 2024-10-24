"use client"
import Head from 'next/head';
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { BsSlack } from "react-icons/bs"
import { FcGoogle } from "react-icons/fc"
import { RxGithubLogo } from "react-icons/rx"
import { zodResolver } from "@hookform/resolvers/zod"
import { MdOutlineAutoAwesome } from "react-icons/md"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { z } from 'zod';

import { Input } from "@/components/ui/input"
import { Provider } from "@supabase/supabase-js"
import Typography from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
import { supabaseBrowserClient } from "@/supabase/supabaseClient"
import { regiserWithEmail } from "@/actions/register-with-email"
const AuthPage = () => {
  const [isAuthenticating,setisAuthenticating] = useState(false);

  const formSchema = z.object({
    email: z.string().email({ message: "Invalid Email" }).min(2, { message: "Email must be more than 2 characters" }),
  })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ' ',
    }
  });


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setisAuthenticating(true);
    const response = await regiserWithEmail(values);
    const {data,error} = JSON.parse(response);
    setisAuthenticating(false);
    if(error){
      console.warn('Sign in error',error);
      return;
    }
  }

  async function socialAuth(provider:Provider){
    setisAuthenticating(true);
    //use the supabase browser client
    await supabaseBrowserClient.auth.signInWithOAuth({
      provider,
      options:{
        redirectTo: `${location.origin}/auth/callback`,
      }
    });
    setisAuthenticating(false);
  }

  return (
    <div className="min-h-screen p-5 grid text-center place-content-center bg-white">
      <div className="max-w-[450px]">
        <div className="flex justify-center items-center gap-3 mb-4">
          <BsSlack size={30} />
          <Typography text="LinkUp" variant="h2" />
        </div>
        <Typography
          text="Sign in to LinkUp"
          variant="h2"
          className="mb-3"
        />
        <Typography
          text="We suggest using email address that you use at work"
          variant="p"
          className="mb-7 opacity-90"
        />

        <div className="flex flex-col space-y-4">
          <Button  
          onClick={()=>socialAuth('google')}
          disabled={isAuthenticating} variant="outline" className="py-6 bordee-2 flex space-x-3">
            <FcGoogle size={30} />
            <Typography
              className="text-xg"
              text="Sign in with Google"
              variant="p"
            />
          </Button>

          <Button
          onClick={()=>socialAuth('github')}
          disabled={isAuthenticating} variant="outline" className="py-6 bordee-2 flex space-x-3">
            <RxGithubLogo size={30} />
            <Typography
              className="text-xg"
              text="Sign in with Github"
              variant="p"
            />
          </Button>
        </div>
        <div>
          <div className="flex items-center my-6">
            <div className="mr-[10px] flex-1 border-t bg-neutral-300" />
            <Typography text="OR" variant="p" />
            <div className="ml-[10px] flex-1 border-t bg-neutral-300" />
          </div>
          {/* FORM */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <fieldset disabled={isAuthenticating}>
                <FormField control={form.control} name='email' render={({ field }) =>
                (<FormItem>
                  <FormControl>
                    <Input placeholder='name@work-email.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                )} />
                <Button variant='secondary'
                  className="bg-primary-dark hover:bg-primary-dark/90 w-full my-5 text-white"
                  type="submit" >
                  <Typography text="Sign In with Email" variant="p" />
                </Button>
                <div className="px-5 py-4 bg-gray-100 rounded-sm">
                  <div className="text-gray-500 flex items-center space-x-3">
                    <MdOutlineAutoAwesome />
                    <Typography text="We will email you a magic link for a password-free sign in" variant="p" />
                  </div>
                </div>
              </fieldset>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
export default AuthPage
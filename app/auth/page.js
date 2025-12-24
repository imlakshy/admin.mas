"use client";
import { useState } from "react";
import { supabase } from "@/lib/createSupabaseClient";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true);
    try {
      toast.promise(
        supabase.auth.signUp({
          email: email + "@mas.com",
          password,
          options: {
            data: {
              display_name: name
            }
          }
        }).then(({ error }) => {
          if (error) throw error;
        }),
        {
          loading: 'Registering...',
          success: 'Registered! Now you can log in.',
          error: (err) => `Error: ${err.message}`,
        }
      );
      setIsNewUser(false);
    } finally {
    setLoading(false);}

  };

  const handleLogin = async () => {
    setLoading(true);

    try {
      toast.promise(
        supabase.auth.signInWithPassword({
          email: email ? `${email}@mas.com` : email,
          password,
        }).then(
          ({ error }) => {
          if (error) throw error;
        }
      ),
        {
          loading: "Logging in...",
          success: "Logged in successfully!",
          error: (err) => err.message,
        }
      );
      router.push("/");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex">
      <div className="flex-0 sm:flex-2 md:flex-3 lg:flex-4 h-screen relative opacity-5">
        <Image src="/loginPage.jpeg" alt="Signup Illustration" fill className="object-cover" />
      </div>

      <div className="p-8 pt-20 flex flex-col gap-20 flex-2">
        <h1 className="text-4xl font-semibold text-white">Hey!<br />we need your credentials</h1>

        {isNewUser ?
          (<div>
            <div className="flex flex-col gap-8">
              <h1 className="font-extralight text-3xl text-white">Sign up</h1>

              <input type="text" id="name" placeholder="Name" className="border-b border-white font-light p-2" value={name} onChange={(e) => setName(e.target.value)} />

              <input type="text" id="username" placeholder="Username" className="border-b border-white font-light p-2" value={email} onChange={(e) => setEmail(e.target.value)} />

              <input type="password" id="password" placeholder="Password" className="border-b border-white font-light p-2" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button className="cursor-pointer hover:bg-gray-200 border p-2 bg-white text-black font-light" onClick={handleSignup}>Sign Up</button>
            </div>
            <button className="cursor-pointer hover:text-gray-400 border p-2 mt-2 text-white font-light w-full" onClick={() => setIsNewUser(false)}>Login</button>
          </div>)
          :
          (<div>
            <div className="flex flex-col gap-8">
              <h1 className="font-extralight text-3xl text-white">Log in</h1>

              <input type="text" id="username" placeholder="Username" className="border-b border-white font-light p-2" value={email} onChange={(e) => setEmail(e.target.value)} />

              <input type="password" id="password" placeholder="Password" className="border-b border-white font-light p-2" value={password} onChange={(e) => setPassword(e.target.value)} />

              <button className={`cursor-pointer hover:bg-gray-300 border p-2 bg-white text-black font-light`} onClick={handleLogin}>Log In</button>
            </div>
            <button className="cursor-pointer hover:text-gray-400 border p-2 mt-2 text-white font-light w-full" onClick={() => setIsNewUser(true)}>Register</button>
          </div>)
        }




      </div>
    </div>
  );
}

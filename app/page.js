"use client";
import ToggleStorageIcon from "@/public/ToggleStorageIcon";
import TagProductIcon from "@/public/TagProductIcon";
import AddCircleIcon from "@/public/AddCircleIcon";
import CubeAnalyticsIcon from "@/public/CubeAnalyticsIcon";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CountUp from 'react-countup';
import { supabase } from "@/lib/createSupabaseClient";
import { LogOut } from "lucide-react";

export default function Home() {

  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("User");

  useEffect(() => {
    let mounted = true;

  const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!mounted) return;

      if (!session) {
        router.push("/auth");
        return;
      }

      setName(session.user.user_metadata?.display_name || "User");
      setMounted(true);
    };

    // Check session immediately
    checkSession();

    // Also listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_IN' && session) {
        setName(session.user.user_metadata?.display_name || "User");
        setMounted(true);
      } else if (event === 'SIGNED_OUT' || !session) {
        router.push("/auth");
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router]);


  const overviewData = [{
    title: "Fullfilled Product",
    value: "150",
    description: "Orders successfully delivered this month"
  }, {
    title: "Pending Order",
    value: "13",
    description: "Orders awaiting shipment this month"
  }, {
    title: "Total User",
    value: "789",
    description: "Total earnings generated in the current month"
  }, {
    title: "Total Revenue",
    value: "231000",
    prefix: "₹",
    description: "Total earnings generated in the current month"
  }]

  const quickActions = [{
    title: "Add Product",
    description: "Add a new product to the inventory",
    icon: AddCircleIcon,
    route: () => router.push('/addProduct')

  }, {
    title: "Edit Product",
    description: "Modify existing product details",
    icon: CubeAnalyticsIcon,
    route: () => router.push('/products')

  }, {
    title: "Manage Category",
    description: "Modify existing product category",
    icon: ToggleStorageIcon,
    route: () => router.push('/category')

  }, {
    title: "Create Coupon",
    description: "Generate a new discount coupon",
    icon: TagProductIcon,
    route: () => router.push('/coupon')

  }]

  return (
    <div className={`transition-all duration-1000 ease-out
    ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>

      {/* Navbar */}
      <div className="flex flex-col md:flex-row justify-between mx-10 md:mx-20 lg:mx-30 mt-10 md:mt-32">
        <div className="flex flex-col justify-center">
          <span className="text-2xl md:text-[48px] font-light">Hey 👋</span>
          <span className="text-[48px] md:text-[96px] font-extrabold">{name}!</span>
        </div>

        <div className="flex gap-2">
          <p className="font-light  text-gray-400">Admin</p>
          <LogOut className="mt-1 cursor-pointer" size={20} onClick={async () => {
            await supabase.auth.signOut();
            router.push('/auth');
          }} />
        </div>
      </div>

      {/* Stats Overview */}
      <div className="flex flex-wrap w-screen p-4 md:p-8">
        {overviewData.map((item, index) => (
          <div key={index} className="card">
            <span className="text-base line-clamp-1 pb-1 block">{item.title}</span>
            <span className="text-2xl md:text-3xl lg:text-5xl"><CountUp end={item.value} duration={0.7} prefix={item.prefix || ""} formattingFn={(value) =>
              value >= 1000 ? `${item.prefix}${Math.floor(value / 1000)}k` : value
            } />
            </span>
            <span className="text-gray-500 text-sm mt-3 line-clamp-2">{item.description}</span>
          </div>
        ))}
      </div>


      {/* Quick Actions */}
      <span className="px-6 md:px-10 text-3xl font-semibold">Quick Actions: </span>
      <div className="flex flex-wrap w-screen px-4 md:px-8">
        {quickActions.map((action, index) => (
          <div key={index} className="quick-action-card" onClick={action.route}>
            <div className="qa-icon">
              <action.icon />
            </div>
            <span className="text-base truncate">{action.title}</span>
            <span className="text-gray-500 text-sm line-clamp-2">{action.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
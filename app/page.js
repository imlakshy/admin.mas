"use client";
import ToggleStorageIcon from "@/public/ToggleStorageIcon";
import TagProductIcon from "@/public/TagProductIcon";
import AddCircleIcon from "@/public/AddCircleIcon";
import CubeAnalyticsIcon from "@/public/CubeAnalyticsIcon";
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();

  const overviewData = [{
    title: "Fullfilled Product",
    value: "150",
    description: "Orders successfully completed and delivered this month"
  }, {
    title: "Pending Order",
    value: "13",
    description: "Orders awaiting processing or shipment this month"
  }, {
    title: "Total User",
    value: "789",
    description: "Total earnings generated in the current month"
  }, {
    title: "Total Revenue",
    value: "₹231K",
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
    title: "Add Category",
    description: "Create a new product category",
    icon: ToggleStorageIcon,
    route: () => router.push('/category')

  }, {
    title: "Create Coupon",
    description: "Generate a new discount coupon",
    icon: TagProductIcon,
    route: () => router.push('/coupon')

  }]

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between mx-10 md:mx-20 lg:mx-30 mt-10 md:mt-32">
        <div className="greet flex flex-col justify-center">
          <span className="text-2xl md:text-[48px] font-light">Hey 👋</span>

          <span className="text-[48px] md:text-[96px] font-extrabold">Lakshya!</span>
        </div>

        <div className="flex gap-2">
          <p className="font-light  text-gray-400">Admin</p>

          <div className="w-6 h-6"><svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0" />

            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <g id="SVGRepo_iconCarrier">
              <path
                d="M16 17L21 12M21 12L16 7M21 12H9M12 17C12 17.93 12 18.395 11.8978 18.7765C11.6204 19.8117 10.8117 20.6204 9.77646 20.8978C9.39496 21 8.92997 21 8 21H7.5C6.10218 21 5.40326 21 4.85195 20.7716C4.11687 20.4672 3.53284 19.8831 3.22836 19.1481C3 18.5967 3 17.8978 3 16.5V7.5C3 6.10217 3 5.40326 3.22836 4.85195C3.53284 4.11687 4.11687 3.53284 4.85195 3.22836C5.40326 3 6.10218 3 7.5 3H8C8.92997 3 9.39496 3 9.77646 3.10222C10.8117 3.37962 11.6204 4.18827 11.8978 5.22354C12 5.60504 12 6.07003 12 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </svg></div>

        </div>
      </div>


      <div className="flex flex-wrap w-screen p-4 md:p-8">
        {overviewData.map((item, index) => (
          <div key={index} className="card">
            <span className="text-base">{item.title}</span>
            <span className="text-5xl">{item.value}</span>
            <span className="text-gray-500 text-sm mt-3 hidden md:inline">{item.description}</span>
          </div>
        ))}
      </div>


      <span className="px-6 md:px-10 text-3xl font-semibold">Quick Actions: </span>
      <div className="flex flex-wrap w-screen px-4 md:px-8">
        {quickActions.map((action, index) => (
          <div key={index} className="quick-action-card" onClick={action.route}>
            <action.icon size={20} md:size={50} />
            <span className="text-xl">{action.title}</span>
            <span className="text-gray-500 text-sm hidden md:inline">{action.description}</span>
          </div>
        ))}
      </div>
    </>
  );
}

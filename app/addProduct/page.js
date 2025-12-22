"use client"
import React from 'react'
import { ArrowLeft, ArrowRight, Package, Tag, User, GalleryHorizontalEnd } from 'lucide-react'
import { useState, useEffect } from 'react'
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { supabase } from "../../lib/createSupabaseClient";
import { getImgUrl } from '../../lib/getImgUrl';


const AddProduct = () => {

  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const StockImages = ["/Images/image_1.jpg", "/Images/image_2.jpg", "/Images/image_3.jpg",];

  const [form, setForm] = useState({
    brand: "",
    name: "",
    description: "",
    cost: "",
    price: "",
    stock: "",
    gender: "",
    category: "",
    images: [],
  });

  const CATEGORY_MAP = {
    men: [
      "T-Shirt",
      "Oversized T-Shirt",
      "Polo T-Shirt",
      "Shirt",
      "Casual Shirt",
      "Formal Shirt",
      "Denim Shirt",
      "Hoodie",
      "Zip Hoodie",
      "Sweatshirt",
      "Jacket",
      "Denim Jacket",
      "Bomber Jacket",
      "Blazer",
      "Pullover",
      "Sweater",
      "Kurta",
      "Track Pants",
      "Joggers",
      "Cargo Pants",
      "Jeans",
      "Chinos",
      "Shorts",
      "Co-ord Set",
    ],

    women: [
      "Top",
      "Crop Top",
      "T-Shirt",
      "Oversized T-Shirt",
      "Shirt",
      "Blouse",
      "Kurti",
      "Anarkali Kurti",
      "Dress",
      "Maxi Dress",
      "Midi Dress",
      "Bodycon Dress",
      "Hoodie",
      "Zip Hoodie",
      "Sweatshirt",
      "Jacket",
      "Shrug",
      "Cardigan",
      "Sweater",
      "Co-ord Set",
      "Skirt",
      "Palazzo",
      "Leggings",
      "Jeans",
      "Wide Leg Pants",
      "Cargo Pants",
    ],

    kids: [
      "T-Shirt",
      "Printed T-Shirt",
      "Shirt",
      "Hoodie",
      "Sweatshirt",
      "Jacket",
      "Dress",
      "Frock",
      "Shorts",
      "Track Pants",
      "Joggers",
      "Jeans",
      "Co-ord Set",
      "Nightwear",
    ],
    unisex: [
      "T-Shirt",
      "Oversized T-Shirt",
      "Graphic T-Shirt",
      "Hoodie",
      "Zip Hoodie",
      "Sweatshirt",
      "Jacket",
      "Windcheater",
      "Track Pants",
      "Joggers",
      "Shorts",
      "Co-ord Set",
      "Loungewear",
    ],
  };

  const canSave = Object.values(form).every(v =>
    Array.isArray(v) ? v.length > 0 : String(v).trim() !== ""
  );

  const canShowButton = Object.values({
    brand: form.brand.trim(),
    name: form.name.trim(),
    description: form.description.trim(),
    cost: form.cost,
    price: form.price,
    stock: form.stock,
    gender: form.gender,
    category: form.category,
  }).some(Boolean) || form.images.length > 0;

  const hasDiscount = form.cost !== "" && form.price !== "" && form.price < form.cost;
  const discountPercent =
    hasDiscount ? Math.round(((form.cost - form.price) / form.cost) * 100) : 0;

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);

    // limit to 5 images
    const remainingSlots = 5 - form.images.length;
    const selectedFiles = files.slice(0, remainingSlots);

    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ...selectedFiles],
    }));

  };

  const saveProduct = async () => {
    try {
      if (!form.images.length) return;

      const urls = await Promise.all(
        form.images.map((file) => getImgUrl(file))
      );
      const { error } = await supabase
        .from("products")
        .insert([
          {
            brand: form.brand,
            name: form.name,
            description: form.description,
            cost: form.cost,
            price: form.price,
            stock: form.stock,
            gender: form.gender,
            category: form.category,
            images: urls,
          },
        ]);

      if (error) throw error;
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  const [showOptions, setShowOptions] = useState(false);
  const filteredCategories =
    form.gender && form.category
      ? CATEGORY_MAP[form.gender].filter((item) =>
        item.toLowerCase().includes(form.category.toLowerCase())
      )
      : form.gender
        ? CATEGORY_MAP[form.gender]
        : [];


  return (
    <div className={`transition-all duration-1000 ease-out
    ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
      <div className='mx-6 lg:mx-12'>
        {/* Navbar Placeholder */}
        <div className='flex items-center justify-between mt-10 lg:mt-25 mb-10'>
          <div className='flex gap-4 items-center'>
            <ArrowLeft className='h-5 md:h-7 lg:h-10 w-5 md:w-7 lg:w-10 cursor-pointer' onClick={() => router.push('/')} />
            <h1 className='text-2xl md:text-3xl lg:text-5xl font-semibold'>Add new product</h1>
          </div>

          <button
            onClick={() => {
              if (canSave) {
                toast.promise(
                  saveProduct().then(() => setTimeout(() => {
                    setMounted(false);
                    setTimeout(() => {
                      router.push('/');
                    }, 300);
                  }, 500)
                  ),
                  {
                    loading: "Saving product...",
                    success: "Product saved successfully!",
                    error: (err) => err.message,
                  }
                );

              } else {
                toast.error("Please fill all the fields correctly!");
              }
            }}
            className={`flex gap-2 px-6 py-3 rounded-xl transition ${canSave ? "border-white border-2 cursor-pointer hover:text-black hover:bg-white" : `${canShowButton ? "border-gray-500 border-2 text-gray-500 cursor-not-allowed hover:text-red-600 hover:border-red-600" : "hidden"}`}`}>
            Save Product {canSave && <ArrowRight className='h-5 w-5 mt-0.5' />}
          </button>

        </div>

        {/* Main Content */}
        <div className='flex gap-4 lg:gap-8 flex-col lg:flex-row'>

          {/* Product detail form */}
          <form className='flex flex-col gap-2 lg:w-1/2'>
            <input type="text" placeholder="Which Brand?" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className={`text-xl`} />

            <input type="text" placeholder='Product Name' value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className='text-3xl font-semibold' />

            <textarea placeholder='Tell something about the product!' value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className='h-30 lg:h-50 text-gray-400' />


            <div className="flex items-center gap-1">
              {form.cost !== "" && (
                <span className={`text-xl text-gray-500 ${hasDiscount ? "line-through" : ""}`}>₹</span>)}

              <input
                type="number"
                placeholder="What's the cost?"
                value={form.cost}
                onChange={(e) =>
                  setForm({ ...form, cost: e.target.value === "" ? "" : Number(e.target.value) })
                }
                className={`placeholder:text-base text-xl bg-transparent focus:outline-none ${hasDiscount ? "line-through text-gray-500" : ""
                  }`}
              />
            </div>

            <div className="inline-flex items-baseline mt-2">
              {form.price !== "" && <span className="text-4xl">₹</span>}

              <input
                type="number"
                placeholder="Price?"
                value={form.price}
                max={form.cost || undefined}
                onChange={(e) => {
                  const val = e.target.value === "" ? "" : Number(e.target.value);
                  if (val === "" || form.cost === "" || val <= form.cost) {
                    setForm({ ...form, price: val });
                  }
                }}
                className="text-4xl font-semibold bg-transparent focus:outline-none w-30"
              />

              {hasDiscount && (
                <div className="font-semibold text-red-500">
                  {discountPercent}% OFF
                </div>
              )}
            </div>

            <div className='flex gap-2 items-center pt-4'>
              <span className={`text-xl text-gray-500 ${form.stock === "" ? "hidden" : "block"}`}><Package /></span>

              <input type="number" placeholder='How many units?' value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className='' />
            </div>

            <div className='flex gap-2 items-center'>
              <span className={`text-xl text-gray-500 ${form.gender === "" ? "hidden" : "block"}`}><User /></span>
              <select
                value={form.gender}
                onChange={(e) =>
                  setForm({ ...form, gender: e.target.value })
                }
                className={`appearance-none leading-none p-0 m-0 ${!form.gender ? "text-[#787B7F]" : ""}`}
              >
                <option value="" disabled>
                  For whom?
                </option>
                <option value="men">Men's</option>
                <option value="women">Women's</option>
                <option value="kids">Kid's</option>
                <option value="unisex">Unisex</option>
              </select>

            </div>

            {form.gender && (<div className='flex gap-2 items-center'>
              <span className={`text-xl text-gray-500 ${form.category === "" ? "hidden" : "block"}`}><Tag /></span>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Type?"
                  value={form.category}
                  onChange={(e) => {
                    setForm({ ...form, category: e.target.value });
                    setShowOptions(true);
                  }}
                  onFocus={() => setShowOptions(true)}

                />

                {showOptions && filteredCategories.length > 0 && (
                  <ul className="absolute z-10 w-full rounded bg-white/10 mt-1 max-h-40 overflow-y-auto">
                    {filteredCategories.map((item) => (
                      <li
                        key={item}
                        onClick={() => {
                          setForm({
                            ...form,
                            category: item,
                          });
                          setShowOptions(false);
                        }}
                        className="px-3 py-2 cursor-pointer hover:bg-gray-700"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

            </div>)}
          </form>

          {/* Image Upload Section */}
          <div className='lg:w-1/2 rounded-2xl h-135 w-260 max-w-full lg:mb-0 mb-24 flex gap-4 overflow-y-scroll' onClick={() => document.getElementById('imgInput').click()}>
            <input type="file" accept="image/*" multiple id='imgInput' className='hidden' onChange={handleImageSelect} />

            {form.images.length === 0 ? (
              <div className='relative flex justify-center items-center'>
                <div className='opacity-4 flex gap-4 overflow-hidden rounded-2xl'>
                  {StockImages.map((src, index) => (
                    <Image
                      key={index}
                      src={src}
                      alt={`Product Image ${index + 1}`}
                      width={300}
                      height={300}
                      className="mb-4 rounded-lg"
                    />
                  ))}
                </div>

                <div className='absolute w-100 h-50 flex flex-col items-center text-white'>
                  <GalleryHorizontalEnd className='h-10 w-10 m-auto' />
                  Show how it looks!
                </div>
              </div>) : (
              <div className='flex w-full gap-4 overflow-y-scroll'>
                {form.images.map((src, index) => (
                  <div key={index} className="relative h-full aspect-2/3  shrink-0 rounded-3xl overflow-hidden">
                    <Image
                      key={index}
                      src={URL.createObjectURL(src)}
                      alt={`Product Image ${index + 1}`}
                      fill
                      className="object-cover object-center cursor-pointer"
                    />
                  </div>
                ))}

              </div>
            )
            }

          </div>

        </div>
      </div>
    </div >)
}

export default AddProduct

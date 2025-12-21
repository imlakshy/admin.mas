"use client"
import React from 'react'
import { ArrowLeft, Package, Tag, User, GalleryHorizontalEnd } from 'lucide-react'
import { useState, useEffect } from 'react'
import Image from "next/image";


const AddProduct = () => {

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [form, setForm] = useState({
    uid: 211212001,
    brand: "",
    name: "",
    description: "",
    cost: "",
    price: "",
    stock: "",
    gender: "",
    category: "",
    StockImages: [
      "/Images/image_1.jpg",
      "/Images/image_2.jpg",
      "/Images/image_3.jpg",],
    images: [],
  });

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


  return (<div className={`transition-all duration-500 ease-out
    ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>

    <div className='mx-12'>
      <div className='flex gap-4 items-center mt-25 mb-10'>
        <ArrowLeft className='h-5 md:h-7 lg:h-10 w-5 md:w-7 lg:w-10 cursor-pointer' />
        <h1 className='text-2xl md:text-3xl lg:text-5xl font-semibold'>Add new product</h1>
      </div>

      <div className='flex gap-4 lg:gap-8 flex-col lg:flex-row'>
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
              className={`text-xl bg-transparent focus:outline-none ${hasDiscount ? "line-through text-gray-500" : ""
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
            <input type="text" placeholder='For whom?' value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className='' />
          </div>

          <div className='flex gap-2 items-center'>
            <span className={`text-xl text-gray-500 ${form.category === "" ? "hidden" : "block"}`}><Tag /></span>

            <input type="text" placeholder='Type?' value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className='' />
          </div>
        </form>

        <div className='w-full lg:w-1/2 p-4 rounded-2xl' onClick={() => document.getElementById('imgInput').click()}>

          <input type="file" multiple id='imgInput' className='hidden' onChange={handleImageSelect} />

          {form.images.length === 0 ? (
            <div className='relative flex justify-center items-center'>
              <div className='opacity-4 flex gap-4 overflow-hidden rounded-2xl'>
                {form.StockImages.map((src, index) => (
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
            <div className='flex gap-4 overflow-y-scroll'>
              {form.images.map((src, index) => (
                <Image
                  key={index}
                  src={URL.createObjectURL(src)}
                  alt={`Product Image ${index + 1}`}
                  width={300}
                  height={300}
                  className="mb-4 rounded-lg"
                />
              ))}
            </div>
          )
          }

        </div>

      </div>
    </div>
  </div>)
}

export default AddProduct

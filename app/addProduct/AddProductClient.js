"use client";
import React, { use } from 'react'
import { ArrowLeft, ArrowRight, Package, Tag, User, GalleryHorizontalEnd, Star, X, Plus } from 'lucide-react'
import { useState, useEffect } from 'react'
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { supabase } from "@/lib/createSupabaseClient";
import { getImgUrl } from "@/lib/getImgUrl";
import { useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";

const AddProductClient = () => {

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/auth");
        return;
      }
    };
    checkAuth();
    return () => { };
  }, []);


  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  const [colorInput, setColorInput] = useState("");


  useEffect(() => {
    if (productId) fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();

    if (!error) {
      setForm({
        brand: data.brand ?? "",
        name: data.name ?? "",
        description: data.description ?? "",
        cost: data.cost ?? "",
        price: data.price ?? "",
        stock: data.stock ?? "",
        gender: data.gender ?? "",
        category: data.category ?? "",
        sizes: data.sizes ?? ["S", "M", "L", "XL", "XXL"],
        color: data.color === null ? [] : (Array.isArray(data.color) ? data.color : (data.color ? [data.color] : [])),
        images: data.images ?? [],
      });
    }
  };
  const isEdit = Boolean(productId);

  const handleSave = async () => {
    const payload = {
      brand: form.brand,
      name: form.name,
      description: form.description,
      cost: form.cost,
      price: form.price,
      stock: form.stock,
      gender: form.gender,
      category: form.category,
      sizes: form.sizes,
      colors: form.color,
      images: form.images,
    };

    const query = supabase.from("products").update(payload).eq("id", productId)

    toast.promise(query, {
      loading: "Updating product…",
      success: "Product updated!",
      error: "Something went wrong!",
    });

    const { error } = await query;
    if (!error) {
      setTimeout(() => {
        setMounted(false);
        setTimeout(() => {
          router.push('/');
        }, 300);
      }, 500)
    }
  };

  const getImageSrc = (img) => {
    if (img instanceof File) {
      return URL.createObjectURL(img);
    }
    return img;
  };

  const makePrimary = (index) => {
    setForm((prev) => {
      const imgs = [...prev.images];
      const selected = imgs.splice(index, 1)[0];
      return {
        ...prev,
        images: [selected, ...imgs],
      };
    });
  };

  const removeImage = (index) => {
    setForm((prev) => {
      const newImages = prev.images.filter((_, i) => i !== index);
      return {
        ...prev,
        images: newImages,
      };
    });
  };

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
    sizes: ["S", "M", "L", "XL", "XXL"],
    color: [],
    images: [],
  });

  const CATEGORY_MAP = {
    Men: [
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
    Women: [
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
    Kids: [
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
    Unisex: [
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

  const canSave = Object.entries(form).every(([key, v]) => {
    if (key === 'sizes') {
      return Array.isArray(v) && v.length > 0;
    }
    if (key === 'color') {
      return Array.isArray(v);
    }
    return Array.isArray(v) ? v.length > 0 : String(v).trim() !== "";
  });

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

    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
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
            sizes: form.sizes,
            colors: form.color,
            images: urls,
          },
        ]);

      if (error) throw error;
    } catch (err) {
      toast.error("Save failed:");
    }
  };

  const [showOptions, setShowOptions] = useState(false);
  const filteredCategories = form.gender && form.category
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
            <ArrowLeft className='h-5 md:h-7 lg:h-10 w-5 md:w-7 lg:w-10 cursor-pointer'
              onClick={() => { isEdit ? router.push('/products') : router.push('/') }} />
            <h1 className='text-2xl md:text-3xl lg:text-5xl font-semibold'>{isEdit ? "Update" : "Add a new"} product</h1>
          </div>

          <button
            onClick={() => {
              if (isEdit) {
                handleSave();
                return;
              }

              if (canSave) {
                toast.promise(
                  saveProduct().then(() => setTimeout(() => {
                    setMounted(false);
                    setTimeout(() => {
                      router.push('/products');
                    }, 300);
                  }, 500)
                  ),
                  {
                    loading: "Adding product...",
                    success: "Product added successfully!",
                    error: (err) => err.message,
                  }
                );

              } else {
                toast.error("Please fill all the fields correctly!");
              }
            }}
            className={`flex gap-2 px-6 py-3 rounded-xl transition ${canSave ? "border-white border-2 cursor-pointer hover:text-black hover:bg-white" : `${canShowButton ? "border-gray-500 border-2 text-gray-500 cursor-not-allowed hover:text-red-600 hover:border-red-600" : "hidden"}`}`}>
            {isEdit ? "Update" : "Add"} Product {canSave && <ArrowRight className='h-5 w-5 mt-0.5' />}
          </button>

        </div>

        {/* Main Content */}
        <div className='flex gap-4 lg:gap-8 flex-col lg:flex-row'>

          {/* Product detail form */}
          <form className='flex flex-col gap-2 lg:w-1/2 pb-10'>
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

            <div className="inline-flex items-baseline">
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

            <div className='flex gap-2 items-center'>
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
                <option value="Men">Men's</option>
                <option value="Women">Women's</option>
                <option value="Kids">Kid's</option>
                <option value="Unisex">Unisex</option>
              </select>

            </div>

            {form.gender && (
              <div className='flex gap-2 items-center mb-4'>
                <span className={`text-xl text-gray-500 ${form.category === "" ? "hidden" : "block"}`}>
                  <Tag />
                </span>

                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Type?"
                    value={form.category}
                    onChange={(e) => {
                      setForm({ ...form, category: e.target.value });
                      setShowOptions(true);
                    }}
                    onFocus={() => setShowOptions(true)}
                    onBlur={() => {
                      setTimeout(() => setShowOptions(false), 200);
                    }}
                    className="w-full text-xl"
                  />

                  {showOptions && filteredCategories.length > 0 && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowOptions(false)}
                      />
                      <ul className="absolute z-20 w-full rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 mt-2 max-h-48 overflow-y-auto shadow-lg">
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
                            className="px-4 py-2.5 cursor-pointer hover:bg-white/20 transition-colors border-b border-white/5 last:border-b-0"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            )}

            {form.category && (
              <div className='flex gap-2 items-center flex-wrap'>
                <span className={`text-xl text-gray-500 ${form.sizes.length === 0 ? "hidden" : "block"}`}>Sizes:</span>
                <div className="flex gap-4 items-center">
                  {["S", "M", "L", "XL", "XXL"].map((size) => (
                    <label key={size} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.sizes.includes(size)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setForm({
                              ...form,
                              sizes: [...form.sizes, size],
                            });
                          } else {
                            setForm({
                              ...form,
                              sizes: form.sizes.filter((s) => s !== size),
                            });
                          }
                        }}
                        className="w-4 h-4 cursor-pointer"
                      />
                      <span className="text-lg">{size}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {form.category && (
              <div className="flex gap-2 items-center flex-wrap">
                <input
                  type="text"
                  placeholder="Color?"
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();

                      const value = colorInput.trim();
                      if (!value) return;
                      if (form.color.some(c => c.toLowerCase() === value.toLowerCase())) return;

                      setForm({
                        ...form,
                        color: [...form.color, value],
                      });

                      setColorInput("");
                    }
                  }}
                  className="text-xl bg-transparent outline-none"
                />

                {form.color.length > 0 && (
                  <div className="flex gap-2 flex-wrap items-center">
                    <span className="text-gray-500">Colors:</span>
                    {form.color.map((color, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-700 rounded text-sm"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

          </form>

          {/* Image Upload Section */}
          <div className='lg:w-1/2 rounded-2xl h-135 w-260 max-w-full lg:mb-0 mb-6 flex gap-4 overflow-y-scroll'>
            <input type="file" accept="image/*" multiple id='imgInput' className='hidden' onChange={handleImageSelect} />

            {form.images.length === 0 ? (
              <div className='relative flex justify-center items-center cursor-pointer' onClick={() => document.getElementById('imgInput').click()}>
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
                  <div
                    key={index}
                    className="relative h-full aspect-2/3 shrink-0 rounded-3xl overflow-hidden group cursor-pointer"
                    onClick={() => {
                      if (index !== 0) {
                        makePrimary(index);
                      }
                    }}
                  >
                    {/* Image */}
                    <Image
                      src={getImageSrc(src)}
                      alt={`Product Image ${index + 1}`}
                      fill
                      className="object-cover object-center"
                      unoptimized
                    />

                    {/* Primary Badge */}
                    {index === 0 && (
                      <div className="absolute top-2 left-2 bg-amber-500 text-black text-xs px-2 py-1 rounded-full flex items-center gap-1 z-20">
                        <Star className="h-3 w-3 fill-black" />
                        <span>Primary</span>
                      </div>
                    )}

                    <div className="absolute top-2 right-2 flex gap-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Make Primary Button */}
                      {index !== 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            makePrimary(index);
                          }}
                          className="bg-white/90 hover:bg-white text-black p-1.5 rounded-full shadow-lg transition-all hover:scale-110"
                          title="Make Primary"
                        >
                          <Star className="h-4 w-4" />
                        </button>
                      )}

                      {/* Remove Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
                        className="bg-red-500/90 hover:bg-red-600 text-white p-1.5 rounded-full shadow-lg transition-all hover:scale-110"
                        title="Remove Image"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Add More Card */}
                <div
                  className="relative h-full aspect-2/3 shrink-0 rounded-3xl overflow-hidden border-2 border-dashed border-white/30 hover:border-white/50 transition-all cursor-pointer flex items-center justify-center bg-white/5 hover:bg-white/10"
                  onClick={() => document.getElementById('imgInput').click()}
                >
                  <div className="flex flex-col items-center gap-2 text-white/70 hover:text-white transition-colors">
                    <Plus className="h-8 w-8" />
                    <span className="text-sm">Add More</span>
                  </div>
                </div>
              </div>
            )
            }

          </div>

        </div>
      </div>
    </div >)
}

export default AddProductClient
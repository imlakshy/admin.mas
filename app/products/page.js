"use client";
import React from 'react'
import { useState, useEffect } from 'react';
import { supabase } from "@/lib/createSupabaseClient";
import Image from 'next/image';
import { ArrowLeft, PencilLine, Trash, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const EditProduct = () => {

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push("/auth");
      }
    });
  }, []);

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    fetchProducts().then((data) => { setProducts(data); setLoading(false); });
  }, []);

  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return [];
    }

    return data;
  };

  const deleteProduct = async (productId) => {
    const deletePromise = supabase
      .from("products")
      .delete()
      .eq("id", productId);

    toast.promise(deletePromise, {
      loading: "Deleting product…",
      success: "Product deleted successfully",
      error: "Failed to delete product",
    });

    const { error } = await deletePromise;

    if (!error) {
      fetchProducts().then((data) => { setProducts(data); });
    }
  };


  const confirmDelete = (product) => {
    toast(
      `Delete "${product.brand} - ${product.name}"?`,
      {
        description: "This action cannot be undone.",
        action: {
          label: "Delete",
          onClick: () => deleteProduct(product.id),
        },
        cancel: {
          label: "Cancel",
        },
      }
    );
  };


  return (<div className={`transition-all duration-1000 ease-out
    ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>

    <div className='mx-4 lg:mx-12'>
      {/* Navbar */}
      <div className='flex items-center gap-2 mt-10 lg:mt-25'>
        <ArrowLeft className='h-5 md:h-7 lg:h-10 w-5 md:w-7 lg:w-10 cursor-pointer' onClick={() => router.push('/')} />

        <h1 className='text-2xl md:text-3xl lg:text-5xl font-semibold'>Manage Products</h1>
      </div>

      {/* Table */}
      {products.length === 0 ? (
        <div className="text-center text-gray-400 py-12">
          {loading ? 'Loading products...' : `No products yet. Add product to get started.`}
        </div>
      )
        :
        (<div className="relative overflow-x-auto">
          {/* Filters */}
          <div className='flex items-center gap-2 my-4 font-light flex-wrap'>
            <div className='shrink-0 p-2 bg-white/10 flex items-center'>Stocks &lt; <input type="number" placeholder='5' className='border-b w-9 text-center' /></div>

            <div className='shrink-0 p-2 bg-white/10 flex items-center'>Discount &gt; <input type="number" placeholder='50' className='border-b w-9 text-center' />%</div>

            <div className='shrink-0 p-2 bg-white/10 flex items-center'>Gender</div>

            <input type="text" placeholder='Search...' className='flex-1 border border-gray-500 p-2 max-w-full w-auto rounded-full' />
          </div>

          <table className="w-full min-w-210 border-collapse">
            <thead>
              <tr className="bg-white/10">
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Brand</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Gender</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Discount</th>
                <th className="p-3 text-left">Stock</th>
                <th className="p-3 text-left"></th>
                <th className="text-left"><RotateCcw className='h-6 w-6 cursor-pointer hover:-rotate-360 transition-all duration-1000' onClick={() => {
                  fetchProducts().then((data) => { setProducts(data); });
                }} /></th>
              </tr>
            </thead>

            {products.map((product) => (
              <tbody key={product.id}>
                <tr className="border-t border-white/10">
                  <td className="p-3"><Image src={product.images[0]} unoptimized loading="lazy" alt={product.name} width={50} height={50} /></td>
                  <td className="p-3">{product.brand}</td>
                  <td className="p-3">{product.name}</td>
                  <td className="p-3">{product.gender}</td>
                  <td className="p-3">₹ {product.price.toLocaleString("en-IN")}</td>
                  <td className="p-3">{Math.round((product.price / product.cost) * 100)}%</td>
                  <td className="p-3">{product.stock}</td>
                  <td className='p-2 lg:p-0'><PencilLine className='h-9 w-9 bg-white/10 p-2 rounded-lg cursor-pointer hover:text-green-500 hover:border-green-500 hover:border border border-transparent hover:scale-110 transition-all duration-300' onClick={() => router.push(`/addProduct?id=${product.id}`)} /></td>
                  <td><Trash className='h-9 w-9 bg-white/10 p-2 rounded-lg cursor-pointer hover:text-red-500 hover:border-red-500 hover:border border border-transparent hover:scale-110 transition-all duration-300' onClick={() => confirmDelete(product)} /></td>
                </tr>
              </tbody>
            ))}
          </table>
        </div>)
      }
    </div>
  </div>)
}

export default EditProduct

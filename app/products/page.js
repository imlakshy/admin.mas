"use client";
import React from 'react'
import { useState, useEffect } from 'react';
import { supabase } from "@/lib/createSupabaseClient";
import Image from 'next/image';
import { ArrowLeft, PencilLine, Trash, RotateCcw, Search, Filter, X, Package, Percent, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const EditProduct = () => {

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/auth");
        return;
      }
    };
    checkAuth();
    return () => {};
  }, []);

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    stockMax: "",
    discountMin: "",
    gender: "",
  });
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    fetchProducts().then((data) => {
      setAllProducts(data);
      setFilteredProducts(data);
      setLoading(false);
    });
  }, []);

  const applyFilters = () => {
    let filtered = [...allProducts];

    // Search filter
    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          (product.brand && product.brand.toLowerCase().includes(searchTerm)) ||
          (product.name && product.name.toLowerCase().includes(searchTerm)) ||
          (product.category && product.category.toLowerCase().includes(searchTerm))
      );
    }

    // Stock filter
    if (filters.stockMax !== "") {
      const maxStock = Number(filters.stockMax);
      filtered = filtered.filter((product) => (product.stock || 0) < maxStock);
    }

    // Discount filter
    if (filters.discountMin !== "") {
      const minDiscount = Number(filters.discountMin);
      filtered = filtered.filter((product) => {
        if (product.cost && product.cost > 0 && product.price) {
          const discount = Math.round(((product.cost - product.price) / product.cost) * 100);
          return discount > minDiscount;
        }
        return false;
      });
    }

    // Gender filter
    if (filters.gender !== "") {
      filtered = filtered.filter((product) => product.gender === filters.gender);
    }

    setFilteredProducts(filtered);
  };

  useEffect(() => {
    let filtered = [...allProducts];

    // Search filter
    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          (product.brand && product.brand.toLowerCase().includes(searchTerm)) ||
          (product.name && product.name.toLowerCase().includes(searchTerm)) ||
          (product.category && product.category.toLowerCase().includes(searchTerm))
      );
    }

    // Stock filter
    if (filters.stockMax !== "") {
      const maxStock = Number(filters.stockMax);
      filtered = filtered.filter((product) => (product.stock || 0) < maxStock);
    }

    // Discount filter
    if (filters.discountMin !== "") {
      const minDiscount = Number(filters.discountMin);
      filtered = filtered.filter((product) => {
        if (product.cost && product.cost > 0 && product.price) {
          const discount = Math.round(((product.cost - product.price) / product.cost) * 100);
          return discount > minDiscount;
        }
        return false;
      });
    }

    // Gender filter
    if (filters.gender !== "") {
      filtered = filtered.filter((product) => product.gender === filters.gender);
    }

    setFilteredProducts(filtered);
  }, [filters, allProducts]);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return [];
    }

    // Convert null values to empty strings or appropriate defaults
    return data.map(product => ({
      ...product,
      brand: product.brand ?? "",
      name: product.name ?? "",
      description: product.description ?? "",
      gender: product.gender ?? "",
      category: product.category ?? "",
      cost: product.cost ?? 0,
      price: product.price ?? 0,
      stock: product.stock ?? 0,
      sizes: product.sizes ?? [],
      color: product.color ?? [],
      images: product.images ?? [],
    }));
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
      fetchProducts().then((data) => {
        setAllProducts(data);
        setFilteredProducts(data);
      });
    }
  };


  const confirmDelete = (product) => {
    toast(
      `Delete "${product.brand || ""} - ${product.name || ""}"?`,
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
      <div className='flex flex-col gap-2 mt-10 lg:mt-25'>
        <div className='flex gap-2 items-center'>
          <ArrowLeft className='h-7 lg:h-10 w-7 lg:w-10 cursor-pointer' onClick={() => router.push('/')} />

          <h1 className='text-2xl md:text-3xl lg:text-5xl font-semibold'>Manage Products</h1>
        </div>

        {/* Filters and Search */}
        {allProducts.length > 0 && (
          <div className='my-6 space-y-4'>
            {/* Search Bar */}
            <div className='relative'>
              <div className='flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 hover:bg-white/10 transition-all duration-200 focus-within:bg-white/10 focus-within:border-white/20'>
                <Search className='h-5 w-5 text-gray-400 flex-shrink-0' />
                <input
                  type="text"
                  placeholder='Search products by brand, name, or category...'
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      applyFilters();
                    }
                  }}
                  className='flex-1 bg-transparent focus:outline-none placeholder:text-gray-500 text-sm'
                />
                {filters.search && (
                  <button
                    onClick={() => setFilters({ ...filters, search: "" })}
                    className='p-1 hover:bg-white/10 rounded-full transition-colors'
                    title="Clear search"
                  >
                    <X className='h-4 w-4 text-gray-400' />
                  </button>
                )}
              </div>
            </div>

            {/* Filter Options */}
            <div className='flex items-center gap-3 flex-wrap'>
              <div className='flex items-center gap-2 text-sm text-gray-300'>
                <Filter className='h-4 w-4' />
                <span>Filters:</span>
              </div>

              {/* Stock Filter */}
              <div className='group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2 hover:bg-white/10 transition-all duration-200 focus-within:bg-white/10 focus-within:border-white/20'>
                <div className='flex items-center gap-2'>
                  <Package className='h-4 w-4 text-gray-400' />
                  <span className='text-xs text-gray-400'>Stock &lt;</span>
                  <input
                    type="number"
                    placeholder='5'
                    value={filters.stockMax}
                    onChange={(e) => setFilters({ ...filters, stockMax: e.target.value })}
                    className='bg-transparent w-12 text-center focus:outline-none text-sm placeholder:text-gray-500'
                  />
                  {filters.stockMax && (
                    <button
                      onClick={() => setFilters({ ...filters, stockMax: "" })}
                      className='p-0.5 hover:bg-white/10 rounded transition-colors'
                    >
                      <X className='h-3 w-3 text-gray-400' />
                    </button>
                  )}
                </div>
              </div>

              {/* Discount Filter */}
              <div className='group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2 hover:bg-white/10 transition-all duration-200 focus-within:bg-white/10 focus-within:border-white/20'>
                <div className='flex items-center gap-2'>
                  <Percent className='h-4 w-4 text-gray-400' />
                  <span className='text-xs text-gray-400'>Discount &gt;</span>
                  <input
                    type="number"
                    placeholder='50'
                    value={filters.discountMin}
                    onChange={(e) => setFilters({ ...filters, discountMin: e.target.value })}
                    className='bg-transparent w-12 text-center focus:outline-none text-sm placeholder:text-gray-500'
                  />
                  <span className='text-xs text-gray-400'>%</span>
                  {filters.discountMin && (
                    <button
                      onClick={() => setFilters({ ...filters, discountMin: "" })}
                      className='p-0.5 hover:bg-white/10 rounded transition-colors'
                    >
                      <X className='h-3 w-3 text-gray-400' />
                    </button>
                  )}
                </div>
              </div>

              {/* Gender Filter */}
              <div className='group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2 hover:bg-white/10 transition-all duration-200 focus-within:bg-white/10 focus-within:border-white/20'>
                <div className='flex items-center gap-2'>
                  <Users className='h-4 w-4 text-gray-400' />
                  <select
                    value={filters.gender}
                    onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                    className='bg-transparent focus:outline-none cursor-pointer text-sm appearance-none pr-6'
                  >
                    <option value="">All Genders</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                  {filters.gender && (
                    <button
                      onClick={() => setFilters({ ...filters, gender: "" })}
                      className='p-0.5 hover:bg-white/10 rounded transition-colors -ml-1'
                    >
                      <X className='h-3 w-3 text-gray-400' />
                    </button>
                  )}
                </div>
              </div>

              {/* Clear All Filters Button */}
              {(filters.search || filters.stockMax || filters.discountMin || filters.gender) && (
                <button
                  onClick={() => {
                    setFilters({
                      search: "",
                      stockMax: "",
                      discountMin: "",
                      gender: "",
                    });
                  }}
                  className='ml-auto px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg transition-all duration-200 text-sm text-red-300 flex items-center gap-2'
                >
                  <X className='h-4 w-4' />
                  <span>Clear All</span>
                </button>
              )}
            </div>

            {/* Active Filters Count */}
            {(filters.search || filters.stockMax || filters.discountMin || filters.gender) && (
              <div className='text-xs text-gray-400'>
                Showing {filteredProducts.length} of {allProducts.length} products
              </div>
            )}
          </div>
        )}

      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center text-gray-400 py-12">
          Loading products...
        </div>
      ) : allProducts.length === 0 ? (
        <div className="text-center text-gray-400 py-12">
          No products yet. Add product to get started.
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center text-gray-400 py-12">
          No products match your filters. Try adjusting your search criteria.
        </div>
      ) : (
        <div className="relative overflow-x-auto">
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
                <th className="text-left">
                  <RotateCcw
                    className='h-6 w-6 cursor-pointer hover:-rotate-360 transition-all duration-1000'
                    onClick={() => {
                      fetchProducts().then((data) => {
                        setAllProducts(data);
                        setFilteredProducts(data);
                      });
                    }}
                  />
                </th>
              </tr>
            </thead>

            {filteredProducts.map((product) => (
              <tbody key={product.id}>
                <tr className="border-t border-white/10">
                  <td className="p-3">
                    {product.images && product.images.length > 0 && product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        unoptimized
                        loading="lazy"
                        alt={product.name || ""}
                        width={50}
                        height={50}
                      />
                    ) : (
                      <div className="w-[50px] h-[50px] bg-white/10 rounded"></div>
                    )}
                  </td>
                  <td className="p-3">{product.brand || ""}</td>
                  <td className="p-3">{product.name || ""}</td>
                  <td className="p-3">{product.gender || ""}</td>
                  <td className="p-3">₹ {product.price ? product.price.toLocaleString("en-IN") : "0"}</td>
                  <td className="p-3">
                    {product.cost && product.cost > 0 && product.price
                      ? `${Math.round(((product.cost - product.price) / product.cost) * 100)}%`
                      : "0%"}
                  </td>
                  <td className="p-3">{product.stock || 0}</td>
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

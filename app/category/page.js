import React from 'react'

const ManageCategory = () => {
  return (<div className='h-full w-full overflow-scroll flex flex-col'>
    <div className='w-screen h-screen flex flex-col items-center justify-center'>
      <h1 className='text-5xl font-bold my-4'>Manage Category</h1>
      <div className='bg-black border-2 border-white/10 w-[80%] min-w-[322px] p-4 rounded-2xl flex flex-wrap gap-4'>

        <div className='categoryCard '>
          <h1>Main Category</h1>
          <div className='p-2 text-[18px] hover:bg-white/5 rounded-xl my hover:scale-105 transition-all duration-300'>Men's</div>
          <div className='p-2 text-[18px] hover:bg-white/5 rounded-xl my hover:scale-105 transition-all duration-300'>Women's</div>
          <div className='p-2 text-[18px] hover:bg-white/5 rounded-xl my hover:scale-105 transition-all duration-300'>Kid's</div>
        </div>

        <div className='categoryCard'>
          <h1>Sub Category Category</h1>
          <div className='p-2 text-[18px] hover:bg-white/5 rounded-xl my hover:scale-105 transition-all duration-300'>T-Shirts</div>
          <div className='p-2 text-[18px] hover:bg-white/5 rounded-xl my hover:scale-105 transition-all duration-300'>Shirts</div>
          <div className='p-2 text-[18px] hover:bg-white/5 rounded-xl my hover:scale-105 transition-all duration-300'>Jeans</div>
          <div className='p-2 text-[18px] hover:bg-white/5 rounded-xl my hover:scale-105 transition-all duration-300'>Trousers</div>
          <div className='p-2 text-[18px] hover:bg-white/5 rounded-xl my hover:scale-105 transition-all duration-300'>Hoodies</div>
          <div className='p-2 text-[18px] hover:bg-white/5 rounded-xl my hover:scale-105 transition-all duration-300'>Sweatshirts</div>
          <div className='p-2 text-[18px] hover:bg-white/5 rounded-xl my hover:scale-105 transition-all duration-300'>Jackets</div>
          <div className='p-2 text-[18px] hover:bg-white/5 rounded-xl my hover:scale-105 transition-all duration-300'>Coats</div>
          <div className='p-2 text-[18px] hover:bg-white/5 rounded-xl my hover:scale-105 transition-all duration-300'>Shorts</div>
          <div className='p-2 text-[18px] hover:bg-white/5 rounded-xl my hover:scale-105 transition-all duration-300'>Track Pants</div>

          <div className='p-2 text-[18px] hover:bg-white/5 rounded-xl my hover:scale-105 transition-all duration-300'>Ethnic Wear</div>
          <div className='p-2 text-[18px] hover:bg-white/5 rounded-xl my hover:scale-105 transition-all duration-300'>Kurta & Kurti</div>
          <div className='p-2 text-[18px] hover:bg-white/5 rounded-xl my hover:scale-105 transition-all duration-300'>Dresses</div>
          <div className='p-2 text-[18px] hover:bg-white/5 rounded-xl my hover:scale-105 transition-all duration-300'>Skirts</div>
          <div className='p-2 text-[18px] hover:bg-white/5 rounded-xl my hover:scale-105 transition-all duration-300'>Sarees</div>
          <div className='p-2 text-[18px] hover:bg-white/5 rounded-xl my hover:scale-105 transition-all duration-300'>Blazers</div>
          <div className='p-2 text-[18px] hover:bg-white/5 rounded-xl my hover:scale-105 transition-all duration-300'>Innerwear</div>
          <div className='p-2 text-[18px] hover:bg-white/5 rounded-xl my hover:scale-105 transition-all duration-300'>Sleepwear</div>
          <div className='p-2 text-[18px] hover:bg-white/5 rounded-xl my hover:scale-105 transition-all duration-300'>Activewear</div>
          <div className='p-2 text-[18px] hover:bg-white/5 rounded-xl my hover:scale-105 transition-all duration-300'>Winter Wear</div>

        </div>

        <div className='categoryCard'>
          <h1>Existing Category</h1>
        </div>

      </div>
    </div>
  </div>)
}

export default ManageCategory

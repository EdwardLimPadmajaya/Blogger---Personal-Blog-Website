'use client'
import React, { useEffect, useState } from 'react';
import { blog_data, assets } from '@/Assets/assets';
import Image from 'next/image';

const page = ({ params }) => {
  const [data, setData] = useState(null);

  // Unwrap params using React.use() hook
  const { id } = React.use(params);

  const fetchBlogData = () => {
    for (let i = 0; i < blog_data.length; i++) {
      if (Number(id) === blog_data[i].id) {
        setData(blog_data[i]);
        break;
      }
    }
  };

  useEffect(() => {
    if (id) {
      fetchBlogData();
    }
  }, [id]);

  return (
    <div className='bg-gray-200 py-5 px-5 md:px-12 lg:px-28'>
      <div className='flex justify-between items-center'>
        <Image src={assets.logo} width={180} alt='' className='w-[130px] sm:w-auto'/>
        <button className='flex items-center gap-2 font-medium py-1 px-3 sm:py-3 sm:px-6 border border-black shadow-[-7px_7px_0px_#000000]'>
            Get Started <Image src={assets.arrow} alt=''/>
        </button>
      </div>
    </div>
  );
};

export default page;
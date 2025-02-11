'use client'
import { assets } from '@/Assets/assets'
import axios from 'axios'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useParams, useRouter } from 'next/navigation'

const EditBlogPage = () => {
  const params = useParams();
  const router = useRouter();
  const blogId = params.id;

  const [image, setImage] = useState(null);
  const [existingImageURL, setExistingImageURL] = useState('');
  const [data, setData] = useState({
    title: "",
    description: "",
    category: "Startup",
    author: "Edward Lim Padmajaya",
    authorImg: "/author_img.png",
  });

  const fetchBlog = async () => {
    try {
      const response = await axios.get('/api/blog', {
        params: { id: blogId },
      });
      const blog = response.data;
      if (blog) {
        setData({
          title: blog.title,
          description: blog.description,
          category: blog.category,
          author: blog.author,
          authorImg: blog.authorImg,
        });
        setExistingImageURL(blog.image); 
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load blog data");
    }
  };

  useEffect(() => {
    if (blogId) {
      fetchBlog();
    }
  }, [blogId]);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('category', data.category);
      formData.append('author', data.author);
      formData.append('authorImg', data.authorImg);

      if (image) {
        formData.append('image', image);
      }

      const response = await axios.put(`/api/blog?id=${blogId}`, formData);
      if (response.data.success) {
        toast.success(response.data.msg);
        // Go back to blogList/page on success
        router.push('/admin/blogList');  
      } else {
        toast.error(response.data.msg || "Error updating blog");
      }
    } catch (error) {
      console.error(error);
      toast.error("Update failed");
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className='pt-5 px-5 sm:pt-12 sm:pl-16'>
      <h1 className='text-2xl mb-4'>Edit Blog</h1>

      <p className='text-xl'>Upload thumbnail</p>
      <label htmlFor='image'>
        {image ? (
          <Image
            className="mt-4"
            src={URL.createObjectURL(image)}
            width={140}
            height={70}
            alt=''
          />
        ) : existingImageURL ? (
          <Image
            className="mt-4"
            src={existingImageURL}
            width={140}
            height={70}
            alt=''
          />
        ) : (
          <Image
            className="mt-4"
            src={assets.upload_area}
            width={140}
            height={70}
            alt=''
          />
        )}
      </label>
      <input
        onChange={(e) => setImage(e.target.files[0])}
        type='file'
        id='image'
        hidden
      />

      <p className='text-xl mt-4'>Blog Title</p>
      <input
        name='title'
        onChange={onChangeHandler}
        value={data.title}
        className='w-full sm:w-[500px] mt-4 px-4 py-3 border'
        type='text'
        placeholder='Type here'
        required
      />

      <p className='text-xl mt-4'>Blog Description</p>
      <textarea
        name='description'
        onChange={onChangeHandler}
        value={data.description}
        className='w-full sm:w-[500px] mt-4 px-4 py-3 border'
        placeholder='Write content here'
        rows={6}
        required
      />

      <p className='text-xl mt-4'>Blog category</p>
      <select
        name='category'
        onChange={onChangeHandler}
        value={data.category}
        className='w-40 mt-4 px-4 py-3 border text-gray-500'
      >
        <option value="Startup">Startup</option>
        <option value="Technology">Technology</option>
        <option value="Lifestyle">Lifestyle</option>
      </select>

      <br />
      <button type="submit" className='mt-8 w-40 h-12 bg-black text-white'>
        Update
      </button>
    </form>
  );
}

export default EditBlogPage;

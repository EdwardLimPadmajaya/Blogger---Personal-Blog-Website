import React, { useEffect } from 'react';
import BlogItem from './BlogItem';
import axios from 'axios';

const BlogList = () => {
const [menu, setMenu] = React.useState('All');
const [blogs, setBlogs] = React.useState([]);

const fetchBlogs = async () => {
    try {
    const response = await axios.get('/api/blog');
    if (response.data && response.data.blogs) {
        setBlogs(response.data.blogs);
    }
    } catch (error) {
    console.error(error);
    }
};

useEffect(() => {
    fetchBlogs();
}, []);


const limitDescription = (htmlString, wordLimit) => {
    // strip out all HTML tags for safe excerpt
    const textOnly = htmlString.replace(/<[^>]*>/g, '');
    const words = textOnly.split(/\s+/);
    if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
    }
    return textOnly;
};

return (
    <div>
    {/* Category Buttons */}
    <div className="flex justify-center gap-6 my-10">
        <button
        onClick={() => setMenu('All')}
        className={menu === 'All' ? 'bg-black text-white py-1 px-4 rounded-sm' : ''}
        >
        All
        </button>
        <button
        onClick={() => setMenu('Technology')}
        className={menu === 'Technology' ? 'bg-black text-white py-1 px-4 rounded-sm' : ''}
        >
        Technology
        </button>
        <button
        onClick={() => setMenu('Startup')}
        className={menu === 'Startup' ? 'bg-black text-white py-1 px-4 rounded-sm' : ''}
        >
        Startup
        </button>
        <button
        onClick={() => setMenu('Lifestyle')}
        className={menu === 'Lifestyle' ? 'bg-black text-white py-1 px-4 rounded-sm' : ''}
        >
        Lifestyle
        </button>
    </div>

    {/* Blog Items */}
    <div className="flex flex-wrap justify-around gap-1 gap-y-10 mb-16 xl:mx-24">
        {blogs
        .filter((item) => (menu === 'All' ? true : item.category === menu))
        .map((item) => {
            // If you want a short excerpt, use limitDescription:
            const shortDesc = limitDescription(item.description, 20);
            // Otherwise, just pass the full HTML:
            return (
            <BlogItem
                key={item._id}
                id={item._id}
                image={item.image}
                title={item.title}
                category={item.category}
                // description={shortDesc} // short excerpt
                description={limitDescription(item.description, 20)}
            />
            );
        })}
    </div>
    </div>
);
};

export default BlogList;

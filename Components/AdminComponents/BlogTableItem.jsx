import { assets } from '@/Assets/assets';
import Image from 'next/image';
import Link from 'next/link';

const BlogTableItem = ({ authorImg, title, author, date, deleteBlog, mongoId }) => {
  const BlogDate = new Date(date);

  return (
    <tr className='bg-white border=-b'>
      <th scope='row' className='items-center gap-3 hidden sm:flex px-6 py-4 font-medium text-gray-900 whitespace-nowrap'>
        <Image width={40} height={40} src={authorImg ? authorImg : assets.profile_icon} alt=''/>
        <p>{author ? author : "No author"}</p>
      </th>
      <td className='px-6 py-4'>
        {/* Link to the edit page */}
        <Link href={`/admin/editBlog/${mongoId}`} className="text-blue-700 underline">
          {title ? title : "no title"}
        </Link>
      </td>
      <td className='px-6 py-4'>
        {BlogDate.toDateString()}
      </td>
      <td onClick={() => deleteBlog(mongoId)} className='px-6 py-4 cursor-pointer text-red-600'>
        x
      </td>
    </tr>
  )
}

export default BlogTableItem

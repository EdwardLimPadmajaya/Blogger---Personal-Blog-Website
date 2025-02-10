import React from 'react'

const SubsTableItem = ({email}) => {
  return (
    <tr className='bg-white border-b text-left'>
        <th scope='row' className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap'>
            {email?email:"No Email"}
        </th>
        <td className='px-6 py-4 hidden sm:block'>{"10 Feb 2025"}</td>
        <td className='px-6 py-4 cursor-pointer'>x</td>
    </tr>
  )
}

export default SubsTableItem

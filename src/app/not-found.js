import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className='w-full h-[100vh] text-center space-y-2 text-[#12396] flex-col bg-white justify-center flex item-center'>
      <h2 className=' text-3xl text-[#12396] '>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link className=' italic ' href="/">Return Home</Link>
    </div>
  )
}
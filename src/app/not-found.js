import Link from 'next/link'
import AuthSideBar from './component/AuthSideBar'
 
export default function NotFound() {
  return (
    <div className='w-full h-[100vh] text-center space-y-2 text-[#12396] flex bg-white '>
     <div className='h-full w-[40%] flex '>
       <AuthSideBar />
     </div>
      <div className='h-full w-full flex flex-col p-14  justify-center items-center'>
        <h2 className=' text-3xl text-[#12396] '>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link className=' italic ' href="/">Return Home</Link>
      </div>
    </div>
  )
}
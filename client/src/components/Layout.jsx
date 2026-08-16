import { useState } from 'react'
import Sidebar from './Sidebar'
import { Outlet, useLocation } from 'react-router-dom'
import { MenuIcon } from 'lucide-react'

const pageTitle ={
"/dashboard":"Dashboard",
"/account":"Social Media Account",
"/schedular":"Post Schedular"
}
const Layout = () => {
  const location = useLocation()
  const title = pageTitle[location.pathname] || "Dashboard"
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen bg-[#0a0a0e]">
      {/*Mobile overlay*/}
      {isMobileMenuOpen &&(
        <div className='fixed inset-0 bg-[#0A0A0E]/50 z-40 md:hidden' onClick={()=>setIsMobileMenuOpen(false)}/>
      )}
      <Sidebar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen}/>
      <div className='flex-1 flex flex-col overflow-hidden'>
        <header className="h-20 bg-[#0a0a0e] border-b border-zinc-800 flex items-center px-4 md:px-8 gap-4">
         <button className='md:hidden p-2 -ml-2 text-zinc-500' onClick={()=>setIsMobileMenuOpen(true)} >
          <MenuIcon className='size-6'/>
         </button>
         <div>
          <h1 className='text-zinc-100 text-lg'>{title}</h1>
          <p className="text-sm text-zinc-500 hidden sm:block">Manage your social media platfrom and automate it</p>
         </div>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8 xl:p-12">
          <Outlet/>
        </main>
      </div>
    </div>
  )
}

export default Layout

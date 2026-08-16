import { CheckCircle, ExternalLinkIcon, XIcon } from 'lucide-react'
import { getPlatformColor, PLATFORMS } from '../assets/assets'


const PlatformPickerModel = ({connectedIds,connecting,onClose,onConnect}) => {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0A0E]/40 backdrop-blur'>
      <div className='bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md border border-zinc-800'>
        <div className='flex items-center justify-between px-6 py-4 shadow'>
            <h2 className='text-zinc-100 uppercase'>Choose a platform</h2>
            <button onClick={onClose} className='p-2 rounded-full hover:bg-zinc-100 text-zinc-500 transition-colors'>
                 <XIcon className='size-5'/>
            </button>
        </div>
        <div className='flex flex-col gap-2 p-6'>
            {PLATFORMS.map((p)=>{
                const isConnected = connectedIds.includes(p.id)
                const isConnecting = connecting === p.id
            return(
                <button key={p.id} disabled={isConnected || isConnecting} onClick={()=>onConnect(p.id)}
                className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${isConnected ? "border-dashed border-emerald-500  cursor-default":"border-zinc-700 bg-zinc-800 hover:border-zinc-800 hover:bg-zinc-700 cursor-pointer"} ${isConnecting && "opacity-60"}`}
                >
                     <div className={`size-10 rounded-xl flex items-center justify-center ${getPlatformColor(p.id)}`}>
                                    <p.icon className="size-5 text-white" />
                                  </div>
                    <div className='flex-1 min-w-0'>
                        <div className={`text-sm ${isConnected ? "text-emerald-500":"text-zinc-100"}`}>{p.name}</div>
                    <div className='text-zinc-500 text-xs truncate'>{isConnected ? "Already Connected":p.description}</div>
                    </div>
                    {isConnected && <CheckCircle className='size-4 text-emerald-500 shrink-0'/>}
                    {isConnecting && <div className='size-4 border-2 border-orange-500/10 border-t-transparent rounded-full animate-spin shtink-0'/>}
                    {!isConnected && !isConnecting && <ExternalLinkIcon className='size-3.5 text-zinc-500 shrink-0'/>}
                </button>
            )

            })}
        </div>
      </div>
    </div>
  )
}

export default PlatformPickerModel

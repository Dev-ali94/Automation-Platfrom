import { useEffect, useState } from "react";
import { dummyAccountsData, PLATFORMS } from "../assets/assets";
import { PlusIcon } from "lucide-react";
import AccountList from "../components/AccountList";
import PlatformPickerModel from "../components/PlatformPickerModel";


const Account = () => {
  const [accounts, setAccounts] = useState([]);
  const [connecting, setConnecting] = useState(null);
  const [platformPicker,setPlatformPicker] = useState(false);
  const handleDisConnect = async (accountId) => {
    setAccounts(accounts.filter((a)=>a._id !== accountId))
  }
  const fetchAcount = async (isSync,platfrom,successMsg) => {
    setAccounts(dummyAccountsData)
    console.log(isSync,platfrom,successMsg);
    
  }
  useEffect(()=>{
    fetchAcount()
  },[])

  const connectedId = accounts.map((a)=>a.platform)
  const handleConnect = async (platformId) => {
    setConnecting(platformId)
    setTimeout(() => {
      setConnecting(null)
      setAccounts((prev)=> [...prev, dummyAccountsData[0]])
      setPlatformPicker(false)
    }, 1000);
  }
  return (
    <div className="space-y-8 max-w-4xl">
     {/*Header*/}
    <div className="flex px-6 py-5 rounded-xl border border-zinc-800 bg-zinc-900 flex-col sm:flex-row items-start sm:items-center text-sm justify-between gap-4">
<div>
  <h1 className="text-xl text-zinc-100 uppercase">Connected Accounts</h1>
  <p className="text-zinc-500 text-sm mt-0.5">{accounts.length}  of {PLATFORMS.length} platform connected.</p>
</div>
    <button onClick={() => setPlatformPicker(true)} className="flex items-center justify-center gap-2 text-sm px-4 py-2 rounded-full font-medium transition-all w-full sm:w-auto text-orange-500 bg-orange-500/20 border border-orange-500/10   hover:bg-zinc-800 hover:border-zinc-700/50 hover:text-zinc-100 ">
      <PlusIcon className="size-4 "/> Connect Account
    </button>
    </div>
    {platformPicker &&  <PlatformPickerModel connectedIds={connectedId} connecting={connecting} onClose={()=>setPlatformPicker(false)} onConnect={handleConnect}/> }
   
    <AccountList accounts={accounts} onDisConnect={handleDisConnect}/>
    </div>
  )
}

export default Account

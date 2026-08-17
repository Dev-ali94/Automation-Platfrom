import { useEffect, useState, useContext } from "react";
import { dummyAccountsData, PLATFORMS } from "../assets/assets";
import { PlusIcon } from "lucide-react";
import AccountList from "../components/AccountList";
import PlatformPickerModel from "../components/PlatformPickerModel";
import axios from "axios"
import { AppContext } from "../context/AppContext";


const Account = () => {
  const { backendUrl } = useContext(AppContext)
  const [accounts, setAccounts] = useState([]);
  const [connecting, setConnecting] = useState(null);
  const [platformPicker, setPlatformPicker] = useState(false);

  const fetchAcount = async (isSync, platfrom, successMsg) => {
    try {
      axios.defaults.withCredentials = true
      if (isSync) {
        const label = platfrom ? platfrom.charAt(0).toUpperCase() + platfrom.slice() : "Social Media"
        await axios.post(`${backendUrl}/api/social-auth/sync`)
        console.log("Sync SuccessFully");
      }
      const { data } = await axios.get(`${backendUrl}/api/account/`)
      setAccounts(data.accounts)
    } catch (error) {
      console.log(error?.response?.data?.message || error?.message);
    }

  }
   const connectedId = accounts.map((a) => a.platform)
  
  const handleConnect = async (platformId) => {
    setConnecting(platformId)
    try {
      axios.defaults.withCredentials = true
      const { data } = await axios.post(`${backendUrl}/api/social-auth/${platformId}/url`)
      window.location.href = data.url
    } catch (error) {
      console.log(error?.response?.data?.message || error?.message);
    }
  }
  const handleDisConnectAccount = async (accountId) => {
    axios.defaults.withCredentials = true
    try {
        await axios.post(`${backendUrl}/api/account/${accountId}`)
        console.log("Account disconnected successfully");
        await fetchAcount()
    } catch (error) {
      console.log(error?.response?.data?.message || error?.message);
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const connectedPlatform = params.get("connected")
    const connecteduserName = params.get("username")
    const syncNeeded = params.get("sync") === "true"
    const errorMsg = params.get("error")
    window.history.replaceState({}, document.title, window.location.pathname)
    if (connectedPlatform) {
      const label = connectedPlatform.charAt(0).toUpperCase() + connectedPlatform.slice(1)
      const handle = connecteduserName ? `@${connecteduserName}` : ""
      fetchAcount(true, connectedPlatform, `${label}${handle} connected!`)
    } else if (errorMsg) {
      console.log(`Error while fetching: ${decodeURIComponent(errorMsg)}`);
      fetchAcount()
    }else if(syncNeeded){
   fetchAcount(true,null,"Account synced")
    }else{
      fetchAcount()
    }
  }, [])

  

  return (
    <div className="space-y-8 max-w-4xl">
      {/*Header*/}
      <div className="flex px-6 py-5 rounded-xl border border-zinc-800 bg-zinc-900 flex-col sm:flex-row items-start sm:items-center text-sm justify-between gap-4">
        <div>
          <h1 className="text-xl text-zinc-100 uppercase">Connected Accounts</h1>
          <p className="text-zinc-500 text-sm mt-0.5">{accounts.length}  of {PLATFORMS.length} platform connected.</p>
        </div>
        <button onClick={() => setPlatformPicker(true)} className="flex items-center justify-center gap-2 text-sm px-4 py-2 rounded-full font-medium transition-all w-full sm:w-auto text-orange-500 bg-orange-500/20 border border-orange-500/10   hover:bg-zinc-800 hover:border-zinc-700/50 hover:text-zinc-100 ">
          <PlusIcon className="size-4 " /> Connect Account
        </button>
      </div>
      {platformPicker && <PlatformPickerModel connectedIds={connectedId} connecting={connecting} onClose={() => setPlatformPicker(false)} onConnect={handleConnect} />}

      <AccountList accounts={accounts} onDisConnect={handleDisConnectAccount} />
    </div>
  )
}

export default Account

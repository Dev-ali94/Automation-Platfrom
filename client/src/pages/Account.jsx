import { useEffect, useState } from "react";
import { PLATFORMS } from "../assets/assets";
import { PlusIcon } from "lucide-react";
import AccountList from "../components/AccountList";
import PlatformPickerModel from "../components/PlatformPickerModel";
import toast from "react-hot-toast"
import api from "../config/axios";


const Account = () => {
  const [accounts, setAccounts] = useState([]);
  const [connecting, setConnecting] = useState(null);
  const [platformPicker, setPlatformPicker] = useState(false);
  // fetch account data
  const fetchAcount = async (isSync, platfrom, successMsg) => {
    try {
      if (isSync) {
        const label = platfrom ? platfrom.charAt(0).toUpperCase() + platfrom.slice() : "Social Media"
        await api.post("/api/social-auth/sync", {}, { withCredentials: true })
        toast.success("Account Connected Successfully")
      }
      const { data } = await api.get("/api/account/", { withCredentials: true })
      setAccounts(data.accounts)
    } catch (error) {
      toast.error(error.response?.data?.message || error?.message)
    }
  }
  const connectedId = accounts.map((a) => a.platform)
  // handle connect
  const handleConnect = async (platformId) => {
    setConnecting(platformId);
    try {
      const { data } = await api.post(`/api/social-auth/${platformId}/url`, {}, { withCredentials: true, });
      window.location.href = data.url;
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message)
    } finally {
      setConnecting(null);
    }
  };
  // handle deleted
  const handleDisConnectAccount = async (accountId) => {
    try {
      await api.post(`/api/account/${accountId}`, {}, { withCredentials: true })
      toast.success("Account Disconnected Successfully");
      await fetchAcount()
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
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
    } else if (syncNeeded) {
      fetchAcount(true, null, "Account synced")
    } else {
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

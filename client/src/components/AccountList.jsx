import {
  AlertCircle,
  CheckCircle,
  PlusIcon,
  UnplugIcon,
} from "lucide-react";
import { getPlatformColor, PLATFORMS } from "../assets/assets";



const AccountList = ({accounts,onDisConnect}) => {
  const handelDisConnect = async (accountId) => {
    const confirm = window.confirm(
      "Are you sure you want to disconnect the account?"
    );

    if (!confirm) return;

    await onDisConnect(accountId);
  };

  if (accounts.length === 0) {
    return (
      <div className="bg-zinc-900 rounded-2xl border-2 border-dashed border-zinc-700 flex flex-col items-center justify-center py-20 px-6">
        <div className="size-14 bg-orange-500/20 border border-orange-500/10 rounded-2xl flex items-center justify-center mb-4">
          <PlusIcon className="text-orange-500 size-6 opacity-50" />
        </div>

        <h3 className="text-zinc-100 text-lg uppercase">
          No Account Selected
        </h3>

        <p className="text-sm text-zinc-500 mt-1 max-w-xs text-center">
          Connect your first social media platform to start scheduling and
          automating your content.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {accounts.map((account, index) => {
        const meta = PLATFORMS.find((p) => p.id === account.platform);
        if (!meta) return null;
        return (
          <div
            key={account._id || index}
            className="group bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-center justify-between hover:border-zinc-700 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className={`size-14 rounded-xl flex items-center justify-center ${getPlatformColor(meta.id)}`}>
                <meta.icon className="size-7 text-white" />
              </div>

              <div>
                <div className="text-zinc-100 truncate">
                  {account.handle}
                </div>

                <div className="text-sm text-zinc-500 mt-0.5">
                  {meta.name}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {account.status === "connected" ? (
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="text-emerald-500 size-4" />
                  <span className="text-xs text-emerald-500">
                    Connected
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <AlertCircle className="text-amber-500 size-4" />
                  <span className="text-xs text-amber-500">
                    Disconnected
                  </span>
                </div>
              )}

              <button
                onClick={() => handelDisConnect(account._id)}
                title="Disconnect Account"
                className="text-zinc-400 hover:text-red-500 transition-colors"
              >
                <UnplugIcon className="size-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AccountList;
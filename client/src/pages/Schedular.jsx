import React, { useEffect, useState } from "react";
import { dummyPostsData, getPlatformColor, PLATFORMS } from "../assets/assets";
import { AlertCircleIcon, ArrowRightIcon, Calendar1Icon, Clock1, Loader2Icon, SendIcon, TimerIcon, UploadIcon, XIcon } from "lucide-react";


const Schedular = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [ScheduledTime, setScheduledTime] = useState("");
  const [scheduledDate, setSheduledDate] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState([]);
  const [mediaFile, setMediaFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const FetchPosts = async () => {
    setPosts(dummyPostsData);
  };
  useEffect(() => {
    (async () => await FetchPosts())();
    const interval = setInterval(async () => await FetchPosts(), 1000);
    return () => clearInterval(interval);
  }, []);
  const sheduled = posts.filter((p) => p.status === "scheduled");
  const published = posts.filter((p) => p.status === "published");
  const togglePlatform = (id) =>
    setSelectedPlatform((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  const handleSchedule = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPosts((prev) => [...prev, dummyPostsData]);
    }, 1000);
  };
  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      <div className="w-full lg:w-[460px] shrink-0">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-start flex-col  gap-1 mb-6">
            <h1 className="text-lg text-zinc-100 uppercase">Compose Posts</h1>
            <div className="h-0.5 rounded-full w-36 bg-orange-500"/>
          </div>
          <form className="space-y-5" onSubmit={handleSchedule}>
            <div className="mb-8">
              <label className="block text-xs text-zinc-200  uppercase mb-2">Platform</label>
              <div className="flex flex-wrap gap-3">
                {PLATFORMS.map((p) => {
                  const active = selectedPlatform.includes(p.id);
                  return (
                    <button
                      type="button"
                      onClick={() => togglePlatform(p.id)}
                      className={`flex items-center gap-1.5 p-3 rounded-xl transition-all duration-150 border ${active
                        ? `border-none text-zinc-100 ${getPlatformColor(p.id)}`
                        : "border-zinc-700 group hover:border-orange-500 bg-zinc-800 text-zinc-300"
                        }`}
                    >
                      <p.icon className="size-5 group-hover:text-orange-500" />
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="group">
              <label className="block text-xs text-zinc-200 uppercase mb-2">
                Content
              </label>

              <textarea
                required
                rows={5}
                placeholder="What do you want to share today"
                className="w-full px-5 py-4 bg-zinc-800/40 border border-zinc-700/40 rounded-2xl text-zinc-300 text-sm placeholder-zinc-400 outline-none resize-none focus:border-orange-500/60 transition-colors duration-200"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />

              <div
                className={`text-right text-xs mt-1 font-medium ${content.length > 280 ? "text-red-500" : "text-zinc-400"
                  }`}
              >
                {content.length}/280
              </div>
            </div>
            <div>
              <label className="block text-xs text-zinc-200  uppercase mb-2">Media</label>

              {mediaFile ? (
                <div className="relative overflow-hidden rounded-xl border border-zinc-700/40 bg-zinc-800/40">
                  {mediaFile.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(mediaFile)}
                      alt="preview"
                      className="w-full h-52 object-cover"
                    />
                  ) : (
                    <video
                      src={URL.createObjectURL(mediaFile)}
                      controls
                      className="w-full h-52 object-cover"
                    />
                  )}

                  <button
                    type="button"
                    onClick={() => setMediaFile(null)}
                    className="absolute top-2.5 right-2.5 flex size-7 items-center justify-center rounded-lg bg-black/60 border border-white/10 text-zinc-300 backdrop-blur-sm hover:bg-red-500/80 hover:text-white transition-colors"
                  >
                    <XIcon className="size-3.5" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-2 h-38 border-2 border-dashed border-zinc-700/40 rounded-2xl cursor-pointer bg-zinc-800/40 hover:bg-zinc-800/70 hover:border-orange-500/30 transition-all group">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700 group-hover:border-orange-500/20 group-hover:bg-orange-500/5 transition-colors">
                    <UploadIcon className="size-4 text-zinc-300 group-hover:text-orange-400 transition-colors" />
                  </div>

                  <div className="text-center">
                    <p className="text-sm font-medium text-zinc-300 group-hover:text-zinc-300">
                      Upload media
                    </p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">
                      Images or videos
                    </p>
                  </div>

                  <input
                    type="file"
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={(e) =>
                      e.target.files?.[0] && setMediaFile(e.target.files[0])
                    }
                  />
                </label>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* Date */}
              <div>
                <label className="block text-xs text-zinc-200 uppercase mb-2">
                  Date
                </label>

                <div className="relative">
                  <Calendar1Icon className="size-4 absolute top-1/2 left-3 -translate-y-1/2 text-zinc-400 pointer-events-none" />

                  <input
                    value={scheduledDate}
                    onChange={(e) => setSheduledDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-800/40 border border-zinc-700/40 rounded-xl text-zinc-300 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition-all duration-200"
                    type="date"
                    required
                  />
                </div>
              </div>

              {/* Time */}
              <div>
                <label className="block text-xs uppercase text-zinc-200  mb-2">
                  Time
                </label>

                <div className="relative">
                  <Clock1 className="size-4 absolute top-1/2 left-3 -translate-y-1/2 text-zinc-400 pointer-events-none" />

                  <input
                    value={ScheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-800/40 border border-zinc-700/40 rounded-xl text-zinc-300 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition-all duration-200"
                    type="time"
                    required
                  />
                </div>
              </div>
            </div>
             <button type="submit" disabled={loading} className="w-full flex items-center justify-center 
                          gap-2 py-3.5 group border border-orange-500/30 bg-orange-500/15 hover:bg-orange-500  rounded-2xl text-sm font-medium transition-colors  disabled:cursor-not-allowed">
                            {loading ? (
                              <>
                                <Loader2Icon className="size-4 text-orange-500 animate-spin group-hover:text-zinc-100" />
                                <span className="text-orange-500 group-hover:text-zinc-100 text-sm font-medium uppercase">Loading</span>
                              </>
                            ) : (
                              <>
                                <TimerIcon className="size-4 text-orange-500 group-hover:text-zinc-100" />
                                <span className="text-orange-500 group-hover:text-zinc-100 text-sm font-medium uppercase">schedule post </span>
                              </>
                            )}
                          </button>
          </form>
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-3 min-w-0">
        {/* Upcoming Posts */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-2.5 px-4 py-3 border-b border-zinc-800">
            <Calendar1Icon className="size-4.5 text-orange-500" />

            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wide">
              Upcoming Posts
            </h3>

            <span className="ml-auto inline-flex items-center justify-center min-w-6 h-5  rounded-full bg-zinc-800 border border-zinc-700 text-[12px] font-bold text-zinc-300">
              {sheduled.length}
            </span>
          </div>

          {/* Posts */}
          <div className="max-h-64 overflow-y-auto">
            {sheduled.length === 0 ? (
              <div className="p-2">
                <div className="flex flex-col items-center justify-center bg-zinc-800/70 border border-zinc-700/70 py-5 px-4 rounded-xl">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-orange-500/20 bg-orange-500/10">
                    <AlertCircleIcon className="size-4.5 text-orange-400" />
                  </div>

                  <p className="text-xs font-medium mt-2 text-zinc-400 text-center">
                    You have no upcoming posts scheduled.
                  </p>
                </div>
              </div>
            ) : (
              sheduled.map((post) => (
                <div
                  key={post._id}
                  className="px-4 py-3 border-b border-zinc-800 last:border-b-0 hover:bg-zinc-800/40 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    {/* Left */}
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Platforms */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {post.platforms.map((p) => {
                          const meta = PLATFORMS.find(
                            (platform) => platform.id === p
                          );

                          if (!meta) return null;

                          return (
                            <div
                              key={p}
                              className={`flex size-8 items-center justify-center rounded-lg ${getPlatformColor(
                                p
                              )} bg-opacity-10 border border-white/5`}
                            >
                              <meta.icon className="size-4 text-zinc-200" />
                            </div>
                          );
                        })}
                      </div>

                      {/* Date */}
                      <span className="text-[11px] text-zinc-400 whitespace-nowrap">
                        {new Date(post.scheduledFor).toLocaleString()}
                      </span>
                    </div>

                    {/* Type */}
                    {post.mediaType && (
                      <span className="shrink-0 text-[10px] text-orange-400 bg-orange-500/10 border border-orange-500/20 px-1.5 py-0.5 rounded-md font-semibold capitalize">
                        {post.mediaType}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <p className="mt-2 text-xs text-zinc-500 line-clamp-1">
                    {post.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Published Posts */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-2.5 px-4 py-3 border-b border-zinc-800">
            <SendIcon className="size-4.5 text-orange-500" />

            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wide">
              Published Posts
            </h3>

            <span className="ml-auto inline-flex items-center justify-center min-w-6 h-5 px-1.5 rounded-full bg-zinc-800 border border-zinc-700 text-[12px] font-bold text-zinc-300">
              {published.length}
            </span>
          </div>

          {/* Posts */}
          <div className="max-h-64 overflow-y-auto">
            {published.length === 0 ? (
              <div className="p-2">
                <div className="flex flex-col items-center justify-center bg-zinc-800/70 border border-zinc-700/70 py-5 px-4 rounded-xl">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-orange-500/20 bg-orange-500/10">
                    <AlertCircleIcon className="size-4.5 text-orange-400" />
                  </div>

                  <p className="text-xs font-medium mt-2 text-zinc-400 text-center">
                    You have no published posts.
                  </p>
                </div>
              </div>
            ) : (
              published.map((post) => (
                <div
                  key={post._id}
                  className="px-4 py-3 border-b border-zinc-800 last:border-b-0 hover:bg-zinc-800/40 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    {/* Left */}
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Platforms */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {post.platforms.map((p) => {
                          const meta = PLATFORMS.find(
                            (platform) => platform.id === p
                          );

                          if (!meta) return null;

                          return (
                            <div
                              key={p}
                              className={`flex size-8 items-center justify-center rounded-lg ${getPlatformColor(
                                p
                              )} bg-opacity-10 border border-white/5`}
                            >
                              <meta.icon className="size-4 text-zinc-200" />
                            </div>
                          );
                        })}
                      </div>

                      {/* Date */}
                      <span className="text-[11px] text-zinc-400 whitespace-nowrap">
                        {new Date(post.updatedAt).toLocaleString()}
                      </span>
                    </div>

                    {/* Status */}
                    <span className="shrink-0 text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-md font-semibold">
                      Published
                    </span>
                  </div>

                  {/* Content */}
                  <p className="mt-2 text-xs text-zinc-500 line-clamp-1">
                    {post.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedular;

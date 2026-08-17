import React, { useEffect, useState,useContext } from "react";
import { dummyGenerationData, getPlatformColor, PLATFORMS } from "../assets/assets";
import axios from "axios"
import {AppContext} from "../context/AppContext"
import { AlertCircleIcon, ArrowRightIcon, Calendar1Icon, Clock1, HistoryIcon, Loader2Icon, TimerIcon, UploadIcon, XIcon } from "lucide-react";

const AiComposer = () => {
  const {backendUrl} = useContext(AppContext)
  const [promt, setPromt] = useState("");
  const [tone, setTone] = useState("Professional");
  const [loading, setLoading] = useState(false);
  const [generation, setGeneration] = useState([]);
  const [activeSchedular, setActiveSchedular] = useState(null)
  const [mediaFile, setMediaFile] = useState(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState([])
  const [scheduleDate, setScheduleDate] = useState("")
  const [scheduleTime, setScheduleTime] = useState("")
  const [scheduling, setScheduling] = useState(false)
  const tones = ["Professional", "Creative", "Funny", "Excited", "Minimalistic"]

  const fetchGenerations = async () => {
      try {
      axios.defaults.withCredentials = true
       const {data} = await axios.get(`${backendUrl}/api/generation`)
       setGeneration(data.generations)
        console.log("generation fucth SuccessFully")
    } catch (error) {
      console.log(error?.response?.data?.message || error?.message);
    }
  }

 const handleSchedulePost = async () => {

    if (!activeSchedular?._id) {
        console.log("Please select a generation");
        return;
    }

    if (selectedPlatforms.length === 0) {
        console.log("Select at least one platform");
        return;
    }

    if (!scheduleDate || !scheduleTime) {
        console.log("Please enter schedule date and time");
        return;
    }

    if (!mediaFile) {
        console.log("Media file is required");
        return;
    }

    console.log("Active Scheduler:", activeSchedular);
    console.log("Generation ID:", activeSchedular._id);

    const scheduledFor = new Date(
        `${scheduleDate}T${scheduleTime}`
    ).toISOString();

    const formData = new FormData();

    formData.append(
        "generationId",
        activeSchedular._id
    );

    formData.append(
        "scheduledFor",
        scheduledFor
    );

    formData.append(
        "platform",
        JSON.stringify(selectedPlatforms)
    );

    formData.append("media", mediaFile);

    setLoading(true);

    try {
        const { data } = await axios.post(
            `${backendUrl}/api/generation/post`,
            formData,
            {
                withCredentials: true
            }
        );

        console.log("Post scheduled successfully:", data);

        fetchGenerations();

    } catch (error) {
        console.error(
            "Schedule Error:",
            error?.response?.data?.message ||
            error?.message
        );
    } finally {
        setLoading(false);
    }
};

  const togglePlatform = (id) =>
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
const handleGeneration = async () => {
  if (!promt.trim()) {
    console.log("Prompt is required");
    return;
  }

  setLoading(true);

  try {
    const { data } = await axios.post(
      `${backendUrl}/api/generation/generate`,
      {
        promt: promt.trim(),
        tone,
      },
      {
        withCredentials: true,
      }
    );

    console.log("Created:", data.generations);

    // Add new generation immediately to UI
    setGeneration((prev) => [
      data.generations,
      ...prev,
    ]);

    // Open scheduler with the newly created generation
    setActiveSchedular(data.generations);

  } catch (error) {
    console.error(
      "Generation Error:",
      error?.response?.data?.message || error?.message
    );
  } finally {
    setLoading(false);
  }
};
    

  useEffect(() => {
    fetchGenerations()
  }, [])

 
  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 animate-in fade-in duration-500">
      {/* Composer */}
      <div className="space-y-6 mt-20 text-center">
        <h1 className="text-3xl text-zinc-100 tracking-tight uppercase">
          What Should You{" "}
          <span className="text-orange-400">Create</span> Today?
        </h1>

        {/* Prompt */}
        <div className="relative mt-12 group">
          <textarea
            className="w-full px-6 py-6 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200 placeholder-zinc-300 outline-none focus:border-orange-400 resize-none h-40"
            placeholder="Share your idea... (e.g. A post about the launch of our new eco-friendly coffee bean)"
            value={promt}
            onChange={(e) => setPromt(e.target.value)}
          />

          <div className="absolute bottom-4 right-2.5 flex items-center gap-3 text-sm">
            <button
            onClick={handleGeneration}
              type="button"
              disabled={loading || !promt.trim()}
              className="bg-orange-500 border  text-zinc-100 border-orange-600 hover:bg-orange-600 hover:text-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 px-4 py-2 rounded-lg transition"
            >
              {loading ? (
                <>
                  <Loader2Icon className="animate-spin size-4" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <span>Generate</span>
                  <ArrowRightIcon className="size-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tones */}
        <div className="flex flex-wrap justify-center gap-2">
          {tones.map((ton) => (
            <button
              type="button"
              key={ton}
              onClick={() => setTone(ton)}
              className={`px-4 py-2 rounded-full border transition ${tone === ton
                ? "bg-orange-500/15 border-orange-500/30 text-orange-400"
                : "bg-zinc-900 text-zinc-300 border-zinc-800  hover:bg-zinc-800"
                }`}
            >
              {ton}
            </button>
          ))}
        </div>
      </div>

      {/* Recent Generations */}
      <div className="space-y-6 pt-12 border-t border-zinc-900">
        <div className="flex items-center justify-between text-zinc-100">
          <div className="flex items-center gap-2">
            <HistoryIcon className="size-5" />

            <h2 className="text-md uppercase">
              Recent Generation
            </h2>
          </div>

          <span className="text-sm text-zinc-300 bg-zinc-900 px-3 py-1 rounded-full">
            {generation.length} total
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {generation.map((gen) => (
            <div
              key={gen._id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-orange-400 relative overflow-hidden p-6 transition"
            >
              <div className="flex flex-col h-full space-y-4">
                {/* Date + Tone */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400 uppercase tracking-wider">
                    {new Date(gen.createdAt).toLocaleString()}
                  </span>

                  <span className="text-xs text-orange-400 bg-orange-500/15 border border-orange-500/30 px-2 py-0.5 rounded-md">
                    {gen.tone}
                  </span>
                </div>

                {/* Content */}
                <p className="text-sm line-clamp-3 leading-relaxed flex-1 text-zinc-300">
                  {gen.content}
                </p>

                {/* Schedule Button */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveSchedular(gen)}
                    className="bg-zinc-800 border text-zinc-200 border-zinc-700 hover:border-none hover:bg-orange-500 hover:text-zinc-100 flex-1  px-4 py-1.5 rounded-lg transition"
                  >
                    Schedule Post
                  </button>
                </div>
              </div>
            </div>
          ))}
          {generation.length === 0 && (
            <div className="col-span-full">
              <div className="flex flex-col items-center justify-center bg-zinc-900 border border-zinc-800 py-15 px-10 rounded-xl">
                <div className="flex h-15 w-15 items-center justify-center rounded-lg border border-orange-500/20 bg-orange-500/10">
                  <AlertCircleIcon className="size-8 text-orange-400" />
                </div>

                <p className="text-md font-sm mt-2 text-zinc-400 text-center">
                  No recent generations found. Please generate some content to see it here.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Schedular Model */}
      {activeSchedular && (
        <div className="fixed inset-0 min-h-screen z-50 flex items-center justify-center p-4 bg-[#0A0A0E]/20 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-2xl border border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-8 py-4 border-b border-zinc-800">
              <div className="flex flex-col items-start">
                <h2 className="text-lg font-lg uppercase text-zinc-100">Schedule Generation</h2>
                <div className="h-0.5 w-52 bg-orange-500" />
              </div>
              <button onClick={() => setActiveSchedular(null)} className="p-2 rounded-full text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700 bg-zinc-800">
                <XIcon className="size-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-4">
              <div className="bg-zinc-800/40 text-sm leading-relaxed whitespace-pre-wrap rounded-2xl text-zinc-300 p-4 border border-zinc-700/40 space-y-4">
                <p>{activeSchedular.promt}</p>
              </div>
              <div className="bg-zinc-800/40 text-sm leading-relaxed whitespace-pre-wrap rounded-2xl text-zinc-300 p-4 border border-zinc-700/40 space-y-4">
                <p>{activeSchedular.content}</p>
              </div>
              <div className="bg-zinc-800/40 rounded-2xl text-zinc-300 p-4 border border-zinc-700/40">
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
                      className="absolute top-2.5 right-2.5 flex size-7 items-center justify-center rounded-full bg-black/60 border border-white/10 text-zinc-300 backdrop-blur-sm hover:bg-red-500/80 hover:text-white transition-colors"
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
              <div className="bg-zinc-800/40 rounded-2xl text-zinc-300 p-4 border border-zinc-700/40">
                <label className="block text-xs text-zinc-200  uppercase mb-2">Platform</label>
                <div className="flex flex-wrap gap-3">
                  {PLATFORMS.map((p) => {
                    const active = selectedPlatforms.includes(p.id);
                    return (
                      <button
                        type="button"
                        onClick={() => togglePlatform(p.id)}
                        className={`flex items-center gap-1.5 p-3 rounded-xl transition-all duration-150 border ${active
                          ? `border-none text-zinc-100 ${getPlatformColor(p.id)}`
                          : "border-zinc-700 group hover:border-orange-500 bg-zinc-800 text-zinc-300"
                          }`}
                      >
                        <p.icon className="size-5 group-hover:text-orange-400" />
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="bg-zinc-800/40 rounded-2xl text-zinc-300 p-4 border border-zinc-700/40">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* Date */}
              <div>
                <label className="block text-xs text-zinc-200 uppercase mb-2">
                  Date
                </label>

                <div className="relative">
                  <Calendar1Icon className="size-4 absolute top-1/2 left-3 -translate-y-1/2 text-zinc-400 pointer-events-none" />

                  <input
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
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
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-800/40 border border-zinc-700/40 rounded-xl text-zinc-300 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition-all duration-200"
                    type="time"
                    required
                  />
                </div>
              </div>
            </div>
              </div>
              <button onClick={handleSchedulePost} type="submit" disabled={loading} className="w-full flex items-center justify-center 
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

            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AiComposer

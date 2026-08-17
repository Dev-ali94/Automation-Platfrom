import { ActivityIcon, CheckCircleIcon, ClockIcon, SendIcon, Share2Icon, TrendingUp } from 'lucide-react';
import React, { Activity, useEffect, useState,useContext } from 'react'

import { AppContext } from '../context/AppContext';
import axios from 'axios';

const Dashboard = () => {
   const {  backendUrl } =useContext(AppContext);
  const [status, setStatus] = useState({ schedules: 0, published: 0, connectedAccounts: 0 })
  const [activites, setActivites] = useState([]);
  const statusCard = [
    { label: 'Scheduled Posts', value: status.schedules, icon: ClockIcon, trend: "+2 day" },
    { label: 'Total Posts', value: status.published, icon: CheckCircleIcon, trend: "All Time" },
    { label: 'Connected Accounts', value: status.connectedAccounts, icon: Share2Icon, trend: "Active" }
  ]
  useEffect(() => {
  const fetchDashboardData = async () => {
  try {
    const [postsRes, accountsRes, activitiesRes] = await Promise.all([
      axios.get(`${backendUrl}/api/post`, {
        withCredentials: true,
      }),
      axios.get(`${backendUrl}/api/account`, {
        withCredentials: true,
      }),
      axios.get(`${backendUrl}/api/activity`, {
        withCredentials: true,
      }),
    ]);

    const posts = postsRes.data.posts || [];
    const accounts = accountsRes.data.accounts || [];
    const activities = activitiesRes.data.activity || [];

    console.log("Posts:", posts);
    console.log("Accounts:", accounts);
    console.log("Activities:", activities);

    setStatus({
      schedules: posts.filter(
        (post) => post.status === "scheduled"
      ).length,

      published: posts.filter(
        (post) => post.status === "published"
      ).length,

      connectedAccounts: accounts.filter(
        (account) => account.status === "connected"
      ).length,
    });

    setActivites(activities);

  } catch (err) {
    console.error(
      "Error fetching dashboard data:",
      err.response?.data || err.message
    );
  }
};
    fetchDashboardData()
  }, [])
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl uppercase text-zinc-100">Welcome back </h2>
        <p className='text-zinc-500 text-xs mt-0.5'>Here's what's happening with your social media accounts today.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statusCard.map((item, index) => (
          <div key={index} className="bg-zinc-900 p-6 relative rounded-2xl hover:border-orange-500/20 hover:bg-zinc-800 border border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl font-medium tabular-nums text-white">{item.value}</div>
              <div className="text-xs absolute top-4 right-4 text-orange-500 flex items-center gap-1">
                <TrendingUp className="size-4 mt-1" />
                {item.trend}
              </div>
            </div>
            <p className="text-zinc-400 text-sm mt-2">{item.label}</p>
          </div>
        ))}
      </div>
      <div className="bg-zinc-900 rounded-2xl border-zinc-800 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <h1 className='text-zinc-100 text-sm uppercase'>Recent Activity</h1>
          <span className="text-xs text-zinc-400">{activites.length} events</span>
        </div>
        {activites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="size-12 border border-orange-500/20  bg-orange-500/10 rounded-xl flex items-center justify-center mb-3">
              <ActivityIcon className="size-6 text-orange-500" />
            </div>
            <h1 className="text-zinc-400">No activity yet</h1>
            <p className="text-zinc-500 text-sm mt-1">Connect account and post something! to see event here</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {activites.map((activity) => (
              <div key={activity._id} className="flex items-start gap-4 px-6 py-4 hover:bg-zinc-800/40 transition-colors">
                <div className="size-9 border border-orange-500/20  bg-orange-500/10 rounded-lg flex items-center justify-center mt-0.5 shrink-0">
                  <SendIcon className="size-4 text-orange-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <span className="text-xs px-2 py-0.5 bg-zinc-800 border border-zinc-700 rounded-full text-zinc-100">Published</span>
                    <span className="text-xs text-zinc-400 shrink-0">{new Date(activity.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-zinc-400 text-sm">{activity.description}</p>
                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  )
}

export default Dashboard

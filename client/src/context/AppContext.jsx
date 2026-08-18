import { createContext, useEffect, useState } from "react"
import api from "../config/axios"
export const AppContext = createContext()

export const AppContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userData, setUserData] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  // Check auth state
  const getAuthState = async () => {
    try {
      const { data } = await api.get("/api/auth/auth", {
        withCredentials: true,
      })

      if (data.success) {
        setIsLoggedIn(true)
        await getUserData()
      } else {
        setIsLoggedIn(false)
        setUserData(null)
      }
    } catch (error) {
      setIsLoggedIn(false)
      setUserData(null)
    } finally {
      setAuthLoading(false)
    }
  }

  //  Fetch user data
  const getUserData = async () => {
    try {
      const { data } = await api.get("/api/auth/data", {
        withCredentials: true,
      })

      if (data.success) {
        setUserData(data.userData)
      } else {
        setUserData(null)
      }
    } catch (error) {
      setUserData(null)
    }
  }

  //  Run on page load
  useEffect(() => {
    getAuthState()
  }, [])

  const value = {
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
    authLoading,
  }

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}
import React, { useState, useEffect, useContext } from "react"
import axios from "axios"
import { AppContext } from "../context/AppContext"
import { useNavigate } from "react-router-dom"
import api from "../config/axios"
import toast from "react-hot-toast"

const EmailVerify = () => {
  const navigate = useNavigate()
  const [counter, setCounter] = useState(30)
  const [loading, setLoading] = useState(false)
  const { getUserData, userData } = useContext(AppContext)
  const inputRefs = React.useRef([])

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])


  const handleInput = (e, index) => {
    const value = e.target.value

    // Allow only numbers
    if (!/^\d*$/.test(value)) {
      e.target.value = ''
      return
    }

    if (value.length > 0 && index < 5) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const paste = e.clipboardData.getData("text").trim()

    // Extract only numbers
    const numbers = paste.replace(/\D/g, '').slice(0, 6)

    numbers.split('').forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char
      }
    })

    // Focus next empty input or last one
    const nextEmptyIndex = numbers.length < 6 ? numbers.length : 5
    if (inputRefs.current[nextEmptyIndex]) {
      inputRefs.current[nextEmptyIndex].focus()
    }
  }

  const SubmitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    // Collect OTP
    const otpArray = inputRefs.current.map((input) => input.value)
    const otp = otpArray.join('')
    // Validate OTP length
    if (otp.length !== 6) {
      console.log("otp is greater then 6 number");
      setLoading(false)
      return
    }

    try {
      const { data } = await api.post("/api/auth/verify", { otp }, { withCredentials: true })
      if (data.success) {
       toast.success("Email verified SuccessFully")
        await getUserData()
        navigate("/dashboard")
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (counter > 0) return

    try {
      const { data } = await api.post("/api/auth/resend-otp", {}, { withCredentials: true })

      if (data.success) {
         toast.success("Otp is resnd to your email")
        setCounter(30)
        // Clear OTP inputs
        inputRefs.current.forEach(input => input.value = '')
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus()
        }
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  // Counter timer
  useEffect(() => {
    if (counter <= 0) return

    const timer = setTimeout(() => setCounter(counter - 1), 1000)
    return () => clearTimeout(timer)
  }, [counter])

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-[#0A0A0E]">
      <div className="bg-zinc-900 border border-zinc-800 p-10 rounded-2xl shadow-lg w-full sm:w-96">
        <h2 className="text-center text-xl font-semibold  uppercase text-zinc-100 mb-2">
          Verify Your Email
        </h2>

        <p className="text-center  text-sm font-medium text-zinc-300 mb-6">
          Enter the<span className="font-semibold text-orange-400 px-1">6-digit</span>code sent to your email
        </p>

        <form onSubmit={SubmitHandler}>
          <div
            className="flex justify-between mb-8"
            onPaste={handlePaste}
          >
            {Array.from({ length: 6 }, (_, index) => (
              <input
                ref={(el) => (inputRefs.current[index] = el)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength="1"
                key={index}
                required
                className="w-12 h-12 text-center text-zinc-100 text-xl rounded-lg bg-zinc-800/40 focus:ring-2 focus:ring-orange-500 outline-none border border-zinc-700/40 hover:border-none transition"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-full text-orange-400 font-medium bg-orange-500/15 border border-orange-500/30 hover:text-zinc-100 hover:bg-orange-500 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'}`}
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>

          <div className="text-center mt-4">
            {counter > 0 ? (
              <p className="text-sm text-zinc-300">
                Resend OTP in
                <span className="text-orange-400 font-medium ml-1">
                  {counter}s
                </span>
              </p>
            ) : (
              <div className="flex items-center justify-center gap-1">
                <p className="text-zinc-300 text-sm">
                  Didn't get the OTP?
                </p>

                <button
                  type="button"
                  onClick={handleResend}
                  className="text-orange-400 text-sm font-semibold hover:text-orange-500 transition"
                >
                  Resend
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default EmailVerify

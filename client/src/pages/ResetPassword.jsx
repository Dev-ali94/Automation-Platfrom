import { LockIcon, MailIcon } from 'lucide-react'
import React, { useState,useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import api from '../config/axios'
import toast from "react-hot-toast"

const ResetPassword = () => {
    const navigate =useNavigate()
    const [email, setEmail] = useState('')
    const [isEmailSent, setIsEmailSent] = useState("")
    const [otp, setOtp] = useState(0)
    const [isOtpSubmited, setIsOtpSubmited] = useState(false)
    const [newPassword, setNewPasssword] = useState('')
    const { setIsLoggedIn, getUserData, userData } =useContext(AppContext);

    const inputRefs = React.useRef([]);

    const handelInput = async (e, index) => {
        if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handelKeyDown = async (e, index) => {
        if (e.key === "Backspace" && e.target.value === "" && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handelPaste = (e) => {
        const paste = e.clipboardData.getData("text");
        const pasteArray = paste.split("");
        pasteArray.forEach((char, index) => {
            if (inputRefs.current[index]) {
                inputRefs.current[index].value = char;
            }
        });
    };
    const onSubmitEmail = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post("/api/auth/forget-password", { email });
            data.success ? toast.success(data.message) : toast.error(data.message)
            data.success && setIsEmailSent(true)
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };
    const onSubmitOtp = async (e) => {
        e.preventDefault(); 
        const otpArray = inputRefs.current.map((e) => e.value);
        setOtp(otpArray.join(""))
        setIsOtpSubmited(true)
    };
    const onSbmitNewPassword = async (e) => {
        e.preventDefault()
        try {
            const { data } = await api.post("/api/auth/reset-password", { email, newPassword, otp });
            data.success ? toast.success(data.message) : toast.error(data.message)
            data.success && navigate('/login')
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    }

    return (
        <div>
            <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-[#0A0A0E]">
                {/*Email  */}
                {!isEmailSent &&
                    <form
                        onSubmit={onSubmitEmail}
                        className="bg-zinc-900 border border-zinc-800 p-10 rounded-xl shadow-lg w-full sm:w-96"
                    >
                        <h2 className="text-center text-xl font-semibold  uppercase text-zinc-100 mb-2">
                            Reset Password
                        </h2>

                        {/* Fixed safe access */}
                        <p className="text-center text-sm font-medium text-zinc-300 mb-6">
                            Enter your register<span className='font-semibold text-orange-400 px-1'>email</span> address
                        </p>
                        <div className="flex items-center mb-5 gap-3 px-4 py-2.5 rounded-full w-full bg-zinc-800/40 border border-zinc-700/40 focus-within:ring placeholder:text-zinc-300 text-zinc-200 focus-within:ring-orange-500 transition">
                            <MailIcon className='text-orange-400 size-4' />
                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                type="email"
                                placeholder="you@company.com"
                                className="flex-1 outline-none bg-transparent text-white placeholder-gray-400 text-sm"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2.5 rounded-full text-orange-500 font-medium bg-orange-500/15 border border-orange-500/30 hover:bg-orange-500 hover:text-white"
                        >
                            Submit
                        </button>
                    </form>
                }
                {/*password reset otp */}
                {!isOtpSubmited && isEmailSent &&
                    <form
                        onSubmit={onSubmitOtp}
                        className="bg-zinc-900 border border-zinc-800 p-10 rounded-xl shadow-lg w-full sm:w-96"
                    >
                        <h2 className="text-center text-xl font-semibold  uppercase text-zinc-100 mb-2">
                            Verify I'ts Your Account
                        </h2>

                        <p className="text-center text-sm font-medium text-zinc-300 mb-6">
                            Enter <span className='font-semibold text-orange-400 px-1'>6-digit</span> code sent to your email
                        </p>

                        <div className="flex justify-between mb-8" onPaste={handelPaste}>
                            {Array(6)
                                .fill(0)
                                .map((_, index) => (
                                    <input
                                        ref={(e) => (inputRefs.current[index] = e)}
                                        onInput={(e) => handelInput(e, index)}
                                        onKeyDown={(e) => handelKeyDown(e, index)}
                                        type="text"
                                        maxLength="1"
                                        key={index}
                                        required
                                        className="w-12 h-12 text-center text-zinc-100 text-xl rounded-lg bg-zinc-800/40 border border-zinc-700/40 focus:ring-2 focus:ring-orange-500 outline-none"
                                    />
                                ))}
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2.5 rounded-full text-orange-400 font-medium bg-orange-500/15 border border-500/30  hover:bg-orange-500 hover:text-white hover:border-none transition-all"
                        >
                            verify email
                        </button>
                    </form>

                }
                {isOtpSubmited && isEmailSent &&
                    <form
                        onSubmit={onSbmitNewPassword}
                        className="bg-zinc-900 border border-zinc-800 p-10 rounded-xl shadow-lg w-full sm:w-96"
                    >
                        <h2 className="text-center text-xl font-semibold  uppercase text-zinc-100 mb-2">
                            Enter New Password
                        </h2>

                        {/* Fixed safe access */}
                        <p className="text-center text-sm font-medium text-zinc-300 mb-6">
                            Enter your new<span className='font-semibold text-orange-400 px-1'>password</span> below
                        </p>
                        <div className="flex items-center text-zinc-200 placeholder:text-zinc-300 mb-5 gap-3 px-4 py-2.5 rounded-full w-full bg-zinc-800/40 border border-zinc-700/40 focus-within:ring-1 focus-within:ring-orange-500 transition">
                            <LockIcon className="size-4 text-orange-400" />
                            <input
                                onChange={(e) => setNewPasssword(e.target.value)}
                                value={newPassword}
                                type="password"
                                placeholder="*******"
                                className="flex-1 outline-none bg-transparent text-white placeholder-gray-400 text-sm"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2.5 rounded-full text-orange-400 font-medium bg-orange-500/15 border border-500/30 hover:bg-orange-500 hover:border-none hover:text-zinc-100"
                        >
                            Submit
                        </button>
                    </form>
                }
            </div>
        </div>
    )
}

export default ResetPassword

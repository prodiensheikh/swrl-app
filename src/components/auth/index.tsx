import { useState } from "react"
import { User } from "../../types/user"
import { HiCheck, HiOutlineDuplicate, HiX } from "react-icons/hi"
import { getOtp, verifyOtp } from "../../api/auth"
import { AxiosError } from "axios"

export default function Auth({
  setUser,
}: {
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>
}) {
  const [emailInput, setEmailInput] = useState<string>("")
  const [gettingOtp, setGettingOtp] = useState<boolean>(false)

  const [otpSent, setOtpSent] = useState<boolean>(false)

  const [otpInput, setOtpInput] = useState<string>("")
  const [verifyingOtp, setVerifyingOtp] = useState<boolean>(false)

  const [numberCopied, setNumberCopied] = useState<boolean>(false)

  const [error, setError] = useState<string>("")

  const handleRequestOtp = async () => {
    if (!emailInput) return

    try {
      setGettingOtp(true)
      const response = await getOtp(emailInput)
      // console.log(response)
      setError(`Could not send OTP (${response.data.otp}) to ${emailInput}`)
      setOtpSent(true)
    } catch (error: unknown) {
      if (!(error instanceof AxiosError)) throw new Error(error as string)
      setError(error.response?.data?.message || error.message)
    } finally {
      setGettingOtp(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (!emailInput || !otpInput) return

    try {
      setVerifyingOtp(true)
      const response = await verifyOtp(emailInput, otpInput)
      console.log(response)

      const { user, token } = response.data
      localStorage.setItem('SWRL_USER_TOKEN', token)

      setUser(user)
    } catch (error: unknown) {
      if (!(error instanceof AxiosError)) throw new Error(error as string)
      setError(error.response?.data || error.response?.data?.message || error.message)
    } finally {
      setVerifyingOtp(false)
    }
  }

  return (
    <div className="mx-auto flex-1 flex flex-col max-w-[360px] p-4 bg-white shadow-xl border border-gray-200 rounded relative">
      <img src="/logo.svg" alt="SWRL Logo" className="w-28 mx-auto mb-2" />
      <div className="text-center text-gray-600">
        Login to your account
      </div>

      {otpSent && (
        <HiX className="absolute top-4 left-4 text-gray-600 cursor-pointer" onClick={() => setOtpSent(false)} />
      )}

      {!otpSent && (
        <>
          <input
            type="email"
            placeholder="Email"
            name="email"
            className="border border-gray-200 rounded p-2 mt-12 w-full bg-gray-200 text-gray-800"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
          />

          <button
            disabled={gettingOtp}
            className="bg-[#25D366] text-white rounded p-2 mt-2 w-full disabled:bg-gray-200 disabled:text-gray-800"
            onClick={handleRequestOtp}
          >
            Get OTP
          </button>
        </>
      )}

      {otpSent && (
        <>
          <input
            type="text"
            placeholder="OTP"
            name="otp"
            className="border border-gray-200 rounded p-2 mt-12 w-full bg-gray-200 text-gray-800 text-center"
            value={otpInput}
            onChange={(e) => setOtpInput(e.target.value)}
          />

          <button
            disabled={verifyingOtp}
            className="bg-[#25D366] text-white rounded p-2 mt-2 w-full disabled:bg-gray-200 disabled:text-gray-800"
            onClick={handleVerifyOtp}
          >
            Verify OTP
          </button>
        </>
      )}

      {error && (
        <p className="mt-4 flex-1 text-center text-red-500 text-xs">
          {error}
        </p>
      )}

      <p className={`flex-1 text-center text-gray-600 text-xs ${error ? 'mt-1' : 'mt-4'}`}>
        Get started for free.
        Send a "Hi" to SWRL on WhatsApp.
        <span className="font-semibold"> (+1-341-241-3950) </span>
        {!numberCopied ? (
          <HiOutlineDuplicate className="inline-block text-gray-600 cursor-pointer" onClick={() => {
            navigator.clipboard.writeText("+1-341-241-3950")
            setNumberCopied(true)
          }} />
        ) : (
          <HiCheck className="inline-block text-gray-600" />
        )}
      </p>
    </div>
  )
}
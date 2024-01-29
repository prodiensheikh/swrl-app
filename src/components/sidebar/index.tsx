import { HiOutlineLogout } from "react-icons/hi"
import { User } from "../../types/user"

export default function Sidebar({
  setUser,
}: {
  user: User,
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>
}) {
  const logout = () => {
    setUser(undefined)
    localStorage.removeItem('SWRL_USER_TOKEN')
  }

  return (
    <div className="flex-col h-screen text-gray-400 py-4 px-4 w-42 items-center hidden md:flex border-r border-gray-700 bg-black/10">
      <img src="/logo.svg" alt="SWRL Logo" className="w-32 mt-4" />
      <div className="text mt-auto flex items-center cursor-pointer" onClick={logout}>
        Logout
        <HiOutlineLogout className="ml-2 mt-1 h-5 w-5" />
      </div>
    </div>
  )
}
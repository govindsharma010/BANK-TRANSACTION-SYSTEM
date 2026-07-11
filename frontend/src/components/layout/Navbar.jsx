import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../ui/Button'

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/accounts', label: 'Accounts' },
  { to: '/transfer', label: 'Transfer' },
  { to: '/transactions', label: 'History' },
  { to: '/profile', label: 'Profile' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <div className="flex items-center gap-6">
          <NavLink to="/dashboard" className="text-lg font-bold text-indigo-600">
            Bank Ledger
          </NavLink>
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-slate-600 sm:inline">{user?.name}</span>
          <Button variant="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}

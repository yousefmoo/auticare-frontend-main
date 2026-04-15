import { NavLink } from 'react-router-dom'
import usePageTitle from '../../utils/usePageTitle'

export default function Unauthorized() {
  usePageTitle('Unauthorized')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-gray-900">403</h1>
        <p className="text-gray-600 mt-2">You do not have permission to access this page.</p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <NavLink
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary-600 px-6 py-3 text-white font-semibold hover:bg-primary-700"
          >
            Back to Home
          </NavLink>
          <NavLink
            to="/login"
            className="inline-flex items-center justify-center rounded-full border border-gray-200 px-6 py-3 text-gray-700 font-semibold hover:border-gray-300"
          >
            Sign in
          </NavLink>
        </div>
      </div>
    </div>
  )
}

import { NavLink } from 'react-router-dom'
import usePageTitle from '../../utils/usePageTitle'

export default function NotFound() {
  usePageTitle('Page Not Found')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-gray-900">404</h1>
        <p className="text-gray-600 mt-2">We could not find the page you are looking for.</p>
        <NavLink
          to="/"
          className="inline-flex items-center justify-center mt-6 rounded-full bg-primary-600 px-6 py-3 text-white font-semibold hover:bg-primary-700"
        >
          Back to Home
        </NavLink>
      </div>
    </div>
  )
}

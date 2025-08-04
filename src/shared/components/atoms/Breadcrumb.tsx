import { Link, useParams } from 'react-router-dom'

const cityNames: Record<string, string> = {
  'medellin': 'Medellín',
  'bogota': 'Bogotá',
  'cali': 'Cali'
}

export default function Breadcrumb() {
  const { id } = useParams()
  const cityName = id ? cityNames[id] || id : ''

  return (
    <nav className="text-sm text-gray-600 mb-6">
      <div className="flex items-center space-x-2">
        <Link to="/" className="hover:text-blue-600 transition-colors">
          Home
        </Link>
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <Link to="/cities" className="hover:text-blue-600 transition-colors">
          Ciudades
        </Link>
        {id && (
          <>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-800 font-medium">{cityName}</span>
          </>
        )}
      </div>
    </nav>
  )
}

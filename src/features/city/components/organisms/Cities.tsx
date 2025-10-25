import { Link } from 'react-router-dom'

const mockCities = [
  { id: 'medellin', name: 'Medellín', description: 'City of eternal spring' },
  { id: 'bogota', name: 'Bogotá', description: 'Capital of Colombia' },
  { id: 'cali', name: 'Cali', description: 'Capital of salsa' }
]

function Cities() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Cities</h1>
        <p className="text-gray-600">Select a city to view its transportation routes</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockCities.map(city => (
          <Link
            key={city.id}
            to={`/cities/${city.id}`}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 hover:border-blue-300"
          >
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl">🏙️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">{city.name}</h3>
            </div>
            <p className="text-gray-600 text-sm">{city.description}</p>
            <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
              View routes
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Cities

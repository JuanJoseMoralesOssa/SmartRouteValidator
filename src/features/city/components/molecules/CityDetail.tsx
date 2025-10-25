import { useParams, useNavigate } from 'react-router-dom'

export default function CityDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Details of {id}</h1>
        <button onClick={() => navigate('/cities')} className="text-sm text-blue-600 hover:underline">
          ← Back to list
        </button>
      </div>
      <p>This is the detailed view of the city <strong>{id}</strong>.</p>
    </div>
  )
}

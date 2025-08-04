import { useParams, useNavigate } from 'react-router-dom'

export default function CityDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Detalles de {id}</h1>
        <button onClick={() => navigate('/cities')} className="text-sm text-blue-600 hover:underline">
          ← Volver a la lista
        </button>
      </div>
      <p>Esta es la vista detallada de la ciudad <strong>{id}</strong>.</p>
    </div>
  )
}

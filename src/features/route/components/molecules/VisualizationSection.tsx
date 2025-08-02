import RouteVisualization from "@/features/route/components/RouteVisualization"

function VisualizationSection() {
  return (
    <div>
      <div className='bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden'>
        <div className='bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4'>
          <h2 className='text-xl font-semibold text-white flex items-center'>
            <span className='mr-2'>📊</span>
            {' '}Visualización de Rutas
          </h2>
          <p className='text-blue-100 text-sm mt-1'>
            Mapa interactivo de conexiones entre ciudades
          </p>
        </div>
        <div className='p-6'>
          <RouteVisualization />
        </div>
      </div>
    </div>
  )
}

export default VisualizationSection

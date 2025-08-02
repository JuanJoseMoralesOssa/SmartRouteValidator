import RoutesTable from "@/features/route/components/RouteTable"

function TableSection() {
  return (
    <div>
      <div className='bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden'>
        <div className='bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4'>
          <h2 className='text-xl font-semibold text-white flex items-center'>
            <span className='mr-2'>📋</span>
            {' '}Lista de Rutas
          </h2>
          <p className='text-green-100 text-sm mt-1'>
            Gestión completa de todas las rutas
          </p>
        </div>
        <div className='p-6'>
          <RoutesTable />
        </div>
      </div>
    </div>
  )
}

export default TableSection

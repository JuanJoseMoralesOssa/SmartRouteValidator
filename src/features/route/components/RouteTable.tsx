import { Route } from '@/shared/types/entities/Route'
import useRouteStore from '../stores/useRouteStore'
import { useRouteController } from '../controller/RouteController'

export function RoutesTable() {
    const { routes, setRoute } = useRouteStore()
    const { handleDelete } = useRouteController()
    console.log('RouteTable rendered with routes:', routes?.length || 0)

    const onEditRoute = (route: Route) => {
        setRoute(route)
    }

    return (
        <div className='rounded-xl border border-gray-200 shadow-lg overflow-hidden bg-white'>
            <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200'>
                        <tr>
                            <th className='px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px]'>
                                <div className='flex items-center space-x-2'>
                                    <span className='text-lg'>🏙️</span>
                                    <span>Origen</span>
                                </div>
                            </th>
                            <th className='px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px]'>
                                <div className='flex items-center space-x-2'>
                                    <span className='text-lg'>🎯</span>
                                    <span>Destino</span>
                                </div>
                            </th>
                            <th className='px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px]'>
                                <div className='flex items-center space-x-2'>
                                    <span className='text-lg'>💰</span>
                                    <span>Costo</span>
                                </div>
                            </th>
                            <th className='px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[140px]'>
                                <div className='flex items-center space-x-2'>
                                    <span className='text-lg'>✈️</span>
                                    <span>Tipo de Ruta</span>
                                </div>
                            </th>
                            <th className='px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[160px]'>
                                <div className='flex items-center space-x-2'>
                                    <span className='text-lg'>🛑</span>
                                    <span>Escalas</span>
                                </div>
                            </th>
                            <th className='px-6 py-5 text-right text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[180px]'>
                                <div className='flex items-center justify-end space-x-2'>
                                    <span className='text-lg'>⚙️</span>
                                    <span>Acciones</span>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-100'>
                        {routes?.map((route, index) => (
                            <tr
                                key={route.id}
                                className={`transition-all duration-200 hover:bg-blue-50 hover:shadow-sm ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                    }`}
                            >
                                <td className='px-6 py-5 whitespace-nowrap'>
                                    <div className='flex items-center'>
                                        <div className={`h-4 w-4 rounded-full mr-3 shadow-sm ${route.origin?.color ? '' : 'bg-blue-500'}`} style={route.origin?.color ? { backgroundColor: route.origin.color } : {}}></div>
                                        <span className='text-sm font-medium text-gray-900'>
                                            {route.origin?.name || 'Sin origen'}
                                        </span>
                                    </div>
                                </td>
                                <td className='px-6 py-5 whitespace-nowrap'>
                                    <div className='flex items-center'>
                                        <div className={`h-4 w-4 rounded-full mr-3 shadow-sm ${route.destiny?.color ? '' : 'bg-green-500'}`} style={route.destiny?.color ? { backgroundColor: route.destiny.color } : {}}></div>
                                        <span className='text-sm font-medium text-gray-900'>
                                            {route.destiny?.name || 'Sin destino'}
                                        </span>
                                    </div>
                                </td>
                                <td className='px-6 py-5 whitespace-nowrap'>
                                    <span className='text-sm font-bold text-green-600 bg-green-50 px-4 py-2 rounded-full border border-green-200'>
                                        ${route.cost.toFixed(2)}
                                    </span>
                                </td>
                                <td className='px-6 py-5 whitespace-nowrap'>
                                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium shadow-sm ${route.isDirectRoute
                                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                        : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                        }`}>
                                        {route.isDirectRoute ? (
                                            <>
                                                <span className='mr-2'>🚀</span>
                                                <span>Directa</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className='mr-2'>🔄</span>
                                                <span>Con Escalas</span>
                                            </>
                                        )}
                                    </span>
                                </td>
                                <td className='px-6 py-5'>
                                    <div className='text-sm text-gray-700'>
                                        {route.intermediateStops && route.intermediateStops.length > 0 ? (
                                            <div className='flex flex-wrap gap-2'>
                                                {route.intermediateStops.map((stop) => (
                                                    <span
                                                        key={`${route.id}-${stop}`}
                                                        className='bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium border border-gray-200'
                                                    >
                                                        {stop}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className='text-gray-400 italic text-sm'>Sin escalas</span>
                                        )}
                                    </div>
                                </td>
                                <td className='px-6 py-5 whitespace-nowrap text-right'>
                                    <div className='flex justify-end space-x-3'>
                                        <button
                                            onClick={() => onEditRoute(route)}
                                            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md ${route.color
                                                ? 'focus:ring-gray-500'
                                                : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                                                }`}
                                            style={route.color ? {
                                                backgroundColor: route.color,
                                                filter: 'brightness(1)',
                                            } : {}}
                                            onMouseEnter={route.color ? (e) => {
                                                e.currentTarget.style.filter = 'brightness(0.9)';
                                            } : undefined}
                                            onMouseLeave={route.color ? (e) => {
                                                e.currentTarget.style.filter = 'brightness(1)';
                                            } : undefined}
                                        >
                                            <span className='mr-2'>✏️</span>
                                            <span>Editar</span>
                                        </button>
                                        <button
                                            onClick={() => route.id && handleDelete(route.id)}
                                            className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 shadow-sm hover:shadow-md'
                                        >
                                            <span className='mr-2'>🗑️</span>
                                            <span>Eliminar</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default RoutesTable

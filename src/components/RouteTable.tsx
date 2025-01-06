import { RoutesTableProps } from '../types/props/RouteTableProps'

export function RoutesTable({
    routes,
    onEditRoute,
    onDeleteRoute,
}: RoutesTableProps) {
    return (
        <div className='rounded-md border border-gray-300 shadow-md'>
            <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                    <tr>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                            Origen
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                            Destino
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                            Costo
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                            Tipo de Ruta
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                            Escalas
                        </th>
                        <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                    {routes.map((route) => (
                        <tr key={route.id}>
                            <td className='px-6 py-4 whitespace-nowrap'>
                                {route.originCity}
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                                {route.destinationCity}
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                                ${route.cost.toFixed(2)}
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                                {route.isDirectRoute ? 'Directa' : 'Con Escalas'}
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                                {route.intermediateStops?.join(', ') ?? 'N/A'}
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-right space-x-2'>
                                <button
                                    onClick={() => onEditRoute(route)}
                                    className='text-blue-600 hover:text-blue-800'>
                                    Editar
                                </button>
                                <button
                                    onClick={() => onDeleteRoute(route.id)}
                                    className='text-red-600 hover:text-red-800'>
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default RoutesTable

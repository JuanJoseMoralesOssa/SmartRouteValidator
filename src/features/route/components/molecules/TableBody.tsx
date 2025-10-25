import ActionButton from "@/shared/components/atoms/ActionButton"
import RouteEdit from "../atoms/RouteEdit"
import { useRouteController } from "../../hooks/useRouteController"
import { Route } from "@/shared/types/entities/Route"

function TableBody() {
  const { handleDelete, routes, setRoute } = useRouteController()
  const onEditRoute = (route: Route) => {
    setRoute(route)
  }
  return (
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
                {route.destiny?.name || 'Without destination'}
              </span>
            </div>
          </td>
          <td className='px-6 py-5 whitespace-nowrap'>
            <span className='text-sm font-bold text-green-600 bg-green-100 px-4 py-2 rounded-full border border-green-200'>
              ${route.cost.toFixed(2)}
            </span>
          </td>
          {/* <td className='px-6 py-5 whitespace-nowrap'>
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
          </td> */}
          {/* <td className='px-6 py-5'>
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
                <span className='italic text-sm default-scales-text-color'>Sin escalas</span>
              )}
            </div>
          </td> */}
          <td className='px-6 py-5 whitespace-nowrap text-right'>
            <div className='flex justify-end space-x-3'>
              <RouteEdit
                route={route}
                onEditRoute={onEditRoute}
              />
              <ActionButton
                variant="danger"
                onClick={() => route.id && handleDelete(route.id)}
                icon="🗑️"
                aria-label={`Delete route from ${route.origin?.name} to ${route.destiny?.name}`}
              >
                Delete
              </ActionButton>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  )
}

export default TableBody

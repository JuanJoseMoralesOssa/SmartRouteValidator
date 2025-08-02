import { useRouteController } from "@/features/route/hooks/useRouteController"

function ErrorAlert() {
  const { errors } = useRouteController()
  return (
    errors.length > 0 && (
      <div className='bg-red-50 border-l-4 border-red-400 p-4 rounded-lg shadow-sm'>
        <div className='flex'>
          <div className='flex-shrink-0'>
            <span className='text-red-400 text-xl'>⚠️</span>
          </div>
          <div className='ml-3'>
            <p className='text-sm text-red-700'>
              <strong className='font-semibold'>Error:</strong> {errors.join(', ')}
            </p>
          </div>
        </div>
      </div>
    )

  )
}

export default ErrorAlert

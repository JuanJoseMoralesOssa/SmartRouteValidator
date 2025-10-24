import { useEffect, useRef } from 'react'
import useRouteStore from '../../stores/useRouteStore'
import { RouteVisualizationController } from '../../controller/RouteVisualizationController'
import { ID } from '@/shared/types/ID'

interface RouteVisualizationProps {
    highlightedRouteId?: ID // Mantener compatibilidad con prop individual (deprecated)
}

const RouteVisualization = ({ highlightedRouteId }: RouteVisualizationProps) => {
    const {
        routes,
        highlightedRouteIds
    } = useRouteStore()

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const abortControllerRef = useRef<AbortController | null>(null)

    useEffect(() => {
        // Cancelar cualquier renderizado previo en progreso
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }

        // Crear nuevo AbortController para esta ejecución
        const abortController = new AbortController()
        abortControllerRef.current = abortController

        if (!canvasRef.current || !routes) {
            return
        }

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        if (!ctx) {
            return
        }

        // Filtrar rutas válidas usando el controlador
        const validRoutes = RouteVisualizationController.filterValidRoutes(routes)

        if (validRoutes.length === 0) {
            RouteVisualizationController.drawEmptyState(ctx, canvas)
            return
        }

        // Crear Set de IDs resaltadas, combinando store y prop para compatibilidad
        const combinedHighlightedIds = new Set(highlightedRouteIds)
        if (highlightedRouteId) {
            combinedHighlightedIds.add(highlightedRouteId)
        }

        // Inicializar visualización usando el controlador (async)
        const renderVisualization = async () => {
            try {
                await RouteVisualizationController.initializeVisualization(
                    canvas,
                    ctx,
                    validRoutes,
                    combinedHighlightedIds.size > 0 ? combinedHighlightedIds : undefined
                )
            } catch (error) {
                // Ignorar errores de AbortController
                if (error instanceof Error && error.name !== 'AbortError') {
                    console.error('Error initializing visualization:', error)
                }
            }
        }

        // Solo renderizar si no fue abortado
        if (!abortController.signal.aborted) {
            renderVisualization()
        }

        // Cleanup: abortar cuando el componente se desmonte o las dependencias cambien
        return () => {
            abortController.abort()
        }
    }, [routes, highlightedRouteIds, highlightedRouteId])

    return (
        <div className='w-full bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 rounded-lg'>
            <canvas
                ref={canvasRef}
                width={800}
                height={450}
                className='w-full h-full border rounded-lg shadow-lg'
            />
        </div>
    )
}

export default RouteVisualization

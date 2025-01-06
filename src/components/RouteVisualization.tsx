import { useEffect, useRef } from 'react'
import { RouteVisualizationProps } from '../types/props/RouteVisualizationProps'

const RouteVisualization = ({ routes }: RouteVisualizationProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if (!canvasRef.current) return

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Get unique cities
        const cities = new Set<string>()
        routes.forEach((route) => {
            cities.add(route.originCity)
            cities.add(route.destinationCity)
            route.intermediateStops?.forEach((stop) => cities.add(stop))
        })

        // Calculate positions
        const positions = new Map<string, { x: number; y: number }>()
        const radius = Math.min(canvas.width, canvas.height) * 0.4
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2

        Array.from(cities).forEach((city, index) => {
            const angle = (index * 2 * Math.PI) / cities.size
            positions.set(city, {
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle),
            })
        })

        // Draw routes
        routes.forEach((route) => {
            const origin = positions.get(route.originCity)
            const destination = positions.get(route.destinationCity)

            if (origin && destination) {
                ctx.beginPath()
                ctx.moveTo(origin.x, origin.y)
                ctx.lineTo(destination.x, destination.y)
                ctx.strokeStyle = route.isDirectRoute ? '#0000FF' : '#FF0000'
                ctx.lineWidth = 2
                ctx.stroke()
            }
        })

        // Draw cities
        positions.forEach(({ x, y }, city) => {
            ctx.beginPath()
            ctx.arc(x, y, 5, 0, 2 * Math.PI)
            ctx.fillStyle = '#000'
            ctx.fill()

            ctx.font = '12px Arial'
            ctx.fillStyle = '#000'
            ctx.textAlign = 'center'
            ctx.fillText(city, x, y - 10)
        })
    }, [routes])

    return (
        <canvas
            ref={canvasRef}
            width={600}
            height={400}
            className='w-full border rounded-lg'
        />
    )
}

export default RouteVisualization

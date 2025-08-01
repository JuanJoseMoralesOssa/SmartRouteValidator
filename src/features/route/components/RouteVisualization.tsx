import { useEffect, useRef } from 'react'
import useRouteStore from '../stores/useRouteStore'

const RouteVisualization = () => {
    const { routes } = useRouteStore()
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationRef = useRef<NodeJS.Timeout | null>(null)

    // Función para generar colores únicos para cada ciudad con buen contraste
    const getCityColors = (cities: string[]): Map<string, string> => {
        const cityColors = new Map<string, string>()
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
            '#F8C471', '#82E0AA', '#AED6F1', '#F1948A', '#D2B4DE'
        ]

        cities.forEach((city, index) => {
            cityColors.set(city, colors[index % colors.length])
        })

        return cityColors
    }

    // Función para crear una imagen SVG con color personalizado
    const createColoredSVG = (color: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
            // Array de diferentes diseños de SVG para ciudades
            const svgDesigns = [
                // Diseño 1: Skyline moderno con edificios altos
                `<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <!-- Edificio principal alto -->
                    <rect x="10" y="4" width="4" height="18" fill="${color}" stroke="${color}" stroke-width="0.5"/>
                    <!-- Edificio mediano izquierdo -->
                    <rect x="6" y="8" width="3" height="14" fill="${color}" stroke="${color}" stroke-width="0.5"/>
                    <!-- Edificio bajo izquierdo -->
                    <rect x="2" y="14" width="3" height="8" fill="${color}" stroke="${color}" stroke-width="0.5"/>
                    <!-- Edificio mediano derecho -->
                    <rect x="15" y="10" width="3" height="12" fill="${color}" stroke="${color}" stroke-width="0.5"/>
                    <!-- Edificio bajo derecho -->
                    <rect x="19" y="16" width="3" height="6" fill="${color}" stroke="${color}" stroke-width="0.5"/>

                    <!-- Ventanas edificio principal -->
                    <rect x="11" y="6" width="0.8" height="0.8" fill="rgba(255,255,255,0.8)"/>
                    <rect x="12.2" y="6" width="0.8" height="0.8" fill="rgba(255,255,255,0.8)"/>
                    <rect x="11" y="8" width="0.8" height="0.8" fill="rgba(255,255,255,0.8)"/>
                    <rect x="12.2" y="8" width="0.8" height="0.8" fill="rgba(255,255,255,0.8)"/>
                    <rect x="11" y="10" width="0.8" height="0.8" fill="rgba(255,255,255,0.8)"/>
                    <rect x="12.2" y="10" width="0.8" height="0.8" fill="rgba(255,255,255,0.8)"/>

                    <!-- Ventanas edificio izquierdo -->
                    <rect x="6.5" y="10" width="0.6" height="0.6" fill="rgba(255,255,255,0.8)"/>
                    <rect x="7.4" y="10" width="0.6" height="0.6" fill="rgba(255,255,255,0.8)"/>
                    <rect x="6.5" y="12" width="0.6" height="0.6" fill="rgba(255,255,255,0.8)"/>
                    <rect x="7.4" y="12" width="0.6" height="0.6" fill="rgba(255,255,255,0.8)"/>

                    <!-- Ventanas edificio derecho -->
                    <rect x="15.5" y="12" width="0.6" height="0.6" fill="rgba(255,255,255,0.8)"/>
                    <rect x="16.4" y="12" width="0.6" height="0.6" fill="rgba(255,255,255,0.8)"/>
                    <rect x="15.5" y="14" width="0.6" height="0.6" fill="rgba(255,255,255,0.8)"/>
                    <rect x="16.4" y="14" width="0.6" height="0.6" fill="rgba(255,255,255,0.8)"/>

                    <!-- Antena en edificio principal -->
                    <line x1="12" y1="4" x2="12" y2="2" stroke="${color}" stroke-width="0.8"/>
                    <circle cx="12" cy="2" r="0.5" fill="${color}"/>

                    <!-- Base/suelo -->
                    <line x1="1" y1="22" x2="23" y2="22" stroke="${color}" stroke-width="1"/>
                </svg>`,

                // Diseño 2: Ciudad clásica con casas (el anterior)
                `<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 22V12C3 10.1144 3 9.17157 3.58579 8.58579C4.17157 8 5.11438 8 7 8C8.88562 8 9.82843 8 10.4142 8.58579C11 9.17157 11 10.1144 11 12" stroke="${color}" stroke-width="1.5"/>
                    <path d="M17 22V16C17 14.1144 17 13.1716 16.4142 12.5858C15.8284 12 14.8856 12 13 12H11C9.11438 12 8.17157 12 7.58579 12.5858C7 13.1716 7 14.1144 7 16V22" stroke="${color}" stroke-width="1.5"/>
                    <path d="M21 21.9999V7.77195C21 6.4311 21 5.76068 20.6439 5.24676C20.2877 4.73283 19.66 4.49743 18.4045 4.02663C15.9492 3.10591 14.7216 2.64555 13.8608 3.2421C13 3.83864 13 5.14974 13 7.77195V11.9999" stroke="${color}" stroke-width="1.5"/>
                    <path d="M4 8V6.5C4 5.55719 4 5.08579 4.29289 4.79289C4.58579 4.5 5.05719 4.5 6 4.5H8C8.94281 4.5 9.41421 4.5 9.70711 4.79289C10 5.08579 10 5.55719 10 6.5V8" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>
                    <path d="M7 4V2" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>
                    <path d="M22 22L2 22" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>
                    <path d="M10 15H14" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>
                    <path d="M10 18H14" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>
                </svg>`,

                // Diseño 3: Ciudad futurista con formas geométricas
                `<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <!-- Torre central -->
                    <rect x="11" y="3" width="2" height="19" fill="${color}" rx="1"/>
                    <!-- Edificios piramidales -->
                    <polygon points="5,22 8,22 6.5,12" fill="${color}" opacity="0.9"/>
                    <polygon points="16,22 19,22 17.5,10" fill="${color}" opacity="0.9"/>
                    <!-- Edificios cilíndricos -->
                    <circle cx="4" cy="18" r="1.5" fill="${color}"/>
                    <rect x="2.5" y="18" width="3" height="4" fill="${color}"/>
                    <circle cx="20" cy="19" r="1" fill="${color}"/>
                    <rect x="19" y="19" width="2" height="3" fill="${color}"/>

                    <!-- Luces/ventanas -->
                    <circle cx="6.5" cy="15" r="0.3" fill="rgba(255,255,255,0.9)"/>
                    <circle cx="17.5" cy="13" r="0.3" fill="rgba(255,255,255,0.9)"/>
                    <circle cx="12" cy="8" r="0.3" fill="rgba(255,255,255,0.9)"/>
                    <circle cx="12" cy="12" r="0.3" fill="rgba(255,255,255,0.9)"/>
                    <circle cx="12" cy="16" r="0.3" fill="rgba(255,255,255,0.9)"/>

                    <!-- Base -->
                    <line x1="1" y1="22" x2="23" y2="22" stroke="${color}" stroke-width="1.5"/>
                </svg>`,

                // Diseño 4: Ciudad con torres y cúpulas
                `<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <!-- Torre con cúpula central -->
                    <rect x="10" y="10" width="4" height="12" fill="${color}"/>
                    <ellipse cx="12" cy="10" rx="2.5" ry="3" fill="${color}"/>
                    <circle cx="12" cy="7" r="0.5" fill="${color}"/>

                    <!-- Torres laterales -->
                    <rect x="5" y="15" width="2.5" height="7" fill="${color}"/>
                    <ellipse cx="6.25" cy="15" rx="1.5" ry="2" fill="${color}"/>
                    <rect x="16.5" y="13" width="2.5" height="9" fill="${color}"/>
                    <ellipse cx="17.75" cy="13" rx="1.5" ry="2" fill="${color}"/>

                    <!-- Edificios pequeños -->
                    <rect x="2" y="18" width="2" height="4" fill="${color}"/>
                    <rect x="20" y="17" width="2" height="5" fill="${color}"/>

                    <!-- Detalles ornamentales -->
                    <circle cx="12" cy="15" r="0.4" fill="rgba(255,255,255,0.8)"/>
                    <circle cx="6.25" cy="18" r="0.3" fill="rgba(255,255,255,0.8)"/>
                    <circle cx="17.75" cy="16" r="0.3" fill="rgba(255,255,255,0.8)"/>

                    <!-- Base -->
                    <line x1="1" y1="22" x2="23" y2="22" stroke="${color}" stroke-width="1"/>
                </svg>`
            ]

            // Seleccionar un diseño aleatorio
            const randomDesign = svgDesigns[Math.floor(Math.random() * svgDesigns.length)]

            const blob = new Blob([randomDesign], { type: 'image/svg+xml' })
            const url = URL.createObjectURL(blob)

            const img = new Image()
            img.onload = () => {
                URL.revokeObjectURL(url)
                resolve(img)
            }
            img.onerror = reject
            img.src = url
        })
    }

    useEffect(() => {
        console.log('RouteVisualization useEffect triggered, routes:', routes)

        // Limpiar cualquier animación pendiente
        if (animationRef.current) {
            clearInterval(animationRef.current)
            animationRef.current = null
        }

        if (!canvasRef.current || !routes) {
            console.log('Saliendo early: canvas o routes no disponibles')
            return
        }

        // Filtrar rutas válidas que tengan origin y destiny definidos
        const validRoutes = routes.filter(route =>
            route?.origin?.name &&
            route?.destiny?.name
        )

        console.log('Valid routes for visualization:', validRoutes.length)

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        if (!ctx) {
            console.log('No se pudo obtener el contexto del canvas')
            return
        }

        // Limpiar completamente el canvas al inicio
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        if (validRoutes.length === 0) {
            console.log('No hay rutas válidas para visualizar, limpiando canvas')
            // Dibujar fondo vacío cuando no hay rutas
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
            gradient.addColorStop(0, '#1a1a2e')
            gradient.addColorStop(0.5, '#16213e')
            gradient.addColorStop(1, '#0f3460')
            ctx.fillStyle = gradient
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // Mensaje de "No hay rutas"
            ctx.font = 'bold 18px "Segoe UI", Arial, sans-serif'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillStyle = '#FFFFFF'
            ctx.fillText('No hay rutas para visualizar', canvas.width / 2, canvas.height / 2)
            return
        }

        // Clear canvas y agregar fondo atractivo
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        console.log('Canvas limpiado, iniciando redibujado')

        // Crear un gradiente de fondo elegante
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
        gradient.addColorStop(0, '#1a1a2e')
        gradient.addColorStop(0.5, '#16213e')
        gradient.addColorStop(1, '#0f3460')

        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Get unique cities
        const cities = new Set<string>()
        validRoutes.forEach((route) => {
            if (route.origin?.name) cities.add(route.origin.name)
            if (route.destiny?.name) cities.add(route.destiny.name)
            route.intermediateStops?.forEach((stop) => cities.add(stop))
        })

        // Generate unique colors for each city
        const cityColors = getCityColors(Array.from(cities))

        // Calculate positions and create colored SVGs for each city
        const positions = new Map<string, { x: number; y: number }>()
        const cityImages = new Map<string, HTMLImageElement>()
        const radius = Math.min(canvas.width, canvas.height) * 0.4
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2

        const initializeVisualization = async () => {
            // Create positions and colored SVGs for each city
            const cityArray = Array.from(cities)

            const cityPromises = cityArray.map(async (city, index) => {
                const angle = (index * 2 * Math.PI) / cities.size
                positions.set(city, {
                    x: centerX + radius * Math.cos(angle),
                    y: centerY + radius * Math.sin(angle),
                })

                const color = cityColors.get(city) || '#FF6B6B'
                const coloredSVG = await createColoredSVG(color)
                cityImages.set(city, coloredSVG)
            })

            await Promise.all(cityPromises)

            // Draw routes with elegant styling
            const circleRadius = 20 // Radio del círculo
            const lineMargin = 8 // Margen adicional para separar la línea del círculo
            const totalOffset = circleRadius + lineMargin

            validRoutes.forEach((route) => {
                const origin = positions.get(route.origin?.name)
                const destination = positions.get(route.destiny?.name)

                if (origin && destination && route.origin?.name && route.destiny?.name) {
                    // Calcular el vector de dirección
                    const dx = destination.x - origin.x
                    const dy = destination.y - origin.y
                    const distance = Math.sqrt(dx * dx + dy * dy)

                    // Normalizar el vector de dirección
                    const unitX = dx / distance
                    const unitY = dy / distance

                    // Calcular los puntos de inicio y fin con offset
                    const startX = origin.x + unitX * totalOffset
                    const startY = origin.y + unitY * totalOffset
                    const endX = destination.x - unitX * totalOffset
                    const endY = destination.y - unitY * totalOffset

                    // Crear gradiente para la línea
                    const gradient = ctx.createLinearGradient(startX, startY, endX, endY)
                    if (route.isDirectRoute) {
                        gradient.addColorStop(0, '#4FC3F7')
                        gradient.addColorStop(1, '#29B6F6')
                    } else {
                        gradient.addColorStop(0, '#FF7043')
                        gradient.addColorStop(1, '#FF5722')
                    }

                    // Dibujar sombra sutil
                    ctx.beginPath()
                    ctx.moveTo(startX + 1, startY + 1)
                    ctx.lineTo(endX + 1, endY + 1)
                    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)'
                    ctx.lineWidth = 3
                    ctx.stroke()

                    // Dibujar línea principal con gradiente
                    ctx.beginPath()
                    ctx.moveTo(startX, startY)
                    ctx.lineTo(endX, endY)
                    ctx.strokeStyle = gradient
                    ctx.lineWidth = 2.5
                    ctx.lineCap = 'round'
                    ctx.stroke()

                    // Añadir puntos decorativos en los extremos
                    const drawEndPoint = (x: number, y: number, color: string) => {
                        ctx.beginPath()
                        ctx.arc(x, y, 3, 0, 2 * Math.PI)
                        ctx.fillStyle = color
                        ctx.fill()
                        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
                        ctx.lineWidth = 1
                        ctx.stroke()
                    }

                    drawEndPoint(startX, startY, route.isDirectRoute ? '#29B6F6' : '#FF5722')
                    drawEndPoint(endX, endY, route.isDirectRoute ? '#29B6F6' : '#FF5722')
                }
            })

            // Draw cities with modern design
            positions.forEach(({ x, y }, city) => {
                const img = cityImages.get(city)
                const cityColor = cityColors.get(city) || '#FF6B6B'

                // Dibujar círculo de fondo con gradiente
                const gradient = ctx.createRadialGradient(x, y, 0, x, y, 22)
                gradient.addColorStop(0, `${cityColor}40`) // 25% opacity
                gradient.addColorStop(1, `${cityColor}20`) // 12% opacity

                ctx.beginPath()
                ctx.arc(x, y, 22, 0, 2 * Math.PI)
                ctx.fillStyle = gradient
                ctx.fill()

                if (img) {
                    // Dibujar la imagen SVG con mejor tamaño
                    const iconSize = 28
                    ctx.drawImage(img, x - iconSize / 2, y - iconSize / 2, iconSize, iconSize)
                }

                // Dibujar borde elegante
                ctx.beginPath()
                ctx.arc(x, y, 20, 0, 2 * Math.PI)
                ctx.strokeStyle = cityColor
                ctx.lineWidth = 2.5
                ctx.stroke()

                // Borde interno más sutil
                ctx.beginPath()
                ctx.arc(x, y, 18, 0, 2 * Math.PI)
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
                ctx.lineWidth = 1
                ctx.stroke()

                // Texto de la ciudad con mejor diseño y posicionamiento
                ctx.font = 'bold 14px "Segoe UI", Arial, sans-serif'
                ctx.textAlign = 'center'
                ctx.textBaseline = 'top'

                // Calcular posición del texto para evitar solapamiento
                const textY = y + 32

                // Fondo semi-transparente para el texto
                const textMetrics = ctx.measureText(city)
                const textWidth = textMetrics.width
                const textHeight = 16
                const padding = 4

                ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
                ctx.fillRect(
                    x - textWidth / 2 - padding,
                    textY - padding,
                    textWidth + padding * 2,
                    textHeight + padding * 2
                )

                // Texto principal con mejor contraste
                ctx.fillStyle = '#FFFFFF'
                ctx.fillText(city, x, textY)
            })

            // Función para resaltar rutas de manera elegante
            const highlightRoutes = () => {
                let currentIndex = 0
                animationRef.current = setInterval(() => {
                    // Limpiar canvas y redibujar fondo
                    ctx.clearRect(0, 0, canvas.width, canvas.height)

                    // Redibujar el fondo gradiente
                    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
                    gradient.addColorStop(0, '#1a1a2e')
                    gradient.addColorStop(0.5, '#16213e')
                    gradient.addColorStop(1, '#0f3460')

                    ctx.fillStyle = gradient
                    ctx.fillRect(0, 0, canvas.width, canvas.height)

                    const circleRadius = 20
                    const lineMargin = 8
                    const totalOffset = circleRadius + lineMargin

                    // Redibujar todas las rutas
                    validRoutes.forEach((route, index) => {
                        const origin = positions.get(route.origin?.name)
                        const destination = positions.get(route.destiny?.name)

                        if (origin && destination && route.origin?.name && route.destiny?.name) {
                            const dx = destination.x - origin.x
                            const dy = destination.y - origin.y
                            const distance = Math.sqrt(dx * dx + dy * dy)
                            const unitX = dx / distance
                            const unitY = dy / distance
                            const startX = origin.x + unitX * totalOffset
                            const startY = origin.y + unitY * totalOffset
                            const endX = destination.x - unitX * totalOffset
                            const endY = destination.y - unitY * totalOffset

                            const isHighlighted = index === currentIndex
                            const opacity = isHighlighted ? 1 : 0.3

                            // Crear gradiente para la línea
                            const gradient = ctx.createLinearGradient(startX, startY, endX, endY)
                            if (route.isDirectRoute) {
                                gradient.addColorStop(0, `rgba(79, 195, 247, ${opacity})`)
                                gradient.addColorStop(1, `rgba(41, 182, 246, ${opacity})`)
                            } else {
                                gradient.addColorStop(0, `rgba(255, 112, 67, ${opacity})`)
                                gradient.addColorStop(1, `rgba(255, 87, 34, ${opacity})`)
                            }

                            // Línea
                            ctx.beginPath()
                            ctx.moveTo(startX, startY)
                            ctx.lineTo(endX, endY)
                            ctx.strokeStyle = gradient
                            ctx.lineWidth = isHighlighted ? 4 : 2.5
                            ctx.lineCap = 'round'
                            ctx.stroke()

                            // Puntos decorativos
                            if (isHighlighted) {
                                const color = route.isDirectRoute ? '#29B6F6' : '#FF5722'
                                ctx.beginPath()
                                ctx.arc(startX, startY, 4, 0, 2 * Math.PI)
                                ctx.fillStyle = color
                                ctx.fill()
                                ctx.beginPath()
                                ctx.arc(endX, endY, 4, 0, 2 * Math.PI)
                                ctx.fillStyle = color
                                ctx.fill()
                            }
                        }
                    })

                    // Redibujar las ciudades
                    positions.forEach(({ x, y }, city) => {
                        const img = cityImages.get(city)
                        const cityColor = cityColors.get(city) || '#FF6B6B'

                        // Círculo de fondo con gradiente
                        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 22)
                        gradient.addColorStop(0, `${cityColor}40`)
                        gradient.addColorStop(1, `${cityColor}20`)

                        ctx.beginPath()
                        ctx.arc(x, y, 22, 0, 2 * Math.PI)
                        ctx.fillStyle = gradient
                        ctx.fill()

                        if (img) {
                            const iconSize = 28
                            ctx.drawImage(img, x - iconSize / 2, y - iconSize / 2, iconSize, iconSize)
                        }

                        // Borde elegante
                        ctx.beginPath()
                        ctx.arc(x, y, 20, 0, 2 * Math.PI)
                        ctx.strokeStyle = cityColor
                        ctx.lineWidth = 2.5
                        ctx.stroke()

                        // Borde interno
                        ctx.beginPath()
                        ctx.arc(x, y, 18, 0, 2 * Math.PI)
                        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
                        ctx.lineWidth = 1
                        ctx.stroke()

                        // Texto con mejor diseño y posicionamiento
                        ctx.font = 'bold 14px "Segoe UI", Arial, sans-serif'
                        ctx.textAlign = 'center'
                        ctx.textBaseline = 'top'

                        // Calcular posición del texto
                        const textY = y + 32

                        // Fondo semi-transparente para el texto
                        const textMetrics = ctx.measureText(city)
                        const textWidth = textMetrics.width
                        const textHeight = 16
                        const padding = 4

                        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
                        ctx.fillRect(
                            x - textWidth / 2 - padding,
                            textY - padding,
                            textWidth + padding * 2,
                            textHeight + padding * 2
                        )

                        // Texto principal
                        ctx.fillStyle = '#FFFFFF'
                        ctx.fillText(city, x, textY)
                    })

                    currentIndex = (currentIndex + 1) % validRoutes.length

                    if (currentIndex === 0) {
                        if (animationRef.current) {
                            clearInterval(animationRef.current)
                            animationRef.current = null
                        }
                    }
                }, 1500)
            }

            // Iniciar animación después de un breve delay
            setTimeout(() => {
                if (validRoutes.length > 0) {
                    highlightRoutes()
                }
            }, 500)
        }

        initializeVisualization()

        // Cleanup function
        return () => {
            if (animationRef.current) {
                clearInterval(animationRef.current)
                animationRef.current = null
            }
        }
    }, [routes])

    return (
        <div className='w-full bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 rounded-lg'>
            <canvas
                ref={canvasRef}
                width={800}
                height={500}
                className='w-full border rounded-lg'
            />
        </div>
    )
}

export default RouteVisualization

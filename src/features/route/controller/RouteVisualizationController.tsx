import ReactDOMServer from 'react-dom/server'
import { City } from '@/shared/types/entities/City'
import { Route } from '@/shared/types/entities/Route'
import { CITY_SVG_TYPES } from '@/features/city/constants/cts'
import { DEFAULT_COLORS } from '@/shared/constants/cts'

/**
 * Controlador para funciones de visualización de rutas
 */
export class RouteVisualizationController {
  // Cache persistente de posiciones para evitar reposicionamiento
  private static readonly cityPositionCache = new Map<string, { x: number; y: number }>()

  // Configuración de espaciado y distribución
  private static readonly POSITION_CONFIG = {
    MIN_CITY_DISTANCE: 80, // Distancia mínima entre ciudades
    MAX_PLACEMENT_ATTEMPTS: 50, // Máximo intentos para encontrar posición válida
    ANGLE_INCREMENT: Math.PI / 20, // Incremento de ángulo por intento (9 grados)
    RADIUS_INCREMENT: 20, // Incremento de radio si no hay espacio
    MAX_RADIUS_MULTIPLIER: 1.8 // Máximo multiplicador del radio base
  }

  /**
   * Resetea el cache de posiciones (útil para testing o reinicio manual)
   */
  static resetPositionCache(): void {
    this.cityPositionCache.clear()
  }

  /**
   * Crea un SVG coloreado para una ciudad
   */
  static createColoredSVG(city: City) {
    const svgType = CITY_SVG_TYPES.find(svg => svg.value === city.svgType)

    if (!svgType) {
      console.warn(`SVG type not found for city: ${city.name}, svgType: ${city.svgType}`)
      // Usar el primer tipo por defecto si no se encuentra
      const defaultSvgType = CITY_SVG_TYPES[0]
      if (defaultSvgType) {
        const DefaultComponent = defaultSvgType.component
        return <DefaultComponent color={city.color || '#FF6B6B'} width={64} height={64} />
      }
      return null
    }

    const SvgComponent = svgType.component
    return (
      <SvgComponent color={city.color || '#FF6B6B'} width={64} height={64} />
    )
  }

  /**
   * Función para generar colores únicos para cada ciudad con buen contraste
   */
  static getCityColors(cities: City[]): Map<string | number, string> {
    const cityColors = new Map<string | number, string>()
    const colors = DEFAULT_COLORS
    cities.forEach((city, index) => {
      cityColors.set(city.id ?? city.name, city.color ?? colors[index % colors.length])
    })

    return cityColors
  }

  /**
   * Helper para cargar un SVG coloreado como HTMLImageElement
   */
  static loadCitySVGImage(coloredSVG: React.ReactNode): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const svgString = ReactDOMServer.renderToStaticMarkup(coloredSVG as React.ReactElement)
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(svgBlob)
      const img = new Image()
      img.src = url
      img.onerror = (e) => {
        URL.revokeObjectURL(url)
        let errorMessage: string
        if (typeof e === 'string') {
          errorMessage = e
        } else if (e instanceof Error) {
          errorMessage = e.message
        } else {
          errorMessage = 'Image load error'
        }
        reject(new Error(errorMessage))
      }
      img.onload = () => {
        URL.revokeObjectURL(url)
        resolve(img)
      }
    })
  }

  /**
   * Verificar si una posición está muy cerca de otras ciudades existentes
   */
  static isPositionTooClose(
    x: number,
    y: number,
    existingPositions: Array<{ x: number; y: number }>,
    minDistance: number
  ): boolean {
    return existingPositions.some(pos =>
      this.calculateDistance(pos.x, pos.y, x, y) < minDistance
    )
  }

  /**
   * Encuentra una posición válida para una nueva ciudad evitando colisiones
   */
  static findValidPosition(
    canvas: HTMLCanvasElement,
    baseRadius: number,
    baseAngle: number,
    existingPositions: Array<{ x: number; y: number }>
  ): { x: number; y: number } {
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const { MIN_CITY_DISTANCE, MAX_PLACEMENT_ATTEMPTS, ANGLE_INCREMENT, RADIUS_INCREMENT, MAX_RADIUS_MULTIPLIER } = this.POSITION_CONFIG

    let currentRadius = baseRadius
    const maxRadius = baseRadius * MAX_RADIUS_MULTIPLIER
    const margin = 50

    while (currentRadius <= maxRadius) {
      let currentAngle = baseAngle
      let attempts = 0

      while (attempts < MAX_PLACEMENT_ATTEMPTS) {
        const x = centerX + currentRadius * Math.cos(currentAngle)
        const y = centerY + currentRadius * Math.sin(currentAngle)

        const isInBounds = x >= margin && x <= canvas.width - margin && y >= margin && y <= canvas.height - margin
        const isFarEnough = !this.isPositionTooClose(x, y, existingPositions, MIN_CITY_DISTANCE)

        if (isInBounds && isFarEnough) {
          return { x, y }
        }

        currentAngle += ANGLE_INCREMENT
        attempts++
      }

      currentRadius += RADIUS_INCREMENT
    }

    // Fallback a posición base
    console.warn('No se pudo encontrar posición óptima, usando posición base')
    return {
      x: centerX + baseRadius * Math.cos(baseAngle),
      y: centerY + baseRadius * Math.sin(baseAngle)
    }
  }

  /**
   * Calcula las posiciones de las ciudades de forma persistente y sin colisiones
   */
  static calculateCityPositions(cities: City[], canvas: HTMLCanvasElement): Map<string, { x: number; y: number }> {
    const positions = new Map<string, { x: number; y: number }>()

    // Validar parámetros de entrada
    if (!cities.length || !canvas.width || !canvas.height) {
      console.warn('Invalid parameters for city position calculation:', {
        citiesLength: cities.length,
        canvasWidth: canvas.width,
        canvasHeight: canvas.height
      })
      return positions
    }

    const baseRadius = Math.min(canvas.width, canvas.height) * this.VISUALIZATION_CONFIG.CANVAS_RADIUS_FACTOR
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // Validar que los valores calculados son finitos
    if (!Number.isFinite(baseRadius) || !Number.isFinite(centerX) || !Number.isFinite(centerY)) {
      console.warn('Invalid calculated values:', { baseRadius, centerX, centerY })
      return positions
    }

    // Primero, cargar las posiciones ya existentes en el cache
    const existingPositions: Array<{ x: number; y: number }> = []
    cities.forEach(city => {
      if (!city.name) return

      if (this.cityPositionCache.has(city.name)) {
        const cachedPosition = this.cityPositionCache.get(city.name)!
        positions.set(city.name, cachedPosition)
        existingPositions.push(cachedPosition)
      }
    })

    // Luego, calcular posiciones para ciudades nuevas
    let newCityIndex = 0
    const newCities = cities.filter(city => city.name && !this.cityPositionCache.has(city.name))

    for (const city of newCities) {
      if (!city.name) continue

      // Calcular ángulo base para distribución uniforme
      const totalCities = this.cityPositionCache.size + newCities.length
      const baseAngle = (newCityIndex * 2 * Math.PI) / Math.max(totalCities, 3) // Mínimo 3 para evitar divisiones pequeñas

      // Encontrar posición válida
      const validPosition = this.findValidPosition(canvas, baseRadius, baseAngle, existingPositions)

      if (validPosition && Number.isFinite(validPosition.x) && Number.isFinite(validPosition.y)) {
        // Guardar en cache y en el resultado
        this.cityPositionCache.set(city.name, validPosition)
        positions.set(city.name, validPosition)
        existingPositions.push(validPosition)
      } else {
        console.warn(`❌ No se pudo posicionar la ciudad: ${city.name}`)
      }

      newCityIndex++
    }

    return positions
  }

  /**
   * Obtiene estadísticas del cache de posiciones
   */
  static getPositionCacheStats(): { totalCities: number; cacheSize: number; cities: string[] } {
    return {
      totalCities: this.cityPositionCache.size,
      cacheSize: this.cityPositionCache.size,
      cities: Array.from(this.cityPositionCache.keys())
    }
  }

  /**
   * Añadir puntos decorativos en los extremos
   */
  static drawEndPoint(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
    ctx.beginPath()
    ctx.arc(x, y, 3, 0, 2 * Math.PI)
    ctx.fillStyle = color
    ctx.fill()
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.lineWidth = 1
    ctx.stroke()
  }

  /**
   * Dibuja una flecha direccional al final de una línea
   */
  static drawArrowHead(
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    color: string,
    size: number = 10
  ) {
    const angle = Math.atan2(toY - fromY, toX - fromX)

    ctx.save()
    ctx.translate(toX, toY)
    ctx.rotate(angle)

    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(-size, -size / 2)
    ctx.lineTo(-size, size / 2)
    ctx.closePath()

    ctx.fillStyle = color
    ctx.fill()
    ctx.strokeStyle = color
    ctx.lineWidth = 1
    ctx.stroke()

    ctx.restore()
  }

  /**
   * Dibuja el fondo gradiente del canvas
   */
  static drawBackground(ctx: CanvasRenderingContext2D, width: number, height: number) {
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, this.VISUALIZATION_CONFIG.BACKGROUND_COLORS.START)
    gradient.addColorStop(0.5, this.VISUALIZATION_CONFIG.BACKGROUND_COLORS.MIDDLE)
    gradient.addColorStop(1, this.VISUALIZATION_CONFIG.BACKGROUND_COLORS.END)

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
  }

  /**
   * Dibuja una ruta individual con estilo direccional
   * Ahora soporta tres estados: normal, highlighted (activa), y explored (visitada/descartada)
   * Soporta curvas Bézier cuadráticas para evitar superposición de aristas bidireccionales
   */
  static drawRoute(
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    isHighlighted: boolean = false,
    isExplored: boolean = false,
    controlPoint?: { cpX: number; cpY: number }
  ) {
    // Validar que todas las coordenadas son números finitos
    if (!Number.isFinite(startX) || !Number.isFinite(startY) ||
      !Number.isFinite(endX) || !Number.isFinite(endY)) {
      console.warn('Invalid coordinates for route drawing:', { startX, startY, endX, endY })
      return
    }

    // Validar punto de control si existe
    if (controlPoint && (!Number.isFinite(controlPoint.cpX) || !Number.isFinite(controlPoint.cpY))) {
      console.warn('Invalid control point, drawing straight line instead')
      controlPoint = undefined
    }

    // Validar que las coordenadas no son iguales (evitar líneas de longitud cero)
    if (startX === endX && startY === endY) {
      console.warn('Start and end coordinates are the same, skipping route')
      return
    }

    // Determinar estilo según el estado
    let lineWidth: number
    let colors: { start: string; middle?: string; end: string }

    if (isHighlighted) {
      // Ruta activa: dorado brillante
      lineWidth = 8
      colors = {
        start: 'rgba(255, 215, 0, 1)',    // Dorado brillante
        middle: 'rgba(255, 165, 0, 1)',   // Naranja brillante
        end: 'rgba(255, 69, 0, 1)'        // Rojo-naranja brillante
      }
    } else if (isExplored) {
      // Ruta explorada (backtracked): azul semitransparente
      lineWidth = 3.5
      colors = {
        start: 'rgba(100, 149, 237, 0.5)',  // Azul cornflower semitransparente
        end: 'rgba(65, 105, 225, 0.5)'      // Azul royal semitransparente
      }
    } else {
      // Ruta normal: colores por defecto
      lineWidth = 2.5
      const defaultColors = this.VISUALIZATION_CONFIG.DIRECT_ROUTE_COLORS
      colors = {
        start: `rgba(${this.hexToRgb(defaultColors.START)}, 0.6)`,
        end: `rgba(${this.hexToRgb(defaultColors.END)}, 0.6)`
      }
    }

    // Crear gradiente para la línea
    const gradient = ctx.createLinearGradient(startX, startY, endX, endY)
    gradient.addColorStop(0, colors.start)
    if (colors.middle) {
      gradient.addColorStop(0.5, colors.middle)
    }
    gradient.addColorStop(1, colors.end)

    // Calcular punto final para la flecha ANTES de dibujar la línea
    let arrowEndX = endX
    let arrowEndY = endY
    let arrowStartX = startX
    let arrowStartY = startY

    // Determinar tamaño de flecha según estado
    let arrowSize: number
    if (isHighlighted) {
      arrowSize = 18
    } else if (isExplored) {
      arrowSize = 12
    } else {
      arrowSize = 10
    }

    // Calcular punto donde termina la línea (antes de la flecha)
    let lineEndX = endX
    let lineEndY = endY

    if (controlPoint) {
      // Para curvas, calcular el punto donde terminará la línea (antes de la flecha)
      const tEnd = 0.97 // Punto donde termina la línea
      arrowEndX = endX
      arrowEndY = endY

      // Para calcular la dirección correcta de la flecha, usar la tangente en tEnd
      // La derivada de una curva Bézier cuadrática es: B'(t) = 2(1-t)(P1-P0) + 2t(P2-P1)
      // donde P0=start, P1=controlPoint, P2=end
      const tangentX = 2 * (1 - tEnd) * (controlPoint.cpX - startX) + 2 * tEnd * (endX - controlPoint.cpX)
      const tangentY = 2 * (1 - tEnd) * (controlPoint.cpY - startY) + 2 * tEnd * (endY - controlPoint.cpY)

      // Normalizar la tangente
      const tangentLength = Math.sqrt(tangentX * tangentX + tangentY * tangentY)
      const unitTangentX = tangentLength > 0 ? tangentX / tangentLength : 0
      const unitTangentY = tangentLength > 0 ? tangentY / tangentLength : 0

      // Calcular el punto de inicio de la flecha retrocediendo desde lineEnd en la dirección de la tangente
      const arrowBackOffset = 15 // Distancia para calcular la dirección de la flecha
      arrowStartX = lineEndX - unitTangentX * arrowBackOffset
      arrowStartY = lineEndY - unitTangentY * arrowBackOffset
    } else {
      // Para líneas rectas, retroceder desde el punto final
      const dx = endX - startX
      const dy = endY - startY
      const length = Math.sqrt(dx * dx + dy * dy)

      if (length > 0) {
        const unitX = dx / length
        const unitY = dy / length

        // La línea termina antes de la flecha
        const lineOffset = arrowSize  // Espacio para la flecha
        lineEndX = endX - unitX * lineOffset
        lineEndY = endY - unitY * lineOffset

        // La flecha va desde donde termina la línea hasta el borde del círculo
        arrowStartX = lineEndX
        arrowStartY = lineEndY
        arrowEndX = endX
        arrowEndY = endY
      }
    }

    // Dibujar la curva o línea (termina ANTES de la flecha)
    ctx.beginPath()
    ctx.moveTo(startX, startY)

    if (controlPoint) {
      // Dibujar curva Bézier cuadrática hasta lineEndX/lineEndY
      ctx.quadraticCurveTo(controlPoint.cpX, controlPoint.cpY, lineEndX, lineEndY)
    } else {
      // Dibujar línea recta hasta lineEndX/lineEndY
      ctx.lineTo(lineEndX, lineEndY)
    }

    ctx.strokeStyle = gradient
    ctx.lineWidth = lineWidth
    ctx.lineCap = 'round'

    // Dibujar sombra brillante si está resaltada
    if (isHighlighted) {
      ctx.shadowColor = 'rgba(255, 215, 0, 0.8)'
      ctx.shadowBlur = 15
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0
    }

    ctx.stroke()

    // Resetear sombra
    if (isHighlighted) {
      ctx.shadowColor = 'transparent'
      ctx.shadowBlur = 0
    }

    // Dibujar flecha direccional
    let arrowColor: string

    if (isHighlighted) {
      arrowColor = '#FFD700'
    } else if (isExplored) {
      arrowColor = 'rgba(100, 149, 237, 0.7)'
    } else {
      arrowColor = this.VISUALIZATION_CONFIG.DIRECT_ROUTE_COLORS.END
    }

    this.drawArrowHead(ctx, arrowStartX, arrowStartY, arrowEndX, arrowEndY, arrowColor, arrowSize)

    // Puntos decorativos en los extremos
    this.drawEndPoint(ctx, startX, startY, arrowColor)
  }

  /**
   * Convierte un color hexadecimal a RGB
   */
  static hexToRgb(hex: string): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) return '0, 0, 0'

    const r = parseInt(result[1], 16)
    const g = parseInt(result[2], 16)
    const b = parseInt(result[3], 16)

    return `${r}, ${g}, ${b}`
  }

  /**
   * Dibuja una ciudad con diseño moderno
   */
  static drawCity(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    cityName: string,
    cityColor: string,
    img: HTMLImageElement | undefined,
    isHighlighted: boolean = false
  ) {
    // Guardar el estado del contexto
    ctx.save()

    const radius = isHighlighted ? 25 : 22
    const borderWidth = isHighlighted ? 3.5 : 2.5
    const iconSize = isHighlighted ? 32 : 28

    // Dibujar círculo de fondo con gradiente
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
    const opacity = isHighlighted ? '60' : '40'
    gradient.addColorStop(0, `${cityColor}${opacity}`)
    gradient.addColorStop(1, `${cityColor}20`)

    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI)
    ctx.fillStyle = gradient
    ctx.fill()

    // Dibujar imagen si existe y está completamente cargada
    if (img && img.complete && img.naturalWidth > 0) {
      try {
        // Asegurar que el contexto está listo para dibujar la imagen
        ctx.globalCompositeOperation = 'source-over'
        ctx.globalAlpha = 1

        ctx.drawImage(img, x - iconSize / 2, y - iconSize / 2, iconSize, iconSize)
      } catch (e) {
        console.error(`❌ Error drawing image for city ${cityName}:`, e)
      }
    } else {
      // Dibujar un icono de fallback (un círculo simple)
      ctx.beginPath()
      ctx.arc(x, y, iconSize / 4, 0, 2 * Math.PI)
      ctx.fillStyle = cityColor
      ctx.fill()
    }

    // Dibujar borde principal
    ctx.beginPath()
    ctx.arc(x, y, radius - 2, 0, 2 * Math.PI)
    ctx.strokeStyle = isHighlighted ? '#FFFFFF' : cityColor
    ctx.lineWidth = borderWidth
    ctx.stroke()

    // Borde interno si está resaltada
    if (isHighlighted) {
      ctx.beginPath()
      ctx.arc(x, y, radius - 5, 0, 2 * Math.PI)
      ctx.strokeStyle = cityColor
      ctx.lineWidth = 2
      ctx.stroke()
    }

    // Texto de la ciudad
    this.drawCityText(ctx, x, y, cityName, isHighlighted)

    // Restaurar el estado del contexto
    ctx.restore()
  }

  /**
   * Dibuja el texto de una ciudad
   */
  static drawCityText(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    cityName: string,
    isHighlighted: boolean = false
  ) {
    const fontSize = isHighlighted ? 16 : 14
    const textY = y + (isHighlighted ? 38 : 32)

    ctx.font = `bold ${fontSize}px "Segoe UI", Arial, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'

    // Calcular dimensiones del fondo del texto
    const textMetrics = ctx.measureText(cityName)
    const textWidth = textMetrics.width
    const textHeight = fontSize + 2
    const padding = isHighlighted ? 6 : 4

    // Fondo del texto
    ctx.fillStyle = isHighlighted ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.6)'
    ctx.fillRect(
      x - textWidth / 2 - padding,
      textY - padding,
      textWidth + padding * 2,
      textHeight + padding * 2
    )

    // Texto principal
    ctx.fillStyle = isHighlighted ? '#FFFF00' : '#FFFFFF'
    ctx.fillText(cityName, x, textY)
  }

  /**
   * Obtiene ciudades únicas de las rutas válidas
   */
  static getUniqueCities(validRoutes: Route[]): City[] {
    const cities = new Set<City>()
    validRoutes.forEach((route) => {
      if (route.origin) cities.add(route.origin)
      if (route.destiny) cities.add(route.destiny)
    })
    return Array.from(cities)
  }

  /**
   * Carga las imágenes SVG de todas las ciudades
   */
  static async loadCityImages(cities: City[]): Promise<Map<string, HTMLImageElement>> {
    const cityImages = new Map<string, HTMLImageElement>()

    // Obtener ciudades únicas por nombre para evitar cargar duplicados
    const uniqueCities = cities.filter((city, index, self) =>
      index === self.findIndex(c => c.name === city.name)
    )

    const imagePromises = uniqueCities.map(async (city) => {
      try {
        const coloredSVG = this.createColoredSVG(city)
        if (coloredSVG) {
          const img = await this.loadCitySVGImage(coloredSVG)

          // Esperar a que la imagen esté completamente lista
          await new Promise<void>((resolve) => {
            if (img.complete && img.naturalWidth > 0) {
              resolve()
            } else {
              img.onload = () => resolve()
              // Timeout de seguridad
              setTimeout(() => resolve(), 1000)
            }
          })

          cityImages.set(city.name, img)
        }
      } catch (e) {
        console.error(`❌ Error loading SVG image for city ${city.name}:`, e)
      }
    })

    await Promise.all(imagePromises)
    return cityImages
  }

  /**
   * Analiza las rutas para detectar duplicados bidireccionales (A->B y B->A)
   */
  static analyzeRouteConnections(validRoutes: Route[]): Map<string, number> {
    const connectionCount = new Map<string, number>()

    validRoutes.forEach((route) => {
      if (!route.origin?.name || !route.destiny?.name) return

      // Crear clave ordenada alfabéticamente para identificar conexiones bidireccionales
      const cities = [route.origin.name, route.destiny.name].sort((a, b) => a.localeCompare(b))
      const connectionKey = `${cities[0]}<->${cities[1]}`

      connectionCount.set(connectionKey, (connectionCount.get(connectionKey) || 0) + 1)
    })

    return connectionCount
  }

  /**
   * Calcula el índice de curvatura para una ruta específica entre dos ciudades
   */
  static getRouteCurveIndex(
    originName: string,
    destinyName: string,
    validRoutes: Route[],
    currentRouteId?: string | number
  ): { curveIndex: number; totalRoutes: number } {
    // Filtrar rutas entre estas dos ciudades (en ambas direcciones)
    const routesBetweenCities = validRoutes.filter(r =>
      (r.origin?.name === originName && r.destiny?.name === destinyName) ||
      (r.origin?.name === destinyName && r.destiny?.name === originName)
    )

    // Encontrar el índice de la ruta actual
    const currentIndex = routesBetweenCities.findIndex(r => r.id === currentRouteId)

    return {
      curveIndex: Math.max(0, currentIndex),
      totalRoutes: routesBetweenCities.length
    }
  }

  /**
   * Calcula un punto de entrada/salida ajustado en el círculo de la ciudad
   * para evitar superposición cuando hay múltiples aristas
   */
  static calculateCircleEntryPoint(
    centerX: number,
    centerY: number,
    targetX: number,
    targetY: number,
    curveIndex: number,
    totalRoutes: number
  ): { x: number; y: number } {
    const radius = this.VISUALIZATION_CONFIG.CIRCLE_RADIUS + this.VISUALIZATION_CONFIG.LINE_MARGIN

    // Calcular ángulo base hacia el objetivo
    const baseAngle = Math.atan2(targetY - centerY, targetX - centerX)

    // Si hay múltiples rutas, distribuir los puntos de entrada alrededor del círculo
    let angleOffset = 0
    if (totalRoutes > 1) {
      // Rango de dispersión (en radianes): ±20 grados por defecto
      const maxSpread = Math.PI / 9 // ~20 grados
      const spreadPerRoute = (maxSpread * 2) / Math.max(totalRoutes - 1, 1)
      angleOffset = -maxSpread + (curveIndex * spreadPerRoute)
    }

    const finalAngle = baseAngle + angleOffset

    return {
      x: centerX + Math.cos(finalAngle) * radius,
      y: centerY + Math.sin(finalAngle) * radius
    }
  }  /**
   * Calcula el punto de control para una curva Bézier cuadrática
   */
  static calculateBezierControlPoint(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    curveIntensity: number,
    isUpward: boolean
  ): { cpX: number; cpY: number } {
    // Punto medio de la línea
    const midX = (startX + endX) / 2
    const midY = (startY + endY) / 2

    // Vector perpendicular a la línea
    const dx = endX - startX
    const dy = endY - startY

    // Vector perpendicular (rotado 90 grados)
    const perpX = -dy
    const perpY = dx

    // Normalizar el vector perpendicular
    const length = Math.sqrt(perpX * perpX + perpY * perpY)
    const unitPerpX = length > 0 ? perpX / length : 0
    const unitPerpY = length > 0 ? perpY / length : 0

    // Determinar dirección de la curva basado en la relación entre ciudades
    const direction = isUpward ? 1 : -1

    // Calcular punto de control
    const cpX = midX + unitPerpX * curveIntensity * direction
    const cpY = midY + unitPerpY * curveIntensity * direction

    return { cpX, cpY }
  }

  /**
   * Dibuja todas las rutas en el canvas con curvas Bézier para evitar superposición
   */
  static drawAllRoutes(
    ctx: CanvasRenderingContext2D,
    validRoutes: Route[],
    positions: Map<string, { x: number; y: number }>,
    highlightedRouteIds?: Set<string | number>,
    exploredRouteIds?: Set<string | number>
  ): void {
    // Analizar conexiones para detectar rutas bidireccionales
    const connectionCount = this.analyzeRouteConnections(validRoutes)

    validRoutes.forEach((route) => {
      const origin = positions.get(route.origin?.name || '')
      const destination = positions.get(route.destiny?.name || '')

      if (origin && destination && route.origin?.name && route.destiny?.name) {
        // Validar que las posiciones son válidas antes de calcular los puntos
        if (!Number.isFinite(origin.x) || !Number.isFinite(origin.y) ||
          !Number.isFinite(destination.x) || !Number.isFinite(destination.y)) {
          console.warn('Invalid origin or destination coordinates:', {
            origin, destination,
            routeId: route.id
          })
          return
        }

        // Obtener índice de curvatura
        const { curveIndex, totalRoutes } = this.getRouteCurveIndex(
          route.origin.name,
          route.destiny.name,
          validRoutes,
          route.id
        )

        // Calcular puntos de entrada/salida ajustados en los círculos
        const adjustedStart = this.calculateCircleEntryPoint(
          origin.x,
          origin.y,
          destination.x,
          destination.y,
          curveIndex,
          totalRoutes
        )

        const adjustedEnd = this.calculateCircleEntryPoint(
          destination.x,
          destination.y,
          origin.x,
          origin.y,
          curveIndex,
          totalRoutes
        )        // Usar puntos ajustados
        const startX = adjustedStart.x
        const startY = adjustedStart.y
        const endX = adjustedEnd.x
        const endY = adjustedEnd.y

        // Validar puntos calculados
        if (!Number.isFinite(startX) || !Number.isFinite(startY) ||
          !Number.isFinite(endX) || !Number.isFinite(endY)) {
          console.warn('Invalid calculated entry points:', {
            startX, startY, endX, endY,
            routeId: route.id
          })
          return
        }

        const isHighlighted = route.id && highlightedRouteIds ? highlightedRouteIds.has(route.id) : false
        const isExplored = route.id && exploredRouteIds ? exploredRouteIds.has(route.id) : false

        // Determinar si hay rutas bidireccionales
        const cities = [route.origin.name, route.destiny.name].sort((a, b) => a.localeCompare(b))
        const connectionKey = `${cities[0]}<->${cities[1]}`
        const routeCount = connectionCount.get(connectionKey) || 1

        // Calcular intensidad de curvatura
        let curveIntensity = 0
        let controlPoint: { cpX: number; cpY: number } | undefined = undefined

        if (routeCount > 1) {
          // Incrementar la curvatura según el índice
          const baseCurve = 40 // Curvatura base
          const curveIncrement = 25 // Incremento por cada ruta adicional
          curveIntensity = baseCurve + (curveIndex * curveIncrement)

          // Determinar si la curva va hacia arriba o abajo
          // Si origin.name < destiny.name (alfabéticamente), curva hacia arriba
          const isUpward = route.origin.name < route.destiny.name

          controlPoint = this.calculateBezierControlPoint(
            startX,
            startY,
            endX,
            endY,
            curveIntensity,
            isUpward
          )
        }

        this.drawRoute(
          ctx,
          startX,
          startY,
          endX,
          endY,
          isHighlighted,
          isExplored,
          controlPoint
        )
      }
    })
  }

  /**
   * Obtiene las ciudades que deben ser resaltadas
   */
  static getHighlightedCities(validRoutes: Route[], highlightedRouteIds?: Set<string | number>): Set<string> {
    const highlightedCities = new Set<string>()
    if (highlightedRouteIds && highlightedRouteIds.size > 0) {
      validRoutes.forEach(route => {
        if (route.id && highlightedRouteIds.has(route.id)) {
          if (route.origin?.name) highlightedCities.add(route.origin.name)
          if (route.destiny?.name) highlightedCities.add(route.destiny.name)
        }
      })
    }
    return highlightedCities
  }

  /**
   * Dibuja todas las ciudades en el canvas
   */
  static drawAllCities(
    ctx: CanvasRenderingContext2D,
    cities: City[],
    positions: Map<string, { x: number; y: number }>,
    cityColors: Map<string | number, string>,
    cityImages: Map<string, HTMLImageElement>,
    validRoutes: Route[],
    highlightedRouteIds?: Set<string | number>
  ): void {
    // Determinar qué ciudades resaltar
    const highlightedCities = this.getHighlightedCities(validRoutes, highlightedRouteIds)

    cities.forEach((city) => {
      const position = positions.get(city.name)
      if (position) {
        const cityColor = cityColors.get(city.id ?? city.name) || '#FF6B6B'
        const img = cityImages.get(city.name)
        const isHighlighted = highlightedCities.has(city.name)

        this.drawCity(
          ctx,
          position.x,
          position.y,
          city.name,
          cityColor,
          img,
          isHighlighted
        )
      }
    })
  }

  /**
   * Dibuja el estado vacío cuando no hay rutas
   */
  static drawEmptyState(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
    this.drawBackground(ctx, canvas.width, canvas.height)

    ctx.font = 'bold 18px "Segoe UI", Arial, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#FFFFFF'
    ctx.fillText('No hay rutas para visualizar', canvas.width / 2, canvas.height / 2)
  }

  /**
   * Inicializa completamente la visualización
   */
  static async initializeVisualization(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    validRoutes: Route[],
    highlightedRouteIds?: Set<string | number>,
    exploredRouteIds?: Set<string | number>
  ): Promise<void> {
    // Validar parámetros de entrada
    if (!canvas || !ctx) {
      console.error('Invalid canvas or context provided to initializeVisualization')
      return
    }

    if (!Number.isFinite(canvas.width) || !Number.isFinite(canvas.height) ||
      canvas.width <= 0 || canvas.height <= 0) {
      console.error('Invalid canvas dimensions:', { width: canvas.width, height: canvas.height })
      return
    }

    // Limpiar y dibujar fondo
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    this.drawBackground(ctx, canvas.width, canvas.height)

    // Validar que hay rutas para procesar
    if (!validRoutes || validRoutes.length === 0) {
      console.log('No valid routes to visualize')
      return
    }

    // Obtener ciudades únicas
    const cities = this.getUniqueCities(validRoutes)

    if (cities.length === 0) {
      console.warn('No cities found in valid routes')
      return
    }

    const cityColors = this.getCityColors(cities)

    // Calcular posiciones (ahora persistentes)
    const positions = this.calculateCityPositions(cities, canvas)

    // Debug información si hay problemas
    if (positions.size === 0) {
      console.error('No valid positions calculated for cities')
      this.debugVisualizationData(validRoutes, cities, positions)
      return
    }

    // Cargar imágenes
    const cityImages = await this.loadCityImages(cities)

    // Dibujar rutas
    this.drawAllRoutes(ctx, validRoutes, positions, highlightedRouteIds, exploredRouteIds)

    // Dibujar ciudades
    this.drawAllCities(ctx, cities, positions, cityColors, cityImages, validRoutes, highlightedRouteIds)
  }

  /**
   * Valida si una ruta es válida para visualización
   */
  static isValidRoute(route: Route): boolean {
    return !!(route?.origin?.name && route?.destiny?.name)
  }

  /**
   * Filtra rutas válidas de un array de rutas
   */
  static filterValidRoutes(routes: Route[]): Route[] {
    return routes.filter(this.isValidRoute)
  }

  /**
   * Calcula la distancia entre dos puntos
   */
  static calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
    const dx = x2 - x1
    const dy = y2 - y1
    return Math.sqrt(dx * dx + dy * dy)
  }

  /**
   * Normaliza un vector
   */
  static normalizeVector(dx: number, dy: number): { unitX: number; unitY: number } {
    const distance = Math.sqrt(dx * dx + dy * dy)

    // Evitar división por cero
    if (distance === 0 || !Number.isFinite(distance)) {
      console.warn('Invalid distance for vector normalization:', { dx, dy, distance })
      return { unitX: 0, unitY: 0 }
    }

    return {
      unitX: dx / distance,
      unitY: dy / distance
    }
  }

  /**
   * Calcula los puntos de inicio y fin de una línea con offset
   */
  static calculateLinePoints(
    originX: number,
    originY: number,
    destX: number,
    destY: number,
    offset: number
  ): { startX: number; startY: number; endX: number; endY: number } {
    // Validar parámetros de entrada
    if (!Number.isFinite(originX) || !Number.isFinite(originY) ||
      !Number.isFinite(destX) || !Number.isFinite(destY) ||
      !Number.isFinite(offset)) {
      console.warn('Invalid parameters for line points calculation:', {
        originX, originY, destX, destY, offset
      })
      return { startX: 0, startY: 0, endX: 0, endY: 0 }
    }

    const dx = destX - originX
    const dy = destY - originY
    const { unitX, unitY } = this.normalizeVector(dx, dy)

    // Validar que los vectores unitarios son válidos
    if (!Number.isFinite(unitX) || !Number.isFinite(unitY)) {
      console.warn('Invalid unit vectors calculated:', { unitX, unitY })
      return { startX: originX, startY: originY, endX: destX, endY: destY }
    }

    return {
      startX: originX + unitX * offset,
      startY: originY + unitY * offset,
      endX: destX - unitX * offset,
      endY: destY - unitY * offset
    }
  }

  /**
   * Configuración de constantes para la visualización
   */
  static readonly VISUALIZATION_CONFIG = {
    CIRCLE_RADIUS: 20,
    LINE_MARGIN: 8,
    CANVAS_RADIUS_FACTOR: 0.4,
    DIRECT_ROUTE_COLORS: {
      START: '#4FC3F7',
      END: '#29B6F6'
    },
    // INDIRECT_ROUTE_COLORS: {
    //   START: '#FF7043',
    //   END: '#FF5722'
    // },
    BACKGROUND_COLORS: {
      START: '#1a1a2e',
      MIDDLE: '#16213e',
      END: '#0f3460'
    }
  } as const

  /**
   * Obtiene la configuración de offset total para las líneas
   */
  static getTotalOffset(): number {
    return this.VISUALIZATION_CONFIG.CIRCLE_RADIUS + this.VISUALIZATION_CONFIG.LINE_MARGIN
  }

  /**
   * Método de debugging para inspeccionar rutas y ciudades
   */
  static debugVisualizationData(validRoutes: Route[], cities: City[], positions: Map<string, { x: number; y: number }>): void {
    console.group('🔍 Route Visualization Debug Info')

    console.log('📊 Valid Routes:', validRoutes.length)
    validRoutes.forEach((route, index) => {
      console.log(`  Route ${index + 1}:`, {
        id: route.id,
        origin: route.origin?.name,
        destiny: route.destiny?.name,
        hasValidOrigin: !!route.origin?.name,
        hasValidDestiny: !!route.destiny?.name
      })
    })

    console.log('🏙️ Cities:', cities.length)
    cities.forEach((city, index) => {
      const position = positions.get(city.name)
      console.log(`  City ${index + 1}:`, {
        name: city.name,
        id: city.id,
        position: position ? { x: Math.round(position.x), y: Math.round(position.y) } : 'No position',
        hasValidPosition: position ? Number.isFinite(position.x) && Number.isFinite(position.y) : false,
        isInCache: this.cityPositionCache.has(city.name)
      })
    })

    console.log('📍 Position Map size:', positions.size)
    console.log('💾 Cache stats:', this.getPositionCacheStats())
    console.groupEnd()
  }
}

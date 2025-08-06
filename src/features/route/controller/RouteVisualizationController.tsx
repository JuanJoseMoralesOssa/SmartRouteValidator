import ReactDOMServer from 'react-dom/server'
import { City } from '@/shared/types/entities/City'
import { Route } from '@/shared/types/entities/Route'
import { CITY_SVG_TYPES } from '@/features/city/constants/cts'
import { DEFAULT_COLORS } from '@/shared/constants/cts'

/**
 * Controlador para funciones de visualización de rutas
 */
export class RouteVisualizationController {
  /**
   * Crea un SVG coloreado para una ciudad
   */
  static createColoredSVG(city: City) {
    const svgType = CITY_SVG_TYPES.find(svg => svg.value === city.svgType)
    if (!svgType) return null

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
   */
  static drawRoute(
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    isDirectRoute: boolean,
    isHighlighted: boolean = false
  ) {
    const opacity = isHighlighted ? 1 : 0.8
    const lineWidth = isHighlighted ? 4 : 2.5

    // Crear gradiente para la línea usando constantes
    const gradient = ctx.createLinearGradient(startX, startY, endX, endY)
    const colors = isDirectRoute
      ? this.VISUALIZATION_CONFIG.DIRECT_ROUTE_COLORS
      : this.VISUALIZATION_CONFIG.INDIRECT_ROUTE_COLORS

    gradient.addColorStop(0, `rgba(${this.hexToRgb(colors.START)}, ${opacity})`)
    gradient.addColorStop(1, `rgba(${this.hexToRgb(colors.END)}, ${opacity})`)

    // Dibujar sombra sutil si está resaltada
    if (isHighlighted) {
      ctx.beginPath()
      ctx.moveTo(startX + 1, startY + 1)
      ctx.lineTo(endX + 1, endY + 1)
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)'
      ctx.lineWidth = lineWidth + 1
      ctx.stroke()
    }

    // Dibujar línea principal
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(endX, endY)
    ctx.strokeStyle = gradient
    ctx.lineWidth = lineWidth
    ctx.lineCap = 'round'
    ctx.stroke()

    // Dibujar flecha direccional
    const arrowColor = colors.END
    const arrowSize = isHighlighted ? 12 : 10
    this.drawArrowHead(ctx, startX, startY, endX, endY, arrowColor, arrowSize)

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

    // Dibujar imagen si existe
    if (img) {
      ctx.drawImage(img, x - iconSize / 2, y - iconSize / 2, iconSize, iconSize)
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
   * Calcula las posiciones de las ciudades en un círculo
   */
  static calculateCityPositions(cities: City[], canvas: HTMLCanvasElement): Map<string, { x: number; y: number }> {
    const positions = new Map<string, { x: number; y: number }>()
    const radius = Math.min(canvas.width, canvas.height) * this.VISUALIZATION_CONFIG.CANVAS_RADIUS_FACTOR
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    cities.forEach((city, index) => {
      const angle = (index * 2 * Math.PI) / cities.length
      positions.set(city.name, {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      })
    })

    return positions
  }

  /**
   * Carga las imágenes SVG de todas las ciudades
   */
  static async loadCityImages(cities: City[]): Promise<Map<string, HTMLImageElement>> {
    const cityImages = new Map<string, HTMLImageElement>()

    const imagePromises = cities.map(async (city) => {
      const coloredSVG = this.createColoredSVG(city)
      if (coloredSVG) {
        try {
          const img = await this.loadCitySVGImage(coloredSVG)
          cityImages.set(city.name, img)
        } catch (e) {
          console.error('Error loading city SVG image:', e)
        }
      }
    })

    await Promise.all(imagePromises)
    return cityImages
  }

  /**
   * Dibuja todas las rutas en el canvas
   */
  static drawAllRoutes(
    ctx: CanvasRenderingContext2D,
    validRoutes: Route[],
    positions: Map<string, { x: number; y: number }>,
    highlightedRouteIds?: Set<string | number>
  ): void {
    const totalOffset = this.getTotalOffset()

    validRoutes.forEach((route) => {
      const origin = positions.get(route.origin?.name || '')
      const destination = positions.get(route.destiny?.name || '')

      if (origin && destination && route.origin?.name && route.destiny?.name) {
        const { startX, startY, endX, endY } = this.calculateLinePoints(
          origin.x,
          origin.y,
          destination.x,
          destination.y,
          totalOffset
        )

        const isHighlighted = route.id && highlightedRouteIds ? highlightedRouteIds.has(route.id) : false

        this.drawRoute(
          ctx,
          startX,
          startY,
          endX,
          endY,
          route.isDirectRoute || false,
          isHighlighted
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
    highlightedRouteIds?: Set<string | number>
  ): Promise<void> {
    // Limpiar y dibujar fondo
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    this.drawBackground(ctx, canvas.width, canvas.height)

    // Obtener ciudades únicas
    const cities = this.getUniqueCities(validRoutes)
    const cityColors = this.getCityColors(cities)

    // Calcular posiciones
    const positions = this.calculateCityPositions(cities, canvas)

    // Cargar imágenes
    const cityImages = await this.loadCityImages(cities)

    // Dibujar rutas
    this.drawAllRoutes(ctx, validRoutes, positions, highlightedRouteIds)

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
    const dx = destX - originX
    const dy = destY - originY
    const { unitX, unitY } = this.normalizeVector(dx, dy)

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
    INDIRECT_ROUTE_COLORS: {
      START: '#FF7043',
      END: '#FF5722'
    },
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
}

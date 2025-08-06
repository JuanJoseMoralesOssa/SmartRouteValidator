# RouteVisualizationController - Documentación

## 📋 Descripción

El `RouteVisualizationController` es una clase estática que maneja toda la lógica de visualización de rutas en canvas. Está diseñado siguiendo el principio de separación de responsabilidades, moviendo toda la lógica de dibujo fuera de los componentes React.

## 🏗️ Arquitectura

### Funciones principales del controlador:

#### 🎨 **Funciones de renderizado básico**

- `createColoredSVG(city)` - Crea SVGs coloreados para ciudades
- `getCityColors(cities)` - Genera colores únicos para cada ciudad
- `loadCitySVGImage(coloredSVG)` - Carga SVGs como HTMLImageElement
- `drawBackground(ctx, width, height)` - Dibuja el fondo gradiente

#### 🎯 **Funciones de dibujo de elementos**

- `drawEndPoint(ctx, x, y, color)` - Dibuja puntos decorativos
- `drawArrowHead(ctx, fromX, fromY, toX, toY, color, size)` - Dibuja flechas direccionales
- `drawRoute(ctx, startX, startY, endX, endY, isDirectRoute, isHighlighted)` - Dibuja una ruta individual
- `drawCity(ctx, x, y, cityName, cityColor, img, isHighlighted)` - Dibuja una ciudad
- `drawCityText(ctx, x, y, cityName, isHighlighted)` - Dibuja el texto de una ciudad

#### 🔧 **Funciones de procesamiento de datos**

- `getUniqueCities(validRoutes)` - Obtiene ciudades únicas de las rutas
- `calculateCityPositions(cities, canvas)` - Calcula posiciones en círculo
- `loadCityImages(cities)` - Carga todas las imágenes de ciudades
- `getHighlightedCities(validRoutes, highlightedRouteId)` - Determina ciudades a resaltar

#### 🚀 **Funciones de alto nivel**

- `drawAllRoutes(ctx, validRoutes, positions, highlightedRouteId)` - Dibuja todas las rutas
- `drawAllCities(ctx, cities, positions, cityColors, cityImages, validRoutes, highlightedRouteId)` - Dibuja todas las ciudades
- `drawEmptyState(ctx, canvas)` - Dibuja el estado vacío
- `initializeVisualization(canvas, ctx, validRoutes, highlightedRouteId)` - Función principal de inicialización

#### 🛠️ **Funciones utilitarias**

- `isValidRoute(route)` - Valida si una ruta es válida
- `filterValidRoutes(routes)` - Filtra rutas válidas
- `calculateDistance(x1, y1, x2, y2)` - Calcula distancia entre puntos
- `normalizeVector(dx, dy)` - Normaliza un vector
- `calculateLinePoints(originX, originY, destX, destY, offset)` - Calcula puntos de línea con offset
- `hexToRgb(hex)` - Convierte hex a RGB
- `getTotalOffset()` - Obtiene el offset total para líneas

## ⚙️ Configuración

El controlador incluye constantes configurables en `VISUALIZATION_CONFIG`:

```typescript
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
}
```

## 📖 Uso del componente

### Uso básico (sin resaltado):

```tsx
<RouteVisualization />
```

### Uso con resaltado de ruta específica:

```tsx
<RouteVisualization highlightedRouteId='route-123' />
```

## 🎯 Características principales

### ✅ **Ventajas de la refactorización:**

1. **Separación de responsabilidades** - Lógica separada del componente React
2. **Reutilización** - Funciones pueden ser usadas por otros componentes
3. **Mantenibilidad** - Código más organizado y fácil de mantener
4. **Testabilidad** - Funciones estáticas fáciles de testear
5. **Configurabilidad** - Constantes centralizadas para personalización
6. **Sin anidamiento excesivo** - Problema resuelto con funciones modulares

### 🎨 **Características visuales:**

- **Grafos dirigidos** con flechas que indican dirección
- **Resaltado de rutas específicas** con mayor grosor y opacidad
- **Resaltado de ciudades** relacionadas con la ruta seleccionada
- **Colores diferenciados** para rutas directas (azul) e indirectas (naranja)
- **Animaciones suaves** y transiciones visuales
- **Diseño responsivo** que se adapta al tamaño del canvas

### 📊 **Métricas de mejora:**

- **Líneas de código reducidas** en el componente: ~220 → ~40 líneas
- **Funciones anidadas eliminadas** - Sin funciones con más de 4 niveles
- **Funciones en el controlador**: 25+ funciones especializadas
- **Reutilización**: 100% de las funciones son reutilizables

## 🔄 Flujo de ejecución

1. **Validación** - Se validan las rutas usando `filterValidRoutes()`
2. **Estado vacío** - Si no hay rutas, se dibuja `drawEmptyState()`
3. **Inicialización** - Se llama `initializeVisualization()` que:
   - Limpia el canvas y dibuja el fondo
   - Obtiene ciudades únicas
   - Calcula posiciones en círculo
   - Carga imágenes SVG de las ciudades
   - Dibuja todas las rutas con flechas direccionales
   - Dibuja todas las ciudades con resaltado si aplica

El resultado es un código mucho más limpio, mantenible y escalable que sigue las mejores prácticas de arquitectura de software.

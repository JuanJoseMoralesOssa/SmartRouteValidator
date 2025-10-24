# Estados de Visualización de Rutas

## 📋 Resumen

El sistema de visualización de rutas ahora soporta **tres estados diferentes** para mostrar el proceso de validación de manera clara e intuitiva:

## 🎨 Estados Visuales

### 1. **Rutas Normales** (Estado Default)

- **Color**: Azul claro semitransparente (`#4FC3F7` → `#29B6F6`)
- **Grosor**: 2.5px
- **Opacidad**: 0.6
- **Uso**: Rutas que no han sido exploradas durante la validación actual

### 2. **Rutas Resaltadas** (Highlighted - Camino Activo)

- **Color**: Gradiente dorado brillante (`#FFD700` → `#FF8C00` → `#FF4500`)
- **Grosor**: 8px
- **Opacidad**: 1.0
- **Efectos**: Glow/resplandor dorado
- **Uso**: Rutas que están siendo exploradas activamente en el camino actual

### 3. **Rutas Exploradas** (Explored - Backtracked)

- **Color**: Azul cornflower semitransparente (`rgba(100, 149, 237, 0.5)`)
- **Grosor**: 3.5px
- **Opacidad**: 0.5
- **Uso**: Rutas que fueron visitadas pero descartadas por backtracking

## 🔄 Flujo de Estados

```
Normal → Highlighted (exploración activa)
         ↓
         Explored (backtracking) → permanece visible como explorada
```

## 🛠️ Implementación

### Store (`useRouteStore.ts`)

Se agregaron dos conjuntos de IDs en el store:

```typescript
interface RouteSpecificState {
  highlightedRouteIds: Set<ID> // Rutas actualmente en el camino activo
  exploredRouteIds: Set<ID> // Rutas visitadas pero descartadas

  // Métodos para highlighted
  addHighlightedRoute: (routeId: ID) => void
  removeHighlightedRoute: (routeId: ID) => void
  clearHighlightedRoutes: () => void

  // Métodos para explored
  addExploredRoute: (routeId: ID) => void
  removeExploredRoute: (routeId: ID) => void
  clearExploredRoutes: () => void
}
```

### Servicio de Restricción (`RouteRestrictionService.ts`)

El callback de visualización ahora incluye la acción `'explore'`:

```typescript
export type VisualizationCallback = (
  routeId: ID,
  action: 'add' | 'clear' | 'remove' | 'explore'
) => Promise<void>
```

**Flujo de acciones**:

1. `'clear'`: Limpia todas las rutas al inicio de la validación
2. `'add'`: Agrega ruta al camino activo (highlighted)
3. `'remove'`: Quita del camino activo durante backtracking
4. `'explore'`: Marca como explorada después del backtracking

### Hook del Controlador (`useRouteController.tsx`)

El callback maneja las cuatro acciones:

```typescript
const createVisualizationCallback = () => {
  return async (routeId: ID, action) => {
    if (action === 'clear') {
      store.clearHighlightedRoutes()
      store.clearExploredRoutes()
    } else if (action === 'add') {
      store.addHighlightedRoute(routeId)
    } else if (action === 'remove') {
      store.removeHighlightedRoute(routeId)
    } else if (action === 'explore') {
      store.addExploredRoute(routeId) // ¡NUEVO!
    }
  }
}
```

### Controlador de Visualización (`RouteVisualizationController.tsx`)

El método `drawRoute` ahora acepta el parámetro `isExplored`:

```typescript
static drawRoute(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  isHighlighted: boolean = false,
  isExplored: boolean = false  // ¡NUEVO!
)
```

## 🎯 Beneficios

### Para el Usuario

- **Claridad Visual**: Puede ver exactamente qué rutas fueron exploradas vs. cuáles forman parte del resultado final
- **Comprensión del Algoritmo**: Entiende cómo el algoritmo de backtracking explora y descarta caminos
- **Debugging**: Facilita identificar problemas en la validación de rutas

### Para el Desarrollador

- **Separación de Concerns**: Estados independientes para cada tipo de ruta
- **Escalabilidad**: Fácil agregar nuevos estados en el futuro
- **Mantenibilidad**: Código organizado siguiendo principios SOLID

## 📊 Ejemplo Visual

Durante la validación de una ruta:

```
Inicio → A (highlighted) → B (highlighted) → C (highlighted)
                                              ↓ (no es destino, backtrack)
                                              C (explored)
         A (highlighted) → D (highlighted) → E (highlighted) → Destino ✅

Resultado final:
- A, D, E: Highlighted (camino exitoso)
- B, C: Explored (intentos fallidos)
- Resto: Normal
```

## 🚀 Uso

```typescript
// En un componente
const {
  highlightedRoutes,  // Rutas en el camino activo
  exploredRoutes,     // Rutas exploradas (backtracked)
  handleCreate
} = useRouteController({
  enableVisualization: true,
  visualizationDelay: 500
})

// El componente de visualización recibe ambos sets
<RouteVisualization
  // Se suscribe automáticamente a highlightedRouteIds y exploredRouteIds
/>
```

## 🎨 Personalización de Colores

Para modificar los colores, edita `RouteVisualizationController.tsx`:

```typescript
if (isExplored) {
  colors = {
    start: 'rgba(100, 149, 237, 0.5)', // Cambiar aquí
    end: 'rgba(65, 105, 225, 0.5)', // Y aquí
  }
}
```

## ✅ Checklist de Implementación

- [x] Agregar `exploredRouteIds` al store
- [x] Implementar métodos CRUD para rutas exploradas
- [x] Actualizar `VisualizationCallback` con acción `'explore'`
- [x] Modificar `RouteRestrictionService` para marcar rutas como exploradas
- [x] Actualizar `useRouteController` para manejar la nueva acción
- [x] Modificar `drawRoute` para aceptar parámetro `isExplored`
- [x] Actualizar `drawAllRoutes` e `initializeVisualization`
- [x] Limpiar rutas exploradas al finalizar validación
- [x] Documentación completa

## 🐛 Consideraciones

1. **Performance**: El delay de las rutas exploradas es la mitad del de las highlighted para mantener la animación fluida
2. **Limpieza**: Siempre limpia ambos conjuntos (`clearHighlightedRoutes` y `clearExploredRoutes`) al finalizar
3. **Orden de Renderizado**: Las rutas exploradas se dibujan con el mismo orden que las demás para evitar z-index issues

## 📝 Notas de Desarrollo

- Las rutas exploradas persisten visualmente durante toda la validación
- Se limpian automáticamente al completar o cancelar la validación
- El algoritmo no se ve afectado, solo la visualización
- Compatible con validaciones secuenciales (ejemplos)

export interface Route {
    id: string
    originCity: string
    destinationCity: string
    cost: number
    isDirectRoute: boolean
    intermediateStops?: string[]
}

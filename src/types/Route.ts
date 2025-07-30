import { City } from "./City"

export interface Route {
    id: string
    origin: City
    destiny: City
    cost: number
    color?: string
    isDirectRoute: boolean
    intermediateStops?: string[]
}

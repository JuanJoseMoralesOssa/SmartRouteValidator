import { ID } from "../ID"
import { City } from "./City"

export interface Route {
    id?: ID
    origin: City
    destiny: City
    cost: number
    color?: string
    isDirectRoute: boolean
    intermediateStops?: string[]
}

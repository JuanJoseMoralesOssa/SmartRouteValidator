import City from "@/features/city/models/City"

export class Route {
  private _id: string
  private _origin: City
  private _destiny: City
  private _cost: number
  private _isDirectRoute: boolean
  private _color?: string
  private _intermediateStops?: City[]

  constructor(origin: City, destiny: City, cost: number, isDirectRoute: boolean, color?: string) {
    this._id = crypto.randomUUID()
    this._origin = origin
    this._destiny = destiny
    this._cost = cost
    this._isDirectRoute = isDirectRoute
    this._color = color
  }

  // public addStop(stop: string) {
  //   if (!this.intermediateStops) {
  //     // let city = llamar al servicio
  //     this.intermediateStops = [stop]
  //     return
  //   }
  //   this.intermediateStops.push(stop)
  // }

}

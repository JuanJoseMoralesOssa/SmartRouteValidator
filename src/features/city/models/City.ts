import { ID } from "@/shared/types/ID"

export default class City {
  id: ID
  name: string
  color: string

  constructor(name: string, color: string) {
    this.id = crypto.randomUUID()
    this.name = name
    this.color = color
  }

}

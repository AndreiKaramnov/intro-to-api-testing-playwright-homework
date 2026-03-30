
/*type Product = {
    id: number
    name: string
    price: number
    createdAt: string | null
  }*/
export class ProductDTO {
  id: number
  name: string
  price: number
  createdAt: string | null

  constructor(id: number, name: string, price: number, createdAt: string) {
    this.id = id
    this.name = name
    this.price = price
    this.createdAt = createdAt
  }
  static generateDefault(): ProductDTO{
    return new ProductDTO(
      0,
      "test lesson 12",
      100,
      new Date().toISOString()
    )
  }
  static generateCustom(name: string, price: number): ProductDTO {
    return new ProductDTO(
      0,
      name,
      price,
      new Date().toISOString()
    )
  }
}
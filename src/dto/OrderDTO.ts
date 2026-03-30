export class OrderDTO {
  status: string
  courierId: number
  customerName: string
  customerPhone: string
  comment: string
  id: number

  constructor(status : string, courierId : number, customerName : string, customerPhone : string, comment : string, id: number) {
  this.status = status;
  this.courierId = courierId;
  this.customerName = customerName;
  this.customerPhone = customerPhone;
  this.comment = comment;
  this.id = id;
  }

  static generateDefault():OrderDTO{
    const dto = new OrderDTO(
      'OPEN',
      0,
      'string',
      'string',
      'string',
      0,
    )
    return dto;
  }
}
import { z } from 'zod'
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
  static generateWithStatus(status : string):OrderDTO{
    return new OrderDTO(
      status,
      0,
      'string',
      'string',
      'string',
      0
    )
  }
  static generateWithCourierId(courierId: number):OrderDTO{
    return new OrderDTO(
      'OPEN',
      courierId,
      'string',
      'string',
      'string',
      0
    )
  }
}
/*"status": "OPEN",
  "courierId": 0,
  "customerName": "string",
  "customerPhone": "string",
  "comment": "string",
  "id": 0*/
  export const OrderSchema = z.object({
    status: z.string(),
    courierId: z.number().nullable(),
    customerName: z.string(),
    customerPhone: z.string(),
    comment: z.string(),
    id: z.number()
}).strict()
/*{
timestamp: '2026-03-31T15:47:38.237+00:00',
status: 400,
error: 'Bad Request',
path: '/orders/1241242343223423432234423423234'
}*/
  export const ErrorSchemaResponse = z.object({
    timestamp: z.string().nullable(),
    status: z.number(),
    error: z.string(),
    path: z.string()
  })
  export type ErrorDTO = z.infer<typeof ErrorSchemaResponse>

// export const OrderSchemaResponse =
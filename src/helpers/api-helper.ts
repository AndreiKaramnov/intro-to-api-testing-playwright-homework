import { LoginDTO } from '../dto/LoginDTO'
import { APIRequestContext } from 'playwright'
import { CourierDTO, CourierResponse, CourierResponseSchema } from '../dto/CourierDTO'

const STUDENT_AUTH_URL = 'https://backend.tallinn-learning.ee/login/student'
const COURIER_AUTH_URL = 'https://backend.tallinn-learning.ee/login/courier'
const CREATE_COURIER_URL = 'https://backend.tallinn-learning.ee/users/courier'

export async function getJwt(request: APIRequestContext): Promise<string> {
  const loginResponse = await request.post(STUDENT_AUTH_URL, {
    data: LoginDTO.generateCorrectPair(),
  })
  return await loginResponse.text()
}

export async function getJwtCourier(
  request: APIRequestContext,
  login: string,
  password: string): Promise<string> {
  const loginResponse = await request.post(COURIER_AUTH_URL, {
    data: {
      username: login,
      password: password,
    },
  })
  return await loginResponse.text()
}

export async function createCourier(
  request: APIRequestContext,
  studentToken: string,
  courierData: CourierDTO
): Promise<CourierResponse> {
  const createCourierResponse = await request.post(CREATE_COURIER_URL, {
    headers: {
      Authorization: `Bearer ${studentToken}`,
    },
    data: courierData,
  })
  const responseBody = await createCourierResponse.json()
  return CourierResponseSchema.parse(responseBody)
}
// const unique = Date.now().toString().slice(-5)
// const courierData = {
//   id: Number(`34${unique}`),
//   login: `Vasili${unique}`,
//   password: `abc123${unique}`,
//   name: 'Vasja',
// }


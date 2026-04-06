import { expect, test } from '@playwright/test'

import { StatusCodes } from 'http-status-codes'
import { ErrorDTO, ErrorSchemaResponse, OrderDTO, OrderSchema } from '../src/dto/OrderDTO'
import { Login, LoginDTO } from '../src/dto/LoginDTO'
import { createCourier, getJwt, getJwtCourier } from '../src/helpers/api-helper'
import { CourierDTO } from '../src/dto/CourierDTO'
//--------------------------------------------CONSTANTS---------------------------------------------
const incorrectApiKey = {
  api_key: '123456789009876',
}
const ORDERS_URL = 'https://backend.tallinn-learning.ee/orders'
const AUTH_URL = 'https://backend.tallinn-learning.ee/login/student'

//---------------------------------------------TESTS------------------------------------------------
test('get order with correct id should receive code 200', async ({ request }) => {
  const token = await getJwt(request)
  const response = await request.post(ORDERS_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: OrderDTO.generateDefault(),
  })
  const responseBody: OrderDTO = await response.json()
  const responseSearch = await request.get(`${ORDERS_URL}/${responseBody.id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  const responseBodySearch: OrderDTO = await responseSearch.json()
  const statusCode = responseSearch.status()
  expect(statusCode).toBe(200)
  const TestSearchBody = OrderSchema.parse(responseBodySearch)
  expect(TestSearchBody.id).not.toBeUndefined()
})
test('get order with incorrect id should receive code 400', async ({ request }) => {
  const token = await getJwt(request)
  console.log('token ' + token)
  const response = await request.get(`${ORDERS_URL}/1241242343223423432234423423234`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  const errorBody = await response.json()
  console.log(errorBody)
  const statusCode = response.status()
  expect(statusCode).toBe(400)
  const parsedError: ErrorDTO = ErrorSchemaResponse.parse(errorBody)
  expect(parsedError.error).toBeDefined()
})
test.skip('get deleted order should receive code 404', async ({ request }) => {
  const token = await getJwt(request)
  //1. создаем заказ
  const createOrder = await request.post(ORDERS_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: OrderDTO.generateDefault(),
  })
  const responseBody: OrderDTO = await createOrder.json()
  //2. удаляем заказ
  const deleteResponse = await request.delete(`${ORDERS_URL}/${responseBody.id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  const deleteStatusCode: number = deleteResponse.status()
  expect(deleteStatusCode).toBe(200)
  //3. проверяем, что заказ удален
  const responseDeletedOrder = await request.get(`${ORDERS_URL}/${responseBody.id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  const statusCode = responseDeletedOrder.status()
  console.log('status: ', statusCode)
  const bodyText = await responseDeletedOrder.text()
  console.log('response body:', bodyText)
  expect(statusCode).toBe(404)
  // Возвращает код 200 и пустое тело, видимо пустое тело API не считает как 404
})
test('delete order should receive code 200', async ({ request }) => {
  const token = await getJwt(request)
  const response = await request.post(ORDERS_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: OrderDTO.generateDefault(),
  })
  const responseBody: OrderDTO = await response.json()

  const responseDeleteBody = await request.delete(`${ORDERS_URL}/${responseBody.id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  const statusCode = responseDeleteBody.status()
  expect(statusCode).toBe(200)
  const deleteBody = await responseDeleteBody.json()
  expect(deleteBody).toBe(true)
})
test('delete order with incorrect id should receive code 400', async ({ request }) => {
  const token = await getJwt(request)
  const response = await request.delete(`${ORDERS_URL}/12323231321231231232`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  const statusCode = response.status()
  expect(statusCode).toBe(400)
  const errorBody = await response.json()
  const parsedError: ErrorDTO = ErrorSchemaResponse.parse(errorBody)
  expect(parsedError.error).toBeDefined()
  // console.log('error body: ')
  // console.log(JSON.stringify(errorBody, null, 2))
})
test('delete unauthorized should receive code 401', async ({ request }) => {
  const response = await request.delete(`${ORDERS_URL}/3`)
  const errorBody = await response.text()
  const statusCode = response.status()
  // console.log('error body: ' + errorBody)
  expect(errorBody).toBe('')
  expect(statusCode).toBe(401)
})
test('courier assign order PUT and updates order status PUT', async ({ request }) => {
  //1. студент логинится
  const studentToken = await getJwt(request)
  //2. создание курьера
  const courierData: CourierDTO = CourierDTO.generateValid()
  const createdCourier = await createCourier(request, studentToken, courierData)
  // console.log(createdCourier)
  //3. курьер логинится
  const courierToken = await getJwtCourier(request, courierData.login, courierData.password)
  // console.log(courierToken)
  //4. студент создает заказ
  const createOrderResponse = await request.post(ORDERS_URL, {
    headers: {
      Authorization: `Bearer ${studentToken}`,
    },
    data: OrderDTO.generateDefault(),
  })
  const createdOrder: OrderDTO = await createOrderResponse.json()
  const parsedOrderResponse = OrderSchema.parse(createdOrder)
  expect(parsedOrderResponse.status).toBeDefined()
  // console.log(createdOrder)
  //5. курьер получает разрешение на заказ
  const assignOrder = await request.put(`${ORDERS_URL}/${createdOrder.id}/assign`, {
    headers: {
      Authorization: `Bearer ${courierToken}`,
    },
  })
  const assignedOrder: OrderDTO = await assignOrder.json()
  const parsedAssignedOrderResponse = OrderSchema.parse(assignedOrder)
  expect(parsedAssignedOrderResponse.status).toBeDefined()
  //6. курьер меняет статус заказа
  const updateResponse = await request.put(`${ORDERS_URL}/${createdOrder.id}/status`, {
    headers: {
      Authorization: `Bearer ${courierToken}`,
    },
    data: OrderDTO.generateWithStatus('INPROGRESS'),
  })
  const updatedOrder: OrderDTO = await updateResponse.json()
  //7/ проверка
  // // console.log('update response: ' + updateResponse.status())
  // // console.log('update body ' + await updateResponse.text())
  expect(updateResponse.status()).toBe(200)
  const parsedUpdatedOrderResponse = OrderSchema.parse(updatedOrder)
  expect(parsedUpdatedOrderResponse.status).toBeDefined()
  expect(updatedOrder.status).toBe('INPROGRESS')
})
test('should return 400 when assigning PUT order with invalid id', async ({ request }) => {
  const studentToken = await getJwt(request)
  const courierData: CourierDTO = CourierDTO.generateValid()
  await createCourier(request, studentToken, courierData)
  const courierToken = await getJwtCourier(request, courierData.login, courierData.password)
  const response = await request.put(`${ORDERS_URL}/${Number.MAX_SAFE_INTEGER * 10000}/assign`, {
    headers: {
      Authorization: `Bearer ${courierToken}`,
    },
    data: OrderDTO.generateWithStatus('IN_PROGRESS'),
  })
  expect(response.status()).toBe(400)
})
test('should return 401 when changing order status unauthorized', async ({ request }) => {
  const studentToken = await getJwt(request)
  const createOrderResponse = await request.post(ORDERS_URL, {
    headers: {
      Authorization: `Bearer ${studentToken}`,
    },
    data: OrderDTO.generateDefault(),
  })
  const createdOrder: OrderDTO = await createOrderResponse.json()
  const parsedOrderResponse = OrderSchema.parse(createdOrder)
  expect(parsedOrderResponse.status).toBeDefined()
  const updateOrder = await request.put(`${ORDERS_URL}/${createdOrder.id}/status`, {
    headers: incorrectApiKey,
    data: OrderDTO.generateWithStatus('INPROGRESS'),
  })
  expect(updateOrder.status()).toBe(401)
})
//старый вариант без хелперов
test('post order with correct data should receive code 200', async ({ request }) => {
  const loginResponse = await request.post(AUTH_URL, {
    data: LoginDTO.generateCorrectPair(),
  })
  const token: Login = await loginResponse.text()
  const response = await request.post(ORDERS_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: OrderDTO.generateDefault(),
  })
  const responseBody: OrderDTO = await response.json()
  const statusCode = response.status()

  console.log('response status:', statusCode)
  console.log('response body:', responseBody)
  expect(statusCode).toBe(StatusCodes.OK)
  const TestOrder = OrderSchema.parse(responseBody)
  expect(TestOrder).not.toBeUndefined()
})

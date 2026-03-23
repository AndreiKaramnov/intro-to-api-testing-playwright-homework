import { expect, test } from '@playwright/test'

import { StatusCodes } from 'http-status-codes'
//--------------------------------------------CONSTANTS---------------------------------------------
const apiHeaders = {
  api_key: '1234567890123456'
}
const incorrectApiKey = {
  api_key: '123456789009876'
}
const requestBody = {
  status: 'OPEN',
  courierId: 0,
  customerName: 'string',
  customerPhone: '123',
  comment: 'string',
  id: 0,
}
//---------------------------------------------TESTS------------------------------------------------
test('get order with correct id should receive code 200', async ({ request }) => {
  // Build and send a GET request to the server
  const response = await request.get('https://backend.tallinn-learning.ee/test-orders/1')

  // parse raw response body to json
  const responseBody = await response.json()
  const statusCode = response.status()

  // Log the response status, body and headers
  console.log('response body:', responseBody)
  // Check if the response status is 200
  expect(statusCode).toBe(200)
})
test('get order with incorrect id should receive code 400', async ({ request }) => {
  const response = await request.get('https://backend.tallinn-learning.ee/test-orders/11')
  const responseBody = await response.json()
  const statusCode = response.status()
  // Log the response status, body and headers
  console.log('response body:', responseBody)
  expect(statusCode).toBe(400)
})
test('get deleted order should receive code 404', async ({ request }) => {
  await request.delete('https://backend.tallinn-learning.ee/test-orders/5', {
    headers: apiHeaders,
  })
  const response = await request.get('https://backend.tallinn-learning.ee/test-orders/5')
  const responseBody = await response.json()
  const statusCode = response.status()
  // Log the response status, body and headers
  console.log('response body:', responseBody)
  expect(statusCode).toBe(404)
})
test('delete order should receive code 204', async ({ request }) => {
  const response = await request.delete('https://backend.tallinn-learning.ee/test-orders/5', {
    headers: apiHeaders
  })
  const statusCode = response.status()
  expect(statusCode).toBe(204)
})
test('delete order with incorrect id should receive code 400', async ({ request }) => {
  const response = await request.delete('https://backend.tallinn-learning.ee/test-orders/11', {
    headers: apiHeaders,
  })
  const statusCode = response.status()
  expect(statusCode).toBe(400)
})
test('delete order with incorrect api key should receive code 401', async ({ request }) => {
  const response = await request.delete('https://backend.tallinn-learning.ee/test-orders/5', {
    headers: incorrectApiKey
  })
  const statusCode = response.status()
  expect(statusCode).toBe(401)
})
test('put order with correct id and api key should receive code 200', async ({ request }) => {
  const response = await request.put('https://backend.tallinn-learning.ee/test-orders/1', {
    headers: apiHeaders,
    data: requestBody
  })
  const statusCode = response.status()
  expect(statusCode).toBe(200)
})
test('put order with incorrect id should receive code 400', async ({ request }) => {
  const response = await request.put('https://backend.tallinn-learning.ee/test-orders/11', {
    headers: apiHeaders,
    data: requestBody,
  })
  const statusCode = response.status()
  expect(statusCode).toBe(400)
})
test('put order with incorrect api key receive code 401', async ({ request }) => {
  const response = await request.put('https://backend.tallinn-learning.ee/test-orders/1', {
    headers: incorrectApiKey,
    data: requestBody,
  })
  const statusCode = response.status()
  expect(statusCode).toBe(401)
})
test('post order with correct data should receive code 201', async ({ request }) => {
  // prepare request body
  const requestBody = {
    status: 'OPEN',
    courierId: 0,
    customerName: 'string',
    customerPhone: 'string',
    comment: 'string',
    id: 0,
  }
  // Send a POST request to the server
  const response = await request.post('https://backend.tallinn-learning.ee/test-orders', {
    data: requestBody,
  })
  // parse raw response body to json
  const responseBody = await response.json()
  const statusCode = response.status()

  // Log the response status and body
  console.log('response status:', statusCode)
  console.log('response body:', responseBody)
  expect(statusCode).toBe(StatusCodes.OK)
  // check that body.comment is string type
  expect(typeof responseBody.comment).toBe('string')
  // check that body.courierId is number type
  expect(typeof responseBody.courierId).toBe('number')
})

import { expect, test } from '@playwright/test'

import { StatusCodes } from 'http-status-codes'

test.describe("Lesson 11 -> Product API tests", () => {
  const BaseEndpointURL = 'https://backend.tallinn-learning.ee/products';
  const AUTH = {'X-API-Key': 'my-secret-api-key'};
  type Product = {
    id: number
    name: string
    price: number
    createdAt: string | null
  }
  const testProduct: Product = {
    id: 0,
    name: 'test lesson 11',
    price: 124523643,
    createdAt: '2026-03-23T18:04:11.285Z',
  }
  const testProduct2: Product = {
    id: 0,
    name: 'test lesson 11a',
    price: 1245,
    createdAt: new Date().toISOString(),
  }

  test('GET /products - check API returns array with length >= 1', async ({ request }) => {
    const response = await request.get(BaseEndpointURL, {
      headers: AUTH
    });

    const responseBody: Product[] = await response.json();
    expect(response.status()).toBe(StatusCodes.OK);
    expect(responseBody.length).toBeDefined();
    expect(responseBody.length).toBeGreaterThanOrEqual(1);
  });

  test('POST /products; GET /products/{id} - check product creation and product search by id', async ({ request }) => {
    const createResponse = await request.post(BaseEndpointURL, {
      headers: AUTH,
      data: testProduct
    });
    const createResponseBody: Product = await createResponse.json();
    expect(createResponseBody.id).toBeGreaterThan(0);
    expect(createResponseBody.name).toBe(testProduct.name);
    expect(createResponseBody.price).toBe(testProduct.price);
    expect(createResponseBody.createdAt).toBeDefined();

    const searchResponse = await request.get(`${BaseEndpointURL}/${createResponseBody.id}`, {
      headers: AUTH
    });
    const searchResponseBody: Product = await searchResponse.json();
    expect(searchResponse.status()).toBe(StatusCodes.OK);
    expect.soft(searchResponseBody.id).toBe(createResponseBody.id);
    expect.soft(searchResponseBody.name).toBe(testProduct.name);
    expect.soft(searchResponseBody.price).toBe(testProduct.price);
    expect.soft(searchResponseBody.createdAt).toBeDefined()

    const deleteResponse = await request.delete(`${BaseEndpointURL}/${createResponseBody.id}`, {
      headers: AUTH,
    })
    expect(deleteResponse.status()).toBe(StatusCodes.NO_CONTENT);
   })

  test('GET /products - not return product with invalid API key', async ({ request }) => {
    const createResponse = await request.post(BaseEndpointURL, {
      headers: AUTH,
      data: testProduct,
    })
    const createResponseBody: Product = await createResponse.json()
    const searchResponse = await request.get(`${BaseEndpointURL}/${createResponseBody.id}`, {
      headers: { 'X-API-Key': 'invalid-api-key' },
    })
    expect(searchResponse.status()).toBe(StatusCodes.UNAUTHORIZED)
  })

  test('POST /products; PUT /products/{id} - check product update', async ({
    request,
  }) => {
    const createResponse = await request.post(BaseEndpointURL, {
      headers: AUTH,
      data: testProduct,
    })
    const createResponseBody: Product = await createResponse.json()
    expect(createResponse.status()).toBe(StatusCodes.OK)
    const createSecondResponse = await request.put(`${BaseEndpointURL}/${createResponseBody.id}`, {
      headers: AUTH,
      data: testProduct2,
    })
    const createSecondResponseBody: Product = await createSecondResponse.json()
    expect(createSecondResponse.status()).toBe(StatusCodes.OK)
    expect(createSecondResponseBody.id).toBeGreaterThan(0)
    expect(createSecondResponseBody.name).toBe(testProduct2.name)
    expect(createSecondResponseBody.price).toBe(testProduct2.price)
    expect(createResponseBody.createdAt).toBeDefined()
    const deleteResponse = await request.delete(`${BaseEndpointURL}/${createSecondResponseBody.id}`, {
      headers: AUTH,
    })
    expect(deleteResponse.status()).toBe(StatusCodes.NO_CONTENT)
  })

  test('DELETE /products - check not existing product deletion', async ({
    request,
  }) => {
    const deleteResponse = await request.delete(`${BaseEndpointURL}/-1`, {
      headers: AUTH
    })
    expect(deleteResponse.status()).toBe(400);
  })

  test('DELETE /products - check product deletion', async ({ request }) => {
    const createResponse = await request.post(BaseEndpointURL, {
      headers: AUTH,
      data: testProduct,
    });
    const createResponseBody: Product = await createResponse.json();

    const deleteResponse = await request.delete(`${BaseEndpointURL}/${createResponseBody.id}`, {
      headers: AUTH,
    });
    expect(deleteResponse.status()).toBe(204)
    const searchResponse = await request.get(`${BaseEndpointURL}/${createResponseBody.id}`, {
      headers: AUTH,
    })
    expect(searchResponse.status()).toBe(StatusCodes.BAD_REQUEST);
  })
   })
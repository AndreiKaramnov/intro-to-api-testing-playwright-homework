import { expect, test } from '@playwright/test'
import { LoginDTO } from '../src/dto/LoginDTO'

test.describe('Login API tests', () => {
  const BaseEndpointURL = 'https://backend.tallinn-learning.ee/login/student'
  test('Incorrect login', async ({ request }) => {
    const loginResponce = await request.post(BaseEndpointURL, {
      data: LoginDTO.generateIncorrectPair(),
    })
    expect(loginResponce.status()).toBe(401)
  })
  test('Correct login', async ({ request }) => {
    console.log(LoginDTO.generateCorrectPair())
    const loginResponce = await request.post(BaseEndpointURL, {
      data: LoginDTO.generateCorrectPair(),
    })
    const token = await loginResponce.text()
    expect(loginResponce.status()).toBe(200)
    expect(token.length).toBeGreaterThan(0)
  })
})

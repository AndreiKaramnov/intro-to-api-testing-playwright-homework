## Checklist

| Endpoint | Scenario | Expected result |
| --- | --- | --- |
| GET /test-orders/{id} | Successful operation | 200 OK |
| GET /test-orders/{id} | Bad Request | 400 |
| GET /test-orders/{id} | Order not found | 404 |
| DELETE /test-orders/{id} | Order deleted successfully | 204 |
| DELETE /test-orders/{id} | Bad Request | 400 |
| DELETE /test-orders/{id} | Unauthorized | 401 |
| PUT /test-orders/{id} | Order updated successfully | 200 |
| PUT /test-orders/{id} | Bad Request | 400 |
| PUT /test-orders/{id} | Unauthorized | 401 |




# API Response Standard

All endpoints in this API must return a response that conforms to the envelope described in this document. The authoritative TypeScript definition lives in `src/api/helpers/responseBuilder.ts`.

---

## Envelope shape

```ts
interface ApiResponse<T = unknown> {
    message: string
    type: 'success' | 'info' | 'warn' | 'error'
    code: number
    name: string
    data?: T
    pagination?: PaginationMeta
    details?: ResponseDetail[]
}

interface PaginationMeta {
    total: number
    limit: number
    offset: number
}

interface ResponseDetail {
    field?: string
    reason: string
    acceptableValue?: string
}
```

---

## Fields

| Field | Required | Description |
|---|---|---|
| `message` | always | Human-readable message describing the outcome. Friendly and user-facing — it must not expose internal details, stack traces, or raw DB errors. |
| `type` | always | Enum indicating the outcome category. See [Type values](#type-values) below. |
| `code` | always | HTTP status code mirrored inside the body (e.g. `200`, `404`, `500`). Must match the actual HTTP status of the response. |
| `name` | always | Machine-readable identifier for the outcome, in `UPPER_SNAKE_CASE`. Used by the frontend for conditional logic and by logging/monitoring. For errors, this is the error name (e.g. `NOT_FOUND`, `CONSTRAINT_ERROR`). For successes, name the operation (e.g. `SIGN_IN_SUCCESS`, `STUDENT_CREATED`). |
| `data` | on 2xx | The payload returned by the endpoint. Omitted on non-2xx responses. |
| `pagination` | on list endpoints | Present only when the response is a paginated list. Contains `total` (total records matching the query), `limit` (page size requested), and `offset` (records skipped). |
| `details` | on 4xx/5xx when applicable | An array of objects that give specific context about what went wrong — particularly useful for validation errors. Each entry may include `field` (the affected field name), `reason` (what constraint was violated), and `acceptableValue` (the expected format or range, if applicable). |

---

## Type values

| Value | When to use |
|---|---|
| `success` | The request completed as expected (2xx). |
| `info` | The request could not be completed, but the cause is informational and actionable by the client — e.g., a record was not found, or the user must take a specific action before retrying. Typically paired with 4xx codes like 404 or 401. |
| `warn` | The request failed due to incorrect or invalid input from the client — e.g., validation failures, missing required fields, constraint violations caused by bad data. Typically paired with 400 or 409. |
| `error` | An unexpected server-side error occurred that the client cannot resolve. Typically paired with 5xx codes. |

---

## Usage

Use `ResponseBuilder` from `src/api/helpers/responseBuilder.ts` to construct responses:

```ts
import { ResponseBuilder } from "@/api/helpers/responseBuilder"

// Success
res.status(200).json(
    ResponseBuilder.success("Student created successfully", "STUDENT_CREATED", 200, student)
)

// Success with pagination
res.status(200).json(
    ResponseBuilder.success("Students retrieved", "STUDENTS_LIST", 200, students, { total: 120, limit: 20, offset: 0 })
)

// Client error (warn)
res.status(400).json(
    ResponseBuilder.fail("Validation failed", "warn", "VALIDATION_ERROR", 400, [
        { field: "email", reason: "Must be a valid email address" },
        { field: "birthdate", reason: "Must be in the past", acceptableValue: "ISO 8601 date" }
    ])
)

// Server error
res.status(500).json(
    ResponseBuilder.fail("An error occurred on our side. Please contact the support team", "error", "INTERNAL_SERVER_ERROR", 500)
)
```

All error responses are already handled centrally by `ControllerExceptionThrowHelper` (`src/api/helpers/controllerExceptionThrowHelper.ts`), which maps every exception type to the correct envelope. Controllers only need to call `ResponseBuilder.success()` for their happy path.

---

## Example responses

### Success — single resource

```json
{
    "message": "Sign in successful",
    "type": "success",
    "code": 200,
    "name": "SIGN_IN_SUCCESS",
    "data": {
        "name": "Lucas Ferri",
        "email": "lucas@example.com",
        "accountType": "student"
    }
}
```

### Success — paginated list

```json
{
    "message": "Equipment list retrieved",
    "type": "success",
    "code": 200,
    "name": "EQUIPMENT_LIST",
    "data": [ { "id": 1, "name": "Oscilloscope" } ],
    "pagination": {
        "total": 48,
        "limit": 10,
        "offset": 0
    }
}
```

### Warn — validation error

```json
{
    "message": "One or more fields are invalid",
    "type": "warn",
    "code": 400,
    "name": "VALIDATION_ERROR",
    "details": [
        { "field": "email", "reason": "Must be a valid email address" },
        { "field": "term", "reason": "Must be between 1 and 10", "acceptableValue": "integer 1–10" }
    ]
}
```

### Info — not found

```json
{
    "message": "Invalid email or password",
    "type": "info",
    "code": 404,
    "name": "NOT_FOUND"
}
```

### Error — server failure

```json
{
    "message": "An error occurred on our side. Please contact the support team",
    "type": "error",
    "code": 500,
    "name": "INTERNAL_SERVER_ERROR"
}
```

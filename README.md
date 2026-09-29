
The gateway handles session management server-side. The JWT token is never exposed to the browser — only a secure httpOnly cookie is sent to the client.

## Related repositories

| Repository | Description |
|---|---|
| [veille-techno-backend](https://github.com/lucas-martinie-de-maisonneuve/veille-techno-backend) | NestJS REST API |
| [veille-techno-frontend](https://github.com/lucas-martinie-de-maisonneuve/veille-techno-frontend) | Angular frontend |

## Tech stack

- NestJS 12
- TypeScript
- express-session + connect-redis
- Redis (session store)
- Docker + Docker Compose

## Prerequisites

- Docker
- Node.js 22+

## Environment variables

Copy `.env.example` to `.env.docker` and fill in the values:

```env
PORT=8090
NESTJS_API_URL=http://host.docker.internal:3001/api
REDIS_HOST=redis
REDIS_PORT=6379
SESSION_SECRET=your-super-secret-key
SESSION_TTL=86400
FRONTEND_URL=http://localhost:4200
```

## Getting started

```bash
# Start gateway + Redis
docker-compose up --build

# Gateway will be available at http://localhost:8090
```

## API

### Auth

| Method | Route | Description | Auth required |
|---|---|---|---|
| POST | /auth/login | Login and create session | No |
| POST | /auth/logout | Destroy session | Yes |

### Proxy

All routes below are proxied to the NestJS backend with the JWT injected from the session.

| Method | Route | Description |
|---|---|---|
| GET | /lists | Get all lists |
| POST | /lists | Create a list |
| PATCH | /lists/:id | Update a list |
| DELETE | /lists/:id | Delete a list |
| GET | /lists/:listId/cards | Get cards of a list |
| POST | /lists/:listId/cards | Create a card |
| GET | /cards/:id | Get a card |
| PATCH | /cards/:id | Update a card |
| DELETE | /cards/:id | Delete a card |
| GET | /users/me | Get current user profile |
| PATCH | /users/:id | Update user profile |

## Security

- JWT stored server-side in Redis session (never sent to browser)
- Session cookie: httpOnly, SameSite=Strict
- Session TTL: 24h (configurable)
- All routes except `/auth/login` require an active session
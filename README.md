# JB-test

## Requirements
- Node.js (LTS or newer)
- pm2 (for production deployment with process manager)

## Backend
0. Open backend folder `cd backend`
1. Install dependencies: `npm install`
2. Create `.env` file based on `.env.example`:

| Key            | Example value     | Description                                            |
|----------------|-------------------|--------------------------------------------------------|
| DATABASE_URL   | file:../db.sqlite | SQLite database URL                                    |
| IMAGES_FOLDER  | resources         | Folder for images                                      |
| OPENAI_API_KEY | v1...             | OpenAI API Key (optional, needed for image generation) |
| PORT           | 3000              | Server port (optional, defaults to 3000)               |

3. Create a resources folder (mentioned above)
4. Init DB with: `npx prisma migrate deploy`
5. Fill DB with tags (`/api/dev/fillTags` endpoint) and images (`/api/dev/generateImage` endpoint)
6. Build front-end part (see Frontend section below)
7. (For development) Start the server with: `npm run dev`
8. (For production) Run `npm run start`
9. (For production with PM2) Build `npm run build` & run `pm2 start ecosystem.config.cjs --env production`

### Swagger UI
You can access it at `http://localhost:3000/docs`


## Frontend
0. Open backend folder `cd backend`
1. Install dependencies: `npm install`
2. Start the development server with: `npm run dev`
3. Build for production with: `npm run build`

### Generate OpenAPI types
1. Start the backend server as described above
2. Run `npm run generate:openapi` to generate API types (or run `npx openapi-typescript http://YOUR_SERVER/openapi.json -o ./src/lib/api/v1.d.ts` with proper server URL if you changed default settings)

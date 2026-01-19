# Scrum 1 – Weekly Update

**Name:** Luke Thompson

## What did I complete last week?

- Set up a PostgreSQL database using Docker Compose with a consistent local development configuration  
- Integrated Prisma ORM with the database and configured environment variables  
- Designed and implemented the initial database schema covering core application domains:
  - Users  
  - Budgets  
  - Expenses  
  - Notes  
  - Calendar Events  
  - Fitness Info  
  - Workouts  
  - Diets  
  - Chatbot Messages  
- Successfully ran Prisma migrations to create all tables, relationships, constraints, and enums in PostgreSQL  
- Created a spike branch to validate end to end database writes through API routes (controller → service → Prisma → database)  
- Documented the spike branch as exploratory and not intended for merge  

## What will I work on next week?

- Align with everyone to define backend ownership and responsibilities  
- Agree on a shared backend folder structure and conventions before writing production code  
- Walk the team through the Docker + Prisma database setup so everyone can run it locally  
- Help define frontend to backend communication expectations (API contracts, request response shapes)  
- Begin implementing production backend endpoints once alignment is complete  

## What is blocking me?

- Clarifying backend ownership and responsibilities with the other backend developer  
- Agreeing on a final backend structure before committing production code  
- Ensuring all team members are comfortable running and using the database setup  
- Aligning early on how the frontend and backend will communicate to avoid rework later  

## Notes / Clarifications

### Database Naming Conventions
- The PostgreSQL database uses `snake_case` for table and column names
- Prisma maps database fields to `camelCase` for use in application code
- Backend APIs and frontend code use `camelCase` exclusively
- This mapping is handled explicitly in `schema.prisma` using `@map` and `@@map`
- Database naming details are not exposed to the frontend

### Local Database Setup (Summary)
To run the database locally:
1. Ensure Docker Desktop is installed and running
2. Start PostgreSQL:
```bash
   docker compose up -d
```
3. Apply schema and migrations:

```bash
  cd backend
  npx prisma migrate dev
```
4. View tavles and data:

```bash
npx prisma studio
```
--- 

## Resetting the Local Database
- The PostgresSQL data is stored in a Docker-managed volume
- To fully reset the local database:
```bash
docker compose down -v
```
- After resetting, restart the database and re-run migrations
  
---

## Database Validation/Testing
- I created a spike branch (`spike/frontend-backend-integration`) in order to validate writing to the database end to end
1. In the project root run:
```bash
git checkout spike/frontend-backend-integration
```
2. Run the app and create a new user
3. From the backend run:
```bash
npx prisma studio
```
4. Verify the user was created in the table
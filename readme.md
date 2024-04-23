npx prisma migrate dev --name init

docker build -t express-app .

docker run -p 3000:3000 express-app

Create a migration from changes in Prisma schema, apply it to the database, trigger generators (e.g. Prisma Client)
$ prisma migrate dev

Reset your database and apply all migrations
$ prisma migrate reset

Apply pending migrations to the database in production/staging
$ prisma migrate deploy

Check the status of migrations in the production/staging database
$ prisma migrate status

Specify a schema
$ prisma migrate status --schema=./schema.prisma

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# MS-PRODUCTS

## Levantar el proyecto

1. Clonar el repositorio
2. Instalar los modulos de node
3. Crear un archivo `.env` basado en el `env.template`
4. Ejecutar migración de prisma `npx prisma migrate dev`
5. Levantar el servidor de NATS
```
docker run -d --name nats-server -p 4222:4222 -p 8222:8222 nats
```
6. Ejecutar `npm run start:dev`
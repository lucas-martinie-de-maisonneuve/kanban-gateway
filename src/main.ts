import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";

/** Creates the NestJS application and applies its global HTTP settings. */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:4200",
    credentials: true,
  });
  app.enableShutdownHooks();

  await app.listen(process.env.PORT ?? 8090);
}
bootstrap();

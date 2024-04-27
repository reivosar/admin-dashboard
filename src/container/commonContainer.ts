import { Container } from "inversify";
import { TYPES } from "./types";
import { PermissionQueryService } from "@/app/services/query/permission";
import { PrismaPermissionQueryService } from "@/infrastructures/service/query/permission";
import { PrismaClient } from "@prisma/client";
import { LogService } from "@/app/services/log";
import { PrismaLogService } from "@/infrastructures/service/log";
import { ContextCreator } from "@/pages/api/context-creator";
import { LogRegister } from "@/pages/api/log-register";
import { ErrorHandler } from "@/pages/api/error-handler";

export const CommonContainer = {
  dependencyInjecton(container: Container) {
    // Prisma
    container.bind(TYPES.PrismaClient).toConstantValue(new PrismaClient());

    // ServiceContextCreator
    container.bind(ContextCreator).toSelf();

    // Log
    container.bind(LogRegister).toSelf();
    container.bind<LogService>("LogService").to(PrismaLogService);

    // ErrorHandler
    container.bind(ErrorHandler).toSelf();

    // Permission
    container
      .bind<PermissionQueryService>("PermissionQueryService")
      .to(PrismaPermissionQueryService);
  },
};

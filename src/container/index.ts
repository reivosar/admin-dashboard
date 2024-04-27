import "reflect-metadata";
import { Container } from "inversify";
import { DebugContainer } from "./debugContainer";
import { MessageContainer } from "./messageContainer";
import { MyContainer } from "./myContainer";
import { UserContainer } from "./userContainer";
import { PrismaClient } from "@prisma/client";
import { TYPES } from "./types";

const container = new Container();

container.bind(TYPES.PrismaClient).toConstantValue(new PrismaClient());

DebugContainer.dependencyInjecton(container);
MessageContainer.dependencyInjecton(container);
MyContainer.dependencyInjecton(container);
UserContainer.dependencyInjecton(container);

export { container };

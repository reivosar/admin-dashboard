import "reflect-metadata";
import { Container } from "inversify";
import { CommonContainer } from "./commonContainer";
import { DebugContainer } from "./debugContainer";
import { MessageContainer } from "./messageContainer";
import { MyContainer } from "./myContainer";
import { UserContainer } from "./userContainer";

const container = new Container();

CommonContainer.dependencyInjecton(container);
DebugContainer.dependencyInjecton(container);
MessageContainer.dependencyInjecton(container);
MyContainer.dependencyInjecton(container);
UserContainer.dependencyInjecton(container);

export { container };

import { Scope, createInjector } from "typed-inject";
import { JsonFileDatabase } from "../data-access/json-file-database";
import { UnitOfWork } from "../data-access/unit-of-work";

export const appInjector = createInjector()
    .provideClass("database", JsonFileDatabase, Scope.Transient)
    .provideClass("unitOfWork", UnitOfWork, Scope.Transient);

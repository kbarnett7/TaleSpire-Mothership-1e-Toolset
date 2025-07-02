import { Scope, createInjector } from "typed-inject";
import { AppDatabaseContext } from "../data-access/app-database-context";
import { UnitOfWork } from "../data-access/unit-of-work";

export const appInjector = createInjector()
    .provideClass("appDatabaseContext", AppDatabaseContext, Scope.Transient)
    .provideClass("unitOfWork", UnitOfWork, Scope.Transient);

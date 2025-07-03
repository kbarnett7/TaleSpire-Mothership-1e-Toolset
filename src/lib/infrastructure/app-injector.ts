import { Scope, createInjector } from "typed-inject";
import { AppDatabaseContext } from "../data-access/app-database-context";
import { UnitOfWork } from "../data-access/unit-of-work";
import { SingleFileJsonDatabase } from "../data-access/single-file-json-database";
import { LocalFileStorage } from "../data-access/local-file-storage";

export const appInjector = createInjector()
    .provideClass("fileStorage", LocalFileStorage, Scope.Transient)
    .provideClass("database", SingleFileJsonDatabase, Scope.Transient)
    .provideClass("appDatabaseContext", AppDatabaseContext, Scope.Transient)
    .provideClass("unitOfWork", UnitOfWork, Scope.Transient);

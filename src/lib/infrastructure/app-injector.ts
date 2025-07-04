import { Scope, createInjector } from "typed-inject";
import { AppDatabaseContext } from "../data-access/app-database-context";
import { UnitOfWork } from "../data-access/unit-of-work";
import { SingleFileJsonDatabase } from "../data-access/single-file-json-database";
import { BrowserFileStorage } from "../data-access/browser-file-storage";
import { AppSettings } from "../settings/app-settings";

// TODO: use environment variable to determine the fileStorage class to use
export const appInjector = createInjector()
    .provideClass("appSettings", AppSettings, Scope.Singleton)
    .provideClass("fileStorage", BrowserFileStorage, Scope.Transient)
    .provideClass("database", SingleFileJsonDatabase, Scope.Transient)
    .provideClass("appDatabaseContext", AppDatabaseContext, Scope.Transient)
    .provideClass("unitOfWork", UnitOfWork, Scope.Transient);

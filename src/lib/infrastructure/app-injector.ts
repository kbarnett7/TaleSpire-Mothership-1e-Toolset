import appSettingsJson from "../../appsettings.json";
import { Scope, createInjector } from "typed-inject";
import { AppDatabaseContext } from "../data-access/app-database-context";
import { UnitOfWork } from "../data-access/unit-of-work";
import { SingleJsonFileDatabase } from "../data-access/single-json-file-database";
import { BrowserDatabaseStorage } from "../data-access/browser-database-storage";
import { AppSettings } from "../settings/app-settings";
import { TaleSpireDatabaseStorage } from "../data-access/talespire-database-storage";

const databaseStorageClass =
    appSettingsJson.environment === "production" ? TaleSpireDatabaseStorage : BrowserDatabaseStorage;

export const appInjector = createInjector()
    .provideValue("webStorage", window.localStorage)
    .provideClass("appSettings", AppSettings, Scope.Singleton)
    .provideClass("databaseStorage", databaseStorageClass, Scope.Transient)
    .provideClass("database", SingleJsonFileDatabase, Scope.Transient)
    .provideClass("appDatabaseContext", AppDatabaseContext, Scope.Transient)
    .provideClass("unitOfWork", UnitOfWork, Scope.Transient);

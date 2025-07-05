import appSettingsJson from "../../appsettings.json";
import { Scope, createInjector } from "typed-inject";
import { AppDatabaseContext } from "../data-access/app-database-context";
import { UnitOfWork } from "../data-access/unit-of-work";
import { SingleJsonFileDatabase } from "../data-access/single-json-file-database";
import { BrowserFileStorage } from "../data-access/browser-file-storage";
import { AppSettings } from "../settings/app-settings";
import { TaleSpireFileStorage } from "../data-access/talespire-file-storage";

const fileStorageClass = appSettingsJson.environment === "production" ? TaleSpireFileStorage : BrowserFileStorage;

export const appInjector = createInjector()
    .provideValue("webStorage", window.localStorage)
    .provideClass("appSettings", AppSettings, Scope.Singleton)
    .provideClass("fileStorage", fileStorageClass, Scope.Transient)
    .provideClass("database", SingleJsonFileDatabase, Scope.Transient)
    .provideClass("appDatabaseContext", AppDatabaseContext, Scope.Transient)
    .provideClass("unitOfWork", UnitOfWork, Scope.Transient);

import appSettingsJson from "../../appsettings.json";
import { Scope, createInjector } from "typed-inject";
import { AppDatabaseContext } from "../data-access/app-database-context";
import { UnitOfWork } from "../data-access/unit-of-work";
import { SingleJsonFileDatabase } from "../data-access/single-json-file-database";
import { SeedableDatabaseStorage } from "../data-access/seedable-database-storage";
import { AppSettings } from "../settings/app-settings";
import { TaleSpireBlobStorage } from "../data-access/talespire-blob-storage";
import { BrowserBlobStorage } from "../data-access/browser-blob-storage";

const blobStorageClass = appSettingsJson.environment === "production" ? TaleSpireBlobStorage : BrowserBlobStorage;

export const appInjector = createInjector()
    .provideValue("webStorage", window.localStorage)
    .provideClass("appSettings", AppSettings, Scope.Singleton)
    .provideClass("blobStorage", blobStorageClass, Scope.Transient)
    .provideClass("databaseStorage", SeedableDatabaseStorage, Scope.Transient)
    .provideClass("database", SingleJsonFileDatabase, Scope.Transient)
    .provideClass("appDatabaseContext", AppDatabaseContext, Scope.Transient)
    .provideClass("unitOfWork", UnitOfWork, Scope.Transient);

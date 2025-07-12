import appSettingsJson from "../../appsettings.json";
import seedDatabaseJson from "../../database/json/database.json";
import { Scope, createInjector } from "typed-inject";
import { AppDatabaseContext } from "../data-access/app-database-context";
import { UnitOfWork } from "../data-access/unit-of-work";
import { AppSettings } from "../settings/app-settings";
import { TaleSpireBlobStorage } from "../data-access/talespire-blob-storage";
import { BrowserBlobStorage } from "../data-access/browser-blob-storage";
import { SeedableJsonDatabase } from "../data-access/seedable-json-database";

const blobStorageClass = appSettingsJson.environment === "production" ? TaleSpireBlobStorage : BrowserBlobStorage;

export const appInjector = createInjector()
    .provideValue("seedJson", seedDatabaseJson)
    .provideValue("webStorage", window.localStorage)
    .provideClass("appSettings", AppSettings, Scope.Singleton)
    .provideClass("blobStorage", blobStorageClass, Scope.Singleton)
    .provideClass("database", SeedableJsonDatabase, Scope.Singleton)
    .provideClass("appDatabaseContext", AppDatabaseContext, Scope.Singleton)
    .provideClass("unitOfWork", UnitOfWork, Scope.Transient);

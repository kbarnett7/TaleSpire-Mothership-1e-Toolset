import appSettingsJson from "../../appsettings.json";
import seedDatabaseJson from "../../database/json/database.json";
import { Scope, createInjector } from "typed-inject";
import { AppDatabaseContext } from "../data-access/app-database-context";
import { UnitOfWork } from "../data-access/unit-of-work";
import { AppSettings } from "../settings/app-settings";
import { SeedableJsonDatabase } from "../data-access/seedable-json-database";
import { BlobStorageAdapter } from "../data-access/blob-storage-adapter";
import { ITaleSpireApi } from "./talespire-api-interface";

declare const TS: any;
console.info("Configure appInjector...");

console.info(`TS Object:`);
//console.log(safeTS);

const safeTS: ITaleSpireApi =
    typeof TS !== "undefined"
        ? TS
        : {
              dice: {
                  putDiceInTray: (rolls: { name: string; roll: string }[]) => {},
                  evaluateDiceResultsGroup: async (resultsGroupd: any) => 0,
              },
              localStorage: {
                  global: {
                      getBlob: () => "",
                      setBlob: (value: string) => {},
                  },
              },
          };

export const appInjector = createInjector()
    .provideValue("environment", appSettingsJson.environment)
    .provideValue("seedJson", seedDatabaseJson)
    .provideValue("webStorage", window.localStorage)
    .provideValue("taleSpireService", safeTS)
    .provideClass("appSettings", AppSettings, Scope.Singleton)
    .provideClass("blobStorage", BlobStorageAdapter, Scope.Singleton)
    .provideClass("database", SeedableJsonDatabase, Scope.Singleton)
    .provideClass("appDatabaseContext", AppDatabaseContext, Scope.Singleton)
    .provideClass("unitOfWork", UnitOfWork, Scope.Singleton);

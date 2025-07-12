import { ITaleSpireApi } from "./talespire-api-interface";

// Assuming TS is part of an external library, import or define it here
// declare const TS: {
//     dice: {
//         putDiceInTray: (rolls: { name: string; roll: string }[]) => void;
//         evaluateDiceResultsGroup: (resultsGroupd: any) => Promise<number>;
//     };
//     localStorage: {
//         global: {
//             getBlob: () => string;
//             setBlob: (value: string) => void;
//         };
//     };
// };

// declare const TS: ITaleSpireApi | undefined;

// export const safeTS: ITaleSpireApi =
//     typeof TS !== "undefined"
//         ? TS
//         : {
//               dice: {
//                   putDiceInTray: (rolls: { name: string; roll: string }[]) => {},
//                   evaluateDiceResultsGroup: async (resultsGroupd: any) => 0,
//               },
//               localStorage: {
//                   global: {
//                       getBlob: () => "",
//                       setBlob: (value: string) => {},
//                   },
//               },
//           };

//declare const TS: any;

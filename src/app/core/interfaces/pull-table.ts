import { BannerResponse } from "./banner";
import { UnitResponse } from "./unit";

export interface PullTable {
    id: number,
    banner: BannerResponse,
    unit: UnitResponse,
    pullsAmount: number,
    fiftyFifty: boolean,
    capturingRadiance: boolean
}
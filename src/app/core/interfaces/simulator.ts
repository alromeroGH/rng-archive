import { UnitResponse } from "./unit"

export interface CharacterSimulator {
    bannerId: number,
    summonAmount: number,
    pityCount: number,
    primoCount: number,
    winFiftyFiftyCount: number,
    winCapturingRadianceCount: number,
    isLostFiftyFifty: boolean,
    fourStarPityCount: number
}

export interface ResponseCharacterSimulator {
    units: UnitResponse[],
    pityCount: number,
    primoCount: number,
    winFiftyFiftyCount: number,
    winCapturingRadianceCount: number,
    lostFiftyFifty: boolean,
    fourStarPityCount: number
}

export interface WeaponSimulator {
    bannerId: number,
    summonAmount: number,
    pityCount: number,
    primoCount: number,
    divinePathCount: number,
    weaponSelected: number,
    fourStarPityCount: number
}

export interface ResponseWeaponSimulator {
    units: UnitResponse[],
    pityCount: number,
    primoCount: number,
    divinePathCount: number,
    fourStarPityCount: number
}
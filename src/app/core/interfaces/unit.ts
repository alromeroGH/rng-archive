export interface Unit {
    unitType: string,
    unitName: string,
    numberOfStars: string,
    unitBanner: string,
    unitImage: string
}

export interface UnitResponse {
    id: number,
    unitType: string,
    unitName: string,
    numberOfStars: string,
    unitBanner: string,
    unitImage: string
}

export interface UnitBanner {
    unitId: number,
    unitName: string,
}
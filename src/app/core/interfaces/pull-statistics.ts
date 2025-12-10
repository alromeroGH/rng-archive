export interface PullStatistics {
    userId: number,
    bannerType: string
}

export interface PullStatisticsData {
    totalPull: number,
    totalFiveUnit: number,
    totalLimitedUnit: number,
    fiftyFiftyGraphic: FiftyFiftyGraphic,
    capturingRadianceGraphic: CapturingRadianceGraphic
}

export interface FiftyFiftyGraphic {
    lost: number,
    win: number
}

export interface CapturingRadianceGraphic {
    activate: number,
    notActivate: number
}
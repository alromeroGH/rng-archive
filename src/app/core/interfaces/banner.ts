export interface Banner {
    bannerId: number,
    bannerName: string,
    bannerVersion: string,
    bannerPhase: string,
    bannerImage: string,
    fiveStar: FiveStarBanner[]
}

export interface BannerResponse {
    id: number,
    bannerName: string,
    bannerVersion: string,
    bannerPhase: string,
    bannerType: string,
    bannerImage: string,
}

export interface BannerMechanics {
    name: string,
    win: boolean
}

export interface FiveStarBanner {
    id: number,
    unitName: string,
    unitImage: string
}
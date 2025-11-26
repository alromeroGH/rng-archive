export interface CharacterBanner {
    id: number;
    unitName: string;
}

export interface CharacterBannerTable {
    id: number;
    characterBannerName: string;
    bannerPhase: string;
    bannerVersion: string;
    bannerStartDate: Date;
    fiveStars: CharacterBanner;
    fourStars: CharacterBanner[];
    bannerImage: string;
}
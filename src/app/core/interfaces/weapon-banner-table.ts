export interface WeaponBanner {
    id: number;
    unitName: string;
}

export interface WeaponBannerTable {
    id: number;
    weaponBannerName: string;
    bannerPhase: string;
    bannerVersion: string;
    bannerStartDate: Date;
    fiveStars: WeaponBanner[];
    fourStars: WeaponBanner[];
    bannerImage: string;
}
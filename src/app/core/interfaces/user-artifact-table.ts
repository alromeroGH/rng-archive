import { Stat } from "./stat";

export interface UserArtifactTable {
    id: number,
    set: ArtifactSet,
    piece: ArtifactPiece,
    mainStat: Stat,
    secondaryStats: Stat[]
}

export interface ArtifactPiece {
    id: number;
    pieceType: string;
    pieceName: string;
}

export interface ArtifactSet {
    id: number;
    setName: string;
    setImage: string;
}
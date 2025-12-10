export interface ArtifactStatistics {
    userId: number,
    artifactPieceId: number,
    artifactSetId: number,
    mainStatId: number
}

export interface ArtifactStatisticsData {
    probabilityPercentage: number;
    totalPieceArtifacts: number;
    totalSetArtifacts: number;
    setName: string;
    pieceType: string;
    mainStat: string;
}
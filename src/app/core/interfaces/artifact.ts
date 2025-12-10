export interface ArtifactPiece {
    pieceType: string;
    pieceName: string;
}

export interface ArtifactSet {
    setName: string;
    setImage: string;
}

export interface ArtifactCreationRequest {
    artifactSet: ArtifactSet; 
    artifactPieces: ArtifactPiece[];
}

export interface GetArtifactPiece {
    id: number;
    pieceType: string;
    pieceName: string;
}

export interface GetArtifactSet {
    id: number;
    setName: string;
    setImage: string;
}
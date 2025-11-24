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
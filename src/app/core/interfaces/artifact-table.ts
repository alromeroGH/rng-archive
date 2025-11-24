export interface ArtifactTable {
    id: number,
    set: string,
    image: string,
    flower: {id: number, pieceName: string},
    feather: {id: number, pieceName: string},
    sands: {id: number, pieceName: string},
    goblet: {id: number, pieceName: string},
    circlet: {id: number, pieceName: string}
}
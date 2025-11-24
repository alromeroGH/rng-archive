export interface NewsTable {
    id: number,
    newsType: string,
    title: string,
    description: string,
    link: string | null,
    date: Date
}
export class Song{
    constructor(
        public _id: string,
        public number: number,
        public name: string,
        public duration: number,
        public file: string,
        public album: string
    ){}
}
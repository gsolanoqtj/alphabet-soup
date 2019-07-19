import { TypeFound } from "./type-found.enum";
import { Index } from "./index.model";

export class WordAlphabetSoup {
    type: TypeFound = null;
    indexStart: Index = null;
    indexEnd: Index = null;
    wordNormal: string = '';
    wordReverse: string = '';
}
import { Injectable } from '@angular/core';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root'
})
export class AlphabetSoupService {

  constructor(private _utilService: UtilService) { }

  findRandomData(numRows: number, numColumns: number) {
    return Array(numRows)
      .fill(null)
      .map(() => {
        return Array(numColumns)
                .fill(null)
                .map(() => this._utilService.getRandomLetter())
      });
  }
}

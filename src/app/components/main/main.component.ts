import { Component, OnInit } from '@angular/core';
import { AlphabetSoupService } from 'src/app/services/alphabet-soup.service';
import { WordAlphabetSoup } from 'src/app/models/word-alphabet-soup.model';
import { TypeFound } from 'src/app/models/type-found.enum';
import { Index } from 'src/app/models/index.model';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  filterWord: string = '';
  numRows: number = 0;
  numColumns: number = 0;
  data: Array<Array<string>> = [];
  dataToFilter: Array<WordAlphabetSoup> = [];
  dataFounded: Array<Array<Index>> = [];

  constructor(private _alphabetSoupService: AlphabetSoupService,
              private _utilService: UtilService) { }

  ngOnInit() {
  }

  loadData() {
    this.dataFounded = [];
    this.dataToFilter = [];
    this.data = [];
    this.data = this._alphabetSoupService.findRandomData(this.numRows, this.numColumns);
    this.dataToFilter = this.convertToColsRowsDiagonal();
  }

  convertToColsRowsDiagonal() {
    let dataToFilter: Array<WordAlphabetSoup> = [];
    for(let i = 0; i < this.numRows; i++) {
      let row = this.data[i].slice(0);
      dataToFilter.push({
        type: TypeFound.Horizontal,
        indexStart: new Index(i, 0),
        indexEnd: new Index(i, this.numColumns - 1),
        wordNormal: row.join(''),
        wordReverse: row.reverse().join('')
      })
    }
    for(let j = 0; j < this.numColumns; j++) {
      let column = this.data.map(value => value[j]);
      dataToFilter.push({
        type: TypeFound.Vertical,
        indexStart: new Index(0, j),
        indexEnd: new Index(this.numRows - 1, j),
        wordNormal: column.join(''),
        wordReverse: column.reverse().join('')
      })
    }

    let jk = 0;
    let dataDiagonalSlash: Array<WordAlphabetSoup> = [];
    let dataDiagonalBackSlash: Array<WordAlphabetSoup> = [];
    for(let i = 0; i < this.numRows && jk < this.numColumns; i++) {
      let diagonalSlash = [];
      let diagonalBackSlash = [];
      let jkSelected = i < this.numColumns - 1 ? i : this.numColumns - 1
      for(let j = 0; j <= jkSelected; j++) {
        diagonalSlash.push(this.data[i - j][jk + j]);
        diagonalBackSlash.push(this.data[this.numRows - 1 - (i - j)][jk + j]);
      }
      dataDiagonalSlash.push({
        type: TypeFound.DiagonalSlash,
        indexStart: new Index(i, jk),
        indexEnd: new Index(i - jkSelected, jkSelected),
        wordNormal: diagonalSlash.join(''),
        wordReverse: diagonalSlash.reverse().join('')
      });
      dataDiagonalBackSlash.push({
        type: TypeFound.DiagonalBackSlash,
        indexStart: new Index(this.numRows - 1 - i, jk),
        indexEnd: new Index(this.numRows - 1 - (i - jkSelected), jkSelected),
        wordNormal: diagonalBackSlash.join(''),
        wordReverse: diagonalBackSlash.reverse().join('')
      });
      if(i == this.numRows - 1) {
        i--;
        jk++;
      }
    }

    dataToFilter = dataToFilter.concat(dataDiagonalSlash);
    dataToFilter = dataToFilter.concat(dataDiagonalBackSlash);

    return dataToFilter;
  }

  search() {
    let founded: Array<Array<Index>> = [];
    let sizeFilterWord = this.filterWord.length;
    if(sizeFilterWord > 0) {
      this.dataToFilter
        .forEach((item) => {
          let indexesWordNormal = this._utilService.getAllIndexesOf(item.wordNormal, this.filterWord);
          let indexesWordReverse = this._utilService.getAllIndexesOf(item.wordReverse, this.filterWord);

          let sumRow = 0;
          let sumCol = 0;
          if(item.type == TypeFound.Horizontal) {
            sumRow = 0;
            sumCol = 1;
          }
          if(item.type == TypeFound.Vertical) {
            sumRow = 1;
            sumCol = 0;
          }
          if(item.type == TypeFound.DiagonalSlash) {
            sumRow = -1;
            sumCol = 1;
          }
          if(item.type == TypeFound.DiagonalBackSlash) {
            sumRow = 1;
            sumCol = 1;
          }

          if(indexesWordNormal.length > 0 || indexesWordReverse.length > 0) {
            if(indexesWordNormal.length > 0) {
              indexesWordNormal.forEach(index => {
                let subIndexes: Array<Index> = [];
                for(let i = index * sumRow, j = index * sumCol, k = 0 ; k < sizeFilterWord; i += sumRow, j += sumCol, k++) {
                  subIndexes.push({
                    indexRow: item.indexStart.indexRow + i,
                    indexCol: item.indexStart.indexCol + j
                  })
                }
                founded.push(subIndexes);
              })
            }
            if(indexesWordReverse.length > 0) {
              indexesWordReverse.forEach(index => {
                let subIndexes: Array<Index> = [];
                for(let i = (item.wordReverse.length - (sizeFilterWord + index)) * sumRow, j = (item.wordReverse.length - (sizeFilterWord + index)) * sumCol, k = 0 ; k < sizeFilterWord; i += sumRow, j += sumCol, k++) {
                  subIndexes.push({
                    indexRow: item.indexStart.indexRow + i,
                    indexCol: item.indexStart.indexCol + j
                  })
                }
                founded.push(subIndexes);
              })
            }
          }
        });
    }
    this.dataFounded = founded;
  }

  getBackgroundColor(indexRow: number, indexCol: number) {
    let founded = this.dataFounded.find(item => {
      return item.find(subItem => subItem.indexRow == indexRow && subItem.indexCol == indexCol) != null;
    }) != null;
    if(founded) {
      return 'gold';
    } else {
      return 'white';
    }
  }
}

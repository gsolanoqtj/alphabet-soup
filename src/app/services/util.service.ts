import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  getRandomIntegerBetween(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }

  getRandomLetter() {
    let aCode: number = 'a'.charCodeAt(0);
    let zCode: number = 'z'.charCodeAt(0);
    return String.fromCharCode(this.getRandomIntegerBetween(aCode, zCode));
  }

  getAllIndexesOf(arrayOrString: any, value: any) {
    var indexes = [], i = -1;
    while ((i = arrayOrString.indexOf(value, i + 1)) != -1){
        indexes.push(i);
    }
    return indexes;
  }
}

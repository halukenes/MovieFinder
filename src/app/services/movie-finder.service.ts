import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';

interface IMrisaResult {
  links: string[],
  descriptions: string[],
  titles: string[],
  similar_images: string[],
  best_guess: string[],
  resized_images: string[]
}

interface PhraseFrequency {
  phrase: string,
  frequency: number
}

@Injectable({
  providedIn: 'root'
})
export class MovieFinderService {

  private header = { headers: { 'Content-Type': 'application/json' } };
  private unnecessaryWords: string[] = ['the', 'a', 'an', 'and', 'or', 'am', 'is', 'are',
    'this', 'these', 'those', 'that', 'has', 'have', 'I', 'you', 'he', 'she', 'it', 'they', 'we', 'us',
    'all', 'there', 'for', 'your', 'us', 'to'];

  constructor(private http: HttpClient) { }

  async postImageURL(imageUrl: string): Promise<IMrisaResult> {
    const response = await this.http.post<IMrisaResult>(environment.mrisaApiUrl, this.createBodyforMrisaApi(imageUrl), this.header).toPromise();
    var ss = '';    //TODO
    response.descriptions.forEach(element => {
      ss = ss + element;
    });
    console.log(response.best_guess);
    this.findRepeatedWordGroup(ss);
    return response;
  }

  createBodyforMrisaApi(imageUrl: string) {
    return '{"image_url":"' + imageUrl + '","resized_images":false}';
  }

  findRepeatedWordGroup(text: string) {
    var phraseResults = [];
    var regexp = /(?=(?:\W|^)(.{3,}).*(?:\W|^)\1(?:\W|$))+/gi;
    text = text.replace(/\.{3}/g, '');

    var match = regexp.exec(text);
    var res = match[1].trim();
    res = res.replace(/,\s*$/, "");
    phraseResults.push(res);

    while (match != null) {
      regexp.lastIndex++;
      match = regexp.exec(text);
      if (match != null) {
        res = match[1].trim();
        res = res.replace(/,\s*$/, "");
        phraseResults.push(res);
      }
    }

    var editedArray: PhraseFrequency[] = [];
    phraseResults = this.removeRepeatedWordsinStringArray(phraseResults);
    phraseResults = this.removeUnnecessaryWords(phraseResults);
    phraseResults.forEach(value => {
      editedArray.push(this.createPhraseFrequency(value, text))
    });
    editedArray.sort((a, b) => (a.frequency > b.frequency) ? -1 : (a.frequency === b.frequency) ? ((a.frequency > b.frequency) ? -1 : 1) : 1);
    console.log(editedArray);
  }

  createPhraseFrequency(phrase: string, text: string): PhraseFrequency {
    //if (/^([a-z0-9]{5,})$/.test('abc1'))
    var count = (text.match(new RegExp(phrase, 'gi')) || []).length;
    var phraseFrequency: PhraseFrequency = {
      phrase: phrase,
      frequency: count
    }
    return phraseFrequency;
  }

  removeRepeatedWordsinStringArray(wordArray: string[]): string[] {
    var uniqueArray: string[] = [];
    wordArray.forEach(function (i) {
      if (!(uniqueArray.includes(i) || uniqueArray.includes(i.toLowerCase())))
        uniqueArray.push(i)
    });
    uniqueArray.forEach((value, index) => {
      uniqueArray.forEach((value2, index2) => {
        if (value.toLowerCase() !== value2.toLowerCase() && value.toLowerCase().includes(value2.toLowerCase())) {
          uniqueArray.splice(index2, 1);
        }
      })
    });
    uniqueArray.forEach((value, index) => {
      uniqueArray.forEach((value2, index2) => {
        if (value.toLowerCase() !== value2.toLowerCase() && value.toLowerCase().includes(value2.toLowerCase())) {
          uniqueArray.splice(index2, 1);
        }
      })
    });
    return uniqueArray;
  }

  removeUnnecessaryWords(wordArray: string[]): string[] {
    var usefulPhrasesArray: string[] = [];
    wordArray.forEach((value) => {
      if (!this.unnecessaryWords.includes(value.toLowerCase())) {
        usefulPhrasesArray.push(value);
      }
    });
    return usefulPhrasesArray;
  }

}

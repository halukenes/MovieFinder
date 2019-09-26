import { Component, OnInit } from '@angular/core';
import { MovieFinderService } from '../services/movie-finder.service';

@Component({
  selector: 'find-movie',
  templateUrl: './find-movie.component.html',
  styleUrls: ['./find-movie.component.scss']
})
export class FindMovieComponent implements OnInit {

  private imageURL: string = '';

  constructor(private movieFinderService: MovieFinderService) { }

  ngOnInit() {
  }

  getResults() {
    this.movieFinderService.postImageURL(this.imageURL);
  }

}

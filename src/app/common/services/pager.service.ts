import { Injectable } from '@angular/core';
import { Pager } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class PagerService {
  constructor() {}

  getPager(
    totalItems: number,
    currentPage: number = 1,
    pageSize: number
  ): Pager {
    // console.log(`Getting pager: totalItems: ${totalItems}, currentPage: ${currentPage}, pageSize: ${pageSize}`);
    // calculate total pages
    const totalPages = Math.ceil(totalItems / pageSize);
    let startPage: number;
    let endPage: number;
    if (totalPages <= 10) {
      // less than 10 total pages so show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // more than 10 total pages so calculate start and end pages
      if (currentPage <= 6) {
        startPage = 1;
        endPage = 10;
      } else if (currentPage + 4 >= totalPages) {
        startPage = totalPages - 9;
        endPage = totalPages;
      } else {
        startPage = currentPage - 5;
        endPage = currentPage + 4;
      }
    }

    // calculate start and end item indexes
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    // create an array of pages to ng-repeat in the pager control
    const pages = Array.from(
      Array(endPage + 1 - startPage),
      (_, i) => startPage + i
    );
    // return object with all pager properties required by the view
    return {
      totalItems,
      currentPage,
      pageSize,
      totalPages,
      startPage,
      endPage,
      startIndex,
      endIndex,
      pages,
    };
  }
}

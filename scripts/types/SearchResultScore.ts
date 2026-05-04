import { SearchResult } from "~/scripts/types/SearchResult"

export class SearchResultScore {
  searchResult: SearchResult
  matchScore: number = 0
  isExactMatch: boolean = false

  constructor(
    searchResult: SearchResult, 
    matchScore: number, 
    isExactMatch: boolean
  ) {
    this.searchResult = searchResult
    this.matchScore = matchScore
    this.isExactMatch = isExactMatch
  }
}
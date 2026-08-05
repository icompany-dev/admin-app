export interface IPropsAnalyticsDistribution {
  totalNumberOfCompanies: number
  companiesByIncorpDate: any
  companiesByLocation: any
  totalIncorporated: number
  totalSwitched: number
  companiesByDateJoined: any
  totalNumberOfUsers: number
  usersByAgeGroup: any
  usersByCitizenship: any
  usersByGender: any
  usersByRace: any
  usersByDateJoined: any
  totalSignUpsThisMonth: number
  isLoading: boolean
}

export class PropsAnalyticsDistribution {
  totalNumberOfCompanies: number = 0
  companiesByIncorpDate: any = {}
  companiesByLocation: any = {}
  totalIncorporated: number = 0
  totalSwitched: number = 0
  companiesByDateJoined: any = {}
  totalNumberOfUsers: number = 0
  usersByAgeGroup: any = {}
  usersByCitizenship: any = {}
  usersByGender: any = {}
  usersByRace: any = {}
  usersByDateJoined: any = {}
  totalSignUpsThisMonth: number = 0

  isLoading: boolean = false

  constructor() {}
}

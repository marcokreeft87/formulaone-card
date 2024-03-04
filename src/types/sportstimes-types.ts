export interface SportsTimesRoot {
    races: SportsTimesRace[]
  }
  
  export interface SportsTimesRace {
    name: string
    location: string
    latitude: number
    longitude: number
    round: number
    slug: string
    localeKey: string
    sessions: SportsTimesSessions
  }
  
  export interface SportsTimesSessions {
    fp1: string
    fp2?: string
    fp3?: string
    qualifying: string
    gp: string
    sprintQualifying?: string
    sprint?: string
  }
  
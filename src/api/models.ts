export interface Root {
    MRData: Mrdata
  }
  
  export interface Mrdata {
    xmlns: string
    series: string
    url: string
    limit: string
    offset: string
    total: string
    RaceTable?: RaceTable
    SeasonTable?: SeasonTable;
    StandingsTable?: StandingsTable
  }

  export interface StandingsTable {
    season: string
    StandingsLists: StandingsList[]
  }
  
  export interface StandingsList {
    season: string
    round: string
    ConstructorStandings: ConstructorStanding[]
    DriverStandings: DriverStanding[]
  }
  
  export interface DriverStanding {
    position: string
    positionText: string
    points: string
    wins: string
    Driver: Driver
    Constructors: Constructor[]
  }
  
  export interface ConstructorStanding {
    position: string
    positionText: string
    points: string
    wins: string
    Constructor: Constructor
  }
  
  export interface RaceTable {
    season: string
    round: string
    Races: Race[]
  }
  
  export interface Race {
    season: string
    round: string
    url: string
    raceName: string
    Circuit: Circuit
    date: string
    time: string
    Results: Result[]
    FirstPractice: FirstPractice
    SecondPractice: SecondPractice
    ThirdPractice?: ThirdPractice
    Qualifying?: Qualifying
    Sprint?: Sprint
  }
  
  export interface Circuit {
    circuitId: string
    url: string
    circuitName: string
    Location: Location
  }
  
  export interface Location {
    lat: string
    long: string
    locality: string
    country: string
  }
  
  export interface Result {
    number: string
    position: string
    positionText: string
    points: string
    Driver: Driver
    Constructor: Constructor
    grid: string
    laps: string
    status: string
    Time?: Time
    FastestLap: FastestLap
    FirstPractice: FirstPractice
    SecondPractice: SecondPractice
    ThirdPractice?: ThirdPractice
    Qualifying: Qualifying
    Sprint?: Sprint
  }
  
  export interface Driver {
    driverId: string
    permanentNumber: string
    code: string
    url: string
    givenName: string
    familyName: string
    dateOfBirth: string
    nationality: string
  }
  
  export interface Constructor {
    constructorId: string
    url: string
    name: string
    nationality: string
  }
  
  export interface Time {
    millis: string
    time: string
  }
  
  export interface FastestLap {
    rank: string
    lap: string
    Time: Time2
    AverageSpeed: AverageSpeed
  }
  
  export interface Time2 {
    time: string
  }
  
  export interface AverageSpeed {
    units: string
    speed: string
  }
  export interface SeasonTable {
    Seasons: Season[]
  }
  
  export interface Season {
    season: string
    url: string
  }
  
  export interface FirstPractice {
    date: string
    time: string
  }
  
  export interface SecondPractice {
    date: string
    time: string
  }
  
  export interface ThirdPractice {
    date: string
    time: string
  }
  
  export interface Qualifying {
    date: string
    time: string
  }
  
  export interface Sprint {
    date: string
    time: string
  }
  
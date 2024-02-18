export interface IResumeField {
  id: string,
  name: string,
  value: string
}

export interface IResume {
  fields: IResumeField[]
}

export interface IAddUrlBody {
  url: string
}

export interface IStats {
  [key: string]: string[]
}

export interface IStatsCountRes {
  count: number
}
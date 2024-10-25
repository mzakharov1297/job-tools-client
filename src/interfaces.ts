export interface IInterview {
  id: string
  company: string
  vacancyDescription: string
  contactName: string
  tgUsername?: string
  waPhoneUsername?: string
  phone?: string
  createdAt: Date
}

export enum ResultEnum  {
  Offer = "Offer",
  Refusal = "Refusal",
  Pending = "Pending",
}


export type UpdateDocModel = Omit<IInterview, 'id' | 'createdAt'> & {
  salaryFrom?: number | null
  salaryTo?: number | null
  stage?: {
    key: string
    stageName: string
    stageDate: Date
    stageComment: string
  }[]
  result: ResultEnum
}

export type UpdatedInterviews = UpdateDocModel

import type { IModel } from "./IModel"
export class Faq implements IModel<Faq>  {
  id: string = ''
  number: number = 0
  keywords: string[] = []
  isOnMainPage: boolean = false
  questionAnswers: FaqQuestionAnswer[] = []

  constructor(data: any = null) {
    if (data !== null) {
      if (data instanceof Faq) {
        this.clone(data)
      } else {
        this.convertFromResponse(data)
      }
    }
  }

  clone (data: Faq) {
    this.id = data.id
    this.number = data.number
    this.keywords = data.keywords
    this.isOnMainPage = data.isOnMainPage
    this.questionAnswers = data.questionAnswers
      .map((qa: FaqQuestionAnswer): FaqQuestionAnswer => {
        return new FaqQuestionAnswer(qa.language, qa.question, qa.answer)
      })
  }

  convertFromResponse (data: any) {
    this.id = data.question_tag
    this.number = data.number
    this.keywords = data.keywords.length > 0 ? data.keywords.split(',') : []
    this.isOnMainPage = data.show_on_main_page
    this.questionAnswers =
      data.question_answers.length > 0
        ? data.question_answers.map((val: any): FaqQuestionAnswer => {
            return new FaqQuestionAnswer(val.language, val.question, val.answer)
          })
        : []
  }

  getRequestBody () { return {} }
}

export class FaqQuestionAnswer {
  language: string
  question: string
  answer: string

  constructor(language: string, question: string, answer: string) {
    this.language = language
    this.question = question
    this.answer = answer
  }
}

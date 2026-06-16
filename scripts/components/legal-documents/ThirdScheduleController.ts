import { StringUtil } from "~/scripts/utils/String"

export class ThirdScheduleController {
  itemRunningNumber: Ref<number> = ref<number>(1)

  items: string[] = [
    "chairperson",
    "noticeOfMeeting",
    "methodsOfHoldingMeetings",
    "quorum",
    "voting",
    "minutes",
    "resolutionsPassedAtAdjournedMeetings",
    "resolutionInWriting",
    "otherProceedings",
    "committeesOfTheBoard",
    "managingDirectors",
    "associateDirectors",
  ]

  constructor() {}

  itemNumber(index: number, currentItem: string): string {
    let numberOfItems = 0

    let indexOfCurrentItem = this.items.findIndex((item: string) => {
      return item === currentItem
    })

    if (indexOfCurrentItem > 0) {
      for (let i = indexOfCurrentItem - 1; i >= 0; i--) {
        let item = this.items[i]
        numberOfItems += (this as any)[item]().length ?? 1
      }
    }

    return `${numberOfItems + 1 + index}.`
  }

  headerComponents(): string[] {
    return ["Third Schedule", "[Section 212]", "<b>PROCEEDINGS OF THE BOARD</b>"]
  }

  chairperson(): string[] {
    return [
      `The directors may elect one of their numbers as chairperson of the Board and determine the period for 
       which he is to hold office.`,
      `If no chairperson is elected, or if at any meeting of the Board the chairperson is not present within 
       fifteen minutes after the time appointed for commencement of the meeting, the directors present may 
       choose one of their numbers to be chairperson of the meeting.`,
    ]
  }

  noticeOfMeeting(): string[] {
    return [
      `A director or, if requested by a director to do so, a secretary, may convene a meeting of the Board by 
       giving notice in accordance with paragraph 4.`,
      `A notice of a meeting of the Board shall be sent to every director who is in Malaysia, and the notice 
       shall include the date, time and place of the meeting and the matters to be discussed.`,
      `An irregularity in the notice of a meeting is waived if all directors entitled to receive notice of 
       the meeting attend the meeting without objection to the irregularity.`,
    ]
  }

  methodsOfHoldingMeetings(): string[] {
    return ["A meeting of the Board may be held either--"]
  }

  methodsOfHoldingMeetingsItems(): string[] {
    return [
      `by a number of the directors who constitute a quorum, being assembled together at the place, date and time 
       appointed for the meeting; or`,
      `by means of audio, or audio and visual, communication by which all directors participating and constituting 
       a quorum can simultaneously hear each other throughout the meeting.`,
    ]
  }

  quorum(): string[] {
    return [
      `A quorum for a meeting of the Board shall be fixed by the Board and if not so fixed shall be a majority of 
       the directors.`,
      `No business may be transacted at a meeting of the Board if a quorum is not present.`,
    ]
  }

  voting(): string[] {
    return [
      `Every director has one vote.`,
      `The chairperson shall have a casting vote.`,
      `A resolution of the Board is passed if it is agreed to by all directors present without dissent or if a 
       majority of the votes cast on it are in favour of it.`,
      `A director present at a meeting of the Board is presumed to have agreed to, and to have voted in favour of, a 
       resolution of the Board unless he expressly dissents from or votes to object against the resolution at the 
       meeting.`,
    ]
  }

  minutes(): string[] {
    return ["The Board shall ensure that the minutes of all proceedings at meetings of the Board are kept."]
  }

  resolutionsPassedAtAdjournedMeetings(): string[] {
    return [
      `Where a resolution is passed at an adjourned meeting of the Board, the resolution shall, for all purposes, be 
       treated as having been passed on the date on which it was in fact passed and shall not to be deemed to have 
       been passed on any earlier date.`,
    ]
  }

  resolutionInWriting(): string[] {
    return [
      `A resolution in writing, signed or assented to by all directors then entitled to receive notice of meeting of 
       the Board, is as valid and effective as if it had been passed at a meeting of the Board duly convened.`,
      `Any such resolution may consist of several documents, including facsimile or other similar means of communication, 
       in similar form and each document shall be signed or assented to by one or more directors.`,
      `A copy of any such resolution shall be entered in the minute book of Board proceedings.`,
    ]
  }

  otherProceedings(): string[] {
    return ["Except as provided in this Schedule, the Board may regulate its own proceedings."]
  }

  committeesOfTheBoard(): string[] {
    return [
      `The Board may delegate any of its powers to committees consisting of such member or members of its body as the Board 
       thinks fit and any committee so formed shall in the exercise of the powers so delegated conform to any terms or 
       conditions that may be imposed on it by the Board.`,
      `A committee may elect a chairperson of its meetings and may determine its own proceedings.`,
      `Any questions arising at any meeting of a committee shall be determined by a majority of votes of the members present, 
       and in the case of an equality of votes the chairman shall have a second or casting vote.`,
    ]
  }

  managingDirectors(): string[] {
    return [
      `The Board may, from time to time, appoint one or more of its body to the office of managing director for such period 
       and on such terms as the Board thinks fit and may revoke any such appointment.`,
      `A director appointed to the office of managing director shall not, while holding that office, be subject to retirement 
       by rotation or be taken into account in determining the rotation of retirement of directors, but his appointment shall 
       be automatically determined if he ceases from any cause to be a director.`,
      `A managing director shall, subject to the terms of any agreement entered into in any particular case, receive such 
       remuneration, whether by way of salary, commission, or participation in profits, or partly in one way and partly in 
       another, as the Board may determine.`,
      `The Board may entrust to and confer upon a managing director any of the powers exercisable by the Board upon such terms 
       and conditions and with such restrictions as the Board may think fit, and either collaterally with or to the exclusion 
       of the Board’s own powers, and may from time to time revoke, withdraw, alter or vary all or any of those powers.`,
    ]
  }

  associateDirectors(): string[] {
    return [
      `The Board may, from time to time, appoint any person to be an associate director and may from time to time revoke any 
       such appointment.`,
      `The Board may fix, determine and vary the powers, duties and remuneration of any person so appointed, but a person so 
       appointed shall not have any right to attend or vote at any meeting of the Board except by the invitation and with the 
       consent of the Board.`,
    ]
  }
}

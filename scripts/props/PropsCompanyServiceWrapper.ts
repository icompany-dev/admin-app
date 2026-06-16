import { type IApplication } from "../models/IApplication"
import { type IPropsServiceStep, PropsServiceStep } from "./PropsServiceStep"
import { type IPropsDocumentSlipCase, PropsDocumentSlipCase } from "./PropsDocumentSlipCase"
import { type IPropsDeleteApplication, PropsDeleteApplication } from "./PropsDeleteApplication"
import { type IPropsServiceWrapper, PropsServiceWrapper } from "./PropsServiceWrapper"
import { ViewMode } from "../constants/ViewMode"
import { PropsPastApplications, type IPropsPastApplications } from "./PropsPastApplications"
import type { Application } from "../models/Application"
import type { IRepositoryStore } from "../models/IRepositoryStore"
import { PaperOrientation } from "../constants/Paper"

export interface IPropsCompanyServiceWrapper {
  application: IApplication | null
  companyId: string
  currentPage: number
  totalPages: number
  earMarkText: string
  showServiceSteps: boolean
  hasPaid: boolean
  viewType: string
  hasOngoingApplication: boolean
  hasPastApplications: boolean
  paperOrientation: PaperOrientation
  serviceStepProps: IPropsServiceStep
  deleteApplicationProps: IPropsDeleteApplication
  documentSlipCaseProps: IPropsDocumentSlipCase
  serviceWrapperProps: IPropsServiceWrapper
  pastApplicationProps: IPropsPastApplications
}

export class PropsCompanyServiceWrapper implements IPropsCompanyServiceWrapper {
  application: IApplication
  companyId: string
  currentPage: number
  totalPages: number
  earMarkText: string
  showServiceSteps: boolean
  hasPaid: boolean
  viewType: string = ViewMode.New
  hasOngoingApplication: boolean = false
  hasPastApplications: boolean = false
  paperOrientation: PaperOrientation = PaperOrientation.Portrait
  serviceStepProps: PropsServiceStep
  deleteApplicationProps: PropsDeleteApplication
  documentSlipCaseProps: PropsDocumentSlipCase
  serviceWrapperProps: PropsServiceWrapper
  pastApplicationProps: PropsPastApplications

  constructor(
    application: IApplication,
    companyId: string,
    target: string,
    slipCaseTitle: string,
    viewType: string,
    hasOngoingApplication: boolean,
    hasPastApplications: boolean,
    targetId: string | null = null,
    currentPage: number | null = null,
    totalPages: number | null = null,
    earMarkText: string | null = null,
    showServiceSteps: boolean | null = null,
    hasPaid: boolean | null = null,
    price: number | null = null,
    haveAllSigned: boolean | null = null,
    hasUserSigned: boolean | null = null,
    signatureDate: string | null = null,
    isDcr: boolean | null = null,
    isMcr: boolean | null = null,
    numberOfDirectors: number | null = null,
    numberOfShareholders: number | null = null,
    canSkipToConfirmation: boolean | null = null,
    useDefaultConfirmation: boolean | null = null,
    backButtonLabel: string | null = null,
    proceedButtonLabel: string | null = null,
    hoveredProceedButtonLabel: string | null = null,
    isInPreviewMode: boolean | null = null,
    isMakingPayment: boolean | null,
    applicationClassType: new (data: any) => Application,
    repository: IRepositoryStore,
    isByShareholder: boolean = false,
    hasMajorityRule: boolean = false,
    hasCustomAffirmation: boolean = false
  ) {
    this.application = application
    this.companyId = companyId
    this.currentPage = currentPage ?? 1
    this.totalPages = totalPages ?? 1
    this.earMarkText = earMarkText ?? "DCR"
    this.showServiceSteps = showServiceSteps ?? false
    this.hasPaid = hasPaid ?? false
    this.viewType = viewType
    this.hasOngoingApplication = hasOngoingApplication
    this.hasPastApplications = hasPastApplications

    this.serviceStepProps = new PropsServiceStep(
      application,
      target,
      price,
      hasPaid,
      haveAllSigned,
      hasUserSigned,
      signatureDate,
      isDcr,
      isMcr,
      numberOfDirectors,
      numberOfShareholders,
      canSkipToConfirmation,
      useDefaultConfirmation,
      hasMajorityRule,
      hasCustomAffirmation
    )

    this.deleteApplicationProps = new PropsDeleteApplication(target, targetId ?? "")

    this.documentSlipCaseProps = new PropsDocumentSlipCase(
      slipCaseTitle,
      backButtonLabel,
      proceedButtonLabel,
      hoveredProceedButtonLabel,
      isMakingPayment
    )

    this.serviceWrapperProps = new PropsServiceWrapper(
      companyId,
      target,
      targetId,
      null,
      isInPreviewMode,
      isByShareholder
    )

    this.pastApplicationProps = new PropsPastApplications(companyId, applicationClassType, repository, target)
  }
}

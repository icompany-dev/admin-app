import type { AnnualReturnData, GeneratedXBRLPackage } from "~/scripts/types/AnnualReturnXBRLGenerator"
import JSZip from "jszip"

export class AnnualReturnXBRLGenerator {
  annualReturnData: AnnualReturnData | null = null

  constructor() {}

  setAnnualReturnData(annualReturnData: AnnualReturnData): void {
    this.annualReturnData = annualReturnData
  }

  generateXBRLPackage(): GeneratedXBRLPackage | null {
    if (!this.annualReturnData) {
      return null
    }

    const sanitizedCompanyNo = this.annualReturnData.companyNumber.replace(/[^a-zA-Z0-9]/g, "_")
    const returnYear = this.annualReturnData.annualReturnDate
      ? this.annualReturnData.annualReturnDate.substring(0, 4)
      : "2024"
    const instanceFilename = `MBRS_AR_${sanitizedCompanyNo}_${returnYear}.xbrl`
    const zipFilename = `MBRS_AR_PACKAGE_${sanitizedCompanyNo}_${returnYear}.zip`

    const xbrlXml = this.buildARXBRLXml(this.annualReturnData)
    const manifestXml = this.buildARManifestXml(this.annualReturnData, instanceFilename)
    const calculationXml = this.buildARCalculationSummaryXml(this.annualReturnData)
    const validationReport = this.validateARDocuments(this.annualReturnData)

    return {
      filename: zipFilename,
      xbrlFilename: instanceFilename,
      zipBlob: new Blob([]),
      sizeBytes: 0,
      xbrlXml,
      manifestXml,
      calculationXml,
      validationReport,
    }
  }

  escapeXml(unsafe: string = ""): string {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;")
  }

  buildARXBRLXml(arData: AnnualReturnData): string {
    const regAddress = `${arData.registeredOfficeAddress.addressLine1}, ${arData.registeredOfficeAddress.addressLine2}, ${arData.registeredOfficeAddress.postcode} ${arData.registeredOfficeAddress.city}, ${arData.registeredOfficeAddress.state}`
    const bizAddress = `${arData.businessAddress.addressLine1}, ${arData.businessAddress.addressLine2}, ${arData.businessAddress.postcode} ${arData.businessAddress.city}, ${arData.businessAddress.state}`

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
  <xbrli:xbrl
    xmlns:xbrli="http://www.xbrl.org/2003/instance"
    xmlns:link="http://www.xbrl.org/2003/linkbase"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    xmlns:iso4217="http://www.xbrl.org/2003/iso4217"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:ssm-ar="http://www.ssm.com.my/mbrs/ar/taxonomy/2023">
  
    <link:schemaRef
      xlink:type="simple"
      xlink:href="http://www.ssm.com.my/mbrs/ar/taxonomy/2023/ssm-mbrs-ar.xsd" />
  
    <xbrli:unit id="MYR">
      <xbrli:measure>iso4217:MYR</xbrli:measure>
    </xbrli:unit>
    <xbrli:unit id="shares">
      <xbrli:measure>xbrli:shares</xbrli:measure>
    </xbrli:unit>
    <xbrli:unit id="pure">
      <xbrli:measure>xbrli:pure</xbrli:measure>
    </xbrli:unit>
  
    <xbrli:context id="AR_Instant">
      <xbrli:entity>
        <xbrli:identifier scheme="http://www.ssm.com.my">${this.escapeXml(arData.companyNumber)}</xbrli:identifier>
      </xbrli:entity>
      <xbrli:period>
        <xbrli:instant>${arData.annualReturnDate}</xbrli:instant>
      </xbrli:period>
    </xbrli:context>
  
    <!-- Section 68 Companies Act 2016 - Annual Return Facts -->
    <ssm-ar:CompanyName contextRef="AR_Instant">${this.escapeXml(arData.companyName)}</ssm-ar:CompanyName>
    <ssm-ar:CompanyRegistrationNumber contextRef="AR_Instant">${this.escapeXml(arData.companyNumber)}</ssm-ar:CompanyRegistrationNumber>
    ${arData.oldCompanyNumber ? `<ssm-ar:OldCompanyRegistrationNumber contextRef="AR_Instant">${this.escapeXml(arData.oldCompanyNumber)}</ssm-ar:OldCompanyRegistrationNumber>` : ""}
    <ssm-ar:CompanyType contextRef="AR_Instant">${this.escapeXml(arData.companyType)}</ssm-ar:CompanyType>
    <ssm-ar:AnnualReturnDate contextRef="AR_Instant">${arData.annualReturnDate}</ssm-ar:AnnualReturnDate>
    <ssm-ar:FinancialYearEndDate contextRef="AR_Instant">${arData.financialYearEndDate}</ssm-ar:FinancialYearEndDate>
    ${arData.agmDate ? `<ssm-ar:DateOfAnnualGeneralMeeting contextRef="AR_Instant">${arData.agmDate}</ssm-ar:DateOfAnnualGeneralMeeting>` : ""}
    <ssm-ar:IsExemptPrivateCompany contextRef="AR_Instant">${arData.isExemptPrivateCompany ? "true" : "false"}</ssm-ar:IsExemptPrivateCompany>
    <ssm-ar:RegisteredOfficeAddress contextRef="AR_Instant">${this.escapeXml(regAddress)}</ssm-ar:RegisteredOfficeAddress>
    <ssm-ar:PrincipalPlaceOfBusiness contextRef="AR_Instant">${this.escapeXml(bizAddress)}</ssm-ar:PrincipalPlaceOfBusiness>
    <ssm-ar:PrincipalActivities contextRef="AR_Instant">${this.escapeXml(arData.principalActivities)}</ssm-ar:PrincipalActivities>
    <ssm-ar:MSICCode contextRef="AR_Instant">${this.escapeXml(arData.msicCode || (arData.msicCodes && arData.msicCodes[0]?.code) || "")}</ssm-ar:MSICCode>
    ${(arData.msicCodes && arData.msicCodes.length > 0
      ? arData.msicCodes
      : [{ id: "1", code: arData.msicCode, description: arData.principalActivities, isPrimary: true }]
    )
      .map(
        (m, idx) => `  <ssm-ar:BusinessActivityClassification item="${idx + 1}" contextRef="AR_Instant">
      <ssm-ar:MSICCodeNumber>${this.escapeXml(m.code)}</ssm-ar:MSICCodeNumber>
      <ssm-ar:MSICDescription>${this.escapeXml(m.description)}</ssm-ar:MSICDescription>
      <ssm-ar:IsPrimaryActivity>${idx === 0 ? "true" : "false"}</ssm-ar:IsPrimaryActivity>
    </ssm-ar:BusinessActivityClassification>`
      )
      .join("\n")}
  
    <!-- Share Capital -->
  `

    for (let i = 0; i < arData.shareCapital.length; i++) {
      const sc = arData.shareCapital[i]
      xml += `  <ssm-ar:ShareCapitalClass contextRef="AR_Instant">${this.escapeXml(sc.shareClass)}</ssm-ar:ShareCapitalClass>\n`
      xml += `  <ssm-ar:NumberOfIssuedShares contextRef="AR_Instant" unitRef="shares" decimals="0">${sc.numberOfShares}</ssm-ar:NumberOfIssuedShares>\n`
      xml += `  <ssm-ar:AmountPaidUp contextRef="AR_Instant" unitRef="MYR" decimals="0">${sc.amountPaidUp}</ssm-ar:AmountPaidUp>\n`
    }

    xml += `\n  <!-- Register of Indebtedness & Charges -->\n`
    xml += `  <ssm-ar:HasRegisteredCharges contextRef="AR_Instant">${arData.indebtedness.hasCharges ? "true" : "false"}</ssm-ar:HasRegisteredCharges>\n`
    xml += `  <ssm-ar:TotalAmountSecuredIndebtedness contextRef="AR_Instant" unitRef="MYR" decimals="0">${arData.indebtedness.totalAmountSecured}</ssm-ar:TotalAmountSecuredIndebtedness>\n`

    xml += `\n  <!-- Directors -->\n`
    for (const dir of arData.directors) {
      xml += `  <ssm-ar:DirectorParticulars contextRef="AR_Instant">\n`
      xml += `    <ssm-ar:DirectorName>${this.escapeXml(dir.name)}</ssm-ar:DirectorName>\n`
      xml += `    <ssm-ar:DirectorIdNumber>${this.escapeXml(dir.idNumber)}</ssm-ar:DirectorIdNumber>\n`
      xml += `    <ssm-ar:DirectorDesignation>${this.escapeXml(dir.designation)}</ssm-ar:DirectorDesignation>\n`
      xml += `    <ssm-ar:DirectorNationality>${this.escapeXml(dir.nationality)}</ssm-ar:DirectorNationality>\n`
      xml += `    <ssm-ar:DirectorAppointmentDate>${dir.appointmentDate}</ssm-ar:DirectorAppointmentDate>\n`
      xml += `    <ssm-ar:DirectorAddress>${this.escapeXml(dir.residentialAddress)}</ssm-ar:DirectorAddress>\n`
      xml += `  </ssm-ar:DirectorParticulars>\n`
    }

    xml += `\n  <!-- Secretaries -->\n`
    for (const sec of arData.secretaries) {
      xml += `  <ssm-ar:SecretaryParticulars contextRef="AR_Instant">\n`
      xml += `    <ssm-ar:SecretaryName>${this.escapeXml(sec.name)}</ssm-ar:SecretaryName>\n`
      xml += `    <ssm-ar:SecretaryIdNumber>${this.escapeXml(sec.idNumber)}</ssm-ar:SecretaryIdNumber>\n`
      xml += `    <ssm-ar:SecretaryLicenseNumber>${this.escapeXml(sec.licenseNumber)}</ssm-ar:SecretaryLicenseNumber>\n`
      xml += `    <ssm-ar:SecretaryAppointmentDate>${sec.appointmentDate}</ssm-ar:SecretaryAppointmentDate>\n`
      xml += `  </ssm-ar:SecretaryParticulars>\n`
    }

    xml += `\n  <!-- Auditor -->\n`
    xml += `  <ssm-ar:AuditorParticulars contextRef="AR_Instant">\n`
    xml += `    <ssm-ar:AuditorFirmName>${this.escapeXml(arData.auditor.firmName)}</ssm-ar:AuditorFirmName>\n`
    xml += `    <ssm-ar:AuditorFirmNumber>${this.escapeXml(arData.auditor.firmNumber)}</ssm-ar:AuditorFirmNumber>\n`
    xml += `    <ssm-ar:AuditorAddress>${this.escapeXml(arData.auditor.firmAddress)}</ssm-ar:AuditorAddress>\n`
    xml += `  </ssm-ar:AuditorParticulars>\n`

    xml += `\n  <!-- Shareholders / Members -->\n`
    for (const sh of arData.shareholders) {
      xml += `  <ssm-ar:ShareholderParticulars contextRef="AR_Instant">\n`
      xml += `    <ssm-ar:ShareholderName>${this.escapeXml(sh.name)}</ssm-ar:ShareholderName>\n`
      xml += `    <ssm-ar:ShareholderIdOrReg>${this.escapeXml(sh.idOrRegNumber)}</ssm-ar:ShareholderIdOrReg>\n`
      xml += `    <ssm-ar:ShareholderClass>${this.escapeXml(sh.shareClass)}</ssm-ar:ShareholderClass>\n`
      xml += `    <ssm-ar:ShareholderNumberOfShares unitRef="shares" decimals="0">${sh.numberOfShares}</ssm-ar:ShareholderNumberOfShares>\n`
      xml += `    <ssm-ar:ShareholderPercentage unitRef="pure" decimals="2">${sh.percentage}</ssm-ar:ShareholderPercentage>\n`
      xml += `  </ssm-ar:ShareholderParticulars>\n`
    }

    xml += `</xbrli:xbrl>`
    return xml
  }

  buildARManifestXml(arData: AnnualReturnData, instanceFilename: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
  <mbrs:manifest
    xmlns:mbrs="http://www.ssm.com.my/mbrs/manifest/2023"
    version="2.0">
    <mbrs:header>
      <mbrs:creationDateTime>${new Date().toISOString()}</mbrs:creationDateTime>
      <mbrs:softwareName>SSM MBRS Preparation &amp; XBRL Generator</mbrs:softwareName>
      <mbrs:filingCategory>Section 68 Companies Act 2016</mbrs:filingCategory>
    </mbrs:header>
    <mbrs:filingDetails>
      <mbrs:companyName>${this.escapeXml(arData.companyName)}</mbrs:companyName>
      <mbrs:companyRegistrationNumber>${this.escapeXml(arData.companyNumber)}</mbrs:companyRegistrationNumber>
      <mbrs:filingType>Annual Return</mbrs:filingType>
      <mbrs:annualReturnDate>${arData.annualReturnDate}</mbrs:annualReturnDate>
    </mbrs:filingDetails>
    <mbrs:documents>
      <mbrs:document role="instance" type="xbrl" filename="${instanceFilename}" />
      <mbrs:document role="calculationSummary" type="xml" filename="calculation_summary.xml" />
    </mbrs:documents>
  </mbrs:manifest>`
  }

  buildARCalculationSummaryXml(arData: AnnualReturnData): string {
    const totalSharesIssued = arData.shareCapital.reduce((sum, item) => sum + item.numberOfShares, 0)
    const totalPaidUp = arData.shareCapital.reduce((sum, item) => sum + item.amountPaidUp, 0)
    const totalShareholderShares = arData.shareholders.reduce((sum, item) => sum + item.numberOfShares, 0)
    const totalPercentage = arData.shareholders.reduce((sum, item) => sum + item.percentage, 0)

    const isShareCountMatched = totalSharesIssued === totalShareholderShares
    const isPercent100 = Math.abs(totalPercentage - 100) < 0.1

    return `<?xml version="1.0" encoding="UTF-8"?>
  <mbrs:calculationAudit xmlns:mbrs="http://www.ssm.com.my/mbrs/calc/2023">
    <mbrs:auditSummary>
      <mbrs:totalIssuedShares>${totalSharesIssued}</mbrs:totalIssuedShares>
      <mbrs:totalPaidUpAmountMYR>${totalPaidUp}</mbrs:totalPaidUpAmountMYR>
      <mbrs:totalShareholderShares>${totalShareholderShares}</mbrs:totalShareholderShares>
      <mbrs:totalPercentageCalculated>${totalPercentage.toFixed(2)}%</mbrs:totalPercentageCalculated>
      <mbrs:shareReconciliationStatus>${isShareCountMatched ? "MATCHED" : "DISCREPANCY"}</mbrs:shareReconciliationStatus>
      <mbrs:percentageReconciliationStatus>${isPercent100 ? "100%_VALID" : "CHECK_PERCENTAGES"}</mbrs:percentageReconciliationStatus>
    </mbrs:auditSummary>
  </mbrs:calculationAudit>`
  }

  validateARDocuments(arData: AnnualReturnData) {
    const errors: string[] = []
    const warnings: string[] = []

    if (!arData.companyName) errors.push("Company Name is required.")
    if (!arData.companyNumber) errors.push("Company Registration Number is required.")
    if (!arData.annualReturnDate) errors.push("Annual Return Date is required.")
    if (!arData.directors || arData.directors.length === 0) errors.push("At least one Director is required.")
    if (!arData.secretaries || arData.secretaries.length === 0)
      errors.push("At least one qualified Company Secretary is required.")
    if (!arData.shareholders || arData.shareholders.length === 0) errors.push("Shareholders particulars are required.")

    // Validate MSIC Codes (SSM permits up to 3)
    const primaryMsic = arData.msicCode || (arData.msicCodes && arData.msicCodes[0]?.code) || ""
    if (!primaryMsic || primaryMsic.trim().length === 0) {
      errors.push("Primary MSIC 5-digit code is required under Section 68(1)(a).")
    } else if (!/^\d{5}$/.test(primaryMsic.trim())) {
      warnings.push(`Primary MSIC code "${primaryMsic}" should be exactly 5 digits (e.g. 62010).`)
    }

    if (arData.msicCodes) {
      arData.msicCodes.forEach((m, idx) => {
        if (m.code && !/^\d{5}$/.test(m.code.trim())) {
          warnings.push(`MSIC code #${idx + 1} (${m.code}) is not a standard 5-digit format.`)
        }
      })
    }

    const totalSharesIssued = arData.shareCapital.reduce((sum, item) => sum + item.numberOfShares, 0)
    const totalShareholderShares = arData.shareholders.reduce((sum, item) => sum + item.numberOfShares, 0)
    if (totalSharesIssued > 0 && totalSharesIssued !== totalShareholderShares) {
      warnings.push(
        `Share Capital mismatch: Issued shares (${totalSharesIssued.toLocaleString()}) does not equal allocated shareholder shares (${totalShareholderShares.toLocaleString()}).`
      )
    }

    const factCount = 12 + arData.directors.length * 6 + arData.shareholders.length * 5 + arData.secretaries.length * 4

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      factCount,
    }
  }

  async createZipBlobFromPackage(
    instanceFilename: string,
    xbrlXml: string,
    manifestXml: string,
    calculationXml: string,
    extraFiles: Record<string, string> = {}
  ): Promise<{ zipBlob: Blob; sizeBytes: number }> {
    const zip = new JSZip()
    zip.file(instanceFilename, xbrlXml)
    zip.file("manifest.xml", manifestXml)
    zip.file("calculation_summary.xml", calculationXml)

    zip.file(
      "filing_metadata.json",
      JSON.stringify(
        {
          system: "Malaysian Business Reporting System (MBRS)",
          authority: "Suruhanjaya Syarikat Malaysia (SSM)",
          filingType: "Annual Return",
          statutorySection: "Section 68 Companies Act 2016",
          companyName: this.annualReturnData?.companyName,
          companyNumber: `${this.annualReturnData?.companyNumber} (${this.annualReturnData?.oldCompanyNumber})`,
          annualReturnDate: this.annualReturnData?.annualReturnDate,
          generatedAt: new Date().toISOString(),
          directorsCount: this.annualReturnData?.directors.length ?? 1,
          shareholdersCount: this.annualReturnData?.shareholders.length ?? 1,
          issuedCapital: this.annualReturnData?.shareCapital,
        },
        null,
        2
      )
    )

    for (const [name, content] of Object.entries(extraFiles)) {
      zip.file(name, content)
    }

    const zipBlob = await zip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: { level: 9 },
    })

    return {
      zipBlob,
      sizeBytes: zipBlob.size,
    }
  }
}

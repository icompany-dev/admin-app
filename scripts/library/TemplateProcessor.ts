import { Company } from "../models/Company"
import { DocumentTemplate } from "../models/DocumentTemplate"
import { StringUtil } from "../utils/String"

export class TemplateProcessor {
  template: DocumentTemplate = new DocumentTemplate()

  time = useLocalTime()

  // Regex
  #genericRegex = /%(\w+(\.\w+)*)%/g
  // #inputRegex = /(\$(text|textarea)(?:(?:\.)?&lt;name=)([^&gt;]+)&gt;\$)/g
  #inputRegex = /\$[A-Za-z]+\.&lt;name=[A-Za-z]+&gt;\$/g

  // Page break marker
  static BREAKPAGE_MARKER = "%breakpage%"
  static BREAKPAGE_HTML = '<div class="print-breakpage"></div>'

  constructor(template: any) {
    this.template = new DocumentTemplate(template)
  }

  getHeader(data: any): string {
    if (StringUtil.isNullOrEmpty(this.template.header)) {
      return ""
    }

    let processedHeader = this.template.header
    processedHeader = this.#replaceGenericPlaceholders(processedHeader, data)
    processedHeader = this.#replaceHtmlTags(processedHeader)

    return processedHeader
  }

  getTitle(data: any): string {
    if (StringUtil.isNullOrEmpty(this.template.title)) {
      return ""
    }

    let processedTitle = this.template.title
    processedTitle = this.#replaceGenericPlaceholders(processedTitle, data)
    processedTitle = this.#replaceInputPlaceholders(processedTitle, data)
    processedTitle = this.#replaceHtmlTags(processedTitle)

    return processedTitle
  }

  getTitleForPrint(data: any): string {
    if (StringUtil.isNullOrEmpty(this.template.content)) {
      return ""
    }

    let processedTitle = this.template.title
    processedTitle = this.#replaceGenericPlaceholders(processedTitle, data)
    processedTitle = this.#replaceInputWithString(processedTitle, data)
    processedTitle = this.#replaceHtmlTags(processedTitle)

    return processedTitle
  }

  getTitleForPreview(data: any): string {
    if (StringUtil.isNullOrEmpty(this.template.title)) {
      return ""
    }

    let processedTitle = this.template.title
    processedTitle = this.#replaceGenericPlaceholders(processedTitle, data)
    processedTitle = this.#replaceInputWithPlaceholders(processedTitle, data)
    processedTitle = this.#replaceHtmlTags(processedTitle)

    return processedTitle
  }

  getContent(data: any, isInPreviewMode: boolean = false): string {
    if (StringUtil.isNullOrEmpty(this.template.content)) {
      return ""
    }

    let processedContent = this.template.content
    processedContent = this.#replaceGenericPlaceholders(processedContent, data)
    processedContent = this.#replaceInputPlaceholders(processedContent, data, isInPreviewMode)
    processedContent = this.#replaceHtmlTags(processedContent)

    return processedContent
  }

  getContentForPreview(data: any): string {
    if (StringUtil.isNullOrEmpty(this.template.content)) {
      return ""
    }

    let processedContent = this.template.content
    processedContent = this.#replaceGenericPlaceholders(processedContent, data)
    processedContent = this.#replaceInputWithPlaceholders(processedContent, data)
    processedContent = this.#replaceHtmlTags(processedContent)

    return processedContent
  }

  getContentForPrint(data: any): string {
    if (StringUtil.isNullOrEmpty(this.template.content)) {
      return ""
    }

    let processedContent = this.template.content
    processedContent = this.#replaceGenericPlaceholders(processedContent, data)
    processedContent = this.#replaceInputWithString(processedContent, data)
    processedContent = this.#replaceHtmlTags(processedContent)

    return processedContent
  }

  getPostSignatureContent(data: any): string {
    if (StringUtil.isNullOrEmpty(this.template.postSignatureContent)) {
      return ""
    }

    let processedContent = this.template.postSignatureContent
    processedContent = this.#replaceGenericPlaceholders(processedContent, data)
    processedContent = this.#replaceInputPlaceholders(processedContent, data)
    processedContent = this.#replaceHtmlTags(processedContent)

    return processedContent
  }

  #replaceHtmlTags(str: string) {
    str = str.replaceAll("ql-align", "text")
    str = str.replaceAll("ql-size", "font")
    str = str.replaceAll("<p ", "<div ")
    str = str.replaceAll("<p>", "<div>")
    str = str.replaceAll("</p>", "</div>")

    return str
  }

  #replaceGenericPlaceholders(str: string, data: any): string {
    return str.replace(this.#genericRegex, (match, path) => {
      const pathParts = path.split(".")
      let value = data
      if (path === "company.businessAddressLocation") {
        if (data instanceof Company) {
          return data.businessAddressLocation?.getMultilineAddress() ?? ""
        }

        const company = new Company()
        company.clone(data)
        return company.businessAddressLocation?.getMultilineAddress() ?? ""
      }

      if (path === "company.incorporatedAt") {
        if (data instanceof Company && data.incorporatedAt !== null) {
          return this.time.formatDateOnlyFull(data.incorporatedAt)
        }

        if (data.company !== null && data.company !== undefined) {
          const company = new Company(data.company)
          return this.time.formatDateOnlyFull(company.incorporatedAt ?? "")
        }
      }

      if (path === "company.fullName") {
        if (data instanceof Company) {
          return data.getFullName().toUpperCase()
        }

        if (data.company !== null && data.company !== undefined) {
          const company = new Company(data.company)
          return company.getFullName().toUpperCase()
        }
      }

      if (path === "company.registrationNoOld") {
        if (data instanceof Company) {
          return data.registrationNumberOld
        }

        if (data.company !== null && data.company !== undefined) {
          const company = new Company(data.company)
          return company.registrationNumberOld
        }
      }

      if (path === "company.registrationNoNew") {
        if (data instanceof Company) {
          return data.registrationNumberNew
        }

        if (data.company !== null && data.company !== undefined) {
          const company = new Company(data.company)
          return company.registrationNumberNew
        }
      }

      for (const part of pathParts) {
        if (value && typeof value === "object" && part in value) {
          value = value[part]

          if (part.toLowerCase().includes("date")) {
            value = this.time.formatDateOnlyFull(value).toUpperCase()
          }
        } else {
          continue
        }
      }

      return value !== null && value !== undefined ? String(value) : ""
    })
  }

  #replaceInputPlaceholders(str: string, data: any, isInPreviewMode: boolean = false): string {
    return str.replace(this.#inputRegex, (match) => {
      const matchedString = match.replaceAll("$", "")
      const splitFragment = matchedString.split(".")
      const type = splitFragment[0]
      const nameFragment = splitFragment[1].split("=")
      const name = nameFragment[1].replaceAll("&gt;", "")

      let value = data !== null && data !== undefined ? (data[name] ?? null) : null

      let disable = isInPreviewMode ? "disabled" : ""

      let placeholder = name
        .replace(/([A-Z])/g, " $1")
        .trim()
        .toUpperCase()

      if (type === "text") {
        return `<input type="text" data-field-name="${name}" name="${name}" value="${value}" class="form-control in-resolution" ${disable} placeholder='${placeholder}' >`
      } else if (type === "textarea") {
        return `<textarea data-field-name="${name}" name="${name}" class="form-control in-resolution" rows="5" placeholder='${placeholder}' ${disable}>${value}</textarea>`
      } else if (type === "date") {
        return `<input type="date" data-field-name="${name}" name="${name}" value="${value}" class="form-control in-resolution" ${disable}>`
      } else if (type === "checkbox") {
        return `<input type="checkbox" data-field-name="${name}" name="${name}" value="${value}" class="form-control in-resolution" ${disable}>`
      }
      return match
    })
  }

  #replaceInputWithString(str: string, data: any): string {
    return str.replace(this.#inputRegex, (match) => {
      const matchedString = match.replaceAll("$", "")
      const splitFragment = matchedString.split(".")
      const type = splitFragment[0]
      const nameFragment = splitFragment[1].split("=")
      const name = nameFragment[1].replaceAll("&gt;", "")

      let value = data[name] ?? null
      if (!value) {
        return ""
      }

      if (type === "date") {
        let formattedDate = this.time.formatDateOnlyFull(data[name]).toUpperCase()
        return formattedDate
      }

      if (type === "checkbox" || type === "inlineCheckbox") {
        return "□"
      }

      return value
    })
  }

  #replaceInputWithPlaceholders(str: string, data: any): string {
    return str.replace(this.#inputRegex, (match) => {
      const matchedString = match.replaceAll("$", "")
      const splitFragment = matchedString.split(".")
      const type = splitFragment[0]
      const nameFragment = splitFragment[1].split("=")
      const name = nameFragment[1].replaceAll("&gt;", "")

      if (type === "date") {
        let formattedDate = this.time.formatDateOnlyFull(data[name])
        if (formattedDate === "Invalid Date") {
          let placeholder = name
            .replace(/([A-Z])/g, " $1")
            .trim()
            .toUpperCase()
          return `<span class='value-placeholder'>YOUR ${placeholder}</span>`
        }
        return `<span class='value-placeholder'>${formattedDate}</span>`
      }

      if (type === "checkbox") {
        return "□"
      }

      if (type === "hiddenCheckBox") {
        return ""
      }

      let value = data[name] ?? null
      if (!value) {
        let placeholder = name
          .replace(/([A-Z])/g, " $1")
          .trim()
          .toUpperCase()
        return `<span class='value-placeholder'>YOUR ${placeholder}</span>`
      }

      return `<span class='value-placeholder'>${value}</span>`
    })
  }

  /**
   * Check if template content contains page break markers
   */
  hasPageBreaks(): boolean {
    return this.template.content.includes(TemplateProcessor.BREAKPAGE_MARKER)
  }

  /**
   * Get the number of pages based on breakpage markers
   * Returns at least 1 (for content without markers)
   */
  getContentPageCount(): number {
    if (!this.hasPageBreaks()) {
      return 1
    }
    return this.template.content.split(TemplateProcessor.BREAKPAGE_MARKER).length
  }

  /**
   * Split content into pages by breakpage marker
   * Returns array of content strings, one per page
   */
  getContentPages(data: any, mode: "preview" | "edit" | "print" = "edit"): string[] {
    const content = this.template.content
    if (!content.includes(TemplateProcessor.BREAKPAGE_MARKER)) {
      // No page breaks, return single page
      return [this.#processContent(content, data, mode)]
    }

    const pages = content.split(TemplateProcessor.BREAKPAGE_MARKER)
    return pages.map((pageContent) => this.#processContent(pageContent, data, mode))
  }

  #processContent(content: string, data: any, mode: "preview" | "edit" | "print"): string {
    let processedContent = content
    processedContent = this.#replaceGenericPlaceholders(processedContent, data)

    switch (mode) {
      case "preview":
        processedContent = this.#replaceInputWithPlaceholders(processedContent, data)
        break
      case "print":
        processedContent = this.#replaceInputWithString(processedContent, data)
        break
      case "edit":
      default:
        processedContent = this.#replaceInputPlaceholders(processedContent, data, false)
        break
    }

    processedContent = this.#replaceHtmlTags(processedContent)
    return processedContent
  }

  /**
   * Replace %breakpage% with HTML page break div
   * Use this when rendering all content in a single container
   */
  replacePageBreaks(content: string): string {
    return content.replaceAll(TemplateProcessor.BREAKPAGE_MARKER, TemplateProcessor.BREAKPAGE_HTML)
  }

  replaceInputsWithValues(content: string): string {
    if (!content) return ""

    const parser = new DOMParser()
    const doc = parser.parseFromString(content, "text/html")

    const inputs = doc.querySelectorAll("input")

    const formatDateString = (dateStr: string): string => {
      if (!dateStr || !dateStr.includes("-")) return dateStr
      const dateObj = new Date(dateStr)

      // Check if it's a valid date object
      if (isNaN(dateObj.getTime())) return dateStr

      // Fast, modern native formatting engine
      return new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(dateObj)
    }

    inputs.forEach((input) => {
      if (!input.parentNode) {
        return
      }

      const listId = input.getAttribute("list")
      if (listId) {
        const datalist = doc.getElementById(listId)
        if (datalist) {
          datalist.remove()
        }
      }

      let inputValue = input.value || ""

      if (
        input.getAttribute("type") === "date" ||
        (inputValue.length === 10 && inputValue.match(/^\d{4}-\d{2}-\d{2}$/))
      ) {
        inputValue = formatDateString(inputValue)
      }

      const spanElement = doc.createElement("span")
      spanElement.textContent = inputValue

      input.parentNode.replaceChild(spanElement, input)
    })

    const selects = doc.querySelectorAll("select")
    selects.forEach((select) => {
      if (!select.parentNode) {
        return
      }

      const selectedOption = select.querySelector("option[selected]") || select.querySelector("option")
      const selectValue = selectedOption ? selectedOption.textContent?.trim() : select.value

      const spanElement = doc.createElement("span")
      spanElement.textContent = selectValue || ""

      select.parentNode.replaceChild(spanElement, select)
    })

    const remainingDatalists = doc.querySelectorAll("datalist")
    remainingDatalists.forEach((dl) => dl.remove())

    return doc.body.innerHTML
  }
}

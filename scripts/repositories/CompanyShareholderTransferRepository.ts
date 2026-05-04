import { CompanyShareholderTransfer } from "../models/CompanyShareholderTransfer"
import { Repository } from "./Repository"

export class CompanyShareholderTransferRepository extends Repository<CompanyShareholderTransfer> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyShareholderTransfer)
  }

  async lodge(id: string): Promise<any> {
    try {
      const response = this.post(`${this.singleResourceUrl}/lodge/${id}`, {})
      return response
    } catch (e) {
      throw e
    }
  }

  async paymentReceived(id: string): Promise<any> {
    try {
      const response = this.post(`${this.singleResourceUrl}/payment/received/${id}`, {})
      return response
    } catch (e) {
      throw e
    }
  }

  async paymentMade(id: string): Promise<any> {
    try {
      const response = this.post(`${this.singleResourceUrl}/payment/made/${id}`, {})
      return response
    } catch (e) {
      throw e
    }
  }

  async fetchSection105Data(id: string): Promise<any> {
    try {
      const response = this.get(`${this.singleResourceUrl}/section-105/${id}`)
      return response
    } catch (e) {
      throw e
    }
  }

  async fetchSection105DataForPublic(id: string, accessHash: string): Promise<any> {
    try {
      const response = this.get(`${this.singleResourceUrl}/section-105/public/${id}?access_hash=${accessHash}`)
      return response
    } catch (e) {
      throw e
    }
  }

  async fetchSection105Pending(): Promise<any> {
    try {
      const response = this.get(`${this.singleResourceUrl}/section-105/pending`)
      return response
    } catch (e) {
      throw e
    }
  }

  async addShareTransferDetails(id: string, data: any): Promise<any> {
    try {
      const response = this.post(`${this.singleResourceUrl}/section-105/add/${id}`, data)
      return response
    } catch (e) {
      throw e
    }
  }

  async updateShareTransferDetails(transferDetailId: string, data: any): Promise<any> {
    try {
      const response = this.post(`${this.singleResourceUrl}/section-105/update/${transferDetailId}`, data)
      return response
    } catch (e) {
      throw e
    }
  }

  async removeShareTransferDetails(transferDetailId: string): Promise<any> {
    try {
      const response = this.post(`${this.singleResourceUrl}/section-105/remove/${transferDetailId}`, {})
      return response
    } catch (e) {
      throw e
    }
  }

  async transferorConsented(transferDetailId: string, isConsented: boolean): Promise<any> {
    try {
      let data = {
        is_consented: isConsented,
      }
      const response = this.post(`${this.singleResourceUrl}/section-105/transferor/consent/${transferDetailId}`, data)
      return response
    } catch (e) {
      throw e
    }
  }

  async transferorSigned(transferDetailId: string, signatureFileId: string): Promise<any> {
    try {
      let data = {
        signature_id: signatureFileId,
      }
      const response = this.post(`${this.singleResourceUrl}/section-105/transferor/signed/${transferDetailId}`, data)
      return response
    } catch (e) {
      throw e
    }
  }

  async transferorRepSigned(
    transferDetailId: string,
    signatureFileId: string,
    repName: string,
    repIdentification: string
  ): Promise<any> {
    try {
      let data = {
        signature_id: signatureFileId,
        name: repName,
        identification: repIdentification,
      }
      const response = this.post(`${this.singleResourceUrl}/section-105/transferor/signed/${transferDetailId}`, data)
      return response
    } catch (e) {
      throw e
    }
  }

  async transfereeConsented(transferDetailId: string, isConsented: boolean): Promise<any> {
    try {
      let data = {
        is_consented: isConsented,
      }
      const response = this.post(`${this.singleResourceUrl}/section-105/transferee/consent/${transferDetailId}`, data)
      return response
    } catch (e) {
      throw e
    }
  }

  async transfereeSigned(transferDetailId: string, signatureFileId: string): Promise<any> {
    try {
      let data = {
        signature_id: signatureFileId,
      }
      const response = this.post(`${this.singleResourceUrl}/section-105/transferee/signed/${transferDetailId}`, data)
      return response
    } catch (e) {
      throw e
    }
  }

  async transfereeRepSigned(
    transferDetailId: string,
    signatureFileId: string,
    repName: string,
    repIdentification: string
  ): Promise<any> {
    try {
      let data = {
        signature_id: signatureFileId,
        name: repName,
        identification: repIdentification,
      }
      const response = this.post(`${this.singleResourceUrl}/section-105/transferee/signed/${transferDetailId}`, data)
      return response
    } catch (e) {
      throw e
    }
  }
}

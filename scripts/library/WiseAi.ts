/**
 * This is Library to use Wise Ai.
 *  1. It connects to iCompany API to get the token
 *  2. It connects to the SDK to initialize the camera
 *  3. It decrypts the return response
 *
 * IT DOES NOT:
 *  1. Handle UI behaviour -- except for the buttons css classes etc.
 *  2. It does not restart eKYC
 *  3. It does not update User data
 *
 * How to use this library:
 *  1. Instantiate: const wiseAi = new WiseAi(docType, divElementId)
 *      -- divElementId is refers to the id of the div where camera will be
 *  2. await wiseAi.init()
 *  3. wiseAi.startCamera()
 *  4. Start poll to check for isOngoing and isSuccess
 *  5. use decryptedData to update User data as needed
 */
import CryptoJS from "crypto-js"
import { Error } from "~/scripts/library/Error"
import { WiseAiConstants, WiseAiDocumentTypes, WiseAiResponseCodes } from "../constants/WiseAi"
import { WiseAiCameraResponse } from "../types/wise-ai/WiseAiCameraResponse"
import { WiseAiTokenResponse } from "../types/wise-ai/WiseAiTokenResponse"
import type { IWiseAiDecryptedData } from "../types/wise-ai/IWiseAiDecryptedData"
import { WiseAiMyKad } from "../types/wise-ai/mykad/WiseAiMyKad"
import { WiseAiPassport } from "../types/wise-ai/passport/WiseAiPassport"

export class WiseAi {
  isInitializing: boolean = false
  tokenResponse: WiseAiTokenResponse = new WiseAiTokenResponse()
  token: string = ""
  wiseAi: any | null = null
  wiseAiUrl: string = WiseAiConstants.WISE_AI_URL
  docType: WiseAiDocumentTypes = WiseAiDocumentTypes.IC
  wiseAiElementId: string = ""

  decryptedData: IWiseAiDecryptedData | null = null

  isOngoing: boolean = false
  isSuccess: boolean = false

  isCameraFailToLoad: boolean = false

  constructor(documentType: WiseAiDocumentTypes, wiseAiElementId: string) {
    this.docType = documentType
    this.wiseAiElementId = wiseAiElementId
  }

  async setToken(): Promise<void> {
    if (this.isInitializing) {
      return
    }

    try {
      this.isInitializing = true

      let wiseAiRepository = useWiseAiStore()
      let response = await wiseAiRepository.getToken()
      if (wiseAiRepository.error !== null) {
        throw wiseAiRepository.error
      }

      this.tokenResponse = new WiseAiTokenResponse(JSON.parse(response))
      this.token = this.tokenResponse.data.token
    } catch (e: any) {
      let errorMessage = "Failed to connect to eKYC service for validation token."
      let error = new Error(Error.ERROR_TYPE_API, errorMessage)
      error.handle()
    } finally {
      this.isInitializing = false
    }
  }

  async init(): Promise<void> {
    await this.setToken()

    try {
      await this.loadSdk()
    } catch (error) {
      console.error("Critical Error: WiseAI SDK Scripts failed to load.", error)
      return
    }

    this.wiseAi = new window.WAILib.SDK(
      this.token,
      this.wiseAiUrl,
      this.wiseAiElementId,
      {
        showActionButtons: true,
        faceVideoLength: 2,
        faceType: "video",
        docType: this.docType,
        cameraFit: true,
        actionButtons: {
          cameraCapture: {
            css: "btn btn-camera",
            elementId: "",
          },
          retake: {
            text: "Retake",
            css: "btn btn-camera btn-danger",
            elementId: "",
          },
          proceed: {
            text: "Proceed",
            css: "btn btn-camera-next btn-submit",
            elementId: "",
          },
        },
        stages: {
          mykadFront: {
            title: "Step 3 of 3: (A) Front of your MyKad",
            message: "Please position your NRIC within the frame",
            titleCss: "camera-title",
            messageCss: "",
            preview: {
              message: "Please make sure the captured photo is clear and without glare",
              messageCss: "camera-preview-message",
            },
          },
          mykadBack: {
            title: "Step 3: (B) Back of your NRIC",
            message: "Please position your NRIC within the frame",
            titleCss: "camera-title",
            messageCss: "",
            preview: {
              message: "Please make sure the captured photo is clear and without glare",
              messageCss: "camera-preview-message",
            },
          },
          passport: {
            title: "Step 3: (A) Your Passport",
            message: "Please position your Passport within the frame",
            titleCss: "camera-title",
            messageCss: "",
            preview: {
              message: "Please make sure the captured photo is clear and without glare",
              messageCss: "camera-preview-message",
            },
          },
          mykadFace: {
            title: "Step 3: (C) Your Selfie",
            message: "Please position your face within the frame",
            titleCss: "camera-title",
            messageCss: "",
            video: {
              readyCountdownText: "Recording starts in {countdownSec}",
            },
          },
          passportFace: {
            title: "Step 3: (C) Your Selfie",
            message: "Please position your face within the frame",
            titleCss: "camera-title",
            messageCss: "",
            video: {
              readyCountdownText: "Recording starts in {countdownSec}",
            },
          },
        },
        exports: {
          exportDocumentImage: true,
          exportDocumentFrontImage: true,
          exportDocumentBackImage: true,
          exportDocumentFaceImage: true,
          exportFaceImage: true,
        },
      },
      "/vendor/wise-ai/models"
    )

    this.decryptedData = null

    this.wiseAi.cameraCapture({
      onSuccess: this.onSuccess.bind(this),
      onError: this.onError.bind(this),
    })
  }

  startCamera(): void {
    if (this.isOngoing) {
      return
    }

    try {
      this.isOngoing = true
      this.isCameraFailToLoad = false
      this.wiseAi.startCamera()
    } catch (e: any) {
      let error = new Error(
        Error.ERROR_TYPE_API,
        "We are unable to start your camera for the purpose of eKYC. Please check your settings and try again."
      )
      error.handle()
      this.isCameraFailToLoad = true
    }
  }

  onSuccess(stage: any, result: any): void {
    let encryptedResponse = new WiseAiCameraResponse(result)

    if (encryptedResponse.code !== WiseAiResponseCodes.Success) {
      this.isOngoing = false
      this.isSuccess = false
      return
    }

    this.decryptResponse(encryptedResponse)
    if (!this.decryptedData) {
      this.isOngoing = false
      this.isSuccess = false
      return
    }

    if (!this.decryptedData.ekycSuccess) {
      this.isOngoing = false
      this.isSuccess = false
      return
    }

    this.isOngoing = false
    this.isSuccess = true
  }

  onError(stage: any, error: any): void {
    this.isOngoing = false
    this.isSuccess = false
  }

  decryptResponse(response: WiseAiCameraResponse): void {
    let encryptedData = response.data.encryptedData

    const keyWordArray = CryptoJS.enc.Base64.parse(this.tokenResponse.data.encryption.key)
    const ivWordArray = CryptoJS.enc.Base64.parse(this.tokenResponse.data.encryption.iv)

    const decrypted = CryptoJS.AES.decrypt(encryptedData, keyWordArray, {
      iv: ivWordArray,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    })

    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8)

    const jsonData = JSON.parse(decryptedString)

    if (this.docType === WiseAiDocumentTypes.IC) {
      this.decryptedData = new WiseAiMyKad(jsonData)
    } else {
      this.decryptedData = new WiseAiPassport(jsonData)
    }
  }

  private loadSdk(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window.WAILib !== "undefined") {
        return resolve()
      }

      console.log("Waiting for WiseAI SDK to load...")
      let attempts = 0
      const maxAttempts = 100

      const interval = setInterval(() => {
        attempts++

        if (typeof window.WAILib !== "undefined") {
          clearInterval(interval)
          console.log("WiseAI SDK loaded successfully.")
          resolve()
        }

        if (attempts >= maxAttempts) {
          clearInterval(interval)
          reject("Timeout: WiseAI SDK script could not be loaded.")
        }
      }, 100)
    })
  }
}

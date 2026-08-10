import { Location } from "../models/Location"
import type { Secretary } from "../types/Secretary"

export class SecretaryInformation {
  static SECRETARY_NAME: string = "NUR ASHIKIN BINTI SHAHARUDIN" //AHMAD ASYRAQ BIN ABDUL RASID
  static SECRETARY_NRIC: string = "941024-04-5428" //870523-04-5725
  static SECRETARY_LICENSE: string = "LS0010853" //BC/A/2271
  static SECRETARY_SSM_PC_NO: string = "202408000763" //202608000324
  static SECRETARY_SIGNATURE: string =
    "https://icompany-public.s3.ap-southeast-1.amazonaws.com/public/signatures/cosec-signature.png"

  static STAFF_NAME_LIST = ["NUR ASHIKIN BINTI SHAHARUDIN"]

  static SECRETARY_NAME_LIST: Secretary[] = [
    {
      name: "AHMAD ASYRAQ BIN ABDUL RASID",
      nric: "870523-04-5275",
      license: "BC/A/2271",
      certificate: "202608000324",
      phone: "017 778 3260",
      email: "cosec@icompany.my",
      firmName: "Cosec Tech Solutions Sdn Bhd",
      firmPhone: "017 778 3260",
      firmFax: "017 778 3260",
      address: new Location({
        address_line_1: "D-1-6, FIRST FLOOR, BLOCK D, SEKITAR26 ENTERPRISE",
        address_line_2: "PERSIARAN HULU SELANGOR, SEKSYEN 26",
        postcode: "40400",
        city: { name: "Shah Alam" },
        state: { name: "Selangor" },
        country: { name: "Malaysia" },
      }),
      signatureUrl: "https://icompany-public.s3.ap-southeast-1.amazonaws.com/public/signatures/asy-signature.png",
    },
    {
      name: "NUR ASHIKIN BINTI SHAHARUDIN",
      nric: "941024-04-5428",
      license: "LS0010853",
      certificate: "202408000763",
      phone: "017 778 3260",
      email: "connect@icompany.my",
      firmName: "Cosec Tech Solutions Sdn Bhd",
      firmPhone: "03 3310 0896",
      firmFax: "03 3310 0896",
      address: new Location({
        address_line_1: "D-1-6, FIRST FLOOR, BLOCK D, SEKITAR26 ENTERPRISE",
        address_line_2: "PERSIARAN HULU SELANGOR, SEKSYEN 26",
        postcode: "40400",
        city: { name: "Shah Alam" },
        state: { name: "Selangor" },
        country: { name: "Malaysia" },
      }),
      signatureUrl: "https://icompany-public.s3.ap-southeast-1.amazonaws.com/public/signatures/cosec-signature.png",
    },
  ]

  static getSecreataryByName(name: string) {
    return SecretaryInformation.SECRETARY_NAME_LIST.find((secretary) => {
      return name === secretary.name
    })
  }
}

Object.freeze(SecretaryInformation)

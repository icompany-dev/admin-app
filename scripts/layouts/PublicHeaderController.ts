export class PublicHeaderController {
  logo: string = "https://icompany-public.s3.ap-southeast-1.amazonaws.com/public/landing-res/logos/icompany_long.png"

  constructor() {}

  onLogoClicked() {
    window.location.href = "https://www.icompany.my"
  }
}

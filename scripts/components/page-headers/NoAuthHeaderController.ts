export class NoAuthHeaderController {
  logo: string =
    "https://icompany-public.s3.ap-southeast-1.amazonaws.com/public/landing-res/logos/icompany_long_white.png"

  constructor() {}

  onLogoClicked() {
    window.location.href = "https://www.icompany.my"
  }
}

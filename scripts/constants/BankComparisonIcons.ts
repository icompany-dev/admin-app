export class BankComparisonIcons {
  static getTypeIcon(type: string): string {
    switch (type) {
      // Document types
      case 'stamp':
        return 'fa-stamp'
      case 'document':
        return 'fa-file-certificate'
      case 'resolution':
        return 'fa-file-signature'
      case 'online_form':
        return 'fa-globe'
      case 'downloadable_form':
        return 'fa-down-to-bracket'
      case 'form':
        return 'fa-file-lines'
      case 'address':
        return 'fa-location-dot'
      case 'bill':
        return 'fa-file-invoice-dollar'
      case 'introducer':
        return 'fa-user-tie'
      case 'nric':
        return 'fa-id-card'
      case 'chop':
        return 'fa-stamp'

      // Verification types
      case 'thumbprint':
        return 'fa-fingerprint'
      case 'ekyc':
        return 'fa-image-user'
      case 'contact':
        return 'fa-mobile-button'
      case 'appointment':
        return 'fa-user-group-simple'
      case 'kyc':
        return 'fa-fingerprint'
      case 'online_verification':
        return 'fa-shield-check'

      // Digital Service types
      case 'mobile':
        return 'fa-mobile-button'
      case 'mobile_app':
        return 'fa-mobile-button'
      case 'website':
        return 'fa-desktop'
      case 'internet_banking':
        return 'fa-globe'
      case 'token':
        return 'fa-key'
      case 'qr_payment':
        return 'fa-qrcode'
      case 'card':
        return 'fa-credit-card'
      case 'fx':
        return 'fa-money-bill-transfer'
      case 'payment_terminal':
        return 'fa-cash-register'
      case 'security':
        return 'fa-shield-halved'
      case 'cash_management':
        return 'fa-sack-dollar'

      // Branch visit types
      case 'branch_visit':
        return 'fa-building-columns'
      case 'online':
        return 'fa-globe'

      default:
        return 'fa-circle'
    }
  }

  static getIconClass(type: string): string {
    const icon = this.getTypeIcon(type)
    return `fa-light fa-duotone icon ${icon}`
  }
}

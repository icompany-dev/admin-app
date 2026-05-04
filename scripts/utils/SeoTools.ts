export class SeoTools {
  static addMetadata(title: string, description: string) {
    return useSeoMeta({
      title: title,
      ogTitle: title,
      description: description,
      ogDescription: description,
      ogImage:
        'https://icompany-public.s3.ap-southeast-1.amazonaws.com/public/landing-res/logos/icompany_long.png',
    })
  }
}

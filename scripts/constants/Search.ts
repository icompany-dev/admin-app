export class SearchConstants {
  static FAQ_LIST_URL = 'https://icompany-public.s3.ap-southeast-1.amazonaws.com/public/faqs/faq_list.json?v=1'

  static SEARCH_TYPE_SYSTEM = 'system'
  static SEARCH_TYPE_SAIRA = 'saira'
  static SEARCH_TYPE_INQUIRY = 'inquiry'
  static SEARCH_TYPE_FAQ = 'faq'
  static SEARCH_TYPE_GLOSSARY = 'glossary'

  static USER_ROLE_SAIRA = 'assistant'
  static USER_ROLE_USER = 'user'

  // OpenAi Run status response list
  static OPENAI_RUN_STATUS_QUEUED = 'queued'
  static OPENAI_RUN_STATUS_IN_PROGRESS = 'in_progress'
  static OPENAI_RUN_STATUS_REQUIRES_ACTION = 'requires_action'
  static OPENAI_RUN_STATUS_COMPLETED = 'completed'
  static OPENAI_RUN_STATUS_FAILED = 'failed'
  static OPENAI_RUN_STATUS_CANCELLING = 'cancelling'
  static OPENAI_RUN_STATUS_CANCELLED = 'cancelled'
  static OPENAI_RUN_STATUS_EXPIRED = 'expired'

  // Handling Search
  static CLASSIFICATION_COMPANY = 'company'
  static CLASSIFICATION_LOCKED_KEYWORD = 'locked_keyword'
  static CLASSIFICATION_SERVICE = 'service'

  static BADGE_CLASS_SUCCESS = 'status-active'
  static BADGE_CLASS_WARNING = 'status-warning'
  static BADGE_CLASS_DANGER = 'status-danger'

  // Lock Keywords
  static LOCKED_KEYWORD_DIRECTOR = 'director'
  static LOCKED_KEYWORD_DIRECTORS = 'directors'
  static LOCKED_KEYWORD_PENGARAH = 'pengarah'
  static LOCKED_KEYWORD_SHAREHOLDER = 'shareholder'
  static LOCKED_KEYWORD_SHAREHOLDERS = 'shareholders'
  static LOCKED_KEYWORD_PEMEGANG_SAHAM = 'pemegang saham'

  static LOCKED_KEYWORDS = [
    SearchConstants.LOCKED_KEYWORD_DIRECTOR,
    SearchConstants.LOCKED_KEYWORD_DIRECTORS,
    SearchConstants.LOCKED_KEYWORD_PENGARAH,
    SearchConstants.LOCKED_KEYWORD_SHAREHOLDER,
    SearchConstants.LOCKED_KEYWORD_SHAREHOLDERS,
    SearchConstants.LOCKED_KEYWORD_PEMEGANG_SAHAM
  ]
}
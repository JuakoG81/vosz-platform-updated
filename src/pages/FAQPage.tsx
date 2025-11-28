// FAQ Page - Frequently Asked Questions - i18n ready
import { useState } from 'react'
import { HelpCircle, Search, ChevronDown, ChevronUp } from 'lucide-react'
import { useTranslation } from '../i18n'
import { MainLayoutV1 } from '../components/v1/MainLayoutV1'

interface FAQItem {
  id: string
  questionKey: string
  answerKey: string
  category: string
}

// FAQ data using translation keys
const faqData: FAQItem[] = [
  { id: '1', category: 'General', questionKey: 'faq.questions.q1.question', answerKey: 'faq.questions.q1.answer' },
  { id: '2', category: 'General', questionKey: 'faq.questions.q2.question', answerKey: 'faq.questions.q2.answer' },
  { id: '3', category: 'General', questionKey: 'faq.questions.q3.question', answerKey: 'faq.questions.q3.answer' },
  { id: '4', category: 'Propuestas', questionKey: 'faq.questions.q4.question', answerKey: 'faq.questions.q4.answer' },
  { id: '5', category: 'Propuestas', questionKey: 'faq.questions.q5.question', answerKey: 'faq.questions.q5.answer' },
  { id: '6', category: 'Propuestas', questionKey: 'faq.questions.q6.question', answerKey: 'faq.questions.q6.answer' },
  { id: '7', category: 'Proyectos', questionKey: 'faq.questions.q7.question', answerKey: 'faq.questions.q7.answer' },
  { id: '8', category: 'Proyectos', questionKey: 'faq.questions.q8.question', answerKey: 'faq.questions.q8.answer' },
  { id: '9', category: 'Gamificacion', questionKey: 'faq.questions.q9.question', answerKey: 'faq.questions.q9.answer' },
  { id: '10', category: 'Gamificacion', questionKey: 'faq.questions.q10.question', answerKey: 'faq.questions.q10.answer' },
  { id: '11', category: 'Comunidad', questionKey: 'faq.questions.q11.question', answerKey: 'faq.questions.q11.answer' },
  { id: '12', category: 'Comunidad', questionKey: 'faq.questions.q12.question', answerKey: 'faq.questions.q12.answer' }
]

const categories = ['General', 'Propuestas', 'Proyectos', 'Gamificacion', 'Comunidad']

export function FAQPage() {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const filteredFAQs = faqData.filter(item => {
    const questionText = t(item.questionKey)
    const answerText = t(item.answerKey)
    const categoryText = t(`faq.categories.${item.category}`)
    
    const matchesSearch = 
      questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      answerText.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || categoryText === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedIds)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedIds(newExpanded)
  }

  return (
    <MainLayoutV1>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{t('faq.title')}</h1>
          </div>
          <p className="text-gray-600">
            {t('faq.subtitle')}
          </p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('faq.search_placeholder')}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                !selectedCategory
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('faq.all_categories')}
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(t(`faq.categories.${category}`))}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === t(`faq.categories.${category}`)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t(`faq.categories.${category}`)}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {filteredFAQs.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">{t('faq.no_results')}</p>
            </div>
          ) : (
            filteredFAQs.map(item => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <button
                  onClick={() => toggleExpanded(item.id)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <span className="text-xs text-blue-600 font-medium">{t(`faq.categories.${item.category}`)}</span>
                    <h3 className="font-medium text-gray-900 mt-1">{t(item.questionKey)}</h3>
                  </div>
                  {expandedIds.has(item.id) ? (
                    <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
                  )}
                </button>
                {expandedIds.has(item.id) && (
                  <div className="px-4 pb-4">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {t(item.answerKey)}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </MainLayoutV1>
  )
}
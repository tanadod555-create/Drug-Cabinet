import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Star, Clipboard, Check } from 'lucide-react'

interface EvaluationModalProps {
  isOpen: boolean
  onClose: () => void
}

interface RatingQuestion {
  id: number
  text: string
}

const QUESTIONS: RatingQuestion[] = [
  {
    id: 1,
    text: "ความสวยงามและการออกแบบ (UI Design)\nความพึงพอใจต่อหน้าตา โทนสี และตู้ยาจำลองที่ดูพรีเมียม",
  },
  {
    id: 2,
    text: "ความง่ายในการใช้งานและการค้นหา (Usability)\nความพึงพอใจต่อความสะดวกในการค้นหายา สลับแท็บ และจัดชั้นวางยา",
  },
  {
    id: 3,
    text: "ข้อมูลและความครบถ้วนของยา (Medicine Info)\nความพึงพอใจต่อความถูกต้อง ละเอียด และครบถ้วนของยาทั้ง 58 รายการ",
  },
  {
    id: 4,
    text: "ประโยชน์ของฟีเจอร์ช่วยเหลือ (Features Utility)\nความพึงพอใจต่อฟีเจอร์ตรวจเช็คยาซ้ำซ้อนและไกด์แนะนำยาตามอาการ",
  },
  {
    id: 5,
    text: "ความพึงพอใจในภาพรวมทั้งหมด (Overall Satisfaction)\nระดับความพึงพอใจทั้งหมดที่มีต่อแอปพลิเคชันตู้ยาสามัญประจำบ้านนี้",
  },
]

export function EvaluationModal({ isOpen, onClose }: EvaluationModalProps) {
  const [ratings, setRatings] = React.useState<Record<number, number>>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  })
  const [hoveredRatings, setHoveredRatings] = React.useState<Record<number, number>>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  })
  const [comment, setComment] = React.useState('')
  const [submitted, setSubmitted] = React.useState(false)
  const [copied, setCopied] = React.useState(false)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    if (isOpen) {
      // Clear state on open
      setSubmitted(false)
      setCopied(false)
      setError('')
      const saved = localStorage.getItem('cabinet_evaluation')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setRatings(parsed.ratings || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 })
          setComment(parsed.comment || '')
        } catch (e) {
          // ignore
        }
      }
    }
  }, [isOpen])

  const handleRate = (qId: number, rating: number) => {
    setRatings(prev => ({ ...prev, [qId]: rating }))
    setError('')
  }

  const handleHover = (qId: number, rating: number) => {
    setHoveredRatings(prev => ({ ...prev, [qId]: rating }))
  }

  const getSummaryText = (currentRatings: Record<number, number>, currentComment: string) => {
    let summary = `📋 ผลประเมินการใช้งานเว็บตู้ยาสามัญประจำบ้าน\n`
    summary += `------------------------------------\n`
    summary += `⭐ 1. UI Design: ${'★'.repeat(currentRatings[1])}${'☆'.repeat(5 - currentRatings[1])} (${currentRatings[1]}/5)\n`
    summary += `⭐ 2. Usability: ${'★'.repeat(currentRatings[2])}${'☆'.repeat(5 - currentRatings[2])} (${currentRatings[2]}/5)\n`
    summary += `⭐ 3. Med Info:  ${'★'.repeat(currentRatings[3])}${'☆'.repeat(5 - currentRatings[3])} (${currentRatings[3]}/5)\n`
    summary += `⭐ 4. Features:  ${'★'.repeat(currentRatings[4])}${'☆'.repeat(5 - currentRatings[4])} (${currentRatings[4]}/5)\n`
    summary += `⭐ 5. Overall:   ${'★'.repeat(currentRatings[5])}${'☆'.repeat(5 - currentRatings[5])} (${currentRatings[5]}/5)\n`
    if (currentComment.trim()) {
      summary += `------------------------------------\n`
      summary += `📝 ข้อเสนอแนะเพิ่มเติม: ${currentComment.trim()}\n`
    }
    return summary
  }

  const copyToClipboard = (text: string): boolean => {
    try {
      navigator.clipboard.writeText(text).catch(() => {})
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
      return true
    } catch (err) {
      // Fallback
      const textArea = document.createElement("textarea")
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      try {
        const successful = document.execCommand('copy')
        setCopied(successful)
        setTimeout(() => setCopied(false), 3000)
        document.body.removeChild(textArea)
        return successful
      } catch (e) {
        document.body.removeChild(textArea)
        return false
      }
    }
  }

  const handleSubmit = () => {
    // Validate that all questions are answered
    const unanswered = Object.entries(ratings).filter(([_, rating]) => rating === 0)
    if (unanswered.length > 0) {
      setError('กรุณาประเมินพึงพอใจให้ครบทุกข้อก่อนส่งนะครับ')
      return
    }

    const evaluationData = {
      ratings,
      comment,
      timestamp: new Date().toISOString()
    }

    // Save to localStorage
    localStorage.setItem('cabinet_evaluation', JSON.stringify(evaluationData))
    setSubmitted(true)

    // Automatically copy the result text
    const textSummary = getSummaryText(ratings, comment)
    copyToClipboard(textSummary)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="w-full max-w-xl rounded-3xl overflow-hidden relative z-10 flex flex-col max-h-[85vh] md:max-h-[90vh]"
            style={{
              background: 'linear-gradient(135deg, #FDF8F0 0%, #F5ECD7 100%)',
              border: '2px solid #C8A265',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
            }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-[#EDE0C4] text-[#4A2C17] hover:bg-[#C8A265] hover:text-white transition-colors z-20"
            >
              <X size={16} />
            </button>

            {/* Header */}
            <div className="p-6 pb-4 border-b border-[#E5D9C9] flex items-center gap-3">
              <span className="text-2xl">📝</span>
              <div>
                <h3 className="font-bold text-[#2C1810] text-lg leading-tight" style={{ fontFamily: 'Kanit, sans-serif' }}>
                  แบบประเมินความพึงพอใจการใช้งาน
                </h3>
                <p className="text-xs text-gray-500 font-medium" style={{ fontFamily: 'Sarabun, sans-serif' }}>
                  ช่วยให้คะแนนเพื่อนำไปปรับปรุงระบบให้ดียิ่งขึ้นครับ
                </p>
              </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
              {!submitted ? (
                <>
                  {error && (
                    <div className="p-3 text-xs bg-red-50 text-red-600 rounded-xl font-medium border border-red-200">
                      ⚠️ {error}
                    </div>
                  )}

                  <div className="space-y-4">
                    {QUESTIONS.map((q) => {
                      const currentVal = ratings[q.id]
                      const hoverVal = hoveredRatings[q.id]
                      const activeVal = hoverVal || currentVal

                      const [title, desc] = q.text.split('\n')

                      return (
                        <div key={q.id} className="p-3 rounded-2xl bg-white border border-[#E5D9C9] shadow-sm">
                          <div className="text-xs md:text-sm font-bold text-[#2C1810]" style={{ fontFamily: 'Kanit, sans-serif' }}>
                            {q.id}. {title}
                          </div>
                          {desc && (
                            <div className="text-xxs md:text-xs text-gray-400 mt-0.5 leading-snug" style={{ fontFamily: 'Sarabun, sans-serif' }}>
                              {desc}
                            </div>
                          )}

                          {/* Stars Selector */}
                          <div className="flex items-center gap-1.5 mt-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => handleRate(q.id, star)}
                                onMouseEnter={() => handleHover(q.id, star)}
                                onMouseLeave={() => handleHover(q.id, 0)}
                                className="transition-transform hover:scale-110 active:scale-95"
                              >
                                <Star
                                  size={24}
                                  fill={star <= activeVal ? "#FBBF24" : "none"}
                                  stroke={star <= activeVal ? "#FBBF24" : "#9CA3AF"}
                                  className="transition-colors cursor-pointer"
                                />
                              </button>
                            ))}
                            {currentVal > 0 && (
                              <span className="text-xs font-bold text-[#B8923A] ml-2">
                                {currentVal} / 5 คะแนน
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Comment */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#2C1810]" style={{ fontFamily: 'Kanit, sans-serif' }}>
                      หมายเหตุ / ข้อเสนอแนะเพิ่มเติม
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="พิมพ์ความคิดเห็นของพี่ หรือฟีเจอร์อื่นๆ ที่อยากให้มีเพิ่มเติมได้เลยครับ..."
                      className="w-full rounded-xl p-3 text-xs md:text-sm border border-[#E5D9C9] outline-none h-20"
                      style={{
                        background: 'white',
                        fontFamily: 'Sarabun, sans-serif',
                      }}
                    />
                  </div>
                </>
              ) : (
                /* Success View */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-8 text-center flex flex-col items-center justify-center space-y-4"
                >
                  <div
                    className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-3xl"
                  >
                    🎉
                  </div>
                  <h4 className="font-bold text-[#2C1810] text-lg" style={{ fontFamily: 'Kanit, sans-serif' }}>
                    ส่งผลประเมินสำเร็จและคัดลอกลงคลิปบอร์ดแล้ว!
                  </h4>
                  <p className="text-xs text-gray-500 max-w-sm" style={{ fontFamily: 'Sarabun, sans-serif' }}>
                    ผลประเมินถูกบันทึกลงเบราว์เซอร์ของท่าน และคัดลอกเป็นข้อความเรียบร้อยแล้ว ท่านสามารถกด **"วาง" (Ctrl+V)** เพื่อส่งทางแชต Line หรือ Messenger ให้เพื่อนได้เลยครับ!
                  </p>

                  {/* Textarea representation of what was copied */}
                  <div className="w-full p-4 rounded-2xl bg-white border border-[#E5D9C9] text-left text-xs space-y-1 text-gray-700 shadow-inner font-mono whitespace-pre-line leading-relaxed max-w-md">
                    {getSummaryText(ratings, comment)}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const success = copyToClipboard(getSummaryText(ratings, comment))
                        if (success) {
                          alert('คัดลอกข้อความผลประเมินใหม่เรียบร้อยแล้ว!')
                        }
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#B8923A] text-white hover:bg-[#C8A265] transition-colors"
                      style={{ fontFamily: 'Kanit, sans-serif' }}
                    >
                      {copied ? <Check size={14} /> : <Clipboard size={14} />}
                      {copied ? 'คัดลอกแล้ว!' : 'คัดลอกข้อความอีกครั้ง'}
                    </button>
                    <button
                      onClick={onClose}
                      className="px-4 py-2 rounded-xl text-xs font-semibold border border-[#E5D9C9] hover:bg-[#EDE0C4] transition-colors"
                      style={{ fontFamily: 'Kanit, sans-serif', color: '#6B7280' }}
                    >
                      ปิดหน้าต่าง
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer buttons */}
            {!submitted && (
              <div className="p-4 border-t border-[#E5D9C9] bg-[#EDE0C4] flex items-center justify-end gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:text-gray-700"
                  style={{ fontFamily: 'Kanit, sans-serif' }}
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white shadow-md hover:shadow-lg transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #10B981, #059669)',
                    fontFamily: 'Kanit, sans-serif',
                  }}
                >
                  บันทึกและคัดลอกผล →
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

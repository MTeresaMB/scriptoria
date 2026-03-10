/**
 * Calculate Flesch Reading Ease score
 * Score ranges from 0-100, higher is easier to read
 * 90-100: Very Easy
 * 80-89: Easy
 * 70-79: Fairly Easy
 * 60-69: Standard
 * 50-59: Fairly Difficult
 * 30-49: Difficult
 * 0-29: Very Difficult
 */
export const calculateFleschReadingEase = (text: string): number => {
  const cleanText = text.replace(/<[^>]*>/g, '')
  
  if (cleanText.trim().length === 0) return 0

  const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0)
  const words = cleanText.split(/\s+/).filter(w => w.length > 0)
  const syllables = words.reduce((total, word) => {
    return total + countSyllables(word)
  }, 0)

  if (sentences.length === 0 || words.length === 0) return 0

  const avgSentenceLength = words.length / sentences.length
  const avgSyllablesPerWord = syllables / words.length

  const score = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord)
  
  return Math.max(0, Math.min(100, Math.round(score)))
}

const countSyllables = (word: string): number => {
  word = word.toLowerCase()
  if (word.length <= 3) return 1
  
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
  word = word.replace(/^y/, '')
  
  const matches = word.match(/[aeiouy]{1,2}/g)
  return matches ? matches.length : 1
}

/**
 * Get readability level description
 */
export const getReadabilityLevel = (score: number): { level: string; color: string } => {
  if (score >= 90) return { level: 'Very Easy', color: 'text-green-400' }
  if (score >= 80) return { level: 'Easy', color: 'text-green-300' }
  if (score >= 70) return { level: 'Fairly Easy', color: 'text-yellow-400' }
  if (score >= 60) return { level: 'Standard', color: 'text-yellow-300' }
  if (score >= 50) return { level: 'Fairly Difficult', color: 'text-orange-400' }
  if (score >= 30) return { level: 'Difficult', color: 'text-red-400' }
  return { level: 'Very Difficult', color: 'text-red-500' }
}

export const analyzeDialogueVsNarration = (text: string): {
  dialoguePercentage: number
  narrationPercentage: number
  dialogueCount: number
  narrationCount: number
} => {
  const cleanText = text.replace(/<[^>]*>/g, '')
  const dialogueMatches = cleanText.match(/[""''„"«»]/g)
  const dialogueCount = dialogueMatches ? Math.floor(dialogueMatches.length / 2) : 0
  const words = cleanText.split(/\s+/).filter(w => w.length > 0)
  const totalWords = words.length
  const estimatedDialogueWords = dialogueCount * 5
  const narrationWords = Math.max(0, totalWords - estimatedDialogueWords)
  
  const dialoguePercentage = totalWords > 0 ? Math.round((estimatedDialogueWords / totalWords) * 100) : 0
  const narrationPercentage = 100 - dialoguePercentage

  return {
    dialoguePercentage,
    narrationPercentage,
    dialogueCount,
    narrationCount: narrationWords,
  }
}

export const STOP_WORDS = new Set([
  "about", "above", "after", "again", "against", "all", "and", "any", "are", "aren", "because", "been", "before", 
  "being", "below", "between", "both", "but", "cannot", "could", "couldn", "did", "didn", "doing", "down", 
  "during", "each", "few", "for", "from", "further", "had", "hadn", "has", "hasn", "have", "haven", "having", 
  "her", "here", "hers", "herself", "him", "himself", "his", "how", "into", "its", "itself", "just", "more", 
  "most", "mustn", "myself", "nor", "not", "off", "once", "only", "other", "ought", "our", "ours", "ourselves", 
  "out", "over", "own", "same", "shan", "she", "should", "shouldn", "some", "such", "than", "that", "the", 
  "their", "theirs", "them", "themselves", "then", "there", "these", "they", "this", "those", "through", "too", 
  "under", "until", "very", "was", "wasn", "were", "weren", "what", "when", "where", "which", "while", "who", 
  "whom", "why", "with", "won", "would", "wouldn", "you", "your", "yours", "yourself", "yourselves", "there",
  "someone", "something", "anyone", "anything", "everyone", "everything", "nobody", "nothing", "never", "always",
  "really", "really", "around", "behind", "before", "after", "under", "over", "between", "through", "within", "without",
  "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth",
  "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety", "hundred", "thousand", "million",
  "which", "where", "whose", "whom", "whoever", "whomever", "whatever", "whenever", "wherever", "however", "though",
  "although", "unless", "until", "since", "because", "while", "whereas", "whether", "neither", "either"
]);

export async function generateCaseVocab(text: string): Promise<Record<string, string>> {
  // Extract words
  const words = text.toLowerCase().match(/[a-z]{5,}/g) || [];
  
  // Filter and get unique words
  const uniqueWords = Array.from(new Set(words))
    .filter(w => !STOP_WORDS.has(w));
  
  // Shuffle words to get random candidates
  const candidates = uniqueWords.sort(() => 0.5 - Math.random());
  
  const result: Record<string, string> = {};
  let count = 0;
  
  // Try fetching definitions until we get 5
  // Batch them 5 at a time to be fast
  for (let i = 0; i < candidates.length; i += 5) {
    const batch = candidates.slice(i, i + 5);
    const promises = batch.map(async (word) => {
      try {
        const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        if (!res.ok) return null;
        const data = await res.json();
        if (data && data[0] && data[0].meanings && data[0].meanings[0].definitions[0]) {
          return {
            word,
            definition: data[0].meanings[0].definitions[0].definition
          };
        }
      } catch (e) {
        return null;
      }
      return null;
    });
    
    const batchResults = await Promise.all(promises);
    for (const res of batchResults) {
      if (res && count < 5) {
        result[res.word] = res.definition;
        count++;
      }
    }
    
    if (count >= 5) break;
  }
  
  return result;
}

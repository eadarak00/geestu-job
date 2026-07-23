export interface JobOffer {
  id: string
  title: string
  company: string
  location: string
  matchScore: number
  type: string
  postedAt: string
}

export const fetchJobOffers = async (): Promise<JobOffer[]> => {
  // Mock API call simulation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'job-1',
          title: 'Développeur Fullstack React & FastAPI',
          company: 'GëstuTech Solutions',
          location: 'Dakar, Sénégal (Hybride)',
          matchScore: 94,
          type: 'CDI',
          postedAt: 'Il y a 2 heures',
        },
        {
          id: 'job-2',
          title: 'Ingénieur Machine Learning / NLP',
          company: 'AfriAI Labs',
          location: 'Télétravail',
          matchScore: 88,
          type: 'CDI',
          postedAt: 'Hier',
        },
        {
          id: 'job-3',
          title: 'Data Analyst & BI Consultant',
          company: 'Orange SN',
          location: 'Dakar',
          matchScore: 81,
          type: 'Stage',
          postedAt: 'Il y a 3 jours',
        },
      ])
    }, 500)
  })
}

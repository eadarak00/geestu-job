import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { useAppStore } from '@/store/useAppStore'
import { fetchJobOffers, type JobOffer } from '@/services/api'
import { Button } from '@/components/ui/button'
import { 
  Briefcase, 
  Sparkles, 
  FileText, 
  User, 
  TrendingUp, 
  CheckCircle2, 
  Building2, 
  MapPin, 
  LogOut,
  Search,
  Bell
} from 'lucide-react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
})

function Navigation() {
  const { user, logout } = useAppStore()
  const location = useLocation()

  const navItems = [
    { label: 'Tableau de bord', path: '/', icon: TrendingUp },
    { label: 'Offres & Matching IA', path: '/jobs', icon: Sparkles },
    { label: 'Mes Candidatures', path: '/applications', icon: Briefcase },
    { label: 'Mon CV & Profil', path: '/profile', icon: FileText },
  ]

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-purple-400 bg-clip-text text-transparent">
                  Gëstu Job
                </span>
                <span className="ml-1 px-1.5 py-0.5 text-[10px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded">
                  AI
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-purple-600/10 text-purple-400 border border-purple-500/20'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-white">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-purple-500"></span>
            </Button>

            <div className="h-6 w-px bg-slate-800 hidden sm:block" />

            <div className="flex items-center gap-3 pl-2">
              <div className="hidden sm:block text-right">
                <div className="text-sm font-semibold text-slate-200">{user?.name}</div>
                <div className="text-xs text-purple-400">{user?.role}</div>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-md">
                {user?.name.charAt(0)}
              </div>
              <Button variant="ghost" size="icon" onClick={logout} title="Déconnexion" className="text-slate-400 hover:text-red-400">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

function DashboardPage() {
  const { user } = useAppStore()
  const { data: jobOffers, isLoading } = useQuery({
    queryKey: ['jobOffers'],
    queryFn: fetchJobOffers,
  })

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-purple-500/20 p-8 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> IA de Matching Activée
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Bienvenue, {user?.name} 👋
          </h1>
          <p className="text-slate-300 text-base leading-relaxed">
            Votre assistant Gëstu Job AI a identifié <span className="text-purple-400 font-semibold">3 opportunités hautement compatibles</span> avec votre profil ce matin.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link to="/jobs">
              <Button size="lg" className="gap-2">
                <Search className="w-4 h-4" /> Explorer les Offres IA
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              Optimiser mon CV
            </Button>
          </div>
        </div>
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Score Profil Sémantique', value: '92%', change: '+5% ce mois', icon: CheckCircle2, color: 'text-emerald-400' },
          { label: 'Offres Matchées', value: '24', change: '8 très fortes', icon: Sparkles, color: 'text-purple-400' },
          { label: 'Candidatures En cours', value: '6', change: '2 en entretien', icon: Briefcase, color: 'text-blue-400' },
          { label: 'Vues de Profil', value: '142', change: '+18% cette semaine', icon: User, color: 'text-amber-400' },
        ].map((kpi, idx) => {
          const Icon = kpi.icon
          return (
            <div key={idx} className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">{kpi.label}</span>
                <Icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">{kpi.value}</span>
                <span className="text-xs text-slate-400">{kpi.change}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recommended Jobs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Recommandations IA Récentes</h2>
            <p className="text-xs text-slate-400">Offres sélectionnées selon votre expérience et compétences extraites</p>
          </div>
          <Link to="/jobs">
            <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300">
              Voir tout ({jobOffers?.length || 0})
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-slate-500">Chargement des recommandations...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {jobOffers?.map((job: JobOffer) => (
              <div
                key={job.id}
                className="group p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-all hover:shadow-lg hover:shadow-purple-950/20 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {job.matchScore}% Match
                    </span>
                    <span className="text-xs text-slate-500">{job.postedAt}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-100 group-hover:text-purple-400 transition-colors line-clamp-1">
                      {job.title}
                    </h3>
                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5 text-slate-500" /> {job.company}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-500" /> {job.location}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300">
                    {job.type}
                  </span>
                  <Button variant="secondary" size="sm" className="gap-1 text-xs">
                    Postuler via IA <Sparkles className="w-3 h-3 text-purple-400" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function JobsPage() {
  const { data: jobOffers, isLoading } = useQuery({
    queryKey: ['jobOffers'],
    queryFn: fetchJobOffers,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Recherche & Matching IA</h1>
        <p className="text-sm text-slate-400">Toutes les offres correspondant à votre profil vectorisé</p>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-slate-500">Chargement...</div>
      ) : (
        <div className="space-y-4">
          {jobOffers?.map((job) => (
            <div key={job.id} className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-white">{job.title}</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                    Score: {job.matchScore}%
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> {job.company}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                  <span className="px-2 py-0.5 bg-slate-800 rounded text-slate-300">{job.type}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <Button variant="outline" size="sm">Générer Lettre IA</Button>
                <Button size="sm" className="gap-1">
                  Postuler <Sparkles className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ApplicationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Pipeline de Suivi des Candidatures</h1>
        <p className="text-sm text-slate-400">Gérez le statut de vos candidatures de la préparation à l'embauche</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: 'À préparer', count: 2, color: 'border-slate-700' },
          { title: 'Envoyées', count: 4, color: 'border-blue-500/40' },
          { title: 'Entretiens', count: 2, color: 'border-amber-500/40' },
          { title: 'Offres / Retenues', count: 1, color: 'border-emerald-500/40' },
        ].map((column, idx) => (
          <div key={idx} className={`p-4 rounded-xl bg-slate-900/60 border-t-4 ${column.color} border-slate-800 space-y-3`}>
            <div className="flex items-center justify-between text-sm font-semibold text-slate-200">
              <span>{column.title}</span>
              <span className="w-6 h-6 rounded-full bg-slate-800 text-xs flex items-center justify-center text-slate-400">
                {column.count}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1">
              <div className="font-semibold text-slate-200">Développeur Fullstack React</div>
              <div className="text-slate-400">GëstuTech Solutions</div>
              <div className="text-[10px] text-purple-400 pt-1">Mis à jour hier</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProfilePage() {
  const { user } = useAppStore()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Profil & Documents CV</h1>
        <p className="text-sm text-slate-400">Analyse NLP et extraction automatique des compétences</p>
      </div>
      <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4 max-w-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-2xl font-bold text-white">
            {user?.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{user?.name}</h3>
            <p className="text-xs text-slate-400">{user?.email}</p>
            <span className="mt-1 inline-block px-2 py-0.5 text-xs bg-purple-500/10 text-purple-400 rounded border border-purple-500/20">
              Profil Vérifié Gëstu AI
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-purple-500 selection:text-white">
          <Navigation />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/applications" element={<ApplicationsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

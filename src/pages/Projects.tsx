import { useState } from 'react'
import {
  FolderKanban,
  Plus,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
} from 'lucide-react'
import { GlassCard } from '../components/ui/GlassCard'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { PageHeader, Field } from '../components/ui/misc'
import { formatEUR, formatDate } from '../lib/format'
import { MOCK_PROJECTS, type FictionalProject } from '../lib/mockData'

export function ProjectsPage() {
  const [projects, setProjects] = useState<FictionalProject[]>(MOCK_PROJECTS)
  const [modalOpen, setModalOpen] = useState(false)
  const [newProject, setNewProject] = useState({
    name: '',
    clientName: '',
    type: 'vitrine' as const,
    budget: 590,
    dueDate: '',
  })

  const columns: {
    key: FictionalProject['status']
    title: string
    tone: 'indigo' | 'cyan' | 'purple' | 'emerald'
  }[] = [
    { key: 'cadrage', title: 'Cadrage & Devis', tone: 'indigo' },
    { key: 'dev', title: 'En Développement', tone: 'cyan' },
    { key: 'recette', title: 'Recette & Tests', tone: 'purple' },
    { key: 'livre', title: 'Livrés & En ligne', tone: 'emerald' },
  ]

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProject.name || !newProject.clientName) return
    const p: FictionalProject = {
      id: `p-${Date.now()}`,
      name: newProject.name,
      clientId: `cli-${Date.now()}`,
      clientName: newProject.clientName,
      type: newProject.type,
      status: 'cadrage',
      budget: Number(newProject.budget),
      progress: 10,
      dueDate: newProject.dueDate || new Date().toISOString(),
      tasks: [{ title: 'Cadrage initial', done: false }],
    }
    setProjects([p, ...projects])
    setModalOpen(false)
    setNewProject({ name: '', clientName: '', type: 'vitrine', budget: 590, dueDate: '' })
  }

  const changeStatus = (id: string, nextStatus: FictionalProject['status']) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: nextStatus,
              progress:
                nextStatus === 'livre'
                  ? 100
                  : nextStatus === 'recette'
                  ? 85
                  : nextStatus === 'dev'
                  ? 50
                  : 20,
            }
          : p,
      ),
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Pipeline de réalisation"
        title="Gestion des Projets"
        description="Suivez l'avancement des développements en cours, recettes clients et livraisons (noms de clients & projets fictifs pour le portfolio)."
        actions={
          <div className="flex items-center gap-3">
            <Badge tone="amber">Projets & Clients fictifs</Badge>
            <Button variant="primary" size="md" onClick={() => setModalOpen(true)}>
              <Plus className="h-4 w-4" />
              Nouveau projet
            </Button>
          </div>
        }
      />

      {/* Kanban Board */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {columns.map((col) => {
          const colProjects = projects.filter((p) => p.status === col.key)
          return (
            <div key={col.key} className="flex flex-col space-y-4">
              {/* Entête colonne */}
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <Badge tone={col.tone} dot>
                    {col.title}
                  </Badge>
                  <span className="font-geist-mono text-xs text-gray-500">
                    ({colProjects.length})
                  </span>
                </div>
              </div>

              {/* Cartes projets */}
              <div className="space-y-3">
                {colProjects.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-xs text-gray-500">
                    Aucun projet à cette étape
                  </div>
                ) : (
                  colProjects.map((proj) => (
                    <GlassCard
                      key={proj.id}
                      className="p-5 transition hover:border-indigo-500/30"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <span className="label-mono text-[10px] text-gray-400">
                            {proj.clientName}
                          </span>
                          <span className="font-geist-mono text-xs font-semibold text-emerald-400">
                            {formatEUR(proj.budget)}
                          </span>
                        </div>

                        <h4 className="font-semibold text-white text-sm">
                          {proj.name}
                        </h4>

                        {/* Progression */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] text-gray-400">
                            <span>Avancement</span>
                            <span className="font-geist-mono font-medium text-white">
                              {proj.progress}%
                            </span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300"
                              style={{ width: `${proj.progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Tâches */}
                        <div className="space-y-1 pt-1">
                          {proj.tasks.slice(0, 2).map((t, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-1.5 text-xs text-gray-400"
                            >
                              <CheckCircle2
                                className={`h-3.5 w-3.5 ${
                                  t.done ? 'text-emerald-400' : 'text-gray-600'
                                }`}
                              />
                              <span className={t.done ? 'line-through text-gray-500' : ''}>
                                {t.title}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Date & Déplacement rapide */}
                        <div className="flex items-center justify-between border-t border-white/5 pt-3 text-[11px]">
                          <span className="flex items-center gap-1 font-geist-mono text-gray-500">
                            <Calendar className="h-3 w-3" />
                            {formatDate(proj.dueDate, 'd MMM')}
                          </span>

                          <select
                            value={proj.status}
                            onChange={(e) =>
                              changeStatus(
                                proj.id,
                                e.target.value as FictionalProject['status'],
                              )
                            }
                            className="rounded-lg border border-white/10 bg-ink-800 px-2 py-0.5 font-geist-mono text-[10px] text-gray-300 outline-none focus:border-indigo-400"
                          >
                            <option value="cadrage">→ Cadrage</option>
                            <option value="dev">→ Dev</option>
                            <option value="recette">→ Recette</option>
                            <option value="livre">→ Livré</option>
                          </select>
                        </div>
                      </div>
                    </GlassCard>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal Création Projet */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Lancer un nouveau projet"
        subtitle="Définissez les objectifs, le client et l'échéance."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Field label="Nom du projet *">
            <input
              required
              type="text"
              value={newProject.name}
              onChange={(e) =>
                setNewProject({ ...newProject, name: e.target.value })
              }
              placeholder="Ex: Refonte Site E-Commerce Stripe"
              className="input"
            />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Client *">
              <input
                required
                type="text"
                value={newProject.clientName}
                onChange={(e) =>
                  setNewProject({ ...newProject, clientName: e.target.value })
                }
                placeholder="Ex: Apex Logistics"
                className="input"
              />
            </Field>

            <Field label="Type de projet">
              <select
                value={newProject.type}
                onChange={(e) =>
                  setNewProject({
                    ...newProject,
                    type: e.target.value as any,
                  })
                }
                className="input bg-ink-800"
              >
                <option value="vitrine">Site Vitrine sur-mesure</option>
                <option value="ecommerce">Boutique E-commerce</option>
                <option value="ia">Chatbot IA / WhatsApp</option>
                <option value="app">Application SaaS</option>
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Budget (€)">
              <input
                type="number"
                value={newProject.budget}
                onChange={(e) =>
                  setNewProject({ ...newProject, budget: Number(e.target.value) })
                }
                className="input"
              />
            </Field>

            <Field label="Date de livraison prévue">
              <input
                type="date"
                value={newProject.dueDate}
                onChange={(e) =>
                  setNewProject({ ...newProject, dueDate: e.target.value })
                }
                className="input"
              />
            </Field>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setModalOpen(false)}
            >
              Annuler
            </Button>
            <Button type="submit" variant="primary">
              Créer le projet
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

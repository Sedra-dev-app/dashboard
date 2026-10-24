import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { Profile } from '../lib/types'

interface AuthCtx {
  session: Session | null
  profile: Profile | null
  loading: boolean
  isDemo: boolean
  signIn: (email: string, password: string) => Promise<string | null>
  signUp: (email: string, password: string) => Promise<string | null>
  signOut: () => Promise<void>
  enterDemoMode: () => void
}

const Ctx = createContext<AuthCtx | null>(null)

const DEFAULT_DEMO_PROFILE: Profile = {
  id: 'demo-admin',
  email: 'contact@sedra-studio-demo.fr',
  full_name: 'Alexandre R. (Sedra Studio)',
  role: 'admin',
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(DEFAULT_DEMO_PROFILE)
  const [loading, setLoading] = useState(false)
  const [isDemo, setIsDemo] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setSession(data.session)
        setIsDemo(false)
      }
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s)
      if (s) {
        setIsDemo(false)
      } else {
        setProfile(DEFAULT_DEMO_PROFILE)
        setIsDemo(true)
      }
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) return
    let cancelled = false
    supabase
      .from('profiles')
      .select('id,email,full_name,role')
      .eq('id', session.user.id)
      .maybeSingle()
      .then(
        ({ data }) => {
          if (cancelled) return
          setProfile((data as Profile) ?? null)
          setLoading(false)
        },
        () => {
          if (!cancelled) setLoading(false)
        },
      )
    return () => {
      cancelled = true
    }
  }, [session])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (!error) {
      setIsDemo(false)
      return null
    }
    return error.message === 'Invalid login credentials'
      ? 'Email ou mot de passe incorrect'
      : error.message
  }

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: 'Alexandre R.' } },
    })
    if (!error) {
      setIsDemo(false)
      return null
    }
    return error.message
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setProfile(DEFAULT_DEMO_PROFILE)
    setIsDemo(true)
  }

  const enterDemoMode = () => {
    setIsDemo(true)
    setProfile({
      id: 'demo-admin',
      email: 'contact@sedra-studio-demo.fr',
      full_name: 'Alexandre R. (Sedra Studio)',
      role: 'admin',
    })
    setLoading(false)
  }

  return (
    <Ctx.Provider
      value={{
        session,
        profile,
        loading,
        isDemo,
        signIn,
        signUp,
        signOut,
        enterDemoMode,
      }}
    >
      {children}
    </Ctx.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth doit être utilisé dans <AuthProvider>')
  return ctx
}

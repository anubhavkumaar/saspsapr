import { useState } from 'react'
import { useAuthUser } from '../lib/auth'
import { useEvidence } from '../lib/evidence'
import { useUserMap } from '../lib/mdt'
import { LoginModal } from '../shell/LoginModal.jsx'
import { EvidenceSection } from './fieldwork/EvidenceSection.jsx'
import { LeaderboardSection } from './fieldwork/LeaderboardSection.jsx'
import { MdtSection } from './fieldwork/MdtSection.jsx'

// Each section asks for a login in its own words, as it always did.
const LOGINS = {
  evidence: { title: 'Admin Login',   sub: 'Sign in to add or remove evidence images.' },
  mdt:      { title: 'Officer Login', sub: 'Sign in to log or remove MDT entries.' },
}

export default function FieldWork() {
  const user    = useAuthUser()
  const userMap = useUserMap()
  const images  = useEvidence()
  const [login, setLogin] = useState(null)   // 'evidence' | 'mdt' | null
  const copy = LOGINS[login || 'mdt']

  return (
    <>
      <EvidenceSection user={user} userMap={userMap} images={images} onLogin={() => setLogin('evidence')}/>
      <MdtSection user={user} userMap={userMap} onLogin={() => setLogin('mdt')}/>
      <LeaderboardSection images={images}/>
      <LoginModal open={!!login && !user} onClose={() => setLogin(null)} title={copy.title} sub={copy.sub}/>
    </>
  )
}

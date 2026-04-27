import { CURRENT_EXHIBITION } from './exhibitions'
import Landing from './ui/Landing'

export default function App() {
  return <Landing config={CURRENT_EXHIBITION} />
}

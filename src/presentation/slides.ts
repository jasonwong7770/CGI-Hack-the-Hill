import type { SlideDef } from './types'
import CustomerFeaturesSlide from './slides/CustomerFeaturesSlide'
import DemoSlide from './slides/DemoSlide'
import ImpactSlide from './slides/ImpactSlide'
import ProblemSlide from './slides/ProblemSlide'
import RolesSlide from './slides/RolesSlide'
import SolutionSlide from './slides/SolutionSlide'
import StaffFeaturesSlide from './slides/StaffFeaturesSlide'
import TeamSlide from './slides/TeamSlide'
import TechSlide from './slides/TechSlide'
import ThanksSlide from './slides/ThanksSlide'
import TitleSlide from './slides/TitleSlide'

// The deck, top to bottom. Reorder, add or remove entries here and the scenery follows.
// Keep zones in the order they appear in zones.ts so the world stays continuous.
export const slides: SlideDef[] = [
  {
    id: 'title',
    title: 'Northwind Utilities',
    zone: 'sky',
    Component: TitleSlide,
    notes: 'Name the project and the CGI CRM challenge. ~15s',
  },
  { id: 'team', title: 'Team', zone: 'sky', Component: TeamSlide, notes: 'Quick round of names. ~15s' },
  {
    id: 'problem',
    title: 'The problem',
    zone: 'powerlines',
    Component: ProblemSlide,
    notes:
      'Context: 1.8M customers, complaints up 37%, first-contact resolution 62%→41%, regulator score 4.3→2.6/5. Then walk the charts: 9→38 days; transfers cost $121 vs $68 and reopen 3×; half are billing. ~40s',
  },
  {
    id: 'solution',
    title: 'Our solution',
    zone: 'rooftops',
    Component: SolutionSlide,
    notes: 'One portal, one case record: each bullet answers one of the three problem numbers. ~25s',
  },
  { id: 'roles', title: 'Roles', zone: 'street', Component: RolesSlide, notes: 'Customer, employee, manager. ~20s' },
  {
    id: 'customer',
    title: 'Customer features',
    zone: 'soil',
    Component: CustomerFeaturesSlide,
    notes: 'Complaint categories match Northwind’s own data exactly. Bill breakdown answers the 51% billing problem. ~30s',
  },
  {
    id: 'staff',
    title: 'Staff features',
    zone: 'soil',
    Component: StaffFeaturesSlide,
    notes: 'One queue instead of four systems. Staffing: point at Calderfield (41% attrition, 32 vacancies). ~25s',
  },
  {
    id: 'demo',
    title: 'Live demo',
    zone: 'watermain',
    Component: DemoSlide,
    notes:
      'Customer: file a billing complaint (bill appears). Employee: close it. Manager: load the staffing CSV. ~75s',
  },
  { id: 'tech', title: 'Tech', zone: 'bedrock', Component: TechSlide, notes: 'React + Supabase; RLS enforces roles. ~20s' },
  {
    id: 'impact',
    title: 'Impact & next',
    zone: 'reservoir',
    Component: ImpactSlide,
    notes: '~$235K/yr is an estimate: transfers × $53 extra each. Then the roadmap. ~25s',
  },
  { id: 'thanks', title: 'Thank you', zone: 'reservoir', Component: ThanksSlide, notes: 'Thank the judges, open for questions.' },
]

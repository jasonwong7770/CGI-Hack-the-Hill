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
    notes: 'Name the project and the challenge. ~15s',
  },
  { id: 'team', title: 'Team', zone: 'sky', Component: TeamSlide, notes: 'Quick round of names. ~15s' },
  {
    id: 'problem',
    title: 'The problem',
    zone: 'powerlines',
    Component: ProblemSlide,
    notes: 'Land the pain point with one number. ~30s',
  },
  { id: 'solution', title: 'Our solution', zone: 'rooftops', Component: SolutionSlide, notes: 'One-sentence pitch. ~25s' },
  { id: 'roles', title: 'Roles', zone: 'street', Component: RolesSlide, notes: 'Customer, employee, manager. ~25s' },
  {
    id: 'customer',
    title: 'Customer features',
    zone: 'soil',
    Component: CustomerFeaturesSlide,
    notes: 'Requests, bill, calendar. ~30s',
  },
  { id: 'staff', title: 'Staff features', zone: 'soil', Component: StaffFeaturesSlide, notes: 'Queue, stats, roles. ~25s' },
  {
    id: 'demo',
    title: 'Live demo',
    zone: 'watermain',
    Component: DemoSlide,
    notes: 'Log in as a customer, file a request, switch to an employee and close it. ~75s',
  },
  { id: 'tech', title: 'Tech', zone: 'bedrock', Component: TechSlide, notes: 'React + Supabase; RLS enforces roles. ~25s' },
  { id: 'impact', title: 'Impact & next', zone: 'reservoir', Component: ImpactSlide, notes: 'Impact, then roadmap. ~20s' },
  { id: 'thanks', title: 'Thank you', zone: 'reservoir', Component: ThanksSlide, notes: 'Thank the judges, open for questions.' },
]

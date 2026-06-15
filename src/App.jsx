import { useState } from 'react'
import CULibraryModule from './components/CULibraryModule'
import BidEstimatesLanding from './components/bid-estimates-landing'
import DesignSystem from './components/gridbase-design-system'
import AuditPage from './components/gridbase-design-system-audit'
import TEAdminSettings from './components/te-admin-settings'
import TECalculator from './components/te-calculator'
import WorkScheduleSplit from './components/work-schedule-split-ot'
import LUMSummary from './components/lumpsum-pnl-prototype'
import UnitPriceCalculator from './components/unitprice-pnl-prototype'
import './App.css'
import SubsidiaryAccessManager from './components/subsidiary-access-manager-prototype'
import GridbaseSidebar from './components/GridbaseSidebar'
import Settings from './components/settings'
import UnionManagement from './components/Unions_Agreements_Detail'
import ProjectLanding from './components/projects-landing'
import WorkOrder from './components/work-order-detail-a2260d99.jsx'
import ContractSetupWizard from './components/contract-setup-wizard'
import OrgSwitcher from './components/org-switcher'
import JobSetupWizard from './components/docs/bluesky-jobs/job-setup-wizard.js'
import CrewEquipment from './components/docs/bluesky-jobs/crew-equipment'
import RedlineModalExample from './components/docs/bluesky-jobs/RedlineModal'
import InvoicingTab from './components/InvoicingTab'
import NestedTableGrouping from './components/NestedTableGrouping'

const PAGES = [
  { key: 'cu-library', label: 'CU Library', component: CULibraryModule },
  { key: 'bid-estimates', label: 'Bid Estimates', component: BidEstimatesLanding },
  { key: 'design-system', label: 'Design System', component: DesignSystem },
  { key: 'design-audit', label: 'Design Audit', component: AuditPage },
  { key: 'te-admin', label: 'T&E Admin Settings', component: TEAdminSettings },
  { key: 'te-calculator', label: 'T&E Calculator', component: TECalculator },
  { key: 'work-schedule', label: 'Work Schedule', component: WorkScheduleSplit },
  {key: 'lum-summary', label: 'LUM Summary', component: LUMSummary},
  {key: 'unit-price-calculator', label: 'Unit Price Calculator', component: UnitPriceCalculator},
  {key: 'subsidiary-access-manager', label: 'Subsidiary Access Manager', component: SubsidiaryAccessManager},
  {key: 'gridbase-sidebar', label: 'Gridbase Sidebar', component: GridbaseSidebar},
  {key: 'settings', label: 'Settings', component: Settings},
  {key: 'union-management', label: 'Union Management', component: UnionManagement},
  {key: 'project-landing' , label: 'Project Landing', component: ProjectLanding},
  {key: 'work-order' , label: 'Work Order', component: WorkOrder},
  {key: 'contract-setup-wizard', label: 'Contract Setup Wizard', component: ContractSetupWizard},
  {key: 'org-switcher', label: 'Org Switcher', component: OrgSwitcher},
  {key: 'job-setup-wizard', label: 'Job Setup Wizard', component: JobSetupWizard},
  {key: 'crew-equipment', label: 'Crew Equipment', component: CrewEquipment},
  {key: 'redline-modal', label: 'Redline Modal', component: RedlineModalExample},
  {key: 'invoicing-tab', label: 'Invoicing Tab', component: InvoicingTab},
  {key: 'nested-table-grouping', label: 'Nested Table Grouping', component: NestedTableGrouping}
]

function App() {
  const [activePage, setActivePage] = useState('invoicing-tab')
  const ActiveComponent = PAGES.find(p => p.key === activePage)?.component

  return (
    <div>
      {/* Navigation Bar */}
      <nav style={{
        display: 'flex',
        gap: 4,
        padding: '8px 16px',
        background: '#111827',
        overflowX: 'auto',
        flexWrap: 'wrap',
      }}>
        {PAGES.map(page => (
          <button
            key={page.key}
            onClick={() => setActivePage(page.key)}
            style={{
              padding: '6px 14px',
              fontSize: 13,
              fontWeight: 500,
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              background: activePage === page.key ? '#374151' : 'transparent',
              color: activePage === page.key ? '#fff' : '#9CA3AF',
              transition: 'all 0.15s',
              whiteSpace: 'nowrap',
            }}
          >
            {page.label}
          </button>
        ))}
      </nav>

      {/* Active Component */}
      {ActiveComponent && <ActiveComponent />}
    </div>
  )
}

export default App

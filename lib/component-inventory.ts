export type ComponentGroup = "shared" | "ui" | "publisher" | "brand";

export type ComponentInventoryItem = {
  name: string;
  group: ComponentGroup;
  file: string;
  purpose: string;
  surfaces: string[];
};

export const COMPONENT_INVENTORY: ComponentInventoryItem[] = [
  {
    name: "AppShell",
    group: "shared",
    file: "components/app-shell.tsx",
    purpose: "Top-level state router for experience and theme versions.",
    surfaces: ["publisher", "brand", "components"]
  },
  {
    name: "ViewSwitcher",
    group: "shared",
    file: "components/view-switcher.tsx",
    purpose: "Switches experience mode and app version.",
    surfaces: ["publisher-shell", "brand-shell", "component-explorer"]
  },
  {
    name: "CommissionStatusChip",
    group: "shared",
    file: "components/commission-status-chip.tsx",
    purpose: "Visual status chip for commission states.",
    surfaces: ["publisher", "brand"]
  },
  {
    name: "EarningsDashboard",
    group: "publisher",
    file: "components/publisher/earnings-dashboard.tsx",
    purpose: "Publisher KPI dashboard and earnings table.",
    surfaces: ["publisher/earnings"]
  },
  {
    name: "CommissionDetail",
    group: "publisher",
    file: "components/publisher/commission-detail.tsx",
    purpose: "Publisher commission detail timeline and context.",
    surfaces: ["publisher/detail"]
  },
  {
    name: "DisputeWizard",
    group: "publisher",
    file: "components/publisher/dispute-wizard.tsx",
    purpose: "Publisher dispute creation multi-step flow.",
    surfaces: ["publisher/dispute-wizard"]
  },
  {
    name: "DisputeResolution",
    group: "publisher",
    file: "components/publisher/dispute-resolution.tsx",
    purpose: "Publisher dispute tracking and message review.",
    surfaces: ["publisher/disputes"]
  },
  {
    name: "MyPrograms",
    group: "publisher",
    file: "components/publisher/my-programs.tsx",
    purpose: "Publisher enrolled programs list and actions.",
    surfaces: ["publisher/my-programs"]
  },
  {
    name: "EnrolledProgramDetail",
    group: "publisher",
    file: "components/publisher/enrolled-program-detail.tsx",
    purpose: "Publisher enrolled program detail and associated commissions.",
    surfaces: ["publisher/enrolled-program-detail"]
  },
  {
    name: "DiscoverPrograms",
    group: "publisher",
    file: "components/publisher/discover-programs.tsx",
    purpose: "Program discovery grid and browsing.",
    surfaces: ["publisher/discover"]
  },
  {
    name: "ProgramDetail",
    group: "publisher",
    file: "components/publisher/program-detail.tsx",
    purpose: "Publisher-facing program detail and terms.",
    surfaces: ["publisher/program-detail"]
  },
  {
    name: "ProgramJoinConfirmation",
    group: "publisher",
    file: "components/publisher/program-join-confirmation.tsx",
    purpose: "Join confirmation state after applying to a program.",
    surfaces: ["publisher/program-joined"]
  },
  {
    name: "PublisherShell",
    group: "publisher",
    file: "components/publisher/publisher-shell.tsx",
    purpose: "Publisher navigation and screen orchestration.",
    surfaces: ["publisher"]
  },
  {
    name: "AllProgramsGrid",
    group: "brand",
    file: "components/brand/all-programs-grid.tsx",
    purpose: "Brand all-programs overview cards.",
    surfaces: ["brand/all-programs"]
  },
  {
    name: "BrandProgramDetail",
    group: "brand",
    file: "components/brand/brand-program-detail.tsx",
    purpose: "Brand program detail with trust and terms.",
    surfaces: ["brand/program-detail"]
  },
  {
    name: "CommissionQueue",
    group: "brand",
    file: "components/brand/commission-queue.tsx",
    purpose: "Brand commission review queue and actions.",
    surfaces: ["brand/queue"]
  },
  {
    name: "CommissionDetailBrand",
    group: "brand",
    file: "components/brand/commission-detail-brand.tsx",
    purpose: "Brand commission detail context and decisions.",
    surfaces: ["brand/detail"]
  },
  {
    name: "DisputeInbox",
    group: "brand",
    file: "components/brand/dispute-inbox.tsx",
    purpose: "Brand dispute list and triage.",
    surfaces: ["brand/disputes"]
  },
  {
    name: "PublishersList",
    group: "brand",
    file: "components/brand/publishers-list.tsx",
    purpose: "Brand publisher relationship list.",
    surfaces: ["brand/publishers"]
  },
  {
    name: "CreateProgram",
    group: "brand",
    file: "components/brand/create-program.tsx",
    purpose: "Brand create-program workflow with draft and publish.",
    surfaces: ["brand/create-program"]
  },
  {
    name: "BrandShell",
    group: "brand",
    file: "components/brand/brand-shell.tsx",
    purpose: "Brand navigation and screen orchestration.",
    surfaces: ["brand"]
  },
  {
    name: "Button",
    group: "ui",
    file: "components/ui/button.tsx",
    purpose: "Core call-to-action button variants.",
    surfaces: ["global-ui"]
  },
  {
    name: "Badge",
    group: "ui",
    file: "components/ui/badge.tsx",
    purpose: "Metadata chips and tags.",
    surfaces: ["global-ui"]
  },
  {
    name: "Card",
    group: "ui",
    file: "components/ui/card.tsx",
    purpose: "Primary surface container for content blocks.",
    surfaces: ["global-ui"]
  },
  {
    name: "Input",
    group: "ui",
    file: "components/ui/input.tsx",
    purpose: "Single-line text input.",
    surfaces: ["global-ui"]
  },
  {
    name: "Textarea",
    group: "ui",
    file: "components/ui/textarea.tsx",
    purpose: "Multi-line text input.",
    surfaces: ["global-ui"]
  },
  {
    name: "Select",
    group: "ui",
    file: "components/ui/select.tsx",
    purpose: "Dropdown selector wrapper.",
    surfaces: ["global-ui"]
  },
  {
    name: "Checkbox",
    group: "ui",
    file: "components/ui/checkbox.tsx",
    purpose: "Boolean toggle control.",
    surfaces: ["global-ui"]
  },
  {
    name: "Separator",
    group: "ui",
    file: "components/ui/separator.tsx",
    purpose: "Rule separator between sections.",
    surfaces: ["global-ui"]
  },
  {
    name: "Table",
    group: "ui",
    file: "components/ui/table.tsx",
    purpose: "Reusable table primitives.",
    surfaces: ["global-ui"]
  },
  {
    name: "Dialog",
    group: "ui",
    file: "components/ui/dialog.tsx",
    purpose: "Modal container primitives.",
    surfaces: ["global-ui"]
  },
  {
    name: "Label",
    group: "ui",
    file: "components/ui/label.tsx",
    purpose: "Field label primitive.",
    surfaces: ["global-ui"]
  },
  {
    name: "Tabs",
    group: "ui",
    file: "components/ui/tabs.tsx",
    purpose: "Tabbed navigation primitives.",
    surfaces: ["global-ui"]
  }
];

export interface PastWorkItem {
  id: string;
  company: string;
  role: string;
  time: string;
  focus: string;
  lead: string;
  detail: string;
}

export interface SelectedWorkItem {
  id: string;
  title: string;
  company: string;
  description: string;
  tags: string[];
  status: string;
  href?: string;
}

export const intro =
  "I design data-heavy products, analytical workflows, and systems for software teams. My work sits close to the material of software: product logic, data structures, components, prototypes, implementation constraints, and the messy middle between an idea and something shipped. Currently at Statista, I am working on AI-assisted survey workflows and a redesigned statistics experience across a large publishing platform.";

export const pastWork: PastWorkItem[] = [
  {
    id: "statista",
    company: "Statista",
    role: "Senior Product Designer",
    time: "2025 — Present",
    focus:
      "AI-assisted survey workflows, statistics platform, analytical interfaces",
    lead:
      "Currently working on AI-assisted survey products and a redesigned statistics experience across a large publishing platform.",
    detail:
      "The work involves dense data, crosstabs, charts, regions, survey waves, researcher workflows, and implementation constraints.",
  },
  {
    id: "event-inc",
    company: "Event Inc",
    role: "Product Designer",
    time: "2024 — 2025",
    focus: "Request flows, funnel improvements, component library",
    lead: "Worked on request and purchase flows for event planning.",
    detail:
      "Focused on reducing friction in the user journey and building a component library to make product work faster and more consistent.",
  },
  {
    id: "container-xchange",
    company: "Container xChange",
    role: "Senior Product Designer",
    time: "2022 — 2024",
    focus: "Financial workflows, logistics tools, design systems",
    lead:
      "Designed B2B tools for logistics teams working with leasing, payments, disputes, invoicing, and operational finance.",
    detail:
      "Redesigned invoice and payment workflows, contributing to improved collections and fewer invoicing disputes. Co-built a cross-product design system used across six products.",
  },
  {
    id: "kinvent",
    company: "KINVENT",
    role: "UX/UI Designer",
    time: "2022 — 2024",
    focus: "Clinical software, sensor data, hardware integration",
    lead:
      "Designed interfaces for physiotherapists working with motion and force data from connected hardware sensors.",
    detail:
      "Focused on making clinical progress easier to understand through clear workflows and data visualization.",
  },
  {
    id: "cgworks",
    company: "CGWorks",
    role: "UX/UI Designer",
    time: "2020 — 2022",
    focus: "B2B products, event experiences, 3D visualization tools",
    lead: "Designed digital products and event experiences for B2B clients.",
    detail:
      "Worked across usability testing, interface design, and a 3D online visualization tool.",
  },
];

export const selectedWork: SelectedWorkItem[] = [
  {
    id: "ai-survey-workflows",
    title: "AI-assisted survey workflows",
    company: "Statista",
    description:
      "Designing how analysts and marketing users explore survey data through an AI-assisted product experience.",
    tags: [
      "AI workflows",
      "Survey data",
      "Analytical interfaces",
      "Product logic",
      "Coded prototypes",
    ],
    status: "Case study coming soon",
  },
  {
    id: "invoice-management",
    title: "Invoice Management Redesign",
    company: "Container xChange",
    description:
      "Redesigned invoicing and payment workflows for logistics teams handling disputes, outstanding payments, and operational finance work. The work contributed to a 24% increase in payment collections and a 45% reduction in invoicing disputes.",
    tags: [
      "Financial workflows",
      "B2B SaaS",
      "Operational tools",
      "Workflow design",
    ],
    status: "Case study coming soon",
  },
  {
    id: "compass-design-system",
    title: "Compass Design System",
    company: "Container xChange",
    description:
      "Co-built a cross-product design system across six products, including shared components, documentation, design tokens, and implementation guidelines.",
    tags: [
      "Design systems",
      "Components",
      "Design tokens",
      "Documentation",
      "Design-development workflow",
    ],
    status: "Case study coming soon",
  },
  {
    id: "event-request-flow",
    title: "Event Request Flow",
    company: "Event Inc",
    description:
      "Redesigned the request and offer journey for event planning, helping users describe their needs and compare provider responses.",
    tags: [
      "Marketplace workflows",
      "Form design",
      "Funnel improvement",
      "Component library",
    ],
    status: "Case study coming soon",
  },
  {
    id: "kinvent-progress",
    title: "KINVENT Progress Tracking",
    company: "KINVENT",
    description:
      "Designed interfaces for physiotherapists working with real-time motion and force data from connected hardware sensors.",
    tags: [
      "Clinical software",
      "Sensor data",
      "Data visualization",
      "Hardware-software interaction",
    ],
    status: "Case study coming soon",
  },
];

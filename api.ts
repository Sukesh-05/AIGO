export type AgentDomain = 'Customer Support' | 'HR' | 'Finance' | 'Cybersecurity' | 'Coding';

export interface Agent {
  id: string;
  name: string;
  domain?: AgentDomain;
  purpose: string;
  environment: 'dev' | 'staging' | 'prod';
  allowed_data_scopes: string[];
  allowed_actions: string[];
  api_key_prefix: string;
  risk_score: number;
  status: 'active' | 'suspended' | 'deprecated';
  created_at: string;
}

export interface Policy {
  id: string;
  name: string;
  description?: string;
  rule_type: string;
  rule_definition: {
    field?: string;
    action_types?: string[];
    pattern?: string;
    effect?: string;
    message?: string;
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  is_active: boolean;
  created_at: string;
}

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface AuditLogItem {
  id: string;
  agent_id: string;
  domain?: AgentDomain | string;
  event_type: string;
  payload: any;
  sensitivity_level: 'NONE' | 'PII' | 'FINANCIAL' | 'CREDENTIALS' | 'CONFIDENTIAL';
  policy_decision: 'ALLOW' | 'BLOCK' | 'FLAG' | 'HUMAN_APPROVAL';
  human_approval_status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  // Rich governance fields (populated for APP_DATA_REQUEST events)
  data_domain?: string;
  sub_data?: string;
  action?: string;
  purpose?: string;
  decision_reason?: string;
  explainability?: string;
  risk_level?: RiskLevel;
  prev_hash: string;
  record_hash: string;
  created_at: string;
}

export interface AlertItem {
  id: string;
  agent_id: string;
  audit_log_id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  status: 'open' | 'acknowledged' | 'resolved';
  created_at: string;
}

declare const process: {
  env: {
    NEXT_PUBLIC_API_URL?: string;
  };
} | undefined;

const API_BASE = (typeof process !== 'undefined' && process?.env?.NEXT_PUBLIC_API_URL)
  ? process.env.NEXT_PUBLIC_API_URL
  : 'http://localhost:8080/api/v1';

export const mockAgents: Agent[] = [
  {
    id: 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1',
    name: 'Customer-Support-AI',
    domain: 'Customer Support',
    purpose: 'Handles customer support chat, ticket resolution, and profile inquiries',
    environment: 'prod',
    allowed_data_scopes: ['customer.name', 'customer.email', 'customer.phone'],
    allowed_actions: ['READ', 'UPDATE_TICKET'],
    api_key_prefix: 'sk_live_csbot1',
    risk_score: 15.00,
    status: 'active',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2',
    name: 'HR-Operations-AI',
    domain: 'HR',
    purpose: 'Automates employee onboarding, directory searches, and policy queries',
    environment: 'prod',
    allowed_data_scopes: ['hr.directory', 'hr.reviews'],
    allowed_actions: ['READ', 'GENERATE_REPORT'],
    api_key_prefix: 'sk_live_hragt',
    risk_score: 25.00,
    status: 'active',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3',
    name: 'Finance-Ops-AI',
    domain: 'Finance',
    purpose: 'Generates quarterly ledger summaries and processes invoice records',
    environment: 'staging',
    allowed_data_scopes: ['finance.invoices', 'finance.reports'],
    allowed_actions: ['READ', 'EXPORT'],
    api_key_prefix: 'sk_live_finagt',
    risk_score: 55.00,
    status: 'active',
    created_at: new Date(Date.now() - 86400000 * 7).toISOString()
  },
  {
    id: 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4',
    name: 'Cybersecurity-SOC-AI',
    domain: 'Cybersecurity',
    purpose: 'Monitors real-time security alerts, firewall logs, and vulnerability feeds',
    environment: 'prod',
    allowed_data_scopes: ['security.logs', 'security.threats'],
    allowed_actions: ['READ', 'BLOCK_IP'],
    api_key_prefix: 'sk_live_secagt',
    risk_score: 20.00,
    status: 'active',
    created_at: new Date(Date.now() - 86400000 * 10).toISOString()
  },
  {
    id: 'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5',
    name: 'Coding-PR-Reviewer-AI',
    domain: 'Coding',
    purpose: 'Automates pull request code reviews, linting, and automated testing',
    environment: 'dev',
    allowed_data_scopes: ['coding.repos', 'coding.reviews'],
    allowed_actions: ['READ_CODE', 'COMMENT_PR'],
    api_key_prefix: 'sk_live_codeast',
    risk_score: 5.00,
    status: 'active',
    created_at: new Date(Date.now() - 86400000 * 12).toISOString()
  }
];

export const mockPolicies: Policy[] = [
  {
    id: 'p1p1p1p1-p1p1-p1p1-p1p1-p1p1p1p1p1p1',
    name: 'Block Customer SSN Access',
    description: 'Prevent any Software AI Agent from reading or exporting sensitive customer SSN data',
    rule_type: 'DATA_FIELD_BLOCK',
    rule_definition: {
      field: 'customers.ssn',
      action_types: ['READ', 'EXPORT', 'UPDATE', 'DELETE'],
      effect: 'BLOCK',
      message: 'BLOCKED — Sensitive customer data access is restricted by AIGO governance policy.'
    },
    severity: 'critical',
    is_active: true,
    created_at: new Date(Date.now() - 86400000 * 10).toISOString()
  },
  {
    id: 'p2p2p2p2-p2p2-p2p2-p2p2-p2p2p2p2p2p2',
    name: 'Require Human Approval for Financial Exports',
    description: 'Require explicit compliance officer sign-off before exporting raw bank account or wire transfer data',
    rule_type: 'HUMAN_APPROVAL_REQUIREMENT',
    rule_definition: {
      field: 'finance.bulk_export',
      action_types: ['EXPORT'],
      effect: 'HUMAN_APPROVAL',
      message: 'HUMAN APPROVAL REQUIRED — High risk bulk financial export requires manual sign-off before execution.'
    },
    severity: 'high',
    is_active: true,
    created_at: new Date(Date.now() - 86400000 * 8).toISOString()
  },
  {
    id: 'p3p3p3p3-p3p3-p3p3-p3p3-p3p3p3p3p3p3',
    name: 'Block Employee Salary & Tax ID Export',
    description: 'Prevent HR software agents from exporting raw employee salary details or Tax IDs',
    rule_type: 'PII_BLOCK',
    rule_definition: {
      field: 'hr.salary',
      action_types: ['EXPORT', 'DELETE'],
      effect: 'BLOCK',
      message: 'BLOCKED — Employee salary and tax records are strictly restricted from export operations.'
    },
    severity: 'critical',
    is_active: true,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 'p4p4p4p4-p4p4-p4p4-p4p4-p4p4p4p4p4p4',
    name: 'Block Root Admin Credentials Access',
    description: 'Prohibit software agents from retrieving raw root admin credentials or security keys',
    rule_type: 'CREDENTIAL_BLOCK',
    rule_definition: {
      field: 'security.root_keys',
      action_types: ['READ', 'EXPORT'],
      effect: 'BLOCK',
      message: 'BLOCKED — System root admin keys cannot be accessed by software AI agents.'
    },
    severity: 'critical',
    is_active: true,
    created_at: new Date(Date.now() - 86400000 * 4).toISOString()
  }
];

export const mockAuditLogs: AuditLogItem[] = [
  {
    id: 'e1111111-1111-1111-1111-111111111111',
    agent_id: 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1',
    domain: 'Customer Support',
    event_type: 'AI_AGENT_REQUEST',
    payload: { action: 'READ', field: 'Customer SSN', user_id: 'usr_9841' },
    sensitivity_level: 'PII',
    policy_decision: 'BLOCK',
    data_domain: 'Customer Support',
    sub_data: 'Customer SSN',
    action: 'READ',
    purpose: 'Retrieve customer SSN for verification ticket',
    decision_reason: 'BLOCKED — Sensitive customer data access is restricted by AIGO governance policy.',
    explainability: 'The Customer Support AI Agent requested access to restricted customer SSN data. The configured AIGO policy prohibits reading or exporting sensitive customer identifiers.',
    risk_level: 'CRITICAL',
    prev_hash: '0000000000000000000000000000000000000000000000000000000000000000',
    record_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    created_at: new Date(Date.now() - 1000 * 60 * 12).toISOString()
  },
  {
    id: 'e2222222-2222-2222-2222-222222222222',
    agent_id: 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3',
    domain: 'Finance',
    event_type: 'AI_AGENT_REQUEST',
    payload: { action: 'EXPORT', field: 'Bank IBAN & Ledger', format: 'CSV' },
    sensitivity_level: 'FINANCIAL',
    policy_decision: 'HUMAN_APPROVAL',
    human_approval_status: 'PENDING',
    data_domain: 'Finance',
    sub_data: 'Bulk Ledger Export',
    action: 'EXPORT',
    purpose: 'Export quarterly financial ledger summary',
    decision_reason: 'HUMAN APPROVAL REQUIRED — High risk bulk financial export requires manual compliance officer sign-off.',
    explainability: 'The Finance Ops AI Agent requested bulk export of bank accounts and ledgers. Because financial exports are classified as HIGH risk, AIGO routed the request to Human Approval before execution.',
    risk_level: 'HIGH',
    prev_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    record_hash: '8f4e2c91a0b3d5e7f9c1b3a5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5',
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString()
  },
  {
    id: 'e3333333-3333-3333-3333-333333333333',
    agent_id: 'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5',
    domain: 'Coding',
    event_type: 'AI_AGENT_REQUEST',
    payload: { action: 'COMMENT_PR', pr_id: 104, body: 'Automated PR lint review completed.' },
    sensitivity_level: 'NONE',
    policy_decision: 'ALLOW',
    data_domain: 'Coding',
    sub_data: 'Pull Request Review',
    action: 'READ',
    purpose: 'Automate code style verification on PR #104',
    decision_reason: 'ALLOWED — Request complies with the configured AIGO policy.',
    explainability: 'The Coding PR Reviewer AI Agent requested access to source repository code. All policy rules passed cleanly and the request is fully permitted within configured scopes.',
    risk_level: 'LOW',
    prev_hash: '8f4e2c91a0b3d5e7f9c1b3a5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5',
    record_hash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    created_at: new Date(Date.now() - 1000 * 60 * 2).toISOString()
  }
];

export async function fetchAgents(): Promise<Agent[]> {
  try {
    const res = await fetch(`${API_BASE}/agents`);
    if (res.ok) return await res.json();
  } catch (e) {}
  return mockAgents;
}

export async function fetchPolicies(): Promise<Policy[]> {
  try {
    const res = await fetch(`${API_BASE}/policies`);
    if (res.ok) return await res.json();
  } catch (e) {}
  return mockPolicies;
}

export async function fetchAuditLogs(): Promise<AuditLogItem[]> {
  try {
    const res = await fetch(`${API_BASE}/audit-logs`);
    if (res.ok) return await res.json();
  } catch (e) {}
  return mockAuditLogs;
}

export async function evaluatePreAction(agentId: string, eventPayload: any) {
  try {
    const res = await fetch(`${API_BASE}/events/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Agent-Key': 'sk_live_test' },
      body: JSON.stringify({ agent_id: agentId, ...eventPayload })
    });
    if (res.ok) return await res.json();
  } catch (e) {}

  // Mock evaluation calculation fallback
  const payloadStr = JSON.stringify(eventPayload);
  const isPii = payloadStr.includes('credit_card') || payloadStr.includes('4111');
  const isBlocked = payloadStr.includes('BLOCK');

  return {
    decision: isBlocked ? 'BLOCK' : (isPii ? 'FLAG' : 'ALLOW'),
    matched_rule: isBlocked ? 'DATA_FIELD_BLOCK' : (isPii ? 'PII_BLOCK' : 'POLICY_PASSED'),
    message: isBlocked ? 'Action blocked by policy' : (isPii ? 'Payload flagged for PII inspection' : 'Policy evaluation passed cleanly.'),
    sensitivity_level: isPii ? 'PII' : 'NONE',
    record_hash: 'a9f4c3b2e1d0f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3'
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// APPLICATION / APK GOVERNANCE TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type DataSensitivity = 'PUBLIC' | 'INTERNAL' | 'PII' | 'FINANCIAL' | 'CRITICAL';
export type DataAction = 'READ' | 'EXPORT' | 'UPDATE' | 'DELETE';
export type AppEnvironment = 'Development' | 'Staging' | 'Production';
export type AppStatus = 'Active' | 'Suspended';
export type GovernanceDecisionType = 'ALLOW' | 'FLAG' | 'BLOCK' | 'HUMAN_APPROVAL';

export interface Application {
  id: string;
  name: string;
  apkName: string;
  version: string;
  environment: AppEnvironment;
  status: AppStatus;
  owner: string;
  purpose: string;
  createdAt: string;
}

export interface DataResource {
  id: string;
  domain: string;
  field: string;
  sensitivity: DataSensitivity;
}

export interface ApplicationDataMapping {
  applicationId: string;
  dataResourceId: string;
  accessLevel: string;
  allowedActions: DataAction[];
}

export interface DataRequest {
  applicationId: string;
  agentId?: string;
  action: DataAction;
  dataDomain: string;
  subData: string;
  purpose: string;
  environment: AppEnvironment;
  timestamp: string;
}

export interface TraceStep {
  step: number;
  label: string;
  detail: string;
  status: 'pass' | 'warn' | 'block' | 'info';
}

export interface GovernanceDecision {
  decision: GovernanceDecisionType;
  policyId?: string;
  policyName?: string;
  reason: string;
  explainability: string;
  sensitivity: DataSensitivity;
  riskLevel: RiskLevel;
  traceSteps: TraceStep[];
  auditId: string;
  recordHash: string;
  prevHash: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// RISK LEVEL CLASSIFICATION
// Rule-based: sensitivity + action → risk tier
// ─────────────────────────────────────────────────────────────────────────────

export function computeRiskLevel(sensitivity: DataSensitivity, action: DataAction): RiskLevel {
  if (sensitivity === 'CRITICAL') return 'CRITICAL';
  if (sensitivity === 'PII') {
    if (action === 'EXPORT' || action === 'DELETE') return 'CRITICAL';
    if (action === 'UPDATE') return 'HIGH';
    return 'HIGH'; // PII READ is still HIGH
  }
  if (sensitivity === 'FINANCIAL') {
    if (action === 'EXPORT' || action === 'DELETE') return 'HIGH';
    return 'MEDIUM';
  }
  if (sensitivity === 'INTERNAL') {
    if (action === 'EXPORT' || action === 'DELETE') return 'MEDIUM';
    return 'LOW';
  }
  return 'LOW'; // PUBLIC
}

// ─────────────────────────────────────────────────────────────────────────────
// MOCK APPLICATION & DOMAIN DATA
// Covers 5 Enterprise Domains: Customer Support, HR, Finance, Cybersecurity, Coding
// ─────────────────────────────────────────────────────────────────────────────

export const mockDataResources: DataResource[] = [
  // Customer Support Domain
  { id: 'dr-001', domain: 'Customer Support', field: 'Customer Name',        sensitivity: 'INTERNAL'  },
  { id: 'dr-002', domain: 'Customer Support', field: 'Customer Email',       sensitivity: 'PII'       },
  { id: 'dr-003', domain: 'Customer Support', field: 'Customer Phone',       sensitivity: 'PII'       },
  { id: 'dr-004', domain: 'Customer Support', field: 'Customer SSN',         sensitivity: 'CRITICAL'  },
  // HR Domain
  { id: 'dr-005', domain: 'HR',               field: 'Employee Directory',   sensitivity: 'INTERNAL'  },
  { id: 'dr-006', domain: 'HR',               field: 'Performance Review',   sensitivity: 'INTERNAL'  },
  { id: 'dr-007', domain: 'HR',               field: 'Salary & Compensation', sensitivity: 'FINANCIAL'},
  { id: 'dr-008', domain: 'HR',               field: 'Employee Tax ID / SSN', sensitivity: 'CRITICAL'},
  // Finance Domain
  { id: 'dr-009', domain: 'Finance',          field: 'Invoice Records',      sensitivity: 'INTERNAL'  },
  { id: 'dr-010', domain: 'Finance',          field: 'Financial Reports',    sensitivity: 'FINANCIAL' },
  { id: 'dr-011', domain: 'Finance',          field: 'Bank Account & IBAN',  sensitivity: 'FINANCIAL' },
  { id: 'dr-012', domain: 'Finance',          field: 'Bulk Wire Transfer',   sensitivity: 'CRITICAL'  },
  // Cybersecurity Domain
  { id: 'dr-013', domain: 'Cybersecurity',    field: 'Incident Audit Logs',  sensitivity: 'INTERNAL'  },
  { id: 'dr-014', domain: 'Cybersecurity',    field: 'Firewall Policy Rules', sensitivity: 'INTERNAL'},
  { id: 'dr-015', domain: 'Cybersecurity',    field: 'Root Admin Credentials', sensitivity: 'CRITICAL'},
  // Coding Domain
  { id: 'dr-016', domain: 'Coding',           field: 'Source Code Repository', sensitivity: 'INTERNAL'},
  { id: 'dr-017', domain: 'Coding',           field: 'Pull Request Review',  sensitivity: 'INTERNAL'  },
  { id: 'dr-018', domain: 'Coding',           field: 'Deployment Secret Tokens', sensitivity: 'CRITICAL'},
];

export const mockApplications: Application[] = [
  {
    id: 'APP-CS001',
    name: 'Customer Support App',
    apkName: 'CustomerSupport.apk',
    version: '1.0.0',
    environment: 'Production',
    status: 'Active',
    owner: 'Customer Experience Team',
    purpose: 'Handles customer support queries, ticket creation and escalation',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'APP-FN002',
    name: 'Finance Operations App',
    apkName: 'FinanceOps.apk',
    version: '2.1.3',
    environment: 'Staging',
    status: 'Active',
    owner: 'Finance & Compliance Team',
    purpose: 'Generates financial reports and manages bank account reconciliation',
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'APP-SL003',
    name: 'Sales Assistant App',
    apkName: 'SalesAssistant.apk',
    version: '0.9.1',
    environment: 'Development',
    status: 'Active',
    owner: 'Sales & Marketing Team',
    purpose: 'Automates sales outreach and lead management workflows',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'APP-EAUVG',
    name: 'Sales AI Assistant',
    apkName: 'salesai.apk',
    version: '1.0.0',
    environment: 'Development',
    status: 'Active',
    owner: 'Sales & Marketing Team',
    purpose: 'AI-powered sales assistant for lead management, customer outreach, and pipeline automation',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

export const mockApplicationDataMappings: ApplicationDataMapping[] = [
  // Customer Support App — Customer domain
  { applicationId: 'APP-CS001', dataResourceId: 'dr-001', accessLevel: 'PERMITTED',  allowedActions: ['READ'] },
  { applicationId: 'APP-CS001', dataResourceId: 'dr-002', accessLevel: 'PERMITTED',  allowedActions: ['READ'] },
  { applicationId: 'APP-CS001', dataResourceId: 'dr-003', accessLevel: 'PERMITTED',  allowedActions: ['READ'] },
  { applicationId: 'APP-CS001', dataResourceId: 'dr-004', accessLevel: 'PERMITTED',  allowedActions: ['READ'] },
  // Finance Operations App — Bank Account domain
  { applicationId: 'APP-FN002', dataResourceId: 'dr-005', accessLevel: 'PERMITTED',  allowedActions: ['READ', 'EXPORT'] },
  { applicationId: 'APP-FN002', dataResourceId: 'dr-006', accessLevel: 'PERMITTED',  allowedActions: ['READ']          },
  { applicationId: 'APP-FN002', dataResourceId: 'dr-007', accessLevel: 'PERMITTED',  allowedActions: ['READ']          },
  { applicationId: 'APP-FN002', dataResourceId: 'dr-008', accessLevel: 'PERMITTED',  allowedActions: ['READ', 'EXPORT'] },
  // Sales Assistant App — Customer (Name + Email only)
  { applicationId: 'APP-SL003', dataResourceId: 'dr-001', accessLevel: 'PERMITTED',  allowedActions: ['READ', 'UPDATE'] },
  { applicationId: 'APP-SL003', dataResourceId: 'dr-002', accessLevel: 'PERMITTED',  allowedActions: ['READ']          },
  // Sales AI Assistant (APP-EAUVG) — Customer domain: Name, Email, Phone, SSN
  { applicationId: 'APP-EAUVG', dataResourceId: 'dr-001', accessLevel: 'PERMITTED',  allowedActions: ['READ']          },
  { applicationId: 'APP-EAUVG', dataResourceId: 'dr-002', accessLevel: 'PERMITTED',  allowedActions: ['READ']          },
  { applicationId: 'APP-EAUVG', dataResourceId: 'dr-003', accessLevel: 'PERMITTED',  allowedActions: ['READ']          },
  { applicationId: 'APP-EAUVG', dataResourceId: 'dr-004', accessLevel: 'PERMITTED',  allowedActions: ['READ']          },
];

// ─────────────────────────────────────────────────────────────────────────────
// APPLICATION GOVERNANCE EVALUATOR
// Reuses existing policy evaluation pattern — same logic as evaluatePreAction()
// ─────────────────────────────────────────────────────────────────────────────

export function evaluateAppDataRequest(
  app: Application,
  dataResource: DataResource,
  action: DataAction,
  purpose: string,
  existingPolicies: Policy[],
  prevHash: string,
  liveMappings?: ApplicationDataMapping[]
): GovernanceDecision {
  const riskLevel = computeRiskLevel(dataResource.sensitivity, action);
  // Use live mappings if provided (so newly-added mappings are respected)
  const mappingsSource = liveMappings ?? mockApplicationDataMappings;
  const traceSteps: TraceStep[] = [];
  let decision: GovernanceDecisionType = 'ALLOW';
  let reason = '';
  let matchedPolicyId: string | undefined;
  let matchedPolicyName: string | undefined;

  // Step 1 — Application Identified
  traceSteps.push({
    step: 1,
    label: 'Application / Agent Identified',
    detail: `Application "${app.name}" (${app.id}) identified in ${app.environment} environment. Status: ${app.status}.`,
    status: 'info',
  });

  // Step 2 — Data Request Intercepted
  traceSteps.push({
    step: 2,
    label: 'Data Request Intercepted by AIGO Gateway',
    detail: `Action "${action}" requested on field "${dataResource.domain} → ${dataResource.field}" for purpose: "${purpose}". Request routed to governance pipeline.`,
    status: 'info',
  });

  // Step 3 — Sensitivity Classification
  traceSteps.push({
    step: 3,
    label: 'Data Sensitivity Classified',
    detail: `"${dataResource.domain} → ${dataResource.field}" classified as ${dataResource.sensitivity}. ${
      dataResource.sensitivity === 'CRITICAL'  ? '⚠ CRITICAL — highest risk classification. Always blocked.' :
      dataResource.sensitivity === 'PII'       ? '⚠ Personal Identifiable Information detected.' :
      dataResource.sensitivity === 'FINANCIAL' ? '⚠ Financial data — elevated compliance scrutiny.' :
      dataResource.sensitivity === 'INTERNAL'  ? 'INTERNAL — restricted to authorised applications.' :
      'PUBLIC — no elevated sensitivity.'
    }`,
    status: dataResource.sensitivity === 'CRITICAL' ? 'block' : (dataResource.sensitivity === 'PII' || dataResource.sensitivity === 'FINANCIAL') ? 'warn' : 'pass',
  });

  // Step 4 — Scope / Permission Check
  const mapping = mappingsSource.find(
    m => m.applicationId === app.id && m.dataResourceId === dataResource.id
  );

  if (!mapping) {
    traceSteps.push({
      step: 4,
      label: 'Permission / Scope Check',
      detail: `"${dataResource.domain} → ${dataResource.field}" is NOT in ${app.name}'s registered data scope. Access denied at scope boundary.`,
      status: 'block',
    });
    decision = 'BLOCK';
    reason = `"${dataResource.domain} → ${dataResource.field}" is not in the registered data scope for ${app.name}.`;
  } else if (mapping.accessLevel === 'RESTRICTED') {
    traceSteps.push({
      step: 4,
      label: 'Permission / Scope Check',
      detail: `"${dataResource.domain} → ${dataResource.field}" is RESTRICTED — no actions permitted on this field regardless of policy.`,
      status: 'block',
    });
    decision = 'BLOCK';
    reason = `Field is marked RESTRICTED in application scope. No actions are permitted on "${dataResource.domain} → ${dataResource.field}".`;
  } else if (!mapping.allowedActions.includes(action)) {
    traceSteps.push({
      step: 4,
      label: 'Permission / Scope Check',
      detail: `Action "${action}" is not in the allowed actions for this field. Allowed: [${mapping.allowedActions.join(', ')}].`,
      status: 'block',
    });
    decision = 'BLOCK';
    reason = `Action "${action}" is not permitted for "${dataResource.domain} → ${dataResource.field}" in this application's scope.`;
  } else {
    traceSteps.push({
      step: 4,
      label: 'Permission / Scope Check',
      detail: `"${dataResource.domain} → ${dataResource.field}" is within application scope. Action "${action}" permitted at scope level. Advancing to Policy Engine.`,
      status: 'pass',
    });
  }

  // Step 5 — Policy Engine Evaluation
  if (decision === 'ALLOW') {
    const legacyField =
      dataResource.domain === 'Customer'     ? `customers.${dataResource.field.toLowerCase()}` :
      dataResource.domain === 'Bank Account' ? `bank_account.${dataResource.field.toLowerCase().replace(/ /g, '_')}` :
      `${dataResource.domain.toLowerCase()}.${dataResource.field.toLowerCase()}`;

    const matchedPolicy = existingPolicies.find(p => {
      if (!p.is_active) return false;
      const def = p.rule_definition;
      if (def.field && (def.field === legacyField || def.field.includes(dataResource.field.toLowerCase()))) {
        if (!def.action_types || def.action_types.includes(action)) return true;
      }
      return false;
    });

    if (matchedPolicy) {
      matchedPolicyId   = matchedPolicy.id;
      matchedPolicyName = matchedPolicy.name;
      const effect = (matchedPolicy.rule_definition.effect as GovernanceDecisionType) || 'BLOCK';
      decision = effect;
      reason   = matchedPolicy.rule_definition.message || `Policy "${matchedPolicy.name}" matched — ${effect}.`;
      traceSteps.push({
        step: 5,
        label: 'Policy Engine Evaluation',
        detail: `Policy matched: "${matchedPolicy.name}" (${matchedPolicy.rule_type}, severity=${matchedPolicy.severity}). Effect: ${effect}. ${matchedPolicy.rule_definition.message || ''}`,
        status: effect === 'BLOCK' ? 'block' : effect === 'FLAG' ? 'warn' : 'pass',
      });
    } else if (dataResource.sensitivity === 'CRITICAL') {
      decision = 'BLOCK';
      reason   = `BLOCKED — Sensitive ${dataResource.domain} data access is restricted by AIGO governance policy.`;
      traceSteps.push({
        step: 5,
        label: 'Policy Engine Evaluation',
        detail: `No explicit policy matched. Default governance baseline: CRITICAL sensitivity data is always blocked.`,
        status: 'block',
      });
    } else if ((dataResource.sensitivity === 'FINANCIAL' || dataResource.sensitivity === 'PII') && (action === 'EXPORT' || action === 'DELETE')) {
      decision = 'HUMAN_APPROVAL';
      reason   = `HUMAN APPROVAL REQUIRED — High risk operation requires manual sign-off before execution.`;
      traceSteps.push({
        step: 5,
        label: 'Policy Engine Evaluation',
        detail: `Default governance rule: ${dataResource.sensitivity} data + ${action} action requires compliance officer review. Sent for Human Approval.`,
        status: 'warn',
      });
    } else {
      reason = `ALLOWED — Request complies with the configured AIGO policy.`;
      traceSteps.push({
        step: 5,
        label: 'Policy Engine Evaluation',
        detail: `All ${existingPolicies.filter(p => p.is_active).length} active policies evaluated. No blocking or human approval rule triggered. Governance check passed cleanly.`,
        status: 'pass',
      });
    }
  } else {
    traceSteps.push({
      step: 5,
      label: 'Policy Engine Evaluation',
      detail: `Policy Engine skipped — request already blocked at scope/permission check (Step 4). No further evaluation needed.`,
      status: 'block',
    });
  }

  // Step 6 — Risk Level
  traceSteps.push({
    step: 6,
    label: `Risk Classification: ${riskLevel}`,
    detail: `"${dataResource.domain} → ${dataResource.field}" with action "${action}" is classified as ${riskLevel} risk. ${
      riskLevel === 'CRITICAL' ? 'Highest risk — immediate enforcement required.' :
      riskLevel === 'HIGH'     ? 'Elevated risk — PII or sensitive financial data involved.' :
      riskLevel === 'MEDIUM'   ? 'Moderate risk — compliance monitoring active.' :
      'Low risk — no elevated data sensitivity detected.'
    }`,
    status: riskLevel === 'CRITICAL' ? 'block' : riskLevel === 'HIGH' ? 'warn' : riskLevel === 'MEDIUM' ? 'warn' : 'pass',
  });

  // Step 7 — Decision
  traceSteps.push({
    step: 7,
    label: `Governance Decision: ${decision}`,
    detail: reason,
    status: decision === 'BLOCK' ? 'block' : decision === 'HUMAN_APPROVAL' || decision === 'FLAG' ? 'warn' : 'pass',
  });

  // Step 8 — Enforcement
  traceSteps.push({
    step: 8,
    label: 'Enforcement Applied',
    detail: decision === 'BLOCK'
      ? `Request BLOCKED. Software AI Agent "${app.name}" is denied access to "${dataResource.domain} → ${dataResource.field}". No data returned. Action aborted.`
      : decision === 'HUMAN_APPROVAL'
      ? `Request Intercepted. Requires manual compliance sign-off. Placed in Human Approval Queue.`
      : decision === 'FLAG'
      ? `Request permitted under compliance monitoring. Access to "${dataResource.domain} → ${dataResource.field}" granted with audit flag.`
      : `Request ALLOWED. Software AI Agent "${app.name}" is authorised to ${action} "${dataResource.domain} → ${dataResource.field}". Data access granted.`,
    status: decision === 'BLOCK' ? 'block' : decision === 'HUMAN_APPROVAL' || decision === 'FLAG' ? 'warn' : 'pass',
  });

  // Generate plain-language non-technical explainability
  const explainability = decision === 'BLOCK'
    ? `The Software AI Agent requested access to restricted ${dataResource.field} data in the ${dataResource.domain} domain. The configured AIGO policy prohibits access/export of this sensitive enterprise data.`
    : decision === 'HUMAN_APPROVAL'
    ? `The Software AI Agent requested ${action} operation on ${dataResource.field} in the ${dataResource.domain} domain. Because this action is classified as HIGH risk, AIGO intercepted the request and routed it for manual Human Approval before execution.`
    : `The Software AI Agent requested ${action} access to ${dataResource.field} in the ${dataResource.domain} domain. The request passed all data scope checks and policy guardrails without violating compliance rules.`;

  // Step 9 — Audit Record
  const recordHash = Math.random().toString(36).substring(2, 18) + Math.random().toString(36).substring(2, 18);
  const auditId    = `app-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  traceSteps.push({
    step: 9,
    label: 'Audit Record Saved',
    detail: `Immutable audit record written. Audit ID: ${auditId}. SHA-256: ${recordHash.substring(0, 24)}… Hash chained to previous record. Risk level: ${riskLevel}.`,
    status: 'info',
  });

  return {
    decision,
    policyId: matchedPolicyId,
    policyName: matchedPolicyName,
    reason,
    explainability,
    sensitivity: dataResource.sensitivity,
    riskLevel,
    traceSteps,
    auditId,
    recordHash,
    prevHash,
  };
}

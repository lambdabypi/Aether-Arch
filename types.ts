
export interface FileContent {
  name: string;
  content: string;
  type: string;
}

export interface DebtItem {
  id: string;
  category: 'Complexity' | 'Coupling' | 'Redundancy' | 'Security';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  description: string;
  impact: string;
  location: string;
}

export interface RefactorProposal {
  title: string;
  description: string;
  benefits: string[];
  codeChanges: {
    file: string;
    before: string;
    after: string;
  }[];
}

export interface ComplianceIssue {
  control: string;
  status: 'Pass' | 'Fail' | 'Warning';
  finding: string;
  remediation: string;
}

export interface AnalysisResults {
  overallHealthScore: number;
  debtItems: DebtItem[];
  refactors: RefactorProposal[];
  compliance: ComplianceIssue[];
  sandboxLogs: string[];
}

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: any;
}

export type ViewType = 'server' | 'tools' | 'explorer' | 'debt' | 'refactor' | 'compliance' | 'sandbox' | 'logs' | 'ide';

export interface ProtocolLog {
  timestamp: string;
  type: 'request' | 'response' | 'error';
  method: string;
  payload: any;
}

export interface TargetedRefactor {
  file: string;
  health: number;
  proposal: RefactorProposal;
}

export interface BridgeState {
  connected: boolean;
  lastSync: string | null;
  error: string | null;
}

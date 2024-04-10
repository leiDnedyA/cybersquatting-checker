type DomainInfo = {
  domain: string;
  ipAddress: string;
  urlConstruction: string;
  category: string;
  logoDetected: boolean;
  detectedInSearch: boolean;
  riskLevel: 1 | 2 | 3;
};

type RiskStyle = {
  padding: string;
  borderRadius: string;
  display: string;
  color?: string;
  backgroundColor?: string;
}

export type { DomainInfo, RiskStyle }

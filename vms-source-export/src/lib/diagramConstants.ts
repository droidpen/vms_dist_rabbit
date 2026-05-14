// SVG diagrams as string constants to bypass Vite import caching issues
// Generated from src/imports/diagram-*.svg files

export const DIAGRAM_3_TIER = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
  <defs>
    <style>
      .title { font-family: Arial, sans-serif; font-size: 20px; font-weight: bold; fill: #1e40af; }
      .subtitle { font-family: Arial, sans-serif; font-size: 14px; fill: #475569; }
      .label { font-family: Arial, sans-serif; font-size: 13px; fill: #1e293b; font-weight: 600; }
      .text { font-family: Arial, sans-serif; font-size: 11px; fill: #475569; }
      .zone-label { font-family: Arial, sans-serif; font-size: 12px; fill: #64748b; font-weight: 600; }
      .cve-label { font-family: monospace; font-size: 10px; fill: #dc2626; font-weight: bold; }
    </style>
  </defs>

  <!-- Title -->
  <text x="400" y="30" text-anchor="middle" class="title">3-Tier Web Application Architecture</text>
  <text x="400" y="50" text-anchor="middle" class="subtitle">E-Government Payment Gateway (Internal Network)</text>

  <!-- External Zone -->
  <rect x="50" y="80" width="700" height="80" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="2" rx="8"/>
  <text x="70" y="100" class="zone-label">EXTERNAL ZONE</text>

  <!-- Citizens Box -->
  <rect x="200" y="110" width="120" height="40" fill="#fff" stroke="#94a3b8" stroke-width="2" rx="4"/>
  <text x="260" y="135" text-anchor="middle" class="label">Citizens</text>

  <!-- External Users Box -->
  <rect x="480" y="110" width="120" height="40" fill="#fff" stroke="#94a3b8" stroke-width="2" rx="4"/>
  <text x="540" y="135" text-anchor="middle" class="label">External Users</text>

  <!-- Perimeter -->
  <rect x="50" y="180" width="700" height="60" fill="#fed7aa" stroke="#fb923c" stroke-width="2" stroke-dasharray="5,5" rx="8"/>
  <text x="70" y="200" class="zone-label">PERIMETER (Firewall + IPS)</text>
  <text x="400" y="220" text-anchor="middle" class="text">Palo Alto Firewall • Network Security Controls</text>

  <!-- Internal Network -->
  <rect x="50" y="260" width="700" height="290" fill="#dbeafe" stroke="#3b82f6" stroke-width="3" rx="8"/>
  <text x="70" y="280" class="zone-label">INTERNAL NETWORK (CAM Access Only)</text>

  <!-- Presentation Tier -->
  <rect x="80" y="300" width="640" height="70" fill="#f0f9ff" stroke="#0284c7" stroke-width="2" rx="6"/>
  <text x="100" y="320" class="label">PRESENTATION LAYER (10.0.1.10)</text>
  <text x="100" y="340" class="text">• Web Server (React Frontend)</text>
  <text x="100" y="355" class="text">• User Interface • Payment Forms</text>

  <!-- Application Tier -->
  <rect x="80" y="385" width="640" height="70" fill="#fef3c7" stroke="#d97706" stroke-width="2" rx="6"/>
  <text x="100" y="405" class="label">APPLICATION LAYER (10.0.1.20)</text>
  <text x="100" y="425" class="text">• Payment Gateway API (Node.js/Express)</text>
  <text x="100" y="440" class="text">• Business Logic • Transaction Validation</text>

  <!-- CVE Label -->
  <rect x="600" y="395" width="110" height="20" fill="#fee2e2" stroke="#dc2626" stroke-width="1.5" rx="3"/>
  <text x="655" y="409" text-anchor="middle" class="cve-label">CVE-2024-3400</text>

  <!-- Data Tier -->
  <rect x="80" y="470" width="640" height="70" fill="#f3e8ff" stroke="#9333ea" stroke-width="2" rx="6"/>
  <text x="100" y="490" class="label">DATA LAYER (10.0.1.30)</text>
  <text x="100" y="510" class="text">• PostgreSQL 14.2 Database</text>
  <text x="100" y="525" class="text">• Transaction Records • Audit Logs • User Profiles</text>

  <!-- Arrows -->
  <line x1="260" y1="150" x2="260" y2="180" stroke="#64748b" stroke-width="2" marker-end="url(#arrowhead)"/>
  <line x1="540" y1="150" x2="540" y2="180" stroke="#64748b" stroke-width="2" marker-end="url(#arrowhead)"/>
  <line x1="400" y1="240" x2="400" y2="260" stroke="#64748b" stroke-width="2" marker-end="url(#arrowhead)"/>
  <line x1="400" y1="370" x2="400" y2="385" stroke="#64748b" stroke-width="2" marker-end="url(#arrowhead)"/>
  <line x1="400" y1="455" x2="400" y2="470" stroke="#64748b" stroke-width="2" marker-end="url(#arrowhead)"/>

  <!-- Arrow marker -->
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
      <polygon points="0 0, 10 5, 0 10" fill="#64748b"/>
    </marker>
  </defs>

  <!-- Footer -->
  <text x="400" y="575" text-anchor="middle" class="text">Attack Surface: API Gateway (CVE-2024-3400) • Compensating Controls: Network Segmentation, CAM-only Access, SIEM Monitoring</text>
</svg>
`;

export const DIAGRAM_MICROSERVICES = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 650">
  <defs>
    <style>
      .title { font-family: Arial, sans-serif; font-size: 20px; font-weight: bold; fill: #1e40af; }
      .subtitle { font-family: Arial, sans-serif; font-size: 14px; fill: #475569; }
      .label { font-family: Arial, sans-serif; font-size: 12px; fill: #1e293b; font-weight: 600; }
      .text { font-family: Arial, sans-serif; font-size: 10px; fill: #475569; }
      .zone-label { font-family: Arial, sans-serif; font-size: 12px; fill: #64748b; font-weight: 600; }
      .cve-label { font-family: monospace; font-size: 10px; fill: #dc2626; font-weight: bold; }
      .service-text { font-family: Arial, sans-serif; font-size: 10px; fill: #1e293b; }
    </style>
  </defs>

  <!-- Title -->
  <text x="450" y="30" text-anchor="middle" class="title">Microservices Architecture</text>
  <text x="450" y="50" text-anchor="middle" class="subtitle">National Identity Verification Platform (AWS Cloud)</text>

  <!-- Internet -->
  <rect x="50" y="80" width="800" height="60" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="2" rx="8"/>
  <text x="70" y="100" class="zone-label">INTERNET (Citizens, Partners, Mobile Apps)</text>

  <!-- AWS Perimeter -->
  <rect x="50" y="160" width="800" height="60" fill="#fed7aa" stroke="#fb923c" stroke-width="2" rx="8"/>
  <text x="70" y="180" class="zone-label">AWS PERIMETER</text>
  <text x="450" y="200" text-anchor="middle" class="text">AWS WAF + Application Load Balancer • DDoS Protection • Rate Limiting</text>

  <!-- API Gateway -->
  <rect x="250" y="240" width="400" height="50" fill="#fef3c7" stroke="#d97706" stroke-width="2" rx="6"/>
  <text x="450" y="260" text-anchor="middle" class="label">KONG API GATEWAY v2.8</text>
  <text x="450" y="275" text-anchor="middle" class="text">OAuth 2.0 • Request Routing • Rate Limiting</text>

  <!-- CVE Label on Gateway -->
  <rect x="680" y="248" width="110" height="18" fill="#fee2e2" stroke="#dc2626" stroke-width="1.5" rx="3"/>
  <text x="735" y="261" text-anchor="middle" class="cve-label">CVE-2023-44487</text>

  <!-- Kubernetes Cluster -->
  <rect x="50" y="310" width="800" height="260" fill="#dbeafe" stroke="#3b82f6" stroke-width="3" rx="8"/>
  <text x="70" y="330" class="zone-label">KUBERNETES CLUSTER (EKS) • Istio Service Mesh (mTLS)</text>

  <!-- Microservices Row 1 -->
  <g>
    <!-- Identity Service -->
    <rect x="80" y="350" width="140" height="80" fill="#f0f9ff" stroke="#0284c7" stroke-width="2" rx="4"/>
    <text x="150" y="368" text-anchor="middle" class="label">Identity Service</text>
    <text x="150" y="382" text-anchor="middle" class="service-text">Java/Spring Boot</text>
    <text x="150" y="395" text-anchor="middle" class="service-text">3 pods</text>
    <rect x="95" y="405" width="110" height="18" fill="#e0f2fe" stroke="#0284c7" stroke-width="1" rx="2"/>
    <text x="150" y="418" text-anchor="middle" class="service-text">PostgreSQL RDS</text>

    <!-- Document Service -->
    <rect x="240" y="350" width="140" height="80" fill="#f0f9ff" stroke="#0284c7" stroke-width="2" rx="4"/>
    <text x="310" y="368" text-anchor="middle" class="label">Document Service</text>
    <text x="310" y="382" text-anchor="middle" class="service-text">Python/FastAPI</text>
    <text x="310" y="395" text-anchor="middle" class="service-text">5 pods</text>
    <rect x="255" y="405" width="110" height="18" fill="#e0f2fe" stroke="#0284c7" stroke-width="1" rx="2"/>
    <text x="310" y="418" text-anchor="middle" class="service-text">MongoDB Atlas</text>

    <!-- Biometric Service -->
    <rect x="400" y="350" width="140" height="80" fill="#f0f9ff" stroke="#0284c7" stroke-width="2" rx="4"/>
    <text x="470" y="368" text-anchor="middle" class="label">Biometric Service</text>
    <text x="470" y="382" text-anchor="middle" class="service-text">Go</text>
    <text x="470" y="395" text-anchor="middle" class="service-text">4 pods</text>
    <rect x="415" y="405" width="110" height="18" fill="#e0f2fe" stroke="#0284c7" stroke-width="1" rx="2"/>
    <text x="470" y="418" text-anchor="middle" class="service-text">DynamoDB</text>

    <!-- Notification Service -->
    <rect x="560" y="350" width="140" height="80" fill="#f0f9ff" stroke="#0284c7" stroke-width="2" rx="4"/>
    <text x="630" y="368" text-anchor="middle" class="label">Notification Svc</text>
    <text x="630" y="382" text-anchor="middle" class="service-text">Node.js</text>
    <text x="630" y="395" text-anchor="middle" class="service-text">2 pods</text>
    <text x="630" y="418" text-anchor="middle" class="service-text">(Stateless)</text>

    <!-- Audit Service -->
    <rect x="720" y="350" width="120" height="80" fill="#f0f9ff" stroke="#0284c7" stroke-width="2" rx="4"/>
    <text x="780" y="368" text-anchor="middle" class="label">Audit Service</text>
    <text x="780" y="382" text-anchor="middle" class="service-text">Python</text>
    <text x="780" y="395" text-anchor="middle" class="service-text">2 pods</text>
    <rect x="735" y="405" width="90" height="18" fill="#e0f2fe" stroke="#0284c7" stroke-width="1" rx="2"/>
    <text x="780" y="418" text-anchor="middle" class="service-text">PostgreSQL</text>
  </g>

  <!-- Message Queue -->
  <rect x="320" y="450" width="260" height="45" fill="#fef3c7" stroke="#d97706" stroke-width="2" rx="4"/>
  <text x="450" y="468" text-anchor="middle" class="label">Amazon SQS (Message Queue)</text>
  <text x="450" y="485" text-anchor="middle" class="text">Event-driven async messaging</text>

  <!-- Shared Services -->
  <rect x="80" y="510" width="760" height="50" fill="#f3e8ff" stroke="#9333ea" stroke-width="2" rx="4"/>
  <text x="450" y="530" text-anchor="middle" class="text">Redis ElastiCache • AWS Secrets Manager • CloudWatch • Prometheus + Grafana</text>

  <!-- Arrows -->
  <line x1="450" y1="140" x2="450" y2="160" stroke="#64748b" stroke-width="2" marker-end="url(#arrowhead)"/>
  <line x1="450" y1="220" x2="450" y2="240" stroke="#64748b" stroke-width="2" marker-end="url(#arrowhead)"/>
  <line x1="450" y1="290" x2="450" y2="310" stroke="#64748b" stroke-width="2" marker-end="url(#arrowhead)"/>

  <!-- mTLS indicator -->
  <line x1="220" y1="390" x2="240" y2="390" stroke="#10b981" stroke-width="2" stroke-dasharray="3,3"/>
  <line x1="380" y1="390" x2="400" y2="390" stroke="#10b981" stroke-width="2" stroke-dasharray="3,3"/>
  <line x1="540" y1="390" x2="560" y2="390" stroke="#10b981" stroke-width="2" stroke-dasharray="3,3"/>
  <line x1="700" y1="390" x2="720" y2="390" stroke="#10b981" stroke-width="2" stroke-dasharray="3,3"/>
  <text x="450" y="440" text-anchor="middle" class="text" fill="#10b981">← Istio mTLS Encryption →</text>

  <!-- Arrow marker -->
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
      <polygon points="0 0, 10 5, 0 10" fill="#64748b"/>
    </marker>
  </defs>

  <!-- Footer -->
  <text x="450" y="595" text-anchor="middle" class="text">Attack Surface: Kong Gateway (CVE-2023-44487) • Compensating Controls: AWS WAF, Istio mTLS, Kubernetes Network Policies</text>
  <text x="450" y="615" text-anchor="middle" class="text">Containerized, Cloud-native, API Gateway pattern</text>
</svg>
`;

export const DIAGRAM_AI_ML = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 950 700">
  <defs>
    <style>
      .title { font-family: Arial, sans-serif; font-size: 20px; font-weight: bold; fill: #1e40af; }
      .subtitle { font-family: Arial, sans-serif; font-size: 14px; fill: #475569; }
      .label { font-family: Arial, sans-serif; font-size: 12px; fill: #1e293b; font-weight: 600; }
      .text { font-family: Arial, sans-serif; font-size: 10px; fill: #475569; }
      .zone-label { font-family: Arial, sans-serif; font-size: 12px; fill: #64748b; font-weight: 600; }
      .cve-label { font-family: monospace; font-size: 10px; fill: #dc2626; font-weight: bold; }
      .ml-label { font-family: Arial, sans-serif; font-size: 11px; fill: #7c3aed; font-weight: 600; }
    </style>
  </defs>

  <!-- Title -->
  <text x="475" y="30" text-anchor="middle" class="title">AI/ML System Architecture (Hybrid Microservices + ML)</text>
  <text x="475" y="50" text-anchor="middle" class="subtitle">Financial Transaction Fraud Detection System</text>

  <!-- External Zone -->
  <rect x="50" y="80" width="850" height="60" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="2" rx="8"/>
  <text x="70" y="100" class="zone-label">EXTERNAL (Banks, Payment Processors, Merchants)</text>

  <!-- API Gateway -->
  <rect x="300" y="160" width="350" height="50" fill="#fef3c7" stroke="#d97706" stroke-width="2" rx="6"/>
  <text x="475" y="180" text-anchor="middle" class="label">Kong API Gateway + AWS WAF</text>
  <text x="475" y="195" text-anchor="middle" class="text">Rate Limiting (prevent model extraction) • OAuth 2.0</text>

  <!-- Kubernetes Cluster -->
  <rect x="50" y="230" width="850" height="410" fill="#dbeafe" stroke="#3b82f6" stroke-width="3" rx="8"/>
  <text x="70" y="250" class="zone-label">KUBERNETES CLUSTER (EKS) - ML WORKLOADS</text>

  <!-- Application Microservices -->
  <rect x="80" y="270" width="820" height="80" fill="#f0fdfa" stroke="#14b8a6" stroke-width="2" rx="6"/>
  <text x="100" y="290" class="label">APPLICATION MICROSERVICES</text>

  <rect x="100" y="300" width="180" height="40" fill="#fff" stroke="#14b8a6" stroke-width="1" rx="3"/>
  <text x="190" y="318" text-anchor="middle" class="text">Transaction API</text>
  <text x="190" y="332" text-anchor="middle" class="text">(Ingestion)</text>

  <rect x="300" y="300" width="180" height="40" fill="#fff" stroke="#14b8a6" stroke-width="1" rx="3"/>
  <text x="390" y="318" text-anchor="middle" class="text">Fraud Scoring Svc</text>
  <text x="390" y="332" text-anchor="middle" class="text">(Orchestration)</text>

  <rect x="500" y="300" width="180" height="40" fill="#fff" stroke="#14b8a6" stroke-width="1" rx="3"/>
  <text x="590" y="318" text-anchor="middle" class="text">Alert Service</text>
  <text x="590" y="332" text-anchor="middle" class="text">(Notifications)</text>

  <rect x="700" y="300" width="180" height="40" fill="#fff" stroke="#14b8a6" stroke-width="1" rx="3"/>
  <text x="790" y="318" text-anchor="middle" class="text">Analytics Service</text>
  <text x="790" y="332" text-anchor="middle" class="text">(Reporting)</text>

  <!-- ML Inference Layer -->
  <rect x="80" y="370" width="820" height="180" fill="#f5f3ff" stroke="#7c3aed" stroke-width="2" rx="6"/>
  <text x="100" y="390" class="ml-label">🧠 ML INFERENCE LAYER</text>

  <!-- Feature Engineering -->
  <rect x="100" y="400" width="780" height="35" fill="#ede9fe" stroke="#7c3aed" stroke-width="1" rx="4"/>
  <text x="490" y="418" text-anchor="middle" class="text">Feature Engineering Module • 147 features • AWS Feature Store • Redis Cache</text>

  <!-- ML Models -->
  <rect x="120" y="450" width="330" height="85" fill="#fff7ed" stroke="#f59e0b" stroke-width="2" rx="4"/>
  <text x="285" y="468" text-anchor="middle" class="label">ML Model Inference Service</text>
  <text x="180" y="485" class="text">Primary: XGBoost</text>
  <text x="180" y="500" class="text">(Fraud Score)</text>
  <text x="350" y="485" class="text">Secondary: LSTM</text>
  <text x="350" y="500" class="text">(Transaction Sequences)</text>
  <rect x="190" y="510" width="180" height="20" fill="#fef3c7" stroke="#f59e0b" stroke-width="1" rx="3"/>
  <text x="280" y="524" text-anchor="middle" class="text">Ensemble Combiner</text>

  <!-- CVE Label -->
  <rect x="470" y="455" width="120" height="20" fill="#fee2e2" stroke="#dc2626" stroke-width="1.5" rx="3"/>
  <text x="530" y="469" text-anchor="middle" class="cve-label">CVE-2023-25659</text>
  <text x="530" y="490" text-anchor="middle" class="text" fill="#dc2626">TensorFlow Serving v2.12</text>

  <!-- Decision Engine -->
  <rect x="600" y="450" width="260" height="85" fill="#ecfdf5" stroke="#10b981" stroke-width="2" rx="4"/>
  <text x="730" y="468" text-anchor="middle" class="label">Decision Engine</text>
  <text x="730" y="485" text-anchor="middle" class="text">Score > 0.75 → Block</text>
  <text x="730" y="500" text-anchor="middle" class="text">0.50-0.75 → Review</text>
  <text x="730" y="515" text-anchor="middle" class="text">< 0.50 → Approve</text>

  <!-- Data Infrastructure -->
  <rect x="80" y="565" width="820" height="65" fill="#f3f4f6" stroke="#6b7280" stroke-width="2" rx="6"/>
  <text x="100" y="585" class="label">DATA INFRASTRUCTURE</text>
  <text x="490" y="605" text-anchor="middle" class="text">PostgreSQL (Transactions) • Kafka (Real-time Stream) • Redis (Cache) • S3 (Training Data)</text>

  <!-- ML Training Pipeline (Offline) -->
  <rect x="50" y="660" width="850" height="30" fill="#f3e8ff" stroke="#9333ea" stroke-width="2" rx="6"/>
  <text x="475" y="680" text-anchor="middle" class="text">🔄 ML TRAINING PIPELINE (AWS SageMaker): Weekly Retraining • A/B Testing • MLflow Model Registry</text>

  <!-- Arrows -->
  <line x1="475" y1="140" x2="475" y2="160" stroke="#64748b" stroke-width="2" marker-end="url(#arrowhead)"/>
  <line x1="475" y1="210" x2="475" y2="230" stroke="#64748b" stroke-width="2" marker-end="url(#arrowhead)"/>
  <line x1="390" y1="340" x2="390" y2="370" stroke="#64748b" stroke-width="2" marker-end="url(#arrowhead)"/>
  <line x1="490" y1="435" x2="490" y2="450" stroke="#7c3aed" stroke-width="2" marker-end="url(#arrowhead-purple)"/>

  <!-- Arrow markers -->
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
      <polygon points="0 0, 10 5, 0 10" fill="#64748b"/>
    </marker>
    <marker id="arrowhead-purple" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
      <polygon points="0 0, 10 5, 0 10" fill="#7c3aed"/>
    </marker>
  </defs>
</svg>
`;

export const DIAGRAM_SERVERLESS = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 700">
  <defs>
    <style>
      .title { font-family: Arial, sans-serif; font-size: 20px; font-weight: bold; fill: #1e40af; }
      .subtitle { font-family: Arial, sans-serif; font-size: 14px; fill: #475569; }
      .label { font-family: Arial, sans-serif; font-size: 12px; fill: #1e293b; font-weight: 600; }
      .text { font-family: Arial, sans-serif; font-size: 10px; fill: #475569; }
      .zone-label { font-family: Arial, sans-serif; font-size: 12px; fill: #64748b; font-weight: 600; }
      .cve-label { font-family: monospace; font-size: 10px; fill: #dc2626; font-weight: bold; }
      .lambda { font-family: Arial, sans-serif; font-size: 11px; fill: #ea580c; font-weight: 600; }
    </style>
  </defs>

  <!-- Title -->
  <text x="450" y="30" text-anchor="middle" class="title">Serverless Event-Driven Architecture</text>
  <text x="450" y="50" text-anchor="middle" class="subtitle">Citizen Document Processing Platform (AWS Lambda)</text>

  <!-- External Zone -->
  <rect x="50" y="80" width="800" height="60" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="2" rx="8"/>
  <text x="70" y="100" class="zone-label">EXTERNAL (Web Portal, Mobile App, Email System)</text>

  <!-- API Gateway -->
  <rect x="250" y="160" width="400" height="50" fill="#fef3c7" stroke="#d97706" stroke-width="2" rx="6"/>
  <text x="450" y="180" text-anchor="middle" class="label">API GATEWAY (REST + WebSocket)</text>
  <text x="450" y="195" text-anchor="middle" class="text">IAM + Cognito Auth • Rate Limiting • Request Validation</text>

  <!-- AWS Cloud -->
  <rect x="50" y="230" width="800" height="420" fill="#dbeafe" stroke="#3b82f6" stroke-width="3" rx="8"/>
  <text x="70" y="250" class="zone-label">AWS SERVERLESS INFRASTRUCTURE</text>

  <!-- S3 Bucket -->
  <rect x="300" y="270" width="300" height="60" fill="#dcfce7" stroke="#16a34a" stroke-width="2" rx="6"/>
  <text x="450" y="290" text-anchor="middle" class="label">S3 BUCKET (Document Storage)</text>
  <text x="450" y="305" text-anchor="middle" class="text">citizen-docs-upload • Versioning • Encryption</text>
  <rect x="620" y="278" width="110" height="18" fill="#fee2e2" stroke="#dc2626" stroke-width="1.5" rx="3"/>
  <text x="675" y="291" text-anchor="middle" class="cve-label">CVE-2023-38545</text>

  <!-- Lambda 1: Upload Handler -->
  <rect x="80" y="360" width="220" height="70" fill="#fff7ed" stroke="#ea580c" stroke-width="2" rx="6"/>
  <text x="190" y="380" text-anchor="middle" class="lambda">λ Document Upload Handler</text>
  <text x="190" y="395" text-anchor="middle" class="text">Python 3.11</text>
  <text x="190" y="408" text-anchor="middle" class="text">• File validation</text>
  <text x="190" y="421" text-anchor="middle" class="text">• Malware scan (ClamAV)</text>

  <!-- SQS Queue -->
  <rect x="340" y="360" width="220" height="70" fill="#fef3c7" stroke="#f59e0b" stroke-width="2" rx="6"/>
  <text x="450" y="380" text-anchor="middle" class="label">SQS QUEUE</text>
  <text x="450" y="395" text-anchor="middle" class="text">Processing Queue</text>
  <text x="450" y="408" text-anchor="middle" class="text">• Dead Letter Queue</text>
  <text x="450" y="421" text-anchor="middle" class="text">• 5 min visibility timeout</text>

  <!-- Lambda 2: OCR Processor -->
  <rect x="600" y="360" width="220" height="70" fill="#fff7ed" stroke="#ea580c" stroke-width="2" rx="6"/>
  <text x="710" y="380" text-anchor="middle" class="lambda">λ OCR Processor</text>
  <text x="710" y="395" text-anchor="middle" class="text">Python 3.11 + Tesseract</text>
  <text x="710" y="408" text-anchor="middle" class="text">• Text extraction</text>
  <text x="710" y="421" text-anchor="middle" class="text">• Image OCR</text>

  <!-- EventBridge -->
  <rect x="300" y="460" width="300" height="50" fill="#e0e7ff" stroke="#6366f1" stroke-width="2" rx="6"/>
  <text x="450" y="480" text-anchor="middle" class="label">EventBridge (Event Bus)</text>
  <text x="450" y="495" text-anchor="middle" class="text">Event filtering • Multi-target routing</text>

  <!-- Lambda 3 & 4 -->
  <rect x="100" y="540" width="200" height="60" fill="#fff7ed" stroke="#ea580c" stroke-width="2" rx="6"/>
  <text x="200" y="560" text-anchor="middle" class="lambda">λ Validation</text>
  <text x="200" y="575" text-anchor="middle" class="text">Node.js 20</text>
  <text x="200" y="588" text-anchor="middle" class="text">Business rules check</text>

  <rect x="340" y="540" width="200" height="60" fill="#fff7ed" stroke="#ea580c" stroke-width="2" rx="6"/>
  <text x="440" y="560" text-anchor="middle" class="lambda">λ Notification</text>
  <text x="440" y="575" text-anchor="middle" class="text">Python 3.11</text>
  <text x="440" y="588" text-anchor="middle" class="text">Email (SES) • SMS (SNS)</text>

  <rect x="580" y="540" width="200" height="60" fill="#fff7ed" stroke="#ea580c" stroke-width="2" rx="6"/>
  <text x="680" y="560" text-anchor="middle" class="lambda">λ Archive</text>
  <text x="680" y="575" text-anchor="middle" class="text">Python 3.11</text>
  <text x="680" y="588" text-anchor="middle" class="text">S3 Glacier (90 days)</text>

  <!-- DynamoDB -->
  <rect x="300" y="610" width="300" height="30" fill="#f3e8ff" stroke="#9333ea" stroke-width="2" rx="4"/>
  <text x="450" y="630" text-anchor="middle" class="text">DynamoDB (Metadata, Status, Extracted Text) • DynamoDB Streams</text>

  <!-- Arrows -->
  <line x1="450" y1="140" x2="450" y2="160" stroke="#64748b" stroke-width="2" marker-end="url(#arrowhead)"/>
  <line x1="450" y1="210" x2="450" y2="230" stroke="#64748b" stroke-width="2" marker-end="url(#arrowhead)"/>

  <!-- S3 to Lambda -->
  <path d="M 450 330 Q 350 345 300 375" stroke="#16a34a" stroke-width="2" fill="none" marker-end="url(#arrowhead-green)"/>
  <text x="370" y="350" class="text" fill="#16a34a">S3 Event</text>

  <!-- Lambda to SQS -->
  <line x1="300" y1="395" x2="340" y2="395" stroke="#ea580c" stroke-width="2" marker-end="url(#arrowhead)"/>

  <!-- SQS to Lambda -->
  <line x1="560" y1="395" x2="600" y2="395" stroke="#f59e0b" stroke-width="2" marker-end="url(#arrowhead)"/>

  <!-- Lambda to EventBridge -->
  <path d="M 710 430 Q 580 445 450 460" stroke="#ea580c" stroke-width="2" fill="none" marker-end="url(#arrowhead)"/>

  <!-- EventBridge to Lambdas -->
  <line x1="350" y1="510" x2="200" y2="540" stroke="#6366f1" stroke-width="2" marker-end="url(#arrowhead)"/>
  <line x1="450" y1="510" x2="440" y2="540" stroke="#6366f1" stroke-width="2" marker-end="url(#arrowhead)"/>
  <line x1="550" y1="510" x2="680" y2="540" stroke="#6366f1" stroke-width="2" marker-end="url(#arrowhead)"/>

  <!-- Validation to DynamoDB -->
  <line x1="250" y1="600" x2="360" y2="610" stroke="#ea580c" stroke-width="2" marker-end="url(#arrowhead)"/>

  <!-- Arrow markers -->
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
      <polygon points="0 0, 10 5, 0 10" fill="#64748b"/>
    </marker>
    <marker id="arrowhead-green" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
      <polygon points="0 0, 10 5, 0 10" fill="#16a34a"/>
    </marker>
  </defs>

  <!-- Footer -->
  <text x="450" y="675" text-anchor="middle" class="text">Attack Surface: S3 Bucket (CVE-2023-38545) • Compensating Controls: VPC Endpoints, IAM Roles, CloudTrail Logging, Input Validation</text>
</svg>
`;

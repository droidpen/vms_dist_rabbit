export const demoFileSets = {
    '3tier': {
      name: '3-Tier Web Application',
      description: 'Traditional 3-tier architecture with internal network deployment',
      files: {
        '3Tier_Web_App_RA_Presentation.txt': `═══════════════════════════════════════════════════════════════════════════
RISK ACCEPTANCE SUBMISSION - 3-TIER WEB APPLICATION
═══════════════════════════════════════════════════════════════════════════

PROJECT: E-Government Payment Gateway
ARCHITECTURE TYPE: 3-Tier Web Application
SUBMISSION ID: RA-2026-0042
DATE: April 10, 2026

───────────────────────────────────────────────────────────────────────────
SYSTEM ARCHITECTURE OVERVIEW
───────────────────────────────────────────────────────────────────────────

The E-Government Payment Gateway follows a traditional 3-tier architecture:

PRESENTATION LAYER:
- Web Interface: React-based frontend application
- User Interface: Citizen-facing payment forms
- Access: Internal network only via CAM (Centralized Access Management)

APPLICATION LAYER:
- Payment Gateway API: RESTful API services
- Business Logic: Transaction processing, validation, routing
- Backend Server: Node.js application server
- Authentication: Basic authentication with session management

DATA LAYER:
- Database Server: PostgreSQL 14.2
- Data Storage: Transaction records, user profiles, audit logs
- Location: Internal network, separate subnet

INFRASTRUCTURE:
- Deployment: On-premise isolated network (VLAN 10.0.1.0/24)
- Security Perimeter: Palo Alto PA-3020 Firewall + IPS (signatures 94528/94529)
- Network Monitoring: Splunk SIEM with EDR/XDR integration (CrowdStrike Falcon)
- Authentication: CAM gateway + hardware tokens (YubiKey) + certificate-based API auth
- WAF Protection: F5 Advanced WAF with custom CVE-2024-3400 blocking rules
- Network Segmentation: Tier-isolated VLANs with strict ACLs between layers

───────────────────────────────────────────────────────────────────────────
VULNERABILITY DETAILS
───────────────────────────────────────────────────────────────────────────

CVE ID: CVE-2024-3400
CVSS Base Score: 10.0 (CRITICAL)
Component: Payment Gateway API
Impact: Command injection vulnerability in GlobalProtect gateway
CVSS Vector: CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H

NOTE: Environmental controls significantly reduce effective risk to LOW:
- Internal network deployment only (no internet exposure)
- Multi-factor authentication (CAM + YubiKey + certificate-based API auth)
- EDR/XDR protection (CrowdStrike Falcon with behavioral detection)
- IPS signatures (94528/94529) blocking CVE-2024-3400 exploit patterns
- WAF protection (F5 Advanced) with custom CVE-specific rulesets
- Network segmentation with VLAN isolation

───────────────────────────────────────────────────────────────────────────
COMPENSATING CONTROLS
───────────────────────────────────────────────────────────────────────────

1. Network Segmentation with Monitoring: Internal network only (10.0.1.0/24 VLAN),
   completely isolated from public internet. Active traffic monitoring via IPS.

2. Multi-Factor Authentication: CAM gateway with hardware token (YubiKey) + OTP.
   All API access requires certificate-based authentication.

3. EDR/XDR Protection: CrowdStrike Falcon endpoint protection on all servers
   with behavioral detection and automated response policies.

4. Intrusion Prevention System: Palo Alto PA-3020 with IPS signatures blocking
   CVE-2024-3400 exploit patterns (signature ID: 94528, 94529).

5. SIEM Monitoring: Splunk Enterprise with custom correlation rules detecting
   unauthorized API access attempts. 24/7 SOC monitoring with automated alerting.

6. Web Application Firewall: F5 Advanced WAF with custom ruleset blocking
   malicious API payloads targeting this vulnerability.

ACCEPTANCE PERIOD: 45 days (patch deployment scheduled May 22, 2026)
═══════════════════════════════════════════════════════════════════════════`,

        '3Tier_Web_App_Architecture_Diagram.txt': `═══════════════════════════════════════════════════════════════════════════
SYSTEM ARCHITECTURE DOCUMENTATION
═══════════════════════════════════════════════════════════════════════════

ARCHITECTURE TYPE: Three-tier Web Application

TIER 1 - PRESENTATION LAYER:
├─ Technology Stack: React 18, HTML5, CSS3
├─ Hosting: Internal web server (10.0.1.10)
├─ Access Method: CAM authentication gateway
└─ User Base: Good Luck Infra staff only (approximately 50 users)

TIER 2 - APPLICATION LAYER:
├─ Technology Stack: Node.js 18, Express.js
├─ Services: Payment processing API, transaction validation
├─ Backend Server: 10.0.1.20
├─ API Gateway: RESTful endpoints at /api/v2/*
└─ Session Management: Redis cache for session storage

TIER 3 - DATA LAYER:
├─ Database: PostgreSQL 14.2
├─ Database Server: 10.0.1.30 (isolated subnet)
├─ Data Store: Transaction records, audit logs, user profiles
└─ Backup: Daily automated backups to secure storage

NETWORK TOPOLOGY:
External World → Firewall/IPS → CAM Gateway → Presentation Layer → Application Layer → Data Layer

SECURITY INFRASTRUCTURE:
- Firewall: Palo Alto Networks PA-3020
- IPS: Intrusion Prevention System enabled
- Monitoring: Splunk SIEM with real-time alerting
- Network Segmentation: VLANs isolating each tier
═══════════════════════════════════════════════════════════════════════════`,

        '3Tier_Web_App_Vendor_Correspondence.txt': `═══════════════════════════════════════════════════════════════════════════
EMAIL CORRESPONDENCE - VENDOR PATCH TIMELINE
═══════════════════════════════════════════════════════════════════════════

From: security@goodluckinfra.gov.sg
To: product-security@agency.gov.sg
Date: April 8, 2026 09:15 SGT
Subject: RE: CVE-2024-3400 - Patch Availability Timeline

───────────────────────────────────────────────────────────────────────────

Dear Product Security Team,

Thank you for your inquiry regarding the security patch for CVE-2024-3400
affecting the Payment Gateway API component.

PATCH TIMELINE:
The official security patch will be available on May 22, 2026 (45 days from now).
Here's the rollout plan:

1. The vulnerability affects a core authentication module that requires
   significant refactoring across our entire product line
2. We must maintain backward compatibility with existing deployments
3. Comprehensive regression testing is required (estimated 6-8 weeks)
4. Current development resources are allocated to Q2 compliance updates

VENDOR RECOMMENDATION:
Given the 45-day window before patch availability, we recommend risk acceptance
with the following compensating controls which reduce the effective risk to LOW:

✓ Network-level isolation: Internal VLAN only, zero internet exposure
✓ Multi-layered authentication: CAM + hardware tokens + certificate-based API auth
✓ IPS/Firewall: Palo Alto with specific exploit blocking (signatures 94528/94529)
✓ Enhanced monitoring: Splunk SIEM + CrowdStrike EDR/XDR with behavioral detection
✓ WAF protection: F5 Advanced WAF with custom CVE-2024-3400 ruleset
✓ Endpoint protection: EDR on all servers with automated response policies

THREAT INTELLIGENCE:
Our security team has reviewed current threat intelligence:
- No public exploits available for CVE-2024-3400 in this configuration
- EPSS score: 0.087% (very low probability of exploitation)
- Not listed in CISA KEV (Known Exploited Vulnerabilities)
- Requires authenticated access + high complexity (CVSS AC:H, PR:H)
- Vendor configuration limits impact to information disclosure only (C:L, I:N, A:N)

SUPPORT COMMITMENT:
If you proceed with risk acceptance, we commit to:
1. Immediate notification if threat landscape changes
2. Emergency patch if active exploitation is detected
3. Monthly security briefings on this vulnerability
4. Priority support for any security concerns

We understand this is not ideal, but the compensating controls approach
is the safest option for your July decommissioning timeline.

Best regards,

Dr. Sarah Chen
Chief Security Officer
Good Luck Infrastructure Services
security@goodluckinfra.gov.sg
+65 6XXX XXXX

───────────────────────────────────────────────────────────────────────────

From: product-security@agency.gov.sg
To: security@goodluckinfra.gov.sg
Date: April 8, 2026 14:30 SGT
Subject: RE: CVE-2024-3400 - Patch Availability Timeline

───────────────────────────────────────────────────────────────────────────

Dr. Chen,

Thank you for the detailed response. We acknowledge the 45-day patch timeline
and agree that risk acceptance with the comprehensive compensating controls
you've outlined reduces the effective risk to LOW severity.

Given the multi-layered defense-in-depth approach (network isolation, MFA,
EDR/XDR, IPS signatures, WAF rules, SIEM monitoring), we will proceed with
formal risk acceptance documentation for this 45-day window.

We appreciate the vendor's commitment to the May 22, 2026 patch deployment.

Regards,
Officer 1
Product Security Team

═══════════════════════════════════════════════════════════════════════════
END OF CORRESPONDENCE
═══════════════════════════════════════════════════════════════════════════`,

        '3Tier_Web_App_Security_Assessment.txt': `═══════════════════════════════════════════════════════════════════════════
SECURITY ASSESSMENT - 3-TIER ARCHITECTURE VALIDATION
═══════════════════════════════════════════════════════════════════════════

DEPLOYMENT MODEL: Internal Network (On-Premise)
NETWORK TYPE: Private internal network with firewall protection

VERIFIED COMPONENTS:
✓ Presentation Tier: Web interface (confirmed React frontend)
✓ Application Tier: Payment API backend (confirmed Node.js)
✓ Data Tier: PostgreSQL database server (confirmed v14.2)

SECURITY CONTROLS IN PLACE:
✓ Firewall rules restricting external access
✓ IPS solution monitoring network traffic
✓ SIEM integration for security event logging
✓ Basic authentication enforced at application layer
✓ Database connection encryption enabled

ARCHITECTURE VALIDATION:
This system implements a traditional three-tier architecture with clear
separation between presentation, application, and data layers. Each tier
is deployed on separate infrastructure with network segmentation.

No AI or machine learning components detected.
No microservices or containerized components detected.
No serverless functions detected.
═══════════════════════════════════════════════════════════════════════════`,

        '3Tier_Web_App_System_Diagram.txt': `═══════════════════════════════════════════════════════════════════════════
SYSTEM DIAGRAM - 3-TIER ARCHITECTURE
═══════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────────┐
│                         EXTERNAL ZONE                                    │
│  ┌──────────────┐      ┌──────────────┐                                 │
│  │  Citizens    │      │ External     │                                 │
│  │  (Users)     │      │ Stakeholders │                                 │
│  └──────┬───────┘      └──────┬───────┘                                 │
│         │                     │                                          │
└─────────┼─────────────────────┼──────────────────────────────────────────┘
          │                     │
          │                     │
┌─────────┼─────────────────────┼──────────────────────────────────────────┐
│         │   DMZ / PERIMETER   │                                          │
│         ▼                     ▼                                          │
│  ┌────────────────────────────────────────┐                             │
│  │  Palo Alto Firewall + IPS              │◄─── Network Security        │
│  │  - Packet inspection                   │     Controls                │
│  │  - Threat prevention                   │                             │
│  │  - Access control lists                │                             │
│  └──────────────┬─────────────────────────┘                             │
│                 │                                                        │
└─────────────────┼────────────────────────────────────────────────────────┘
                  │
                  │
┌─────────────────┼────────────────────────────────────────────────────────┐
│                 │      INTERNAL NETWORK (CAM Access Only)                │
│                 ▼                                                        │
│  ┌─────────────────────────────────────────┐                            │
│  │  CAM (Centralized Access Management)    │                            │
│  │  - Authentication gateway               │                            │
│  │  - SSO for authorized users only        │                            │
│  └──────────────┬──────────────────────────┘                            │
│                 │                                                        │
│                 ▼                                                        │
│  ═══════════════════════════════════════════                            │
│  ║  PRESENTATION TIER (10.0.1.10)        ║                            │
│  ═══════════════════════════════════════════                            │
│  ║  ┌─────────────────────────────────┐  ║                            │
│  ║  │  Web Server (React Frontend)    │  ║                            │
│  ║  │  - User interface               │  ║                            │
│  ║  │  - Payment forms                │  ║                            │
│  ║  │  - Session management           │  ║                            │
│  ║  └────────────┬────────────────────┘  ║                            │
│  ═══════════════════════════════════════════                            │
│                 │ HTTPS                                                  │
│                 ▼                                                        │
│  ═══════════════════════════════════════════                            │
│  ║  APPLICATION TIER (10.0.1.20)         ║                            │
│  ═══════════════════════════════════════════                            │
│  ║  ┌─────────────────────────────────┐  ║                            │
│  ║  │  App Server (Node.js/Express)   │  ║ ◄── CVE-2024-3400          │
│  ║  │  - Payment Gateway API          │  ║     (VULNERABLE)           │
│  ║  │  - /api/v2/admin/config         │  ║                            │
│  ║  │  - Business logic               │  ║                            │
│  ║  │  - Transaction validation       │  ║                            │
│  ║  └────────────┬────────────────────┘  ║                            │
│  ═══════════════════════════════════════════                            │
│                 │ Encrypted DB connection                                │
│                 ▼                                                        │
│  ═══════════════════════════════════════════                            │
│  ║  DATA TIER (10.0.1.30)                ║                            │
│  ═══════════════════════════════════════════                            │
│  ║  ┌─────────────────────────────────┐  ║                            │
│  ║  │  PostgreSQL 14.2 Database       │  ║                            │
│  ║  │  - Transaction records          │  ║                            │
│  ║  │  - User profiles                │  ║                            │
│  ║  │  - Audit logs                   │  ║                            │
│  ║  │  - Encrypted at rest            │  ║                            │
│  ║  └─────────────────────────────────┘  ║                            │
│  ═══════════════════════════════════════════                            │
│                                                                          │
│  ┌────────────────────────────────────────────────────────┐             │
│  │  MONITORING & SECURITY                                 │             │
│  │  - Splunk SIEM (24/7 monitoring)                       │             │
│  │  - IDS/IPS active                                      │             │
│  │  - Network flow analysis                               │             │
│  │  - Anomaly detection                                   │             │
│  └────────────────────────────────────────────────────────┘             │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘

ATTACK SURFACE ANALYSIS:
━━━━━━━━━━━━━━━━━━━━━━━━━
• Entry Point: Firewall → CAM Gateway → Web Server
• Vulnerable Component: API Gateway /api/v2/admin/config (CVE-2024-3400)
• Attack Vector: Authenticated user with low privileges
• Lateral Movement: Limited by network segmentation (VLANs)
• Data Exfiltration Path: Application Tier → Internet (blocked by egress firewall)

COMPENSATING CONTROLS:
━━━━━━━━━━━━━━━━━━━━━━
✓ Network segmentation (3 isolated subnets)
✓ CAM-only access (no public internet exposure)
✓ Firewall + IPS monitoring all traffic
✓ SIEM alerting on suspicious API calls
✓ Limited user base (~50 Good Luck Infra staff)
═══════════════════════════════════════════════════════════════════════════`
      }
    },

    'microservices': {
      name: 'Microservices Architecture',
      description: 'Cloud-native microservices with Kubernetes and API Gateway',
      files: {
        'Microservices_RA_Presentation.txt': `═══════════════════════════════════════════════════════════════════════════
RISK ACCEPTANCE SUBMISSION - MICROSERVICES PLATFORM
═══════════════════════════════════════════════════════════════════════════

PROJECT: National Identity Verification Platform
ARCHITECTURE TYPE: Microservices Architecture
SUBMISSION ID: RA-2026-0089
DATE: May 1, 2026

───────────────────────────────────────────────────────────────────────────
SYSTEM ARCHITECTURE OVERVIEW
───────────────────────────────────────────────────────────────────────────

The National Identity Verification Platform is built on a modern
microservices architecture deployed on Kubernetes (K8s).

MICROSERVICES COMPONENTS:
- Identity Service: User identity verification and validation
- Document Service: ID document processing and OCR
- Biometric Service: Facial recognition and fingerprint matching
- Notification Service: Email and SMS notifications
- Audit Service: Logging and compliance tracking
- API Gateway: Kong API Gateway for request routing

CONTAINERIZATION:
- Container Platform: Kubernetes v1.27
- Container Runtime: Docker 24.0
- Orchestration: K8s with Helm charts
- Service Mesh: Istio for inter-service communication

INFRASTRUCTURE:
- Cloud Provider: AWS (Amazon Web Services)
- Deployment: Multi-AZ deployment across ap-southeast-1
- Load Balancer: AWS Application Load Balancer
- Database: Per-service databases (microservice pattern)
  - Identity Service: PostgreSQL RDS
  - Document Service: MongoDB Atlas
  - Biometric Service: DynamoDB
- Cache Layer: Redis ElastiCache for session management
- Message Queue: Amazon SQS for async communication

SECURITY:
- API Gateway: Kong v2.8 with HTTP/2 stream limits (100/conn, 10 RST/sec)
- DDoS Protection: AWS Shield Advanced + CloudFront rate limiting
- Service-to-Service Auth: mTLS via Istio with certificate rotation
- Secrets Management: AWS Secrets Manager with automatic rotation
- Network Security: VPC with isolated subnets + security groups + NACLs
- WAF: AWS WAF Managed Rules + custom HTTP/2 rapid reset blocking
- Container Security: Trivy image scanning + Falco runtime monitoring
- EDR/XDR: AWS GuardDuty + Falco with automated response policies
- Authentication: Cognito with MFA + OAuth 2.0 JWT tokens
- Monitoring: CloudWatch + Prometheus + Grafana with H2 traffic alerting

───────────────────────────────────────────────────────────────────────────
VULNERABILITY DETAILS
───────────────────────────────────────────────────────────────────────────

CVE ID: CVE-2023-44487
CVSS Base Score: 7.5 (HIGH)
Component: Kong API Gateway v2.8
Impact: HTTP/2 Rapid Reset DoS
CVSS Vector: CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H

NOTE: Environmental controls significantly reduce effective risk to LOW:
- AWS Shield Advanced DDoS protection (auto-mitigation)
- Kong rate limiting (100 streams/connection, 10 RST/sec)
- Kubernetes auto-scaling maintains availability even under attack
- Multiple defense layers reduce exploitation probability and impact

───────────────────────────────────────────────────────────────────────────
COMPENSATING CONTROLS
───────────────────────────────────────────────────────────────────────────

1. Network Segmentation with Monitoring: Internal VPC with isolated subnets per
   microservice. All traffic routed through Kong API Gateway with request inspection.

2. Multi-Factor Authentication: Cognito with MFA for admin access + OAuth 2.0
   JWT tokens for API access. Service-to-service auth via mTLS certificates.

3. EDR/XDR Protection: AWS GuardDuty for threat detection + Falco for runtime
   Kubernetes security monitoring with automated pod termination policies.

4. HTTP/2 Stream Limiting: Kong configured with max 100 streams per connection,
   RST_STREAM rate limiting at 10/second, connection timeout 30s.

5. DDoS Protection: AWS Shield Advanced with automated traffic filtering +
   CloudFront with custom rules blocking rapid reset patterns.

6. SIEM Monitoring: CloudWatch Logs + Prometheus + Grafana dashboards with
   alerting on anomalous H2 traffic patterns (>50 stream resets/min).

7. Auto-Scaling: Kubernetes HPA with CPU/memory-based scaling, EKS cluster
   auto-scaler ensuring service availability even under attack.

8. WAF Protection: AWS WAF Managed Rules + custom ruleset blocking HTTP/2
   rapid reset attack signatures (Rule ID: AWSManagedRulesKnownBadInputsRuleSet).

ACCEPTANCE PERIOD: 40 days (Kong v3.5 upgrade scheduled May 17, 2026)
═══════════════════════════════════════════════════════════════════════════`,

        'Microservices_Architecture_Details.txt': `═══════════════════════════════════════════════════════════════════════════
MICROSERVICES ARCHITECTURE DOCUMENTATION
═══════════════════════════════════════════════════════════════════════════

ARCHITECTURE PATTERN: Microservices with Service-Oriented Design

API GATEWAY:
├─ Kong API Gateway v2.8
├─ Request routing and load balancing
├─ Rate limiting: 1000 req/min per service
├─ Authentication: OAuth 2.0 + JWT tokens
└─ Public endpoint: https://api.verify.gov.sg

MICROSERVICES CATALOG:
1. Identity Service (identity-svc)
   - Language: Java Spring Boot
   - Database: PostgreSQL RDS (per-service database)
   - Replicas: 3 pods

2. Document Service (document-svc)
   - Language: Python FastAPI
   - Database: MongoDB Atlas
   - Replicas: 5 pods (high traffic)

3. Biometric Service (biometric-svc)
   - Language: Go
   - Database: DynamoDB
   - Replicas: 4 pods

4. Notification Service (notification-svc)
   - Language: Node.js
   - Database: None (stateless)
   - Replicas: 2 pods

5. Audit Service (audit-svc)
   - Language: Python
   - Database: PostgreSQL RDS
   - Replicas: 2 pods

KUBERNETES INFRASTRUCTURE:
├─ Cluster: EKS (Elastic Kubernetes Service)
├─ Node Groups: 3 node groups across 3 availability zones
├─ Container Registry: Amazon ECR
├─ Ingress Controller: NGINX Ingress
└─ Service Mesh: Istio v1.18

EVENT-DRIVEN ARCHITECTURE:
- Message Broker: Amazon SQS for async communication
- Event Bus: Amazon EventBridge for event routing
- Pattern: Event-driven microservices for loose coupling

OBSERVABILITY:
- Metrics: Prometheus + Grafana
- Logging: ELK Stack (Elasticsearch, Logstash, Kibana)
- Tracing: Jaeger distributed tracing
- APM: AWS X-Ray for performance monitoring

DEPLOYMENT:
- CI/CD: GitLab CI/CD with automated deployments
- Blue-Green Deployments: Zero-downtime updates
- Auto-scaling: Horizontal Pod Autoscaler (HPA)
═══════════════════════════════════════════════════════════════════════════`,

        'Microservices_Vendor_Email.txt': `═══════════════════════════════════════════════════════════════════════════
EMAIL THREAD - KONG API GATEWAY VULNERABILITY
═══════════════════════════════════════════════════════════════════════════

From: support@konghq.com
To: platform-team@agency.gov.sg
Date: April 28, 2026 16:45 SGT
Subject: CVE-2023-44487 - Kong Gateway Security Advisory

───────────────────────────────────────────────────────────────────────────

Dear Platform Team,

Kong has identified CVE-2023-44487 (HTTP/2 Rapid Reset DoS, CVSS 7.5 HIGH) affecting
Kong Gateway v2.8.x series. With your current configuration + AWS infrastructure,
the effective risk is significantly reduced to LOW due to multiple mitigation layers.

PATCH TIMELINE:
- Kong Gateway v3.5 with full HTTP/2 fixes: May 17, 2026 (40 days)
- Migration assistance available: Kong Professional Services included
- Migration tools for v2.8 → v3.5: Available now

MIGRATION PLAN:
Upgrading from Kong 2.8 to 3.5 in 40-day window:
1. Week 1-2: Staging environment upgrade + plugin compatibility testing
2. Week 3-4: Load testing with production traffic patterns
3. Week 5: Blue-green production deployment (zero-downtime)
4. Week 6: Monitoring + rollback readiness period

RISK ASSESSMENT:
While CVE-2023-44487 has a HIGH base score of 7.5, your current configuration
provides comprehensive protection that reduces the effective risk to LOW:

✓ AWS Shield Advanced: Automated DDoS mitigation at network edge
✓ Kong HTTP/2 stream limits: Max 100 streams/connection, 10 RST/sec rate limit
✓ Auto-scaling: Kubernetes HPA ensures availability even under attack load
✓ WAF protection: AWS WAF blocks 98% of HTTP/2 rapid reset attack patterns
✓ CloudFront caching: Reduces backend load + adds additional rate limiting layer

COMPENSATING CONTROLS (Defense-in-Depth):
1. AWS Shield Advanced with automatic DDoS response
2. Kong rate limiting: 100 streams/connection, 10 RST_STREAM/sec, 30s timeout
3. AWS WAF Managed Rules + custom HTTP/2 rapid reset signatures
4. Istio service mesh mTLS (isolates internal services from gateway breach)
5. Kubernetes HPA auto-scaling (maintains availability under attack)
6. CloudWatch + Prometheus monitoring with H2 anomaly detection
7. GuardDuty + Falco runtime threat detection with automated pod termination

EXPLOIT ANALYSIS:
- Impact limited to availability (DoS), no confidentiality/integrity impact
- Availability impact LOW (A:L) due to auto-scaling + AWS Shield
- EPSS score: 0.12% (very low exploitation probability with these controls)
- Not in CISA KEV (Known Exploited Vulnerabilities)

Kong Security Team will provide weekly threat intelligence updates
during your acceptance period.

Best regards,

Marcus Wong
Senior Security Engineer, Kong Inc.
support@konghq.com

───────────────────────────────────────────────────────────────────────────

From: platform-team@agency.gov.sg
To: support@konghq.com, ciso@agency.gov.sg
Date: April 29, 2026 10:20 SGT
Subject: RE: CVE-2023-44487 - Risk Acceptance Decision

───────────────────────────────────────────────────────────────────────────

Marcus / CISO Team,

After reviewing Kong's detailed risk assessment and our current defense-in-depth
controls, we agree that the effective risk is LOW (CVSS 3.8) and will proceed
with risk acceptance for the 40-day window until the May 17 Kong v3.5 upgrade.

RISK ACCEPTANCE RATIONALE:
1. Multiple mitigation layers reduce effective risk to LOW:
   - AWS Shield Advanced DDoS protection
   - Kong HTTP/2 stream limits (100/conn, 10 RST/sec)
   - AWS WAF blocking 98% of exploit patterns
   - Kubernetes auto-scaling maintains availability
   - Istio mTLS isolates internal services

2. Business impact minimal:
   - DoS-only vulnerability (no data breach risk)
   - Auto-scaling + Shield ensure service availability
   - 40-day window aligns with scheduled Q2 maintenance

3. Strong monitoring:
   - CloudWatch + Prometheus with H2 anomaly detection
   - GuardDuty + Falco runtime threat detection
   - Automated response policies for suspicious activity

We will proceed with the Kong 3.5 upgrade on May 17, 2026 as planned.

Platform Engineering Team

═══════════════════════════════════════════════════════════════════════════
END OF EMAIL THREAD
═══════════════════════════════════════════════════════════════════════════`,

        'Microservices_Security_Assessment.txt': `═══════════════════════════════════════════════════════════════════════════
SECURITY ASSESSMENT - MICROSERVICES PLATFORM
═══════════════════════════════════════════════════════════════════════════

DEPLOYMENT MODEL: Cloud (AWS)
ARCHITECTURE: Containerized Microservices on Kubernetes

VERIFIED COMPONENTS:
✓ Microservices: 5 independent services identified
✓ API Gateway: Kong v2.8 (vulnerable version)
✓ Container Platform: Kubernetes EKS cluster
✓ Service Mesh: Istio for secure service-to-service communication
✓ Load Balancer: AWS ALB distributing traffic
✓ Databases: Per-service databases (PostgreSQL, MongoDB, DynamoDB)
✓ Cache: Redis ElastiCache
✓ Message Queue: Amazon SQS for event-driven patterns

SECURITY CONTROLS:
✓ WAF protection via AWS WAF
✓ mTLS between microservices via Istio
✓ Network policies enforced in Kubernetes
✓ Container image scanning enabled
✓ Secrets encrypted in AWS Secrets Manager
✓ VPC isolation with security groups

ARCHITECTURE CLASSIFICATION:
- Type: Microservices Architecture
- Pattern: Service-oriented design with event-driven communication
- Containerization: Docker containers on Kubernetes
- Cloud-Native: Full AWS cloud deployment

LATERAL MOVEMENT RISK:
Due to microservices architecture, lateral movement between services
is a concern if API Gateway is compromised. Istio mTLS provides
defense-in-depth, but container escape vulnerabilities could allow
privilege escalation within Kubernetes cluster.

No AI/ML components detected in this architecture.
═══════════════════════════════════════════════════════════════════════════`,

        'Microservices_System_Diagram.txt': `═══════════════════════════════════════════════════════════════════════════
SYSTEM DIAGRAM - MICROSERVICES ARCHITECTURE
═══════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────────┐
│                         EXTERNAL ZONE (Internet)                         │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐          │
│  │  Citizens    │      │ Partners     │      │ Mobile Apps  │          │
│  │  (Web)       │      │ (API)        │      │              │          │
│  └──────┬───────┘      └──────┬───────┘      └──────┬───────┘          │
└─────────┼──────────────────────┼─────────────────────┼──────────────────┘
          │                      │                     │
          │                      │                     │
┌─────────┼──────────────────────┼─────────────────────┼──────────────────┐
│         │   AWS PERIMETER      │                     │                  │
│         ▼                      ▼                     ▼                  │
│  ┌────────────────────────────────────────────────────────────┐        │
│  │  AWS WAF + Application Load Balancer (ALB)                 │        │
│  │  - DDoS protection                                          │        │
│  │  - Rate limiting                                            │        │
│  │  - SSL/TLS termination                                      │        │
│  └──────────────┬─────────────────────────────────────────────┘        │
│                 │                                                       │
└─────────────────┼───────────────────────────────────────────────────────┘
                  │
                  │
┌─────────────────┼───────────────────────────────────────────────────────┐
│                 │      AWS VPC (Virtual Private Cloud)                  │
│                 ▼                                                       │
│  ┌─────────────────────────────────────────────────────────────┐      │
│  │  KONG API GATEWAY (v2.8) ◄── CVE-2023-44487 (VULNERABLE)     │      │
│  │  - Request routing                                           │      │
│  │  - OAuth 2.0 + JWT authentication                            │      │
│  │  - Rate limiting (1000 req/min per service)                  │      │
│  │  - Load balancing across pods                                │      │
│  └──────────────┬──────────────────────────────────────────────┘      │
│                 │                                                       │
│                 │                                                       │
│  ═══════════════════════════════════════════════════════════════      │
│  ║         KUBERNETES CLUSTER (EKS)                            ║      │
│  ║         Service Mesh: Istio (mTLS enabled)                  ║      │
│  ═══════════════════════════════════════════════════════════════      │
│  ║                                                              ║      │
│  ║  ┌────────────────┐  ┌────────────────┐  ┌───────────────┐ ║      │
│  ║  │ Identity       │  │ Document       │  │ Biometric     │ ║      │
│  ║  │ Service        │  │ Service        │  │ Service       │ ║      │
│  ║  │ (3 pods)       │  │ (5 pods)       │  │ (4 pods)      │ ║      │
│  ║  │ Java/Spring    │  │ Python/FastAPI │  │ Go            │ ║      │
│  ║  └───────┬────────┘  └───────┬────────┘  └───────┬───────┘ ║      │
│  ║          │                   │                    │         ║      │
│  ║          │ ◄────── Istio mTLS encryption ────────►│         ║      │
│  ║          │                   │                    │         ║      │
│  ║  ┌───────▼────────┐  ┌───────▼────────┐  ┌───────▼───────┐ ║      │
│  ║  │ PostgreSQL RDS │  │ MongoDB Atlas  │  │ DynamoDB      │ ║      │
│  ║  │ (Per-service)  │  │ (Per-service)  │  │ (Per-service) │ ║      │
│  ║  └────────────────┘  └────────────────┘  └───────────────┘ ║      │
│  ║                                                              ║      │
│  ║  ┌────────────────┐  ┌────────────────┐                    ║      │
│  ║  │ Notification   │  │ Audit          │                    ║      │
│  ║  │ Service        │  │ Service        │                    ║      │
│  ║  │ (2 pods)       │  │ (2 pods)       │                    ║      │
│  ║  │ Node.js        │  │ Python         │                    ║      │
│  ║  └────────┬───────┘  └────────┬───────┘                    ║      │
│  ║           │                   │                             ║      │
│  ║           └───────┬───────────┘                             ║      │
│  ║                   ▼                                         ║      │
│  ║           ┌───────────────┐                                 ║      │
│  ║           │ Amazon SQS    │  Event-driven async messaging  ║      │
│  ║           │ Message Queue │                                 ║      │
│  ║           └───────────────┘                                 ║      │
│  ║                                                              ║      │
│  ═══════════════════════════════════════════════════════════════      │
│                                                                        │
│  ┌────────────────────────────────────────────────────────────┐      │
│  │  SHARED SERVICES                                            │      │
│  │  - Redis ElastiCache (session/cache)                        │      │
│  │  - AWS Secrets Manager (API keys, credentials)              │      │
│  │  - CloudWatch (logging and metrics)                         │      │
│  │  - Prometheus + Grafana (observability)                     │      │
│  └────────────────────────────────────────────────────────────┘      │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘

ATTACK SURFACE ANALYSIS:
━━━━━━━━━━━━━━━━━━━━━━━━━
• Entry Point: Internet → AWS WAF → ALB → Kong API Gateway
• Vulnerable Component: Kong API Gateway v2.8 (CVE-2023-44487)
• Attack Vector: Authentication bypass via HTTP header manipulation
• Lateral Movement: Service-to-service via Istio mTLS (mitigated)
• Container Escape Risk: Kubernetes privilege escalation if gateway compromised
• Data Exposure: Per-service databases accessible if service compromised

COMPENSATING CONTROLS:
━━━━━━━━━━━━━━━━━━━━━━
✓ AWS WAF blocking known exploit patterns (95% effectiveness)
✓ Istio service mesh with mTLS (encrypted inter-service communication)
✓ Kubernetes Network Policies (restricting pod-to-pod traffic)
✓ CloudWatch + Prometheus alerting on suspicious auth patterns
✓ Rate limiting at ALB and Kong levels
✓ Container image scanning (Trivy)
✓ RBAC and namespace isolation in Kubernetes
═══════════════════════════════════════════════════════════════════════════`
      }
    },

    'ai-ml': {
      name: 'AI/ML System',
      description: 'Machine learning platform with model inference and training pipelines',
      files: {
        'AI_ML_System_RA_Presentation.txt': `═══════════════════════════════════════════════════════════════════════════
RISK ACCEPTANCE SUBMISSION - AI/ML FRAUD DETECTION PLATFORM
═══════════════════════════════════════════════════════════════════════════

PROJECT: Financial Transaction Fraud Detection System
ARCHITECTURE TYPE: AI/ML Platform with Microservices
SUBMISSION ID: RA-2026-0134
DATE: May 6, 2026

───────────────────────────────────────────────────────────────────────────
SYSTEM ARCHITECTURE OVERVIEW
───────────────────────────────────────────────────────────────────────────

The Fraud Detection System combines traditional microservices architecture
with advanced machine learning and AI components for real-time fraud detection.

MACHINE LEARNING COMPONENTS:
- ML Model Inference Service: Real-time fraud prediction API
- Model Training Pipeline: Automated retraining on new fraud patterns
- Feature Engineering Module: Data preprocessing and feature extraction
- Model Registry: MLflow for model versioning and deployment
- A/B Testing Framework: Champion/Challenger model comparison

ML MODEL DETAILS:
- Primary Model: XGBoost Gradient Boosting (fraud classification)
- Neural Network: LSTM for transaction sequence analysis
- Ensemble Model: Combining multiple ML models for improved accuracy
- Framework: TensorFlow 2.13 and PyTorch 2.0
- Inference Latency: <100ms for real-time decisions

TRADITIONAL MICROSERVICES:
- Transaction API: Receives payment transactions
- Fraud Scoring Service: Calls ML inference endpoint
- Alert Service: Triggers fraud alerts and blocks
- Analytics Service: Fraud pattern analysis and reporting
- API Gateway: Kong for request routing

INFRASTRUCTURE:
- Container Platform: Kubernetes on AWS EKS
- ML Infrastructure: SageMaker for model training
- Model Serving: TensorFlow Serving on Kubernetes
- Feature Store: AWS Feature Store for ML features
- Database: PostgreSQL for transactions, S3 for training data
- Cache: Redis for feature caching
- Message Queue: Kafka for streaming transactions

AI/ML WORKFLOW:
1. Transaction arrives via API Gateway
2. Feature Engineering Module extracts features
3. ML Inference Service predicts fraud probability
4. Neural Network analyzes transaction sequence patterns
5. Ensemble model combines predictions
6. Fraud alert triggered if score > threshold

DATA PIPELINE:
- Streaming: Kafka for real-time transaction ingestion
- Batch Processing: Apache Spark for training data preparation
- Training Data: Historical transactions stored in S3
- Model Training: Automated weekly retraining on SageMaker

SECURITY:
- API Gateway: Authentication and rate limiting
- Model Security: Encrypted model artifacts
- Data Privacy: PII anonymization in training data
- Access Control: IAM roles for SageMaker access
- Monitoring: CloudWatch + Prometheus for ML metrics

───────────────────────────────────────────────────────────────────────────
VULNERABILITY DETAILS
───────────────────────────────────────────────────────────────────────────

CVE ID: CVE-2023-25659
CVSS Base Score: 7.8 (HIGH)
Component: TensorFlow Serving v2.12
Impact: Heap buffer overflow in TensorFlow Serving
CVSS Vector: CVSS:3.1/AV:L/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H

NOTE: Environmental controls significantly reduce effective risk to LOW:
- Strict API rate limiting (10 queries/min/user, 100/min total) - prevents model extraction
- Adversarial detection classifier (99.2% detection rate on FGSM/PGD/C&W attacks)
- Model watermarking enables detection of exfiltrated models
- Differential privacy (DP-SGD ε=1.0) limits membership inference to <53%
- Network isolation (internal VPC only, no direct internet access)
- ML-specific input validation blocks malicious inference requests

AI-SPECIFIC RISKS (MITIGATED):
- Model Inversion: Rate limiting prevents query patterns needed for extraction
  (would require >100K queries, but limit is 100/min = 700 days to extract)
- Adversarial Examples: Adversarial training + input validation blocks 99.2%
- Model Poisoning: Training data validation + differential privacy protections

───────────────────────────────────────────────────────────────────────────
COMPENSATING CONTROLS (ML-Specific Defense-in-Depth)
───────────────────────────────────────────────────────────────────────────

1. Network Segmentation with Monitoring: ML inference API in isolated VPC subnet,
   internal-only access via Kong API Gateway with mTLS + JWT authentication.

2. Multi-Factor Authentication: Cognito with MFA for ML engineers + API keys with
   IP whitelisting for service accounts. All inference requests require OAuth 2.0.

3. EDR/XDR Protection: AWS GuardDuty + Falco monitoring inference service pods
   with automated termination on suspicious activity (>50 queries/min threshold).

4. Strict Rate Limiting: Kong API Gateway enforces 10 queries/min per user,
   100 queries/min total. Exponential backoff for repeated violations.

5. ML-Specific Input Validation: Adversarial detection layer (separate XGBoost
   classifier) validates all inputs before reaching main model. Rejects 99.2%
   of adversarial examples (tested on FGSM, PGD, C&W attacks).

6. Model Watermarking: Digital fingerprints embedded in model weights enable
   detection of extracted models. Watermark verification via query patterns.

7. Differential Privacy: Training process uses DP-SGD (ε=1.0, δ=10^-5) limiting
   membership inference attack success rate to <53% (random guess baseline).

8. SIEM Monitoring: CloudWatch + Prometheus tracking query patterns with ML-based
   anomaly detection. Alerts on: >50 queries/min, unusual feature distributions,
   model extraction patterns (sequential boundary queries).

9. Training Data Protection: Encrypted at rest (AES-256), PII removal via automated
   scrubbing, periodic data poisoning audits using influence functions.

10. A/B Shadow Deployment: Production models run alongside challenger models to
    detect adversarial drift (sudden accuracy drops trigger automatic rollback).

ACCEPTANCE PERIOD: 35 days (TensorFlow v2.15 upgrade scheduled May 12, 2026)
═══════════════════════════════════════════════════════════════════════════`,

        'AI_ML_System_Architecture_Docs.txt': `═══════════════════════════════════════════════════════════════════════════
AI/ML SYSTEM ARCHITECTURE DOCUMENTATION
═══════════════════════════════════════════════════════════════════════════

ARCHITECTURE TYPE: Hybrid Microservices + Machine Learning Platform

ML MODEL STACK:
1. Fraud Detection Model (Primary)
   - Algorithm: XGBoost Gradient Boosting
   - Features: 147 engineered features
   - Training Frequency: Weekly automated retraining
   - Accuracy: 96.5% on validation set
   - Framework: XGBoost 1.7.5

2. Transaction Sequence Analyzer (Secondary)
   - Algorithm: LSTM Neural Network
   - Framework: TensorFlow 2.13
   - Input: 30-day transaction history per user
   - Architecture: 3-layer LSTM with attention mechanism
   - Training: Bi-weekly on SageMaker

3. Ensemble Model (Production)
   - Combines XGBoost + LSTM predictions
   - Voting mechanism: Weighted average
   - Deployment: TensorFlow Serving on Kubernetes

ML INFRASTRUCTURE:
├─ Model Training: AWS SageMaker
│  ├─ Instance Type: ml.p3.8xlarge (GPU for neural networks)
│  ├─ Framework: TensorFlow + PyTorch containers
│  └─ Orchestration: SageMaker Pipelines
│
├─ Model Serving: TensorFlow Serving
│  ├─ Deployment: Kubernetes pods (5 replicas)
│  ├─ Endpoint: /v1/models/fraud-detection:predict
│  └─ Latency SLA: <100ms p95
│
├─ Feature Store: AWS Feature Store
│  ├─ Online Features: Real-time inference features
│  └─ Offline Features: Historical data for training
│
└─ Model Registry: MLflow
   ├─ Model Versioning: Git-style version control
   └─ Experiment Tracking: Hyperparameter logs

DATA PIPELINE:
- Streaming: Apache Kafka for real-time transactions
- Batch Processing: Apache Spark on EMR for training data
- Storage: S3 for model artifacts and training datasets
- Preprocessing: Feature engineering microservice

MICROSERVICES (Non-ML):
1. Transaction API (transaction-api)
2. Feature Engineering Service (feature-svc)
3. ML Inference Service (ml-inference-svc)
4. Alert Service (alert-svc)
5. Analytics Service (analytics-svc)

KUBERNETES DEPLOYMENT:
- ML Pods: GPU-enabled nodes for inference
- Standard Pods: CPU nodes for traditional services
- Auto-scaling: Based on inference request volume

AI/ML MONITORING:
- Model Performance: MLflow metrics tracking
- Inference Monitoring: Prediction distribution analysis
- Data Drift Detection: Evidently AI for feature drift
- Model Explainability: SHAP values for fraud decisions

SECURITY INFRASTRUCTURE:
- Network: Isolated VPC subnet (10.100.50.0/24) for ML services only
- Authentication: Cognito with MFA + OAuth 2.0 JWT tokens + API key rotation
- API Gateway: Kong with strict rate limiting (10 req/min/user, 100 req/min total)
- WAF: AWS WAF with custom rules blocking ML model extraction patterns
- EDR/XDR: GuardDuty + Falco with ML-specific threat detection rules
- SIEM: CloudWatch + Prometheus with query pattern anomaly detection

ADVERSARIAL DEFENSE (MITRE ATLAS Framework):
- Adversarial Training: Models trained on FGSM, PGD, C&W adversarial examples
- Input Validation: Adversarial detection classifier (99.2% detection rate)
- Model Watermarking: Embedded fingerprints enable detection of model theft
- Differential Privacy: DP-SGD (ε=1.0) limits membership inference attacks
- Rate Limiting: Prevents model extraction (would require 700 days at current limit)
- Data Poisoning Detection: Automated influence function analysis on training data
═══════════════════════════════════════════════════════════════════════════`,

        'AI_ML_System_Vendor_Correspondence.txt': `═══════════════════════════════════════════════════════════════════════════
EMAIL THREAD - TENSORFLOW SERVING VULNERABILITY
═══════════════════════════════════════════════════════════════════════════

From: tensorflow-security@google.com
To: ml-platform@agency.gov.sg
Date: May 2, 2026 08:30 PST
Subject: Security Advisory: CVE-2023-25659 - TensorFlow Serving v2.12

───────────────────────────────────────────────────────────────────────────

Dear ML Platform Team,

TensorFlow Security Team has identified CVE-2023-25659 (CVSS 7.8 HIGH) affecting
TensorFlow Serving v2.12.x. Based on your current configuration, the effective
risk is significantly reduced to LOW due to comprehensive ML-specific defense controls.

PATCH AVAILABILITY:
- TensorFlow Serving v2.15.1 with full patch: May 12, 2026 (35 days)
- Fast-track migration support: Google AI Professional Services included
- Migration guide v2.12 → v2.15: Available with automated tooling

UPGRADE PLAN (35-Day Window):
Week 1-2: Model re-export + staging deployment
  - XGBoost/LSTM models re-exported with TF 2.15 SavedModel format
  - Automated compatibility verification tooling provided

Week 3-4: A/B testing + production validation
  - Champion vs Challenger deployment for statistical validation
  - Automated prediction parity testing (target: >99.9% match)

Week 5: Production rollout + monitoring
  - Blue-green deployment with instant rollback capability
  - Extended monitoring period for model drift detection

RISK ASSESSMENT:
While CVE-2023-25659 has a HIGH base score of 7.8, your current ML-specific
controls provide comprehensive protection that reduces the effective risk to LOW:

✓ Strict rate limiting: 10 queries/min/user, 100/min total
  → Model extraction requires >100K queries = 700 days at current limit

✓ High privilege requirement: MFA + OAuth 2.0 + API key with IP whitelisting
  → Only authenticated ML engineers can access inference API

✓ Adversarial detection: Separate classifier blocks 99.2% of adversarial inputs
  → Tested against FGSM, PGD, C&W attack methods

✓ Model watermarking: Embedded fingerprints enable detection of model theft
  → Cryptographic verification via query pattern analysis

✓ Differential privacy: DP-SGD (ε=1.0) limits membership inference
  → Attack success rate <53% (random guess baseline)

AI-SPECIFIC MITIGATIONS (Defense-in-Depth):
Your existing controls provide comprehensive ML security:

1. INFERENCE RATE LIMITING:
   - Kong API Gateway: 10 queries/min/user, 100/min total
   - Exponential backoff for repeated violations
   - Model extraction mathematically infeasible within any reasonable timeframe

2. INPUT VALIDATION + ANOMALY DETECTION:
   - Adversarial detection classifier (99.2% detection rate on known attacks)
   - Evidently AI monitoring for query pattern anomalies
   - Real-time alerting for systematic feature probing patterns

3. MODEL WATERMARKING + FINGERPRINTING:
   - Digital fingerprints embedded in model weights
   - Enables detection of exfiltrated models via query verification
   - Already supported in your MLflow registry

4. ADVERSARIAL TRAINING:
   - Continue your current adversarial training regimen
   - Hardens model against crafted inputs (99.2% detection on FGSM/PGD/C&W)
   - Dual benefit: security + model robustness

5. DIFFERENTIAL PRIVACY:
   - Your DP-SGD implementation (ε=1.0) limits membership inference
   - Attack success rate <53% (essentially random guessing)
   - Protects training data even if model is partially extracted

EXPLOITATION LIKELIHOOD - VERY LOW:
- Requires deep ML expertise + extensive query patterns (>100K requests)
- Your rate limiting makes extraction infeasible (would require 700 days)
- High privilege requirement (MFA + OAuth + API key) limits attack surface
- No automated tools publicly available for TensorFlow Serving exploitation
- Defense-in-depth (rate limiting + WAF + mTLS + watermarking) significantly raises attack bar

EPSS SCORE: 0.08% (very low probability of exploitation in wild)

RECOMMENDATION:
Accept risk for 35-day window with comprehensive ML-specific controls.
Effective CVSS reduced to 3.6 (LOW) - proceed with May 12 upgrade as planned.

We will provide weekly threat intelligence updates specific to ML/AI
attack techniques.

Best regards,

Dr. Priya Sharma
TensorFlow Security Team
Google Brain
tensorflow-security@google.com

───────────────────────────────────────────────────────────────────────────

From: ml-platform@agency.gov.sg
To: tensorflow-security@google.com
Cc: data-science-lead@agency.gov.sg
Date: May 3, 2026 14:15 SGT
Subject: RE: CVE-2023-25659 - Risk Acceptance with ML Mitigations

───────────────────────────────────────────────────────────────────────────

Dr. Sharma,

Thank you for the detailed risk assessment. Our ML engineering team agrees
that the effective risk is LOW (CVSS 3.6) given our comprehensive ML-specific
defense-in-depth controls.

DECISION: Risk Acceptance for 35-Day Window

RISK ACCEPTANCE RATIONALE:
1. Multiple ML-specific mitigation layers reduce effective risk to LOW:
   - Strict rate limiting (10 req/min/user) makes model extraction infeasible (700 days)
   - Adversarial detection classifier blocks 99.2% of known attack methods
   - Model watermarking enables detection of exfiltrated models
   - Differential privacy (DP-SGD ε=1.0) limits membership inference to <53% success
   - High privilege requirement (MFA + OAuth + API key) restricts attack surface

2. Business impact minimal:
   - Confidentiality impact LOW (C:L) - watermarking enables theft detection
   - No integrity or availability impact (I:N, A:N)
   - EPSS score 0.08% - very low exploitation probability

3. Alignment with model lifecycle:
   - May 12 TensorFlow upgrade aligns with monthly model refresh cycle
   - 35-day window allows proper A/B testing + statistical validation
4. Current adversarial training already hardens against crafted inputs

We will implement all recommended mitigations and schedule the upgrade
for our June sprint.

ML Platform Team

═══════════════════════════════════════════════════════════════════════════
END OF EMAIL THREAD
═══════════════════════════════════════════════════════════════════════════`,

        'AI_ML_System_Security_Assessment.txt': `═══════════════════════════════════════════════════════════════════════════
AI/ML SECURITY RISK ASSESSMENT
═══════════════════════════════════════════════════════════════════════════

SYSTEM CLASSIFICATION: AI/ML Platform (Machine Learning)

DETECTED AI/ML COMPONENTS:
✓ Machine Learning Models: XGBoost + LSTM Neural Network
✓ Model Inference Service: TensorFlow Serving
✓ Model Training Pipeline: SageMaker automated training
✓ Feature Engineering: Real-time feature extraction
✓ Model Registry: MLflow for version control

AI-SPECIFIC THREAT LANDSCAPE (MITRE ATLAS):

1. MODEL EXTRACTION RISK:
   - Threat: Attackers query inference API to reverse-engineer model
   - Mitigant: Rate limiting (1000 queries/hour per user)
   - Residual Risk: MEDIUM

2. ADVERSARIAL EXAMPLES:
   - Threat: Crafted transactions designed to evade fraud detection
   - Mitigant: Adversarial training + input validation
   - Residual Risk: MEDIUM-LOW

3. MODEL POISONING:
   - Threat: Malicious data injection during training
   - Mitigant: Training data validation + anomaly detection
   - Residual Risk: LOW

4. MODEL INVERSION:
   - Threat: Reconstruct sensitive training data from model
   - Mitigant: Differential privacy + PII anonymization
   - Residual Risk: LOW

TRADITIONAL SECURITY (MITRE ATT&CK):
✓ Microservices architecture with container orchestration
✓ Kubernetes cluster on AWS cloud
✓ API Gateway for access control
✓ Network segmentation via Kubernetes network policies

DEPLOYMENT CONTEXT:
- Cloud Provider: AWS
- Containerization: Docker on Kubernetes
- AI Framework: TensorFlow + PyTorch
- Production ML: Yes (real-time inference)

RECOMMENDATION:
Accept risk for 45-day window with enhanced ML-specific monitoring:
- Model performance dashboards
- Inference request pattern analysis
- Data drift alerts
- Adversarial attack detection
═══════════════════════════════════════════════════════════════════════════`,

        'AI_ML_System_Diagram.txt': `═══════════════════════════════════════════════════════════════════════════
SYSTEM DIAGRAM - AI/ML FRAUD DETECTION SYSTEM
═══════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────────┐
│                    EXTERNAL ZONE (Financial Institutions)                │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐          │
│  │  Banks       │      │ Payment      │      │ Merchants    │          │
│  │  (API)       │      │ Processors   │      │ (Webhooks)   │          │
│  └──────┬───────┘      └──────┬───────┘      └──────┬───────┘          │
└─────────┼──────────────────────┼─────────────────────┼──────────────────┘
          │                      │                     │
          │        HTTPS/TLS     │                     │
┌─────────┼──────────────────────┼─────────────────────┼──────────────────┐
│         │   AWS PERIMETER      │                     │                  │
│         ▼                      ▼                     ▼                  │
│  ┌────────────────────────────────────────────────────────────┐        │
│  │  Kong API Gateway + AWS WAF                                │        │
│  │  - Rate limiting (prevent model extraction)                │        │
│  │  - Authentication (OAuth 2.0)                              │        │
│  │  - Input validation (block adversarial inputs)             │        │
│  └──────────────┬─────────────────────────────────────────────┘        │
└─────────────────┼───────────────────────────────────────────────────────┘
                  │
                  │
┌─────────────────┼───────────────────────────────────────────────────────┐
│                 │    KUBERNETES CLUSTER (EKS) - ML WORKLOADS            │
│                 ▼                                                       │
│  ═══════════════════════════════════════════════════════════════      │
│  ║         APPLICATION MICROSERVICES                           ║      │
│  ═══════════════════════════════════════════════════════════════      │
│  ║  ┌─────────────────┐  ┌─────────────────┐  ┌────────────┐  ║      │
│  ║  │ Transaction     │  │ Fraud Scoring   │  │ Alert      │  ║      │
│  ║  │ API Service     │  │ Service         │  │ Service    │  ║      │
│  ║  │ (Ingestion)     │  │ (Orchestration) │  │            │  ║      │
│  ║  └────────┬────────┘  └────────┬────────┘  └────────────┘  ║      │
│  ═══════════════════════════════════════════════════════════════      │
│           │                      │                                     │
│           │                      │                                     │
│  ═══════════════════════════════════════════════════════════════      │
│  ║         ML INFERENCE LAYER                                  ║      │
│  ═══════════════════════════════════════════════════════════════      │
│  ║  ┌──────────────────────────────────────────────────────┐   ║      │
│  ║  │  FEATURE ENGINEERING MODULE                          │   ║      │
│  ║  │  - Real-time feature extraction (147 features)       │   ║      │
│  ║  │  - Feature store integration (AWS Feature Store)     │   ║      │
│  ║  │  - Feature caching (Redis)                           │   ║      │
│  ║  └────────────────────┬─────────────────────────────────┘   ║      │
│  ║                       ▼                                      ║      │
│  ║  ┌──────────────────────────────────────────────────────┐   ║      │
│  ║  │  ML MODEL INFERENCE SERVICE ◄── CVE-2023-25659        │   ║      │
│  ║  │  (TensorFlow Serving v2.12 - VULNERABLE)             │   ║      │
│  ║  │  ┌────────────────┐  ┌───────────────────────────┐  │   ║      │
│  ║  │  │ Primary Model  │  │ Secondary Model           │  │   ║      │
│  ║  │  │ XGBoost        │  │ LSTM Neural Network       │  │   ║      │
│  ║  │  │ (Fraud Score)  │  │ (Transaction Sequences)   │  │   ║      │
│  ║  │  └────────┬───────┘  └───────────┬───────────────┘  │   ║      │
│  ║  │           │                      │                   │   ║      │
│  ║  │           └──────────┬───────────┘                   │   ║      │
│  ║  │                      ▼                               │   ║      │
│  ║  │           ┌─────────────────────┐                    │   ║      │
│  ║  │           │ Ensemble Combiner   │                    │   ║      │
│  ║  │           │ (Weighted Average)  │                    │   ║      │
│  ║  │           └─────────────────────┘                    │   ║      │
│  ║  └──────────────────────────────────────────────────────┘   ║      │
│  ═══════════════════════════════════════════════════════════════      │
│           │                                                            │
│           │ Fraud Probability Score (0-1)                             │
│           ▼                                                            │
│  ┌────────────────────────────────────────────────────────────┐      │
│  │  DECISION ENGINE                                            │      │
│  │  - Threshold: 0.75 → Block transaction                     │      │
│  │  - Threshold: 0.50-0.75 → Manual review                    │      │
│  │  - Threshold: <0.50 → Approve                              │      │
│  └────────────────────────────────────────────────────────────┘      │
│                                                                        │
│  ┌────────────────────────────────────────────────────────────┐      │
│  │  DATA INFRASTRUCTURE                                        │      │
│  │  - PostgreSQL: Transaction metadata                         │      │
│  │  - Kafka: Real-time transaction stream                      │      │
│  │  - Redis: Feature caching                                   │      │
│  │  - S3: Historical training data                             │      │
│  └────────────────────────────────────────────────────────────┘      │
└────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                    ML TRAINING PIPELINE (Offline)                        │
│  ┌──────────────────────────────────────────────────────────────┐      │
│  │  AWS SAGEMAKER                                                │      │
│  │  - Weekly automated retraining                                │      │
│  │  - Training data: S3 (historical transactions)               │      │
│  │  - Model validation: Holdout set (20%)                        │      │
│  │  - A/B Testing: Champion vs Challenger models                │      │
│  │  - Model Registry: MLflow (versioning + metadata)            │      │
│  └──────────────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────────────┘

ATTACK SURFACE ANALYSIS (MITRE ATLAS):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• ML-Specific Threats:
  - Model Extraction (AML.T0024): Repeated inference calls to steal model
  - Adversarial Examples (AML.T0043): Crafted inputs to evade detection
  - Model Inversion (AML.T0025): Reconstruct training data from model
  - Data Poisoning (AML.T0018): Compromise training pipeline
  - Model Backdoor (AML.T0019): Inject trigger patterns during training

• Traditional Threats (MITRE ATT&CK):
  - API Gateway compromise (CVE-2023-25659)
  - Lateral movement to training pipeline
  - Exfiltration of model artifacts

COMPENSATING CONTROLS:
━━━━━━━━━━━━━━━━━━━━━━
✓ Rate limiting on inference API (max 100 req/min per API key)
✓ Input validation and anomaly detection on requests
✓ Model watermarking (embedded fingerprints for IP protection)
✓ Training data validation (automated poisoning detection)
✓ Adversarial training (models hardened against evasion)
✓ Inference call logging (detect extraction attempts)
✓ A/B testing (monitor for model drift/degradation)
✓ Encrypted model artifacts (S3 server-side encryption)
═══════════════════════════════════════════════════════════════════════════`
      }
    },

    'serverless': {
      name: 'Serverless Architecture',
      description: 'Event-driven serverless system with AWS Lambda and API Gateway',
      files: {
        'Serverless_RA_Presentation.txt': `═══════════════════════════════════════════════════════════════════════════
RISK ACCEPTANCE SUBMISSION - SERVERLESS DOCUMENT PROCESSING
═══════════════════════════════════════════════════════════════════════════

PROJECT: Citizen Document Processing Platform
ARCHITECTURE TYPE: Serverless Event-Driven Architecture
SUBMISSION ID: RA-2026-0201
DATE: May 8, 2026

───────────────────────────────────────────────────────────────────────────
SYSTEM ARCHITECTURE OVERVIEW
───────────────────────────────────────────────────────────────────────────

The Citizen Document Processing Platform is built entirely on serverless
architecture using AWS Lambda functions and event-driven patterns.

SERVERLESS FUNCTIONS:
- Document Upload Handler: Lambda function triggered by S3 uploads
- OCR Processor: Lambda function for document text extraction
- Validation Function: Lambda for document validation rules
- Notification Function: Lambda for email/SMS notifications
- Archive Function: Lambda for long-term storage

EVENT-DRIVEN ARCHITECTURE:
- Event Source: S3 bucket events trigger Lambda functions
- Event Bus: Amazon EventBridge for event routing
- Message Queue: SQS for async processing
- Step Functions: AWS Step Functions for workflow orchestration

AWS LAMBDA DETAILS:
- Runtime: Python 3.11 and Node.js 18
- Memory: 512MB - 3GB depending on function
- Timeout: 15 minutes max for OCR processing
- Concurrency: 1000 concurrent executions
- Cold Start Mitigation: Provisioned concurrency for critical functions

API GATEWAY:
- Type: AWS API Gateway (REST API)
- Authentication: Cognito User Pools
- Authorization: Lambda authorizer function
- Rate Limiting: 10,000 requests per second
- Endpoint: https://api.documents.gov.sg

DATA STORAGE:
- Document Storage: Amazon S3 buckets
- Metadata: DynamoDB for document metadata
- Cache: None (stateless functions)
- Archive: S3 Glacier for long-term retention

CLOUD SERVICES:
- Compute: AWS Lambda (serverless functions)
- API: Amazon API Gateway
- Storage: Amazon S3
- Database: Amazon DynamoDB
- OCR: Amazon Textract for document processing
- Notifications: Amazon SNS + SES
- Monitoring: CloudWatch Logs + X-Ray tracing

WORKFLOW:
1. Citizen uploads document to S3 via API Gateway
2. S3 event triggers Document Upload Handler Lambda
3. Lambda invokes Step Functions workflow
4. OCR Processor Lambda extracts text using Textract
5. Validation Function checks document compliance
6. Notification Function sends confirmation email
7. Archive Function moves to long-term storage

SECURITY:
- Function Isolation: Each Lambda has minimal IAM permissions
- Encryption: S3 buckets encrypted at rest (SSE-S3)
- Network: Lambda functions in VPC for database access
- API Security: AWS WAF protecting API Gateway
- Secrets: AWS Secrets Manager for API keys

───────────────────────────────────────────────────────────────────────────
VULNERABILITY DETAILS
───────────────────────────────────────────────────────────────────────────

CVE ID: CVE-2023-38545
CVSS Base Score: 9.8 (CRITICAL)
Component: cURL library in Lambda Python 3.11 runtime (via urllib3 dependency)
Impact: SOCKS5 heap overflow vulnerability
CVSS Vector: CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H

NOTE: Environmental controls significantly reduce effective risk to LOW:
- Lambda execution isolation: Each invocation in isolated Firecracker microVM (ephemeral)
- IAM least privilege: Functions cannot escalate privileges beyond role boundaries
- No SOCKS5 proxy usage: Code review confirms functions only use direct HTTPS to AWS services
- API Gateway WAF blocks malicious SOCKS5-related payloads
- VPC isolation: Lambda functions in isolated subnets with no SOCKS5 proxy access
- Ephemeral execution: Containers destroyed after invocation (no persistent backdoor possible)

───────────────────────────────────────────────────────────────────────────
COMPENSATING CONTROLS (Serverless Defense-in-Depth)
───────────────────────────────────────────────────────────────────────────

1. Lambda Execution Isolation: Each function invocation runs in isolated container
   (AWS Firecracker microVM). Compromise contained to single invocation lifecycle.

2. IAM Least Privilege: Each Lambda has minimal role-based permissions via IAM.
   Functions cannot access S3 buckets, DynamoDB tables, or secrets outside scope.
   Example: upload-handler can only s3:PutObject to upload-bucket, nothing else.

3. Network Isolation: VPC Lambda deployment with isolated subnets. No direct
   internet access - all external calls via NAT Gateway with security group rules.

4. Multi-Factor Authentication: Cognito User Pools with MFA for API access.
   Lambda authorizer validates JWT tokens + user session validity.

5. Input Validation: API Gateway request validation schemas + Lambda input
   sanitization before any external HTTP requests (blocks SOCKS5 proxy abuse).

6. WAF Protection: AWS WAF Managed Rules + custom ruleset blocking malicious
   request patterns. Rate limiting: 10,000 req/sec with IP-based throttling.

7. CloudWatch Monitoring: Real-time alarms for: Lambda errors >5%, execution
   time >3s, concurrent executions >800, IAM access denied events.

8. Immutable Infrastructure: Lambda deployment packages cryptographically signed.
   Functions redeployed from clean container images on every cold start.

9. Secrets Management: AWS Secrets Manager with automatic rotation. No hardcoded
   credentials in function code. Secret access logged and monitored.

10. Step Functions State Validation: AWS Step Functions enforces workflow states
    preventing out-of-order execution that could trigger vulnerable code paths.

ACCEPTANCE PERIOD: 30 days (Lambda runtime python3.11 update May 28, 2026)
═══════════════════════════════════════════════════════════════════════════`,

        'Serverless_Architecture_Diagram.txt': `═══════════════════════════════════════════════════════════════════════════
SERVERLESS ARCHITECTURE DOCUMENTATION
═══════════════════════════════════════════════════════════════════════════

ARCHITECTURE PATTERN: Event-Driven Serverless (Function-as-a-Service)

API LAYER:
├─ Amazon API Gateway (REST API)
├─ Authentication: AWS Cognito User Pools
├─ Authorization: Lambda Authorizer function
└─ Endpoints:
   - POST /documents/upload
   - GET /documents/{id}
   - DELETE /documents/{id}

SERVERLESS FUNCTIONS (AWS Lambda):

1. upload-handler (Python 3.11)
   - Trigger: API Gateway POST /documents/upload
   - Action: Validates upload, stores in S3, triggers workflow
   - Memory: 512MB
   - Timeout: 30 seconds

2. ocr-processor (Python 3.11)
   - Trigger: S3 event on document upload
   - Action: Calls Amazon Textract for OCR
   - Memory: 3GB (OCR processing)
   - Timeout: 15 minutes

3. validator-function (Node.js 18)
   - Trigger: EventBridge event from OCR completion
   - Action: Validates extracted text against rules
   - Memory: 1GB
   - Timeout: 5 minutes

4. notification-function (Node.js 18)
   - Trigger: SQS message from validator
   - Action: Sends email via SES, SMS via SNS
   - Memory: 512MB
   - Timeout: 1 minute

5. archive-function (Python 3.11)
   - Trigger: EventBridge scheduled rule (daily)
   - Action: Moves old documents to Glacier
   - Memory: 1GB
   - Timeout: 15 minutes

EVENT FLOW:
User Request → API Gateway → Lambda Authorizer → upload-handler Lambda
                                                        ↓
                                                    S3 Bucket
                                                        ↓
                                                S3 Event Trigger
                                                        ↓
                                                ocr-processor Lambda
                                                        ↓
                                            Amazon Textract (OCR)
                                                        ↓
                                                EventBridge Event
                                                        ↓
                                            validator-function Lambda
                                                        ↓
                                                    SQS Queue
                                                        ↓
                                            notification-function Lambda

STEP FUNCTIONS WORKFLOW:
- Orchestrates multi-step document processing
- Handles retries and error handling
- Parallel processing for multiple documents

DATA STORES:
- S3 Buckets: Raw documents, processed documents
- DynamoDB: Document metadata and status
- S3 Glacier: Long-term archive storage

SERVERLESS PATTERN: Event-driven with loose coupling
CLOUD PROVIDER: Amazon Web Services (AWS)
NO TRADITIONAL SERVERS: Fully serverless, no EC2 instances
═══════════════════════════════════════════════════════════════════════════`,

        'Serverless_Vendor_Email.txt': `═══════════════════════════════════════════════════════════════════════════
EMAIL CORRESPONDENCE - AWS LAMBDA RUNTIME VULNERABILITY
═══════════════════════════════════════════════════════════════════════════

From: aws-security-announce@amazon.com
To: devops@agency.gov.sg
Date: May 5, 2026 11:00 PST
Subject: AWS Lambda Python 3.11 Runtime - Security Bulletin CVE-2023-38545

───────────────────────────────────────────────────────────────────────────

Dear AWS Customer,

AWS Security has identified CVE-2023-38545 (cURL SOCKS5 heap overflow) affecting
the cURL library bundled in Python 3.11 Lambda runtime via urllib3 dependency.

PATCH TIMELINE:
- Updated Python 3.11 runtime with patched cURL: May 28, 2026 (30 days)
- Automatic runtime update: Opt-in (requires customer action)
- Lambda layer alternative: Available May 24, 2026 (6 days earlier)

RISK ASSESSMENT:
While CVE-2023-38545 has a CRITICAL base score of 9.8, Lambda's serverless architecture
combined with your security controls significantly reduces the effective risk to LOW:

✓ Execution isolation: Each invocation runs in isolated Firecracker microVM
  → Compromise contained to single invocation lifecycle (ephemeral)

✓ IAM least privilege: Functions cannot escalate beyond role boundaries
  → Even if compromised, cannot access resources outside IAM scope

✓ Ephemeral containers: Destroyed after invocation
  → No persistent backdoor possible (unlike traditional servers)

✓ Attack complexity HIGH (AC:H): Requires user interaction + specific code path
  → Vulnerability only exploitable if function makes SOCKS5 proxy request

✓ Limited impact: C:L (Low confidentiality), A:L (Low availability), I:N (No integrity)
  → Worst case: temporary data exposure within single invocation scope

SERVERLESS-SPECIFIC PROTECTIONS:

1. ZERO-DOWNTIME PATCHING:
   Lambda runtime updates are non-disruptive:
   - New invocations use updated runtime immediately
   - In-flight invocations complete on old runtime
   - No code deployment required (runtime managed by AWS)

2. ALTERNATIVE MITIGATION (Lambda Layers):
   - Deploy patched urllib3/cURL as Lambda layer (May 24)
   - Override built-in dependency versions
   - Recommended for functions making external HTTP requests

3. SERVERLESS ISOLATION BENEFITS:
   - Each Lambda invocation in isolated Firecracker microVM
   - No shared memory/filesystem across invocations
   - IAM role boundaries prevent lateral movement
   - Ephemeral execution prevents persistence
   - VPC isolation for database-connected functions
   - No lateral movement risk (stateless functions)

IMPACT ASSESSMENT FOR YOUR ACCOUNT:
- Affected functions: 5 (upload-handler, ocr-processor, validator-function,
  notification-function, archive-function)
- Exploitation path: Requires functions to make HTTP requests via SOCKS5 proxy
- Code review: NONE of your functions use SOCKS5 proxies (only direct HTTPS to AWS services)
- Severity: LOW - vulnerability not exploitable in your specific implementation

COMPENSATING CONTROLS (Defense-in-Depth):
1. API Gateway WAF: AWS WAF Managed Rules block malicious SOCKS5-related payloads
2. Input Validation: API Gateway request validation schemas + Lambda input sanitization
3. Lambda Authorizer: Cognito authentication + JWT validation before invocation
4. CloudWatch Alarms: Real-time monitoring for errors, timeouts, IAM denials
5. VPC Isolation: Lambda functions in isolated subnets with no SOCKS5 proxy access
6. Step Functions Validation: Workflow state machine prevents out-of-order execution
7. Secrets Manager: No hardcoded proxy configurations in function code
8. IAM Least Privilege: Functions cannot modify network settings or add proxy configs

SERVERLESS SECURITY POSTURE (Inherent Protection):
Your serverless architecture provides built-in defense-in-depth:
- Immutable infrastructure: Functions redeployed from clean container images
- Ephemeral execution: Containers destroyed after invocation (no persistence)
- Execution isolation: Firecracker microVMs prevent cross-invocation compromise
- Limited execution time: 3-15 minute timeouts limit attack window
- CloudWatch logs: All invocations logged for forensic analysis
- No shared state: Stateless functions eliminate lateral movement risk

EPSS SCORE: 0.15% (very low probability of exploitation in serverless context)

RECOMMENDATION:
Accept risk for 30-day window. Your serverless security architecture
(WAF + input validation + function isolation + no SOCKS5 usage) makes
exploitation effectively impossible in your deployment.

AWS Security Team will monitor for any threat intelligence updates.

Best regards,

AWS Security Notifications
aws-security-announce@amazon.com

───────────────────────────────────────────────────────────────────────────

From: devops@agency.gov.sg
To: aws-security-announce@amazon.com
Date: May 6, 2026 09:45 SGT
Subject: RE: CVE-2023-38545 - Risk Acceptance for Lambda Runtime (30 Days)

───────────────────────────────────────────────────────────────────────────

AWS Security Team,

Thank you for the comprehensive risk assessment. We agree that the effective
risk is LOW (CVSS 3.9) given Lambda's serverless security architecture.

DECISION: Accept risk for 30-day window until May 28 runtime update

RISK ACCEPTANCE RATIONALE:
1. Serverless isolation reduces risk to LOW:
   - Ephemeral Firecracker microVMs contain compromise to single invocation
   - IAM least privilege prevents lateral movement
   - No persistent attack surface (containers destroyed after execution)
   - EPSS 0.15% - very low exploitation probability

2. Code review confirms vulnerability not exploitable:
   - NONE of our Lambda functions use SOCKS5 proxies
   - All external calls are direct HTTPS to AWS services only
   - cURL vulnerability requires SOCKS5 proxy usage (not present in our code)

3. Defense-in-depth controls provide comprehensive protection:
   - API Gateway WAF blocks malicious payloads
   - Input validation + sanitization before any external HTTP requests
   - VPC isolation with no SOCKS5 proxy access
   - Step Functions enforce workflow state validation
   - CloudWatch monitoring with real-time anomaly detection

4. Zero-effort patching:
   - Automatic runtime update on May 28 requires no code changes
   - Alternative Lambda layer available May 24 (6 days earlier)

We will enable automatic runtime updates on May 28. The serverless architecture's
inherent isolation makes this a LOW risk acceptance.

DevOps Team

═══════════════════════════════════════════════════════════════════════════
END OF EMAIL CORRESPONDENCE
═══════════════════════════════════════════════════════════════════════════`,

        'Serverless_Security_Assessment.txt': `═══════════════════════════════════════════════════════════════════════════
SECURITY ASSESSMENT - SERVERLESS PLATFORM
═══════════════════════════════════════════════════════════════════════════

DEPLOYMENT MODEL: Cloud (AWS Serverless)
ARCHITECTURE: Event-Driven Serverless (FaaS - Function-as-a-Service)

VERIFIED COMPONENTS:
✓ Serverless Functions: 5 AWS Lambda functions identified
✓ API Gateway: Amazon API Gateway (REST API)
✓ Event Bus: Amazon EventBridge for event routing
✓ Message Queue: Amazon SQS for async processing
✓ Workflow: AWS Step Functions for orchestration
✓ Storage: Amazon S3 buckets
✓ Database: Amazon DynamoDB (NoSQL)
✓ Cloud Services: Textract (OCR), SNS (notifications), SES (email)

SECURITY CONTROLS:
✓ WAF protection on API Gateway
✓ IAM least privilege for Lambda functions
✓ VPC isolation for sensitive functions
✓ S3 bucket encryption (SSE-S3)
✓ API authentication via Cognito
✓ Lambda authorizer for fine-grained access control

ARCHITECTURE CLASSIFICATION:
- Type: Serverless Architecture (Event-Driven)
- Pattern: Function-as-a-Service (FaaS) with event triggers
- Cloud-Native: Full AWS serverless stack
- No Traditional Servers: No EC2, no containers, pure Lambda

SERVERLESS-SPECIFIC RISKS:
1. Function Injection: Malicious code in Lambda deployments
2. Over-Privileged Functions: IAM roles with excessive permissions
3. Event Injection: Crafted S3 events triggering unintended behavior
4. Cold Start DoS: Triggering many cold starts to exhaust concurrency
5. Dependency Vulnerabilities: Vulnerable npm/pip packages in functions

ATTACK SURFACE:
- API Gateway is primary entry point (public-facing)
- S3 bucket policies must prevent unauthorized uploads
- Lambda function code is potential target if deployment compromised

No AI/ML components detected.
No container orchestration detected (pure serverless).
No traditional 3-tier architecture (event-driven FaaS model).
═══════════════════════════════════════════════════════════════════════════`,

        'Serverless_System_Diagram.txt': `═══════════════════════════════════════════════════════════════════════════
SYSTEM DIAGRAM - SERVERLESS EVENT-DRIVEN ARCHITECTURE
═══════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────────┐
│                    EXTERNAL ZONE (Citizens/Government Staff)             │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐          │
│  │  Web Portal  │      │ Mobile App   │      │ Email System │          │
│  │              │      │              │      │ (Auto-submit)│          │
│  └──────┬───────┘      └──────┬───────┘      └──────┬───────┘          │
└─────────┼──────────────────────┼─────────────────────┼──────────────────┘
          │                      │                     │
          │        HTTPS         │                     │
┌─────────┼──────────────────────┼─────────────────────┼──────────────────┐
│         │   AWS CLOUD          │                     │                  │
│         ▼                      ▼                     ▼                  │
│  ┌────────────────────────────────────────────────────────────┐        │
│  │  API GATEWAY (REST + WebSocket)                            │        │
│  │  - Authentication (IAM + Cognito)                           │        │
│  │  - Rate limiting                                            │        │
│  │  - Request validation                                       │        │
│  │  - CORS policies                                            │        │
│  └──────────────┬─────────────────────────────────────────────┘        │
│                 │                                                       │
│                 │  Async invoke                                         │
│                 ▼                                                       │
│  ═══════════════════════════════════════════════════════════════      │
│  ║         EVENT-DRIVEN WORKFLOW                               ║      │
│  ═══════════════════════════════════════════════════════════════      │
│  ║                                                              ║      │
│  ║  CITIZEN UPLOADS DOCUMENT                                   ║      │
│  ║       │                                                      ║      │
│  ║       ▼                                                      ║      │
│  ║  ┌─────────────────────────────────┐                        ║      │
│  ║  │  S3 BUCKET (Document Storage)   │ ◄── CVE-2023-38545      ║      │
│  ║  │  - Bucket: citizen-docs-upload  │     (VULNERABLE)       ║      │
│  ║  │  - Versioning enabled           │                        ║      │
│  ║  │  - Server-side encryption       │                        ║      │
│  ║  └────────────┬────────────────────┘                        ║      │
│  ║               │                                              ║      │
│  ║               │ S3 Event: ObjectCreated                      ║      │
│  ║               ▼                                              ║      │
│  ║  ┌─────────────────────────────────┐                        ║      │
│  ║  │  Lambda: Document Upload        │                        ║      │
│  ║  │  Handler (Python 3.11)          │                        ║      │
│  ║  │  - File type validation         │                        ║      │
│  ║  │  - Malware scan (ClamAV)        │                        ║      │
│  ║  │  - Metadata extraction          │                        ║      │
│  ║  └────────────┬────────────────────┘                        ║      │
│  ║               │                                              ║      │
│  ║               │ SQS Message: Process Document                ║      │
│  ║               ▼                                              ║      │
│  ║  ┌─────────────────────────────────┐                        ║      │
│  ║  │  SQS QUEUE (Processing Queue)   │                        ║      │
│  ║  │  - Dead Letter Queue enabled    │                        ║      │
│  ║  │  - Visibility timeout: 5 min    │                        ║      │
│  ║  └────────────┬────────────────────┘                        ║      │
│  ║               │                                              ║      │
│  ║               │ Batch polling (1-10 messages)                ║      │
│  ║               ▼                                              ║      │
│  ║  ┌─────────────────────────────────┐                        ║      │
│  ║  │  Lambda: OCR Processor          │                        ║      │
│  ║  │  (Python 3.11 + Tesseract)      │                        ║      │
│  ║  │  - Text extraction from PDF     │                        ║      │
│  ║  │  - Image OCR processing         │                        ║      │
│  ║  │  - Structured data extraction   │                        ║      │
│  ║  └────────────┬────────────────────┘                        ║      │
│  ║               │                                              ║      │
│  ║               │ EventBridge Event: OCR Complete              ║      │
│  ║               ▼                                              ║      │
│  ║  ┌─────────────────────────────────┐                        ║      │
│  ║  │  EventBridge (Event Bus)        │                        ║      │
│  ║  │  - Event filtering              │                        ║      │
│  ║  │  - Multi-target routing         │                        ║      │
│  ║  └─────────┬──────────┬────────────┘                        ║      │
│  ║            │          │                                      ║      │
│  ║            │          └──────────────┐                       ║      │
│  ║            ▼                         ▼                       ║      │
│  ║  ┌──────────────────┐    ┌──────────────────────┐          ║      │
│  ║  │ Lambda:          │    │ Lambda:              │          ║      │
│  ║  │ Validation       │    │ Notification         │          ║      │
│  ║  │ (Node.js 20)     │    │ (Python 3.11)        │          ║      │
│  ║  │ - Business rules │    │ - Email via SES      │          ║      │
│  ║  │ - Data quality   │    │ - SMS via SNS        │          ║      │
│  ║  └────────┬─────────┘    └──────────────────────┘          ║      │
│  ║           │                                                  ║      │
│  ║           │ Write to DynamoDB                                ║      │
│  ║           ▼                                                  ║      │
│  ║  ┌─────────────────────────────────┐                        ║      │
│  ║  │  DynamoDB (NoSQL Database)      │                        ║      │
│  ║  │  - Document metadata            │                        ║      │
│  ║  │  - Processing status            │                        ║      │
│  ║  │  - Extracted text data          │                        ║      │
│  ║  └────────────┬────────────────────┘                        ║      │
│  ║               │                                              ║      │
│  ║               │ DynamoDB Stream (Change Data Capture)        ║      │
│  ║               ▼                                              ║      │
│  ║  ┌─────────────────────────────────┐                        ║      │
│  ║  │  Lambda: Archive Function       │                        ║      │
│  ║  │  (Python 3.11)                  │                        ║      │
│  ║  │  - Long-term storage to S3      │                        ║      │
│  ║  │  - Glacier transition (90 days) │                        ║      │
│  ║  └─────────────────────────────────┘                        ║      │
│  ║                                                              ║      │
│  ═══════════════════════════════════════════════════════════════      │
│                                                                        │
│  ┌────────────────────────────────────────────────────────────┐      │
│  │  SUPPORTING SERVICES                                        │      │
│  │  - CloudWatch Logs (Lambda execution logs)                  │      │
│  │  - X-Ray (Distributed tracing)                              │      │
│  │  - SNS (Email/SMS notifications)                            │      │
│  │  - SES (Email delivery)                                     │      │
│  │  - Secrets Manager (API keys, credentials)                  │      │
│  └────────────────────────────────────────────────────────────┘      │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘

ATTACK SURFACE ANALYSIS:
━━━━━━━━━━━━━━━━━━━━━━━━━
• Entry Point: API Gateway (public-facing REST endpoint)
• Vulnerable Component: S3 Bucket (CVE-2023-38545 - improper access control)
• Attack Vector: Unauthorized S3 bucket access via misconfigured policy
• Serverless-Specific Risks:
  - Lambda cold start delays (DoS potential)
  - Function execution role over-permissioning
  - Event injection via S3/SQS/EventBridge
  - Secrets in environment variables (if not using Secrets Manager)

COMPENSATING CONTROLS:
━━━━━━━━━━━━━━━━━━━━━━
✓ API Gateway authentication (IAM + Cognito)
✓ S3 bucket encryption (AES-256 server-side)
✓ Lambda execution roles (least privilege IAM)
✓ VPC endpoints for private S3 access (no internet routing)
✓ CloudWatch alarms on failed invocations
✓ Dead Letter Queue (DLQ) for failed messages
✓ Input validation in all Lambda functions
✓ ClamAV malware scanning on uploads
✓ S3 versioning (recovery from unauthorized modifications)
✓ CloudTrail logging (audit all S3/Lambda API calls)
═══════════════════════════════════════════════════════════════════════════`
      }
    }
  };


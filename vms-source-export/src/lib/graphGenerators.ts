import { MarkerType, Node, Edge } from '@xyflow/react';

export interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

const X_OFFSET = 250;
const Y_INPUT = 150;

export function generateGraphForArchitecture(systemType: string, cveId: string): GraphData {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  // Base Attacker Node
  nodes.push({ 
    id: 'attacker', 
    position: { x: 0, y: Y_INPUT }, 
    data: { label: 'Attacker (External)' }, 
    type: 'input',
    style: { border: '2px solid #ef4444', backgroundColor: '#fef2f2', fontWeight: 'bold' } 
  });

  if (systemType === '3-tier-web-application') {
    nodes.push(
      { id: 'waf', position: { x: X_OFFSET * 1, y: Y_INPUT }, data: { label: 'WAF / Load Balancer' } },
      { id: 'web', position: { x: X_OFFSET * 2, y: Y_INPUT }, data: { label: 'Web Server (DMZ)' } },
      { id: 'app', position: { x: X_OFFSET * 3, y: Y_INPUT }, data: { label: 'App Server (Internal)' } },
      { id: 'db', position: { x: X_OFFSET * 4, y: Y_INPUT }, data: { label: 'Database' }, type: 'output' }
    );

    // Default connections
    edges.push(
      { id: 'e-att-waf', source: 'attacker', target: 'waf', animated: true },
      { id: 'e-waf-web', source: 'waf', target: 'web' },
      { id: 'e-web-app', source: 'web', target: 'app' },
      { id: 'e-app-db', source: 'app', target: 'db' }
    );

    // Apply CVE specific overrides for 3-Tier
    if (cveId.includes('CVE-2024-3400')) {
      // PAN-OS vulnerability
      nodes.find(n => n.id === 'waf')!.style = { border: '2px solid #ef4444', backgroundColor: '#fef2f2' };
      nodes.find(n => n.id === 'waf')!.data.label = 'Palo Alto Gateway (Vulnerable)';
      edges.find(e => e.id === 'e-att-waf')!.label = 'Command Injection';
      edges.find(e => e.id === 'e-att-waf')!.style = { stroke: '#ef4444', strokeWidth: 2 };
      edges.find(e => e.id === 'e-att-waf')!.markerEnd = { type: MarkerType.ArrowClosed, color: '#ef4444' };
      
      // Show lateral movement
      edges.push({
        id: 'lat-move',
        source: 'waf',
        target: 'app',
        label: 'Lateral Movement (Bypass)',
        animated: true,
        style: { stroke: '#ef4444', strokeDasharray: '5 5' },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' }
      });
      nodes.find(n => n.id === 'app')!.style = { border: '2px solid #f59e0b', backgroundColor: '#fffbeb' };
    }

  } else if (systemType === 'microservices-architecture') {
    nodes.push(
      { id: 'api', position: { x: X_OFFSET * 1, y: Y_INPUT }, data: { label: 'API Gateway' } },
      { id: 'auth', position: { x: X_OFFSET * 2, y: 50 }, data: { label: 'Auth Service' } },
      { id: 'svc1', position: { x: X_OFFSET * 2, y: 250 }, data: { label: 'Catalog Service' } },
      { id: 'svc2', position: { x: X_OFFSET * 3, y: 150 }, data: { label: 'Order Service' } },
      { id: 'redis', position: { x: X_OFFSET * 4, y: 150 }, data: { label: 'Redis Cache' }, type: 'output' }
    );
    edges.push(
      { id: 'e-att-api', source: 'attacker', target: 'api', animated: true },
      { id: 'e-api-auth', source: 'api', target: 'auth' },
      { id: 'e-api-svc1', source: 'api', target: 'svc1' },
      { id: 'e-auth-svc2', source: 'auth', target: 'svc2' },
      { id: 'e-svc1-svc2', source: 'svc1', target: 'svc2' },
      { id: 'e-svc2-redis', source: 'svc2', target: 'redis' }
    );

    if (cveId.includes('CVE-2023-38545')) {
      nodes.find(n => n.id === 'api')!.style = { border: '2px solid #ef4444', backgroundColor: '#fef2f2' };
      nodes.find(n => n.id === 'api')!.data.label = 'API Gateway (cURL Vuln)';
      edges.find(e => e.id === 'e-att-api')!.label = 'Heap Buffer Overflow';
      edges.find(e => e.id === 'e-att-api')!.style = { stroke: '#ef4444', strokeWidth: 2 };
    }

  } else if (systemType === 'serverless-architecture') {
    nodes.push(
      { id: 'cdn', position: { x: X_OFFSET * 1, y: Y_INPUT }, data: { label: 'CloudFront CDN' } },
      { id: 'apigw', position: { x: X_OFFSET * 2, y: Y_INPUT }, data: { label: 'API Gateway' } },
      { id: 'lambda', position: { x: X_OFFSET * 3, y: Y_INPUT }, data: { label: 'Lambda Function' } },
      { id: 's3', position: { x: X_OFFSET * 4, y: 50 }, data: { label: 'S3 Bucket' }, type: 'output' },
      { id: 'dynamo', position: { x: X_OFFSET * 4, y: 250 }, data: { label: 'DynamoDB' }, type: 'output' }
    );
    edges.push(
      { id: 'e-att-cdn', source: 'attacker', target: 'cdn', animated: true },
      { id: 'e-cdn-apigw', source: 'cdn', target: 'apigw' },
      { id: 'e-apigw-lambda', source: 'apigw', target: 'lambda' },
      { id: 'e-lambda-s3', source: 'lambda', target: 's3' },
      { id: 'e-lambda-dynamo', source: 'lambda', target: 'dynamo' }
    );
  } else if (systemType === 'ai-ml-system') {
    nodes.push(
      { id: 'api', position: { x: X_OFFSET * 1, y: Y_INPUT }, data: { label: 'Inference API' } },
      { id: 'model', position: { x: X_OFFSET * 2, y: Y_INPUT }, data: { label: 'Model Serving' } },
      { id: 'store', position: { x: X_OFFSET * 3, y: Y_INPUT }, data: { label: 'Model Store / Weights' }, type: 'output' },
      { id: 'data', position: { x: X_OFFSET * 2, y: 300 }, data: { label: 'Training Data' }, type: 'output' }
    );
    edges.push(
      { id: 'e-att-api', source: 'attacker', target: 'api', animated: true },
      { id: 'e-api-model', source: 'api', target: 'model' },
      { id: 'e-model-store', source: 'model', target: 'store' },
      { id: 'e-data-model', source: 'data', target: 'model' }
    );

    if (cveId.includes('CVE-2024-24590') || cveId.includes('CVE-2024')) {
       // Assuming PyTorch/Pickle injection pattern common in AI
       nodes.find(n => n.id === 'api')!.style = { border: '2px solid #ef4444', backgroundColor: '#fef2f2' };
       nodes.find(n => n.id === 'api')!.data.label = 'API (Unsafe Deserialization)';
       edges.find(e => e.id === 'e-att-api')!.label = 'Malicious Prompt/Payload';
       edges.find(e => e.id === 'e-att-api')!.style = { stroke: '#ef4444', strokeWidth: 2 };
       
       edges.push({
        id: 'data-poison',
        source: 'api',
        target: 'store',
        label: 'Model Poisoning',
        animated: true,
        style: { stroke: '#ef4444', strokeDasharray: '5 5' },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' }
      });
      nodes.find(n => n.id === 'store')!.style = { border: '2px solid #f59e0b', backgroundColor: '#fffbeb' };
    }
  }

  // Fallback if system type is unknown
  if (nodes.length === 1) {
    nodes.push(
      { id: 'target', position: { x: X_OFFSET * 1, y: Y_INPUT }, data: { label: 'Vulnerable Asset' } }
    );
    edges.push({
      id: 'e-att-target', source: 'attacker', target: 'target', animated: true, label: cveId,
      style: { stroke: '#ef4444', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' }
    });
  }

  return { nodes, edges };
}

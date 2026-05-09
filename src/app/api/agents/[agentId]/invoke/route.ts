import { NextRequest, NextResponse } from 'next/server'

const RESPONSES: Record<string, (prompt: string) => string> = {
  'agent-alpha': p => `[ALPHA ANALYST v2.1]\n\nINPUT: "${p}"\n\n━━ ANALYSIS COMPLETE ━━\n\n• Detected 3 primary clusters in dataset\n• Anomaly at index 47 (z-score: 2.83, flagged)\n• Correlation matrix: A↔C = 0.91 (strong positive)\n• Temporal trend: +12.4% QoQ\n\nCONFIDENCE: 94.2%\nPROCESSING TIME: 0.34s`,

  'agent-beta': p => `[BETA WRITER v3.0]\n\nINPUT: "${p}"\n\n━━ GENERATED CONTENT ━━\n\nIn today's rapidly evolving landscape, ${p.split(' ').slice(0, 3).join(' ')} represents a paradigm shift in how we approach complex challenges. By leveraging cutting-edge methodologies...\n\nREADABILITY: 84/100 | SEO SCORE: 91/100\nWORDS: 247 | EST. READ: 1.2 min`,

  'agent-gamma': p => `[GAMMA TRANSLATOR v1.8]\n\nSOURCE (EN): "${p}"\n\n━━ TRANSLATIONS ━━\n\nVI: "${p.replace(/is/g, 'là').replace(/the /g, 'các ').replace(/a /g, 'một ')}"\n\nJA: "これは重要なメッセージです。"\nZH: "这是一个重要的信息。"\n\nCONFIDENCE: 97.8% | DOMAIN: General`,

  'agent-delta': p => `[DELTA CODER v4.2]\n\nANALYZING: "${p}"\n\n━━ CODE REVIEW ━━\n\n✅ No critical vulnerabilities\n✅ No hardcoded credentials\n⚠  Line 12: Magic number, extract to constant\n⚠  Line 28: Unchecked return value\n💡 Suggest: Add input validation on line 5\n💡 Suggest: Consider reentrancy guard\n\nSECURITY SCORE: 87/100 | QUALITY: 82/100`,
}

export async function POST(
  req: NextRequest,
  { params }: { params: { agentId: string } }
) {
  const { agentId } = params
  const body = await req.json()
  const { prompt = '', caller } = body

  // Simulate processing time
  await new Promise(r => setTimeout(r, 600 + Math.random() * 800))

  const handler = RESPONSES[agentId]
  const result = handler
    ? handler(prompt || 'No input provided')
    : `[AGENT ${agentId.toUpperCase()}]\n\nProcessed: "${prompt}"\n\nTask completed successfully.`

  return NextResponse.json({ agentId, result, caller, timestamp: Date.now() })
}

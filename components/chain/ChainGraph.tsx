"use client"

import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
} from "reactflow"
import "reactflow/dist/style.css"
import { useMemo } from "react"

type ChainNode = {
  id: number
  position: number
  giverWallet: string
  receiverWallet: string
  description: string
  status: string
}

type Props = {
  nodes: ChainNode[]
  originWallet: string
  isLoop?: boolean
}

function shortAddress(addr: string) {
  return addr.slice(0, 6) + "..." + addr.slice(-4)
}

export function ChainGraph({ nodes, originWallet, isLoop = false }: Props) {
  const { flowNodes, flowEdges } = useMemo(() => {
    const wallets: string[] = []
    if (nodes.length > 0) {
      wallets.push(nodes[0].giverWallet)
      for (const n of nodes) {
        if (!wallets.includes(n.receiverWallet)) wallets.push(n.receiverWallet)
      }
    }

    const angleStep = (2 * Math.PI) / Math.max(wallets.length, 3)
    const radius = 160

    const flowNodes: Node[] = wallets.map((wallet, i) => {
      const angle = i * angleStep - Math.PI / 2
      const isOrigin = wallet === originWallet
      return {
        id: wallet,
        position: {
          x: radius * Math.cos(angle) + radius,
          y: radius * Math.sin(angle) + radius,
        },
        data: {
          label: (
            <div className="text-center px-2 py-1">
              {isOrigin && <div className="text-xs font-bold text-white mb-0.5">起点</div>}
              <div className="text-xs font-mono">{shortAddress(wallet)}</div>
            </div>
          ),
        },
        style: {
          background: isOrigin ? "#0052FF" : "#f8fafc",
          color: isOrigin ? "#fff" : "#0f172a",
          border: isOrigin ? "2px solid #0040cc" : "1px solid #e2e8f0",
          borderRadius: "50%",
          width: 80,
          height: 80,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      }
    })

    const flowEdges: Edge[] = nodes.map((n) => ({
      id: `e${n.id}`,
      source: n.giverWallet,
      target: n.receiverWallet,
      label: n.description.slice(0, 12) + (n.description.length > 12 ? "..." : ""),
      animated: n.status === "pending",
      style: {
        stroke: n.status === "confirmed" ? "#0052FF" : "#94a3b8",
        strokeWidth: 2,
      },
      labelStyle: { fontSize: 11 },
    }))

    if (isLoop && nodes.length > 0) {
      const last = nodes[nodes.length - 1]
      flowEdges.push({
        id: "loop-close",
        source: last.receiverWallet,
        target: originWallet,
        animated: true,
        style: { stroke: "#f59e0b", strokeWidth: 3, strokeDasharray: "5,5" },
        label: "🎉 ループ完成！",
        labelStyle: { fontSize: 12, fontWeight: "bold" },
      })
    }

    return { flowNodes, flowEdges }
  }, [nodes, originWallet, isLoop])

  return (
    <div style={{ height: 400 }} className="border rounded-2xl overflow-hidden bg-accent/30">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        fitView
        attributionPosition="bottom-right"
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#e2e8f0" />
        <Controls />
        <MiniMap zoomable pannable />
      </ReactFlow>
    </div>
  )
}

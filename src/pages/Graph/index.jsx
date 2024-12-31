import React, { useCallback, useContext, useEffect } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  MarkerType,
} from '@xyflow/react';
import Dagre from '@dagrejs/dagre';

import '@xyflow/react/dist/style.css';
import styles from './Graph.module.css';

import { showErrorToastNotification, showInfoToastNotification } from '../../components/ToastNotification';

import { apiFetchGraph } from '../../api/operations';

import { RefreshAuthContext } from "../../App";
import Button from '../../components/Button';

const initialNodes = [];
// const initialNodes = [
//   { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
//   { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
//   { id: '3', position: { x: 50, y: 50 }, data: { label: '3' } },
// ];
const initialEdges = [];
// const initialEdges = [
//   { id: 'e1-2', source: '1', target: '2' }
// ];

const nodeOffsets = {
  connected: {
    origin: {
      x: 0,
      y: 0
    },
    scaling: {
      x: 240,
      y: 80
    }
  },
  unconnected: {
    origin: {
      x: 800,
      y: 0
    },
    scaling: {
      x: 160,
      y: 40
    }
  }
}

/** @type {import('@xyflow/react').DefaultEdgeOptions} */
const edgeOptions = {
  animated: true,
  style: {
    stroke: "white",
    strokeWidth: 2,
  },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: "white",
    width: 40,
    height: 40,
  }
};

const proOptions = { hideAttribution: true };

const Graph = () => {
  const refreshAuth = useContext(RefreshAuthContext);
  const flowInstance = useReactFlow();
  const [playlistNodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [linkEdges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onFlowInit = (instance) => {
    console.debug("flow loaded");
  }

  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge(params, eds));
    console.debug("new connection");
    console.debug(params);
  }, [setEdges]);

  const getLayoutedElements = (nodes, edges, options = { direction: "TB" }) => {
    const g = new Dagre.graphlib.Graph()
    g.setDefaultEdgeLabel(() => ({}));
    g.setGraph({ rankdir: options.direction, nodesep: 200, edgesep: 200, ranksep: 200 });

    edges.forEach((edge) => g.setEdge(edge.source, edge.target));

    const connectedNodesID = new Set(edges.flatMap(edge => [edge.source, edge.target]));
    const connectedNodes = nodes.filter(node => connectedNodesID.has(node.id));
    const unconnectedNodes = nodes.filter(node => !connectedNodesID.has(node.id));

    nodes.forEach((node) => {
      g.setNode(node.id, {
        ...node,
        width: node.measured?.width ?? 0,
        height: node.measured?.height ?? 0,
      })
    });

    Dagre.layout(g);

    let finalLayout = { edges };
    finalLayout.nodes = [
      ...connectedNodes.map((node) => {
        const position = g.node(node.id);
        // We are shifting the dagre node position (anchor=center center) to the top left
        // so it matches the React Flow node anchor point (top left).
        const x = position.x - (node.measured?.width ?? 0) / 2;
        const y = position.y - (node.measured?.height ?? 0) / 2;

        return { ...node, position: { x, y } };
      }),
      ...unconnectedNodes.map((node, idx) => {
        const position = {
          x: nodeOffsets.unconnected.origin.x + Math.floor(idx / 20) * nodeOffsets.unconnected.scaling.x,
          y: nodeOffsets.unconnected.origin.y + Math.floor(idx % 20) * nodeOffsets.unconnected.scaling.y,
        };
        const x = position.x - (node.measured?.width ?? 0) / 2;
        const y = position.y - (node.measured?.height ?? 0) / 2;

        return { ...node, position: { x, y } };
      })
    ];

    console.debug("layout generated");
    return finalLayout;
  };

  const arrangeLayout = (direction) => {
    const layouted = getLayoutedElements(playlistNodes, linkEdges, { direction });

    setNodes([...layouted.nodes]);
    setEdges([...layouted.edges]);

    setTimeout(flowInstance.fitView);
    console.debug("layout applied");
  }

  useEffect(() => {
    const fetchGraph = async () => {
      const resp = await apiFetchGraph();
      if (resp === undefined) {
        showErrorToastNotification("Please try again after sometime");
        return;
      }
      if (resp.status === 200) {
        // place playlist nodes
        setNodes(resp.data.playlists.map((pl, idx) => {
          return {
            id: `${pl.playlistID}`,
            position: {
              x: nodeOffsets.unconnected.origin.x + Math.floor(idx / 15) * nodeOffsets.unconnected.scaling.x,
              y: nodeOffsets.unconnected.origin.y + Math.floor(idx % 15) * nodeOffsets.unconnected.scaling.y,
            },
            data: {
              label: pl.playlistName,
              metadata: {
                pl
              }
            }
          }
        }));
        // connect links
        setEdges(resp.data.links.map((link, idx) => {
          return {
            id: `${idx}`,
            source: link.from,
            target: link.to
          }
        }));
        showInfoToastNotification("Graph updated.");
        return;
      }
      if (resp.status >= 500) {
        showErrorToastNotification(resp.data.message);
        return;
      }
      if (resp.status === 401) {
        await refreshAuth();
      }
      showErrorToastNotification(resp.data.message);
      return;
    }
    fetchGraph();
  }, [refreshAuth, setEdges, setNodes]);

  return (
    <div className={styles.graph_wrapper}>
      <ReactFlow
        nodes={playlistNodes}
        edges={linkEdges}
        defaultEdgeOptions={edgeOptions}
        connectionLineType="smoothstep"
        fitView
        proOptions={proOptions}
        colorMode={"light"}
        onInit={onFlowInit}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Controls />
        <Background variant='dots' gap={36} size={3} />
        {/* <Panel position="top-right"> */}
        {/* <button onClick={() => arrangeLayout('TB')}>Arrange vertically</button> */}
        {/* <button onClick={() => arrangeLayout('LR')}>Arrange horizontally</button> */}
        {/* </Panel> */}
      </ReactFlow>
      <div className={styles.operations_wrapper}>
        <Button onClickMethod={() => arrangeLayout('TB')}>Arrange</Button>
      </div>
    </div>
  )
}

export default Graph;

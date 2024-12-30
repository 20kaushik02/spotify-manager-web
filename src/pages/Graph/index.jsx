import React, { useCallback, useContext, useEffect } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
} from '@xyflow/react';
import Dagre from '@dagrejs/dagre';

import '@xyflow/react/dist/style.css';
import styles from './Graph.module.css';

import { showErrorToastNotification, showInfoToastNotification, showSuccessToastNotification } from '../../components/ToastNotification';

import { apiFetchGraph } from '../../api/operations';

import { RefreshAuthContext } from "../../App";

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
      x: 1000,
      y: 0
    },
    scaling: {
      x: 270,
      y: 90
    }
  },
  unconnected: {
    origin: {
      x: 0,
      y: 0
    },
    scaling: {
      x: 180,
      y: 60
    }
  }
}

const edgeOptions = {
  animated: true,
  style: {
    stroke: 'white',
  },
};

const proOptions = { hideAttribution: true };

const Graph = () => {
  const refreshAuth = useContext(RefreshAuthContext);
  const [playlistNodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [linkEdges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge(params, eds));
  }, [setEdges]);

  const getLayoutedElements = (nodes, edges, options = { direction: "TB" }) => {
    const g = new Dagre.graphlib.Graph()
    g.setDefaultEdgeLabel(() => ({}));
    g.setGraph({ rankdir: options.direction });

    edges.forEach((edge) => g.setEdge(edge.source, edge.target));

    // const connectedNodes = new Set(edges.flatMap(edge => [edge.source, edge.target]));
    // const unconnectedNodes = nodes.filter(node => !connectedNodes.has(node.id));
    nodes.forEach((node) => {
      // if (connectedNodes.has(node.id)) {
      g.setNode(node.id, {
        ...node,
        width: node.measured?.width ?? 0,
        height: node.measured?.height ?? 0,
      })
      // }
    });

    Dagre.layout(g);

    return {
      nodes: nodes.map((node) => {
        const position = g.node(node.id);
        // We are shifting the dagre node position (anchor=center center) to the top left
        // so it matches the React Flow node anchor point (top left).
        const x = position.x - (node.measured?.width ?? 0) / 2;
        const y = position.y - (node.measured?.height ?? 0) / 2;

        return { ...node, position: { x, y } };
      }),
      edges,
    };
  };


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
              x: nodeOffsets.unconnected.origin.x + Math.floor(idx / 5) * nodeOffsets.unconnected.scaling.x,
              y: nodeOffsets.unconnected.origin.y + Math.floor(idx % 5) * nodeOffsets.unconnected.scaling.y,
            },
            data: {
              label: pl.playlistName,
              meta: {
                name: pl.playlistName
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
  }, []);

  const arrangeLayout = (direction) => {
    const layouted = getLayoutedElements(playlistNodes, linkEdges, { direction });

    setNodes([...layouted.nodes]);
    setEdges([...layouted.edges]);
  }

  return (
    <div className={styles.graph_wrapper}>
      <ReactFlow
        nodes={playlistNodes}
        edges={linkEdges}
        defaultEdgeOptions={edgeOptions}
        fitView
        proOptions={proOptions}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Controls />
        <Background variant='dots' gap={36} size={3} />
        <Panel position="top-right">
          <button onClick={() => arrangeLayout('TB')}>Arrange vertically</button>
          <button onClick={() => arrangeLayout('LR')}>Arrange horizontally</button>
        </Panel>
      </ReactFlow>
      <div className={styles.operations_wrapper}>
        test
      </div>
    </div>
  )
}

export default Graph;

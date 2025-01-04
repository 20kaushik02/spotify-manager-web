import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  useReactFlow,
  MarkerType,
  BackgroundVariant,
  ConnectionLineType,
  type DefaultEdgeOptions,
  type ProOptions,
  type ReactFlowInstance,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
} from "@xyflow/react";
import Dagre, { type GraphLabel } from "@dagrejs/dagre";

import "@xyflow/react/dist/style.css";
import styles from "./Graph.module.css";

import { IoIosGitNetwork } from "react-icons/io";
import { WiCloudRefresh } from "react-icons/wi";

import {
  showErrorToastNotification,
  showInfoToastNotification,
} from "../../components/ToastNotification";

import { apiFetchGraph } from "../../api/operations";

import { RefreshAuthContext } from "../../App";
import Button from "../../components/Button";

const initialNodes: any[] = [];
const initialEdges: any[] = [];

const nodeOffsets = {
  connected: {
    origin: {
      x: 0,
      y: 0,
    },
    scaling: {
      x: 240,
      y: 80,
    },
  },
  unconnected: {
    origin: {
      x: 800,
      y: 0,
    },
    scaling: {
      x: 160,
      y: 40,
    },
  },
};

const edgeOptions: DefaultEdgeOptions = {
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
  },
};

const proOptions: ProOptions = { hideAttribution: true };

const Graph = () => {
  const refreshAuth = useContext(RefreshAuthContext);
  const flowInstance = useReactFlow();
  const [playlistNodes, setPlaylistNodes] = useState<Node[]>(initialNodes);
  const [linkEdges, setLinkEdges] = useState<Edge[]>(initialEdges);

  const onFlowInit = (_instance: ReactFlowInstance) => {
    console.debug("flow loaded");
  };

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setPlaylistNodes((nds) => applyNodeChanges(changes, nds)),
    [setPlaylistNodes]
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setLinkEdges((eds) => applyEdgeChanges(changes, eds)),
    [setLinkEdges]
  );

  const onConnect: OnConnect = useCallback(
    (connection) => {
      setLinkEdges((eds) => addEdge(connection, eds));
      console.debug(
        `new connection: ${connection.source} -> ${connection.target}`
      );
      // call API to create link
    },
    [setLinkEdges]
  );

  type getLayoutedElementsOpts = {
    direction: GraphLabel["rankdir"];
  };
  const getLayoutedElements = (
    nodes: Node[],
    edges: Edge[],
    options: getLayoutedElementsOpts = { direction: "TB" }
  ) => {
    const g = new Dagre.graphlib.Graph();
    g.setDefaultEdgeLabel(() => ({}));
    g.setGraph({
      rankdir: options.direction,
      nodesep: 200,
      edgesep: 200,
      ranksep: 200,
    });

    edges.forEach((edge) => g.setEdge(edge.source, edge.target));

    const connectedNodesID = new Set(
      edges.flatMap((edge) => [edge.source, edge.target])
    );
    const connectedNodes = nodes.filter((node) =>
      connectedNodesID.has(node.id)
    );
    const unconnectedNodes = nodes.filter(
      (node) => !connectedNodesID.has(node.id)
    );

    nodes.forEach((node) => {
      g.setNode(node.id, {
        ...node,
        width: node.measured?.width ?? 0,
        height: node.measured?.height ?? 0,
      });
    });

    Dagre.layout(g);

    let finalLayout: { nodes: Node[]; edges: Edge[] } = {
      nodes: [],
      edges: [],
    };

    finalLayout.edges = [...edges];
    finalLayout.nodes.push(
      ...connectedNodes.map((node) => {
        const position = g.node(node.id);
        // We are shifting the dagre node position (anchor=center center) to the top left
        // so it matches the React Flow node anchor point (top left).
        const x = position.x - (node.measured?.width ?? 0) / 2;
        const y = position.y - (node.measured?.height ?? 0) / 2;

        return { ...node, position: { x, y } };
      })
    );

    finalLayout.nodes.push(
      ...unconnectedNodes.map((node, idx) => {
        const position = {
          x:
            nodeOffsets.unconnected.origin.x +
            Math.floor(idx / 20) * nodeOffsets.unconnected.scaling.x,
          y:
            nodeOffsets.unconnected.origin.y +
            Math.floor(idx % 20) * nodeOffsets.unconnected.scaling.y,
        };
        const x = position.x - (node.measured?.width ?? 0) / 2;
        const y = position.y - (node.measured?.height ?? 0) / 2;

        return { ...node, position: { x, y } };
      })
    );

    console.debug("layout generated");
    return finalLayout;
  };

  const arrangeLayout = (direction: GraphLabel["rankdir"]) => {
    const layouted = getLayoutedElements(playlistNodes, linkEdges, {
      direction,
    });

    setPlaylistNodes([...layouted.nodes]);
    setLinkEdges([...layouted.edges]);

    setTimeout(flowInstance.fitView);
    console.debug("layout applied");
  };

  const fetchGraph = useCallback(async () => {
    const resp = await apiFetchGraph();
    if (resp === undefined) {
      showErrorToastNotification("Please try again after sometime");
      return;
    }
    if (resp.status === 200) {
      console.debug(
        `graph fetched with ${resp.data.playlists?.length} nodes and ${resp.data.links?.length} edges`
      );
      // place playlist nodes
      setPlaylistNodes(
        resp.data.playlists?.map((pl, idx) => {
          return {
            id: `${pl.playlistID}`,
            position: {
              x:
                nodeOffsets.unconnected.origin.x +
                Math.floor(idx / 15) * nodeOffsets.unconnected.scaling.x,
              y:
                nodeOffsets.unconnected.origin.y +
                Math.floor(idx % 15) * nodeOffsets.unconnected.scaling.y,
            },
            data: {
              label: pl.playlistName,
              metadata: {
                pl,
              },
            },
          };
        }) ?? []
      );
      // connect links
      setLinkEdges(
        resp.data.links?.map((link, idx) => {
          return {
            id: `${idx}`,
            source: link.from,
            target: link.to,
          };
        }) ?? []
      );
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
  }, [refreshAuth]);

  const onArrange = () => {
    arrangeLayout("TB");
  };

  const onRefresh = async () => {
    await fetchGraph();
    arrangeLayout("TB");
  };

  useEffect(() => {
    fetchGraph();
    // TODO: how to invoke async and sync fns in order correctly inside useEffect?
    // onRefresh();
  }, [fetchGraph]);

  return (
    <div className={styles.graph_wrapper}>
      <ReactFlow
        nodes={playlistNodes}
        edges={linkEdges}
        defaultEdgeOptions={edgeOptions}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
        proOptions={proOptions}
        colorMode={"light"}
        onInit={onFlowInit}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Controls />
        <Background variant={BackgroundVariant.Dots} gap={36} size={3} />
        {/* <Panel position="top-right"> */}
        {/* <button onClick={() => arrangeLayout('TB')}>Arrange vertically</button> */}
        {/* <button onClick={() => arrangeLayout('LR')}>Arrange horizontally</button> */}
        {/* </Panel> */}
      </ReactFlow>
      <div className={styles.operations_wrapper}>
        <Button onClickMethod={onRefresh}>
          <WiCloudRefresh size={36} />
          Refresh
        </Button>
        <Button onClickMethod={onArrange}>
          <IoIosGitNetwork size={36} />
          Arrange
        </Button>
      </div>
    </div>
  );
};

export default Graph;

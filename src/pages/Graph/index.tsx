import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  useOnSelectionChange,
  useReactFlow,
  MarkerType,
  BackgroundVariant,
  type DefaultEdgeOptions,
  type ProOptions,
  type ReactFlowInstance,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnSelectionChangeFunc,
  type OnConnect,
  type OnBeforeDelete,
} from "@xyflow/react";
import Dagre from "@dagrejs/dagre";

import "@xyflow/react/dist/style.css";
import styles from "./Graph.module.css";

import { IoIosGitNetwork } from "react-icons/io";
import { WiCloudRefresh } from "react-icons/wi";
import { MdOutlineLock, MdOutlineLockOpen } from "react-icons/md";
import { AiFillSpotify } from "react-icons/ai";

import {
  showErrorToastNotification,
  showInfoToastNotification,
  showSuccessToastNotification,
  showWarnToastNotification,
} from "../../components/ToastNotification";

import {
  apiCreateLink,
  apiDeleteLink,
  apiFetchGraph,
  apiUpdateUserData,
} from "../../api/operations";

import { RefreshAuthContext } from "../../App";
import Button from "../../components/Button";
import APIWrapper from "../../components/APIWrapper";

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

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

type Interactive = {
  ndDrag: boolean;
  ndConn: boolean;
  elsSel: boolean;
};

type rankdirType = "TB" | "BT" | "LR" | "RL";

const initialInteractive: Interactive = {
  ndDrag: true,
  ndConn: true,
  elsSel: true,
};

const edgeOptions: DefaultEdgeOptions = {
  animated: false,
  style: {
    stroke: "white",
    strokeWidth: 2,
  },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: "white",
    width: 16,
    height: 16,
    orient: "auto",
  },
};

const selectedEdgeOptions: DefaultEdgeOptions = {
  animated: true,
  style: {
    stroke: "red",
    strokeWidth: 2,
  },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: "red",
    width: 16,
    height: 16,
    orient: "auto",
  },
};

const proOptions: ProOptions = { hideAttribution: true };

const Graph = () => {
  const refreshAuth = useContext(RefreshAuthContext);
  const flowInstance = useReactFlow();
  const [playlistNodes, setPlaylistNodes] = useState<Node[]>(initialNodes);
  const [linkEdges, setLinkEdges] = useState<Edge[]>(initialEdges);
  const [interactive, setInteractive] =
    useState<Interactive>(initialInteractive);

  const onFlowInit = (_instance: ReactFlowInstance) => {
    console.debug("flow loaded");
  };

  // base event handling
  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setPlaylistNodes((nds) => applyNodeChanges(changes, nds)),
    [setPlaylistNodes]
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setLinkEdges((eds) => applyEdgeChanges(changes, eds)),
    [setLinkEdges]
  );

  const onFlowSelectionChange: OnSelectionChangeFunc = useCallback(
    ({ nodes, edges }) => {
      const newSelectedID = edges[0]?.id ?? "";
      setLinkEdges((eds) =>
        eds.map((ed) =>
          ed.id === newSelectedID
            ? { ...ed, ...selectedEdgeOptions }
            : { ...ed, ...edgeOptions }
        )
      );
    },
    [setLinkEdges]
  );
  useOnSelectionChange({
    onChange: onFlowSelectionChange,
  });

  // new edge
  const onFlowConnect: OnConnect = useCallback(
    async (connection) => {
      console.debug(
        `new connection: ${connection.source} -> ${connection.target}`
      );
      // call API to create link
      const spotifyPlaylistLinkPrefix = "https://open.spotify.com/playlist/";
      const resp = await APIWrapper({
        apiFn: apiCreateLink,
        data: {
          from: spotifyPlaylistLinkPrefix + connection.source,
          to: spotifyPlaylistLinkPrefix + connection.target,
        },
        refreshAuth,
      });
      if (resp?.status === 201) {
        showSuccessToastNotification(resp?.data.message);
        setLinkEdges((eds) => addEdge(connection, eds));
      }
    },
    [setLinkEdges, refreshAuth]
  );

  // remove edge
  const onFlowBeforeDelete: OnBeforeDelete = useCallback(
    async ({ nodes, edges }) => {
      // can't delete playlists
      if (nodes.length > 0) {
        showErrorToastNotification("Can't delete playlists!");
        return false;
      }
      console.debug(
        `deleted connection: ${edges[0].source} -> ${edges[0].target}`
      );
      // call API to delete link
      const spotifyPlaylistLinkPrefix = "https://open.spotify.com/playlist/";
      const resp = await APIWrapper({
        apiFn: apiDeleteLink,
        data: {
          from: spotifyPlaylistLinkPrefix + edges[0].source,
          to: spotifyPlaylistLinkPrefix + edges[0].target,
        },
        refreshAuth,
      });
      if (resp?.status === 200) {
        showSuccessToastNotification(resp?.data.message);
        return { nodes, edges };
      }
      return false;
    },
    [refreshAuth]
  );

  type getLayoutedElementsOpts = {
    direction: rankdirType;
  };
  const getLayoutedElements = (
    nodes: Node[],
    edges: Edge[],
    options: getLayoutedElementsOpts
  ) => {
    const g = new Dagre.graphlib.Graph();
    g.setDefaultEdgeLabel(() => ({}));
    g.setGraph({
      rankdir: options.direction,
      nodesep: 100,
      edgesep: 100,
      ranksep: 100,
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

  const arrangeLayout = (direction: rankdirType) => {
    const layouted = getLayoutedElements(playlistNodes, linkEdges, {
      direction,
    });

    setPlaylistNodes([...layouted.nodes]);
    setLinkEdges([...layouted.edges]);

    setTimeout(flowInstance.fitView);
    console.debug("layout applied");
  };

  const fetchGraph = useCallback(async () => {
    const resp = await APIWrapper({ apiFn: apiFetchGraph, refreshAuth });
    console.debug(
      `graph fetched with ${resp?.data.playlists?.length} nodes and ${resp?.data.links?.length} edges`
    );
    // place playlist nodes
    setPlaylistNodes(
      resp?.data.playlists?.map((pl, idx) => {
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
      resp?.data.links?.map((link, idx) => {
        return {
          id: `${link.from}->${link.to}`,
          source: link.from,
          target: link.to,
        };
      }) ?? []
    );
    showInfoToastNotification("Graph updated.");
  }, [refreshAuth]);

  const updateUserData = async () => {
    const resp = await APIWrapper({
      apiFn: apiUpdateUserData,
      refreshAuth,
    });
    showInfoToastNotification("Spotify synced.");
    if (resp?.data.removedLinks)
      showWarnToastNotification(
        "Some links with deleted playlists were removed."
      );
    await refreshGraph();
  };

  const refreshGraph = async () => {
    await fetchGraph();
    arrangeLayout("TB");
  };

  useEffect(() => {
    fetchGraph();
  }, [fetchGraph]);

  const disableInteractive = () => {
    setInteractive({
      ndDrag: false,
      ndConn: false,
      elsSel: false,
    });
  };
  const enableInteractive = () => {
    setInteractive({
      ndDrag: true,
      ndConn: true,
      elsSel: true,
    });
  };

  const isInteractive = () => {
    return interactive.ndDrag || interactive.ndConn || interactive.elsSel;
  };

  const toggleInteractive = () => {
    isInteractive() ? disableInteractive() : enableInteractive();
  };

  return (
    <div className={styles.graph_wrapper}>
      <ReactFlow
        nodes={playlistNodes}
        edges={linkEdges}
        defaultEdgeOptions={edgeOptions}
        proOptions={proOptions}
        fitView
        colorMode={"light"}
        elevateEdgesOnSelect
        edgesReconnectable={false}
        nodesFocusable={false}
        nodesDraggable={interactive.ndDrag}
        nodesConnectable={interactive.ndConn}
        elementsSelectable={interactive.elsSel}
        deleteKeyCode={["Delete", "Backspace"]}
        multiSelectionKeyCode={null}
        onInit={onFlowInit}
        onBeforeDelete={onFlowBeforeDelete}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onFlowConnect}
      >
        <Controls onInteractiveChange={toggleInteractive} />
        <MiniMap pannable zoomable />
        <Background variant={BackgroundVariant.Dots} gap={36} size={3} />
      </ReactFlow>
      <div className={`${styles.operations_wrapper} custom_scrollbar`}>
        <Button onClickMethod={refreshGraph}>
          <WiCloudRefresh size={36} />
          Refresh Graph
        </Button>
        <Button onClickMethod={() => arrangeLayout("TB")}>
          <IoIosGitNetwork size={36} />
          Arrange
        </Button>
        <Button onClickMethod={toggleInteractive}>
          {isInteractive() ? (
            <MdOutlineLock size={36} />
          ) : (
            <MdOutlineLockOpen size={36} />
          )}
          {isInteractive() ? "Lock" : "Unlock"}
        </Button>
        <hr className={styles.divider} />
        <Button onClickMethod={updateUserData}>
          <span className={styles.icons}>
            <WiCloudRefresh size={36} />
            <AiFillSpotify size={36} />
          </span>
          Sync Spotify
        </Button>
      </div>
    </div>
  );
};

export default Graph;

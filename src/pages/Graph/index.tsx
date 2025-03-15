import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  Panel,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  useOnSelectionChange,
  useReactFlow,
  MarkerType,
  BackgroundVariant,
  type DefaultEdgeOptions,
  type ProOptions,
  type Node,
  type Edge,
  type OnInit,
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
import { PiSupersetOf, PiSubsetOf } from "react-icons/pi";

import {
  showErrorToastNotification,
  showInfoToastNotification,
  showSuccessToastNotification,
  showWarnToastNotification,
} from "../../components/ToastNotification/index.tsx";

import { spotifyPlaylistLinkPrefix } from "../../api/paths.ts";
import {
  apiBackfillChain,
  apiBackfillLink,
  apiCreateLink,
  apiDeleteLink,
  apiFetchGraph,
  apiPruneLink,
  apiUpdateUserData,
} from "../../api/operations.ts";

import { RefreshAuthContext } from "../../App.tsx";
import Button from "../../components/Button/index.tsx";
import APIWrapper from "../../components/APIWrapper/index.tsx";
import SimpleLoader from "../../components/SimpleLoader/index.tsx";

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
      x: 0,
      y: 1600,
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

const nodeProps: Partial<Node> = {
  style: {
    backgroundColor: "white",
  },
};

const selectedNodeProps: Partial<Node> = {
  style: {
    backgroundColor: "white",
    boxShadow: "0px 0px 40px 10px red",
  },
};

interface buildEdgeOptionsArgs {
  animated?: boolean;
  color: string;
}
const buildEdgeOptions: (opts: buildEdgeOptionsArgs) => DefaultEdgeOptions = ({
  animated = false,
  color,
}): DefaultEdgeOptions => {
  return {
    animated,
    style: {
      stroke: `${color}`,
      strokeWidth: 2,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color,
      width: 16,
      height: 16,
      orient: "auto",
    },
  };
};

const edgeOptions = buildEdgeOptions({ color: "white" });
const selectedEdgeOptions = buildEdgeOptions({ animated: true, color: "red" });

const proOptions: ProOptions = { hideAttribution: true };

const Graph = (): React.ReactNode => {
  const refreshAuth = useContext(RefreshAuthContext);
  const flowInstance = useReactFlow();
  const [playlistNodes, setPlaylistNodes] = useState<Node[]>(initialNodes);
  const [linkEdges, setLinkEdges] = useState<Edge[]>(initialEdges);
  const [selectedNodeID, setSelectedNodeID] = useState<Node["id"]>("");
  const [selectedEdgeID, setSelectedEdgeID] = useState<Edge["id"]>("");
  const [interactive, setInteractive] =
    useState<Interactive>(initialInteractive);
  const [loading, setLoading] = useState<boolean>(false);

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

  const isInteractive = useCallback(() => {
    return interactive.ndDrag || interactive.ndConn || interactive.elsSel;
  }, [interactive]);

  const toggleInteractive = () => {
    isInteractive() ? disableInteractive() : enableInteractive();
  };
  const onFlowInit: OnInit = (_instance) => {
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
      if (!isInteractive()) return;
      const nodeSelection = nodes[0]?.id ?? "";
      setSelectedNodeID(nodeSelection);
      setPlaylistNodes((nds) =>
        nds.map((nd) =>
          nd.id === nodeSelection
            ? { ...nd, ...selectedNodeProps }
            : { ...nd, ...nodeProps }
        )
      );
      const edgeSelection = edges[0]?.id ?? "";
      setSelectedEdgeID(edgeSelection);
      setLinkEdges((eds) =>
        eds.map((ed) =>
          ed.id === edgeSelection
            ? { ...ed, ...selectedEdgeOptions }
            : { ...ed, ...edgeOptions }
        )
      );
    },
    [isInteractive]
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
      setLoading(true);
      const resp = await APIWrapper({
        apiFn: apiCreateLink,
        data: {
          from: spotifyPlaylistLinkPrefix + connection.source,
          to: spotifyPlaylistLinkPrefix + connection.target,
        },
        refreshAuth,
      });
      setLoading(false);
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
      if (!edges[0]) throw new ReferenceError("no edge selected");
      console.debug(
        `deleted connection: ${edges[0].source} -> ${edges[0].target}`
      );
      // call API to delete link
      setLoading(true);
      const resp = await APIWrapper({
        apiFn: apiDeleteLink,
        data: {
          from: spotifyPlaylistLinkPrefix + edges[0].source,
          to: spotifyPlaylistLinkPrefix + edges[0].target,
        },
        refreshAuth,
      });
      setLoading(false);
      if (resp?.status === 200) {
        showSuccessToastNotification(resp?.data.message);
        return { nodes, edges };
      }
      return false;
    },
    [refreshAuth]
  );

  const backfillLink = async () => {
    if (selectedEdgeID === "") {
      showWarnToastNotification("Select a link!");
      return;
    }
    const selectedEdge = linkEdges.filter((ed) => ed.id === selectedEdgeID)[0];
    if (!selectedEdge) throw new ReferenceError("no edge selected");
    setLoading(true);
    const resp = await APIWrapper({
      apiFn: apiBackfillLink,
      data: {
        from: spotifyPlaylistLinkPrefix + selectedEdge.source,
        to: spotifyPlaylistLinkPrefix + selectedEdge.target,
      },
      refreshAuth,
    });
    setLoading(false);

    if (resp?.status === 200) {
      if (resp?.data.addedNum < resp?.data.toAddNum)
        showWarnToastNotification(resp?.data.message);
      else showSuccessToastNotification(resp?.data.message);
      return;
    }
    return;
  };

  const backfillChain = async () => {
    if (selectedNodeID === "") {
      showWarnToastNotification("Select a playlist!");
      return;
    }
    const selectedNode = playlistNodes.filter(
      (nd) => nd.id === selectedNodeID
    )[0];
    if (!selectedNode) throw new ReferenceError("no playlist selected");
    setLoading(true);
    const resp = await APIWrapper({
      apiFn: apiBackfillChain,
      data: {
        root: spotifyPlaylistLinkPrefix + selectedNodeID,
      },
      refreshAuth,
    });
    setLoading(false);

    if (resp?.status === 200) {
      if (resp?.data.addedNum < resp?.data.toAddNum)
        showWarnToastNotification(resp?.data.message);
      else showSuccessToastNotification(resp?.data.message);
      return;
    }
    return;
  };

  const pruneLink = async () => {
    if (selectedEdgeID === "") {
      showWarnToastNotification("Select a link!");
      return;
    }
    const selectedEdge = linkEdges.filter((ed) => ed.id === selectedEdgeID)[0];
    if (!selectedEdge) throw new ReferenceError("no edge selected");

    setLoading(true);
    const resp = await APIWrapper({
      apiFn: apiPruneLink,
      data: {
        from: spotifyPlaylistLinkPrefix + selectedEdge.source,
        to: spotifyPlaylistLinkPrefix + selectedEdge.target,
      },
      refreshAuth,
    });
    setLoading(false);

    if (resp?.status === 200) {
      if (resp?.data.deletedNum < resp?.data.toDelNum)
        showWarnToastNotification(resp?.data.message);
      else showSuccessToastNotification(resp?.data.message);
      return;
    }
    return;
  };

  type getLayoutedElementsOpts = {
    direction: rankdirType;
  };
  const getLayoutedElements = useCallback(
    (nodes: Node[], edges: Edge[], options: getLayoutedElementsOpts) => {
      const g = new Dagre.graphlib.Graph();
      g.setDefaultEdgeLabel(() => ({}));
      g.setGraph({ rankdir: options.direction, ranksep: 200 });

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

      const connectedPositions = finalLayout.nodes.map((nd) => nd.position);
      const largestX = connectedPositions.sort((a, b) => b.x - a.x)[0]?.x;
      const largestY = connectedPositions.sort((a, b) => b.y - a.y)[0]?.y;

      finalLayout.nodes.push(
        ...unconnectedNodes.map((node, idx) => {
          const position = {
            x:
              // nodeOffsets.unconnected.origin.x +
              (largestX ?? nodeOffsets.unconnected.origin.x) / 2 +
              Math.floor(idx / 5) * nodeOffsets.unconnected.scaling.x,
            y:
              // nodeOffsets.unconnected.origin.y +
              (largestY ?? nodeOffsets.unconnected.origin.y) +
              100 +
              Math.floor(idx % 5) * nodeOffsets.unconnected.scaling.y,
          };
          const x = position.x - (node.measured?.width ?? 0) / 2;
          const y = position.y - (node.measured?.height ?? 0) / 2;

          return { ...node, position: { x, y } };
        })
      );

      console.debug("layout generated");
      return finalLayout;
    },
    []
  );

  const arrangeLayout = useCallback(
    (direction: rankdirType) => {
      // TODO: race condition
      // states not updated in time inside other functions that call this before they call this
      // fix that
      const layouted = getLayoutedElements(playlistNodes, linkEdges, {
        direction,
      });

      setPlaylistNodes([...layouted.nodes]);
      setLinkEdges([...layouted.edges]);

      setTimeout(flowInstance.fitView);
      console.debug("layout applied");
    },
    [playlistNodes, linkEdges, flowInstance, getLayoutedElements]
  );

  const fetchGraph = useCallback(async () => {
    setLoading(true);
    const resp = await APIWrapper({ apiFn: apiFetchGraph, refreshAuth });
    setLoading(false);
    console.debug(
      `graph fetched with ${resp?.data.playlists?.length} nodes and ${resp?.data.links?.length} edges`
    );
    // place playlist nodes
    const newNodes =
      resp?.data.playlists?.map((pl, idx) => {
        return {
          id: `${pl.playlistID}`,
          position: {
            x:
              nodeOffsets.connected.origin.x +
              Math.floor(idx / 15) * nodeOffsets.connected.scaling.x,
            y:
              nodeOffsets.connected.origin.y +
              Math.floor(idx % 15) * nodeOffsets.connected.scaling.y,
          },
          data: {
            label: pl.playlistName,
            metadata: {
              pl,
            },
          },
        };
      }) ?? [];
    setPlaylistNodes(newNodes);
    // connect links
    const newEdges =
      resp?.data.links?.map((link, _idx) => {
        return {
          id: `${link.from}->${link.to}`,
          source: link.from,
          target: link.to,
        };
      }) ?? [];
    setLinkEdges(newEdges);
    showInfoToastNotification("Graph updated.");
  }, [refreshAuth]);

  const updateUserData = async () => {
    setLoading(true);
    const resp = await APIWrapper({
      apiFn: apiUpdateUserData,
      refreshAuth,
    });
    setLoading(false);
    showInfoToastNotification(resp?.data.message);
    if (resp?.data.removedLinks)
      showWarnToastNotification(
        "Some links with deleted playlists were removed."
      );
  };

  const refreshGraph = async () => {
    await fetchGraph();
  };

  useEffect(() => {
    fetchGraph();
  }, [fetchGraph]);

  useEffect(() => {
    loading ? disableInteractive() : enableInteractive();
  }, [loading]);

  return (
    <div className={`${styles.graph_wrapper} ${loading && styles.loading}`}>
      <ReactFlow
        nodes={playlistNodes}
        edges={linkEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onFlowConnect}
        proOptions={proOptions}
        colorMode={"light"}
        fitView
        minZoom={0.05}
        maxZoom={20}
        elevateEdgesOnSelect
        defaultEdgeOptions={edgeOptions}
        edgesReconnectable={false}
        onInit={onFlowInit}
        onBeforeDelete={onFlowBeforeDelete}
        nodesDraggable={interactive.ndDrag}
        nodesConnectable={interactive.ndConn}
        nodesFocusable
        edgesFocusable
        elementsSelectable={interactive.elsSel}
        deleteKeyCode={["Delete"]}
        multiSelectionKeyCode={null}
      >
        <Controls onInteractiveChange={toggleInteractive} />
        <MiniMap
          pannable
          zoomable
          nodeColor={"pink"}
          nodeStrokeColor={"blue"}
          bgColor={"purple"}
        />
        <Background variant={BackgroundVariant.Dots} gap={36} size={3} />
        <Panel position="top-right">{loading && <SimpleLoader />}</Panel>
      </ReactFlow>
      <div className={`${styles.operations_wrapper} custom_scrollbar`}>
        <Button disabled={loading} onClickMethod={backfillLink}>
          <PiSupersetOf size={36} />
          Backfill Link
        </Button>
        <Button disabled={loading} onClickMethod={backfillChain}>
          <PiSupersetOf size={36} />
          Backfill Chain
        </Button>
        <hr className={styles.divider} />
        <Button disabled={loading} onClickMethod={pruneLink}>
          <PiSubsetOf size={36} />
          Prune Link
        </Button>
        <Button disabled={loading}>
          <PiSubsetOf size={36} />
          Prune Link
        </Button>
        <hr className={styles.divider} />
        <Button disabled={loading} onClickMethod={() => arrangeLayout("TB")}>
          <IoIosGitNetwork size={36} />
          Arrange
        </Button>
        <Button disabled={loading} onClickMethod={toggleInteractive}>
          {isInteractive() ? (
            <MdOutlineLock size={36} />
          ) : (
            <MdOutlineLockOpen size={36} />
          )}
          {isInteractive() ? "Lock" : "Unlock"}
        </Button>
        <hr className={styles.divider} />
        <Button disabled={loading} onClickMethod={updateUserData}>
          <span className={styles.icons}>
            <WiCloudRefresh size={36} />
            <AiFillSpotify size={36} />
          </span>
          Sync Spotify
        </Button>
        <Button disabled={loading} onClickMethod={refreshGraph}>
          <WiCloudRefresh size={36} />
          Refresh Graph
        </Button>
      </div>
    </div>
  );
};

export default Graph;

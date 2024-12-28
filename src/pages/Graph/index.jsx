import React, { useCallback } from 'react';
import {
	ReactFlow,
	Controls,
	Background,
	useNodesState,
	useEdgesState,
	addEdge,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import styles from './Graph.module.css';

// const initialNodes = [];
const initialNodes = [
	{ id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
	{ id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
];
// const initialEdges = [];
const initialEdges = [
	{ id: 'e1-2', source: '1', target: '2' }
];
const Graph = () => {
	const [playlistNodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [linkEdges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

	const onConnect = useCallback((params) => {
		setEdges((eds) => addEdge(params, eds));
	}, [setEdges]);

	return (
		<div className={styles.graph_wrapper}>
			<ReactFlow
				nodes={playlistNodes}
				edges={linkEdges}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
			>
				<Controls />
				<Background variant='dots' gap={36} size={3} />
			</ReactFlow>
		</div>
	)
}

export default Graph;
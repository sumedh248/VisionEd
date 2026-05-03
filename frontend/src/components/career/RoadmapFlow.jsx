import ReactFlow, { Background, Controls, MarkerType } from "reactflow";
import "reactflow/dist/style.css";

const RoadmapFlow = ({ steps }) => {
  const nodes = steps.map((step, index) => ({
    id: `${index}`,
    type: "default",
    data: {
      label: (
        <div className="roadmap-node">
          <div className="roadmap-node__step">Step {index + 1}</div>
          <strong>{step.title}</strong>
          {step.description ? <span>{step.description}</span> : null}
        </div>
      ),
    },
    position: { x: index % 2 === 0 ? 80 : 420, y: index * 165 },
    draggable: false,
    selectable: false,
  }));

  const edges = steps.slice(1).map((_, index) => ({
    id: `e${index}`,
    source: `${index}`,
    target: `${index + 1}`,
    animated: true,
    type: "smoothstep",
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
    style: {
      stroke: "#0e9f8a",
      strokeWidth: 2,
    },
  }));

  return (
    <div className="roadmap-flow">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        zoomOnScroll
        panOnDrag
        panOnScroll
        selectionOnDrag={false}
      >
        <Background color="#d8e2f0" gap={20} />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default RoadmapFlow;

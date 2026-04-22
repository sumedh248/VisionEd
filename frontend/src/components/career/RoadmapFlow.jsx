import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";

const RoadmapFlow = ({ steps }) => {
  const nodes = steps.map((step, index) => ({
    id: `${index}`,
    data: {
      label: (
        <div className="roadmap-node">
          <strong>{step.title}</strong>
          <span>{step.description}</span>
        </div>
      ),
    },
    position: { x: 80, y: index * 150 },
  }));

  const edges = steps.slice(1).map((_, index) => ({
    id: `e${index}`,
    source: `${index}`,
    target: `${index + 1}`,
    animated: true,
  }));

  return (
    <div className="roadmap-flow">
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default RoadmapFlow;

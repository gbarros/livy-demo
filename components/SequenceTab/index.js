import { useSequenceController } from './SequenceController';
import SequenceView from './SequenceView';

/**
 * Sequence Tab - Thin connector between controller and view
 * Perfect separation for demos: focus on controller logic, view is just templating
 */
export default function SequenceTab() {
  const controllerProps = useSequenceController();
  
  return <SequenceView {...controllerProps} />;
} 
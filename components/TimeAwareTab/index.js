import { useTimeAwareController } from './TimeAwareController';
import TimeAwareView from './TimeAwareView';

/**
 * TimeAware Tab - Thin connector between controller and view
 * Perfect separation for demos: focus on controller logic, view is just templating
 */
export default function TimeAwareTab() {
  const controllerProps = useTimeAwareController();
  
  return <TimeAwareView {...controllerProps} />;
} 
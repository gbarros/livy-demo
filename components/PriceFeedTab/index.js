import { usePriceFeedController } from './PriceFeedController';
import PriceFeedView from './PriceFeedView';

/**
 * PriceFeed Tab - Thin connector between controller and view
 * Perfect separation for demos: focus on controller logic, view is just templating
 */
export default function PriceFeedTab() {
  const controllerProps = usePriceFeedController();
  
  return <PriceFeedView {...controllerProps} />;
} 
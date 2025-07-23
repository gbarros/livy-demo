import { useCoinTossController } from './CoinTossController';
import CoinTossView from './CoinTossView';

/**
 * CoinToss Tab - Thin connector between controller and view
 * Perfect separation for demos: focus on controller logic, view is just templating
 */
export default function CoinTossTab() {
  const controllerProps = useCoinTossController();
  
  return <CoinTossView {...controllerProps} />;
} 
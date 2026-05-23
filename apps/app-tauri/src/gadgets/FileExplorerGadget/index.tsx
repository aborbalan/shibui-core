import { GadgetFrame } from '../GadgetFrame';
import { FileBrowser } from './FileBrowser';

export function FileExplorerGadget() {
  return (
    <GadgetFrame title="Archivos" icon="folder-open">
      <FileBrowser rowSize="compact" />
    </GadgetFrame>
  );
}

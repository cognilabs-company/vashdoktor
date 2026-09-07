import { createContext, useContext } from 'react';

/** Lets any page open the shared consultation / 3D-viewer modals owned by Layout. */
export interface ClinicUI {
  openConsultation: () => void;
  open3DViewer: () => void;
}

export const ClinicUIContext = createContext<ClinicUI>({
  openConsultation: () => {},
  open3DViewer: () => {},
});

export const useClinicUI = () => useContext(ClinicUIContext);

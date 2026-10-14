import type { HTMLAttributes, ReactNode } from 'react';
export interface LegacyDocumentText {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
}
export interface LegacyDocumentPage {
  src: string;
  width: number;
  height: number;
  text?: LegacyDocumentText[];
}
export interface LegacyModalDocument {
  id: string;
  title: string;
  pages: LegacyDocumentPage[];
}
export interface LegacyDocumentsModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  dataId?: string;
  closeOnConfirm?: boolean;
  confirmLoading?: boolean;
  documents: LegacyModalDocument[];
  heading?: ReactNode;
  placement?: 'inline' | 'top-center';
  onClose: () => void;
  onConfirm?: () => void;
}
declare const DocumentsModal: {
  (props: LegacyDocumentsModalProps): JSX.Element;
  displayName: string;
  propTypes: object;
};
export default DocumentsModal;

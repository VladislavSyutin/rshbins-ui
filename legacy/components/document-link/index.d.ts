import type { AnchorHTMLAttributes, ReactNode } from 'react';
export interface LegacyDocumentLinkProps
  extends Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    'title' | 'href' | 'target' | 'rel' | 'children'
  > {
  href: string;
  title: ReactNode;
  fileSize?: string;
  dataId?: string;
}
declare function DocumentLink(props: LegacyDocumentLinkProps): JSX.Element;
export default DocumentLink;

import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode
} from 'react';

export type LegacyTextLinkSize = 'm' | 's';
export type LegacyTextLinkAs = 'a' | 'button';

interface LegacyTextLinkCommonProps {
  children?: ReactNode;
  className?: string;
  dataId?: string;
  size?: LegacyTextLinkSize;
}

type LegacyTextLinkAnchorProps = LegacyTextLinkCommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'className'> & {
    as?: 'a';
    href?: string;
  };

type LegacyTextLinkButtonProps = LegacyTextLinkCommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'> & {
    as: 'button';
  };

export type LegacyTextLinkProps =
  | LegacyTextLinkAnchorProps
  | LegacyTextLinkButtonProps;

export default function TextLink(props: LegacyTextLinkProps): JSX.Element;

export namespace TextLink {
  const displayName: string;
  const sizes: Record<LegacyTextLinkSize, LegacyTextLinkSize>;
  const elements: {
    anchor: 'a';
    button: 'button';
  };
  const propTypes: object;
}

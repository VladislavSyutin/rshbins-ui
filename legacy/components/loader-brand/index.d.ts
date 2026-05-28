import type { HTMLAttributes } from 'react';

export type LegacyLoaderBrandLogoStep = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';
export type LegacyLoaderBrandTextStep = '1' | '2' | '3' | '4';

export interface LegacyLoaderBrandProps extends HTMLAttributes<HTMLDivElement> {
  autoPlay?: boolean;
  className?: string;
  dataId?: string;
  logoStep?: LegacyLoaderBrandLogoStep;
  textStep?: LegacyLoaderBrandTextStep;
}

export interface LegacyLoaderBrandComponent {
  (props: LegacyLoaderBrandProps): JSX.Element;
  displayName?: string;
  logoSteps: {
    step1: '1';
    step2: '2';
    step3: '3';
    step4: '4';
    step5: '5';
    step6: '6';
    step7: '7';
    step8: '8';
  };
  textSteps: {
    step1: '1';
    step2: '2';
    step3: '3';
    step4: '4';
  };
}

declare const LoaderBrand: LegacyLoaderBrandComponent;

export default LoaderBrand;

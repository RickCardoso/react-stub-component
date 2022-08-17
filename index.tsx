import sinon from 'sinon';
import type { ReactElement } from 'react';
import { MockComponent } from './components/MockComponent';
import { fireMockEvent, getPropValue, mockComponentTestId } from './utils';

export const stubComponent = (
  module: any,
  componentName: string,
): {
  getPropValue: (propName: string) => any;
  fireMockEvent: (propName: string, ...params: any[]) => void;
  stubTestId: string;
  restoreStubs: () => void;
} => {
  const uniqueName = `${componentName}-${new Date().valueOf()}`;

  sinon.replace<any, typeof module[typeof componentName]>(
    module,
    componentName,
    ({ ...args }: Record<string, any>): ReactElement => <MockComponent uniqueName={uniqueName} {...args} />,
  );

  return {
    getPropValue: getPropValue(uniqueName),
    fireMockEvent: fireMockEvent(uniqueName),
    stubTestId: mockComponentTestId(uniqueName),
    restoreStubs: sinon.restore,
  };
};

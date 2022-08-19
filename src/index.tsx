import sinon from 'sinon';
import type { ReactElement } from 'react';
import { StubComponent } from 'components/StubComponent';
import { fireMockEvent, getPropValue, getReactNodePropTestId, mockComponentTestId } from 'utils';

export const stubComponent = (
  module: any,
  componentName: string,
): {
  getPropValue: (propName: string) => any;
  getReactNodePropTestId: (propName: string) => any;
  fireMockEvent: (propName: string, ...params: any[]) => void;
  stubTestId: string;
  restoreStubs: () => void;
} => {
  const uniqueName = `${componentName}-${new Date().valueOf()}`;

  sinon.replace<any, typeof module[typeof componentName]>(
    module,
    componentName,
    ({ ...args }: Record<string, any>): ReactElement => <StubComponent uniqueName={uniqueName} {...args} />,
  );

  return {
    getPropValue: getPropValue(uniqueName),
    getReactNodePropTestId: getReactNodePropTestId(uniqueName),
    fireMockEvent: fireMockEvent(uniqueName),
    stubTestId: mockComponentTestId(uniqueName),
    restoreStubs: sinon.restore,
  };
};

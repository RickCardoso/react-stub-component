import sinon from 'sinon';
import type { ReactElement } from 'react';
import { StubComponent } from './components/StubComponent';
import { fireMockEvent, getPropValue, getReactNodePropTestId, mockComponentTestId } from './utils';
import kebabCase from 'lodash/kebabCase';

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
  const uniqueName = `${kebabCase(componentName)}-${Date.now().toString(32) + Math.random().toString(16)}`;

  const sandbox = sinon.createSandbox();

  sandbox.replace<any, typeof module[typeof componentName]>(
    module,
    componentName,
    ({ ...args }: Record<string, any>): ReactElement => <StubComponent uniqueName={uniqueName} {...args} />,
  );

  return {
    getPropValue: getPropValue(uniqueName),
    getReactNodePropTestId: getReactNodePropTestId(uniqueName),
    fireMockEvent: fireMockEvent(uniqueName),
    stubTestId: mockComponentTestId(uniqueName),
    restoreStubs: sandbox.restore,
  };
};

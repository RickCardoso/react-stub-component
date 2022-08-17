import sinon from 'sinon';
import type { ReactElement } from 'react';
import { MockComponent } from 'components/MockComponent';
import { fireMockEvent, getPropValue } from "utils";

export const stubComponent = (module: any, componentName: keyof object) => {
  const uniqueName = `${String(componentName)}-${new Date().valueOf()}`;

  sinon.replace<any, typeof module[typeof componentName]>(module, componentName, ({ ...args }: Record<string, any>): ReactElement => (
    <MockComponent uniqueName={uniqueName} {...args} />
  ));

  return {
    getPropValue: getPropValue(uniqueName),
    fireMockEvent: fireMockEvent(uniqueName),
  };
};

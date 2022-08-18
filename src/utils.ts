import compact from 'lodash/compact';
import kebabCase from 'lodash/kebabCase';

export const mockComponentTestId = (uniqueName: string): string => `mock-component-${kebabCase(uniqueName)}`;
export const reactNodeTestId = (uniqueName: string, propName: string): string =>
  `react-node-${kebabCase(uniqueName)}-${kebabCase(propName)}`;

export const getEventName = (uniqueName: string, eventKey: string): string =>
  compact([kebabCase(uniqueName), kebabCase(eventKey)]).join('-');

export const getDataPropName = (propName: string): string => `data-${kebabCase(propName)}`;

export const getPropValue =
  (uniqueName: string) =>
  (propName: string): any => {
    const stubbedComponent = document.querySelector(`[data-testid="${mockComponentTestId(uniqueName)}"]`);

    if (stubbedComponent?.getAttribute(getDataPropName(propName)) === 'undefined') {
      return undefined;
    }

    return JSON.parse(stubbedComponent?.getAttribute(getDataPropName(propName)));
  };

export const getReactNodePropTestId =
  (uniqueName: string) =>
  (propName: string): any =>
    reactNodeTestId(uniqueName, propName);

export const fireMockEvent =
  (uniqueName: string) =>
  (eventKey: string, params?: unknown[]): void => {
    const event = new CustomEvent(getEventName(uniqueName, eventKey), { detail: { params } });
    document.dispatchEvent(event);
  };

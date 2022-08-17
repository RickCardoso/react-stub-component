import compact from 'lodash/compact';
import kebabCase from 'lodash/kebabCase';

export const mockComponentTestId = (uniqueName: string): string => `mock-component-${kebabCase(uniqueName)}`;

export const getEventName = (uniqueName: string, eventKey: string): string =>
  compact([kebabCase(uniqueName), kebabCase(eventKey)]).join('-');

export const getDataPropName = (propName: string): string => `data-${kebabCase(propName)}`;

export const getPropValue =
  (uniqueName: string) =>
  (propName: string): any => {
    const stubbedComponent = document.querySelector(`[data-testid="${mockComponentTestId(uniqueName)}"]`);

    return stubbedComponent?.getAttribute(getDataPropName(propName)) === 'undefined'
      ? undefined
      : JSON.parse(stubbedComponent?.getAttribute(getDataPropName(propName)));
  };

export const fireMockEvent =
  (uniqueName: string) =>
  (eventKey: string, params?: unknown[]): void => {
    const event = new CustomEvent(getEventName(uniqueName, eventKey), { detail: { params } });
    document.dispatchEvent(event);
  };

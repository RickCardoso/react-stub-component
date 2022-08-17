import compact from 'lodash/compact';
import kebabCase from 'lodash/kebabCase';

export const mockComponentTestId = (uniqueName: string): string =>
  `mock-component-${kebabCase(uniqueName)}`;

export const eventName = (uniqueName: string, eventKey: string): string =>
  compact([kebabCase(uniqueName), kebabCase(eventKey)]).join('-');

export const getPropValue = (uniqueName: string) => (propName: string) => {
  const prop = document.querySelector(`[data-testid="${mockComponentTestId(uniqueName)}"]`);

  return prop?.getAttribute(`data-${propName}`);
};

export const fireMockEvent = (uniqueName: string) => (eventKey: string, params?: unknown[]): void => {
  const event = new CustomEvent(eventName(uniqueName, eventKey), { detail: { params } });
  document.dispatchEvent(event);
};

import { fireMockEvent, getDataPropName, getEventName, getPropValue, mockComponentTestId } from './utils';
import kebabCase from 'lodash/kebabCase';

describe('utils', () => {
  describe('mockComponentTestId', () => {
    it('should return a string in the correct format', () => {
      const uniqueName = 'unique-name';
      const testId = mockComponentTestId(uniqueName);

      expect(testId).toBe(`mock-component-${kebabCase(uniqueName)}`);
    });
  });

  describe('eventName', () => {
    it('should return a string in the correct format', () => {
      const uniqueName = 'unique-name';
      const eventKey = 'event-key';
      const eventName = getEventName(uniqueName, eventKey);

      expect(eventName).toBe(`${kebabCase(uniqueName)}-${kebabCase(eventKey)}`);
    });
  });

  describe('getDataPropName', () => {
    it('should return a string in the correct format', () => {
      const propName = 'prop-name';
      const dataPropName = getDataPropName(propName);

      expect(dataPropName).toBe(`data-${kebabCase(propName)}`);
    });
  });

  describe('getPropValue', () => {
    it('should return a function', () => {
      const uniqueName = 'unique-name';
      const getPropValueFunction = getPropValue(uniqueName);

      expect(getPropValueFunction).toEqual(expect.any(Function));
    });
  });

  describe('fireMockEvent', () => {
    it('should return a function', () => {
      const uniqueName = 'unique-name';
      const fireMockEventFunction = fireMockEvent(uniqueName);

      expect(fireMockEventFunction).toEqual(expect.any(Function));
    });
  });
});

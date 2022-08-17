import { render } from '@testing-library/react';
import { stubComponent } from './index';
import sinon from 'sinon';
import { getPropValue as getPropValueConstructor, fireMockEvent as fireMockEventConstructor } from './utils';
import * as UtilsModule from './utils';
import kebabCase from 'lodash/kebabCase';

jest.spyOn(sinon, 'replace');
jest.spyOn(UtilsModule, 'getPropValue');
jest.spyOn(UtilsModule, 'fireMockEvent');

const SubComponent = (props?: Record<string, unknown>) => <>Original sub component</>;
const SubComponentModule = {
  SubComponent,
};

const FakeComponent = (props?: Record<string, unknown>) => (
  <>
    Original fake component
    <SubComponentModule.SubComponent {...props} />
  </>
);

const setup = (props?: Record<string, unknown>) => render(<FakeComponent {...props} />);

describe('stubComponent', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should call sinon.replace with the correct arguments', () => {
    stubComponent(SubComponentModule, 'SubComponent');
    expect(sinon.replace).toHaveBeenCalledWith(SubComponentModule, 'SubComponent', expect.any(Function));
  });

  it('should call getPropValueConstructor with unique-name', () => {
    stubComponent(SubComponentModule, 'SubComponent');
    expect(getPropValueConstructor).toHaveBeenCalledWith(expect.stringMatching(new RegExp('SubComponent-\\d+')));
  });

  it('should call fireMockEventConstructor with unique-name', () => {
    stubComponent(SubComponentModule, 'SubComponent');
    expect(fireMockEventConstructor).toHaveBeenCalledWith(expect.stringMatching(new RegExp('SubComponent-\\d+')));
  });

  it('should return getPropValue and fireMockEvent functions', () => {
    const { getPropValue, fireMockEvent } = stubComponent(SubComponentModule, 'SubComponent');

    expect(getPropValue).toEqual(expect.any(Function));
    expect(fireMockEvent).toEqual(expect.any(Function));
  });

  describe('when rendered', () => {
    describe.each([
      ['undefinedProp', undefined],
      ['nullProp', null],
      ['objectProp', { foo: 'bar' }],
      ['arrayProp', ['foo', 'bar']],
      ['stringProp', 'foo'],
    ])('when %s is passed', (propName, propValue) => {
      it(`should render span with a data-${kebabCase(propName)} as ${propValue}`, () => {
        const { getPropValue } = stubComponent(SubComponentModule, 'SubComponent');
        setup({ [propName]: propValue });
        expect(getPropValue(propName)).toEqual(propValue);
      });
    });
  });
});

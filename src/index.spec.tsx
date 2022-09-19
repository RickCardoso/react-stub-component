import { render } from '@testing-library/react';
import { stubComponent } from './index';
import sinon from 'sinon';
import { getPropValue as getPropValueConstructor, fireMockEvent as fireMockEventConstructor } from './utils';
import * as UtilsModule from './utils';
import kebabCase from 'lodash/kebabCase';

jest.spyOn(sinon, 'replace');
jest.spyOn(sinon, 'createSandbox');
jest.spyOn(UtilsModule, 'getPropValue');
jest.spyOn(UtilsModule, 'fireMockEvent');

const onClick = jest.fn();
const SubComponent = (props?: Record<string, unknown>) => (
  <>Original sub component with props: {JSON.stringify(props)}</>
);
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

  it('should call sinon.createSandbox', () => {
    stubComponent(SubComponentModule, 'SubComponent');
    expect(sinon.createSandbox).toHaveBeenCalledTimes(1);
  });

  it('should call sinon.replace with the correct arguments', () => {
    const mockReplace = jest.fn();

    (sinon.createSandbox as jest.Mock).mockImplementationOnce(() => ({
      replace: mockReplace,
    }));

    stubComponent(SubComponentModule, 'SubComponent');
    expect(mockReplace).toHaveBeenCalledWith(SubComponentModule, 'SubComponent', expect.any(Function));
  });

  it('should call getPropValueConstructor with unique-name', () => {
    stubComponent(SubComponentModule, 'SubComponent');
    expect(getPropValueConstructor).toHaveBeenCalledWith(expect.stringMatching(new RegExp('sub-component-[\\w\\d]+')));
  });

  it('should call fireMockEventConstructor with unique-name', () => {
    stubComponent(SubComponentModule, 'SubComponent');
    expect(fireMockEventConstructor).toHaveBeenCalledWith(expect.stringMatching(new RegExp('sub-component-[\\w\\d]+')));
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
    ])('when prop %s is passed', (propName, propValue) => {
      it(`should render span with a data-${kebabCase(propName)} as ${propValue}`, () => {
        const { getPropValue } = stubComponent(SubComponentModule, 'SubComponent');
        setup({ [propName]: propValue });
        expect(getPropValue(propName)).toEqual(propValue);
      });
    });

    describe('when children are passed', () => {
      it('should render the ReactNode with a provided test id', () => {
        const { getReactNodePropTestId } = stubComponent(SubComponentModule, 'SubComponent');
        const { getByTestId } = setup({ children: <>children</> });
        expect(getByTestId(getReactNodePropTestId('children'))).toHaveTextContent('children');
      });
    });

    describe('when ReactNode prop is passed', () => {
      it('should render the ReactNode with a provided test id', () => {
        const { getReactNodePropTestId } = stubComponent(SubComponentModule, 'SubComponent');
        const { getByTestId } = setup({ footer: <footer>a footer</footer> });
        expect(getByTestId(getReactNodePropTestId('footer'))).toHaveTextContent('a footer');
      });
    });

    describe('when function prop is passed', () => {
      it('should return custom event function that triggers the function prop', () => {
        const { fireMockEvent } = stubComponent(SubComponentModule, 'SubComponent');
        setup({ onClick });
        fireMockEvent('onClick', ['foo', { foo: 'bar' }]);
        expect(onClick).toHaveBeenCalledWith('foo', { foo: 'bar' });
      });
    });
  });
});

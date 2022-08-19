# react-stub-component

This library has the sole purpose of simplifying React component unit testing by 
providing a stub component that can be used to test the component without actually 
having to render the component itself or rely on internal subcomponent logic.

## Getting Started

Install the library:

```shell
#NPM
npm i react-stub-component --save-dev
```
```shell
#Yarn
yarn add react-stub-component --dev
```
```shell
#Rush
rush add -p react-stub-component --dev
```

## Usage

The library has one main method called `stubComponent` that takes the following:
- `module`: the actual module of the component you want to stub
- `componentName`: the name of the component you want to stub from that module

Then, with `sinon`, we create a component stub and return the following properties:
- `getPropValue: (propName: string) => any`: the function you will use to get the value of a prop provided to the stubbed component
- `getReactNodePropTestId: (propName: string) => any`: the function you will use to get the value of a ReactNode prop provided to the stubbed component
- `fireMockEvent: (propName: string, ...params: any[]) => void`: the function you will use to fire a mock event on the stubbed component with parameters
- `stubTestId: string`: the test id of the stubbed component which you can use to validate if it has been simply rendered
- `restoreStubs: () => void`: the function you will use to restore the stubs and actually use real components
- 

```jsx
import { stubComponent } from 'react-stub-component';
import * as YourComponentModule from 'components/YourComponent';

const { getPropValue, fireMockEvent, stubTestId } = stubComponent(YourComponentModule, 'YourComponent');

const setup = () => render(<YourParentComponent />);

describe('Example', () => {
  describe('check subcomponents', () => {
    it('should render YourComponent', () => {
      const { getByTestId } = setup();
      expect(getByTestId(stubTestId)).toBeInTheDocument();
    });
    
    it('should render YourComponent with correct props', () => {
      const { getByTestId } = setup();
      expect(getPropValue('prop1')).toBe('value1');
      expect(getPropValue('prop2')).toBe('value2');
    });
    
    describe('when YourComponent triggers callback', () => {
      it('should call parentCallback with same params', () => {
        const parentCallback = jest.fn();
        const { getByTestId } = setup({ parentCallback });
        fireMockEvent('onCallback', onCallbackParams);
        expect(parentCallback).toHaveBeenCalledWith(onCallbackParams);
      });
    });
  });
});
```

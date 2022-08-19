import { render } from '@testing-library/react';
import { StubComponent } from './StubComponent';
import type { StubComponentProps } from './StubComponent';
import kebabCase from 'lodash/kebabCase';

const defaultProps = {
  uniqueName: 'unique-name',
};

const setup = (props?: StubComponentProps) => render(<StubComponent {...defaultProps} {...props} />);

describe('<StubComponent />', () => {
  it('should render span with a data-testid', () => {
    const { container } = setup();
    expect(container.firstChild).toHaveAttribute('data-testid', 'mock-component-unique-name');
  });

  describe('when props are passed', () => {
    describe.each([
      ['undefinedProp', undefined],
      ['nullProp', null],
      ['objectProp', { foo: 'bar' }],
      ['arrayProp', ['foo', 'bar']],
      ['stringProp', 'foo'],
    ])('when %s is passed', (propName, propValue) => {
      it(`should render span with a data-${kebabCase(propName)} as ${propValue}`, () => {
        const { container } = setup({ [propName]: propValue });
        expect(container.firstChild).toHaveAttribute(`data-${kebabCase(propName)}`, JSON.stringify(propValue));
      });
    });
  });
});

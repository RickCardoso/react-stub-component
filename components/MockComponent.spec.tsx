import { render } from '@testing-library/react';
import { MockComponent } from './MockComponent';
import type { MockComponentProps } from './MockComponent';
import kebabCase from 'lodash/kebabCase';

const defaultProps = {
  uniqueName: 'unique-name',
};

const setup = (props?: MockComponentProps) => render(<MockComponent {...defaultProps} {...props} />);

describe('<MockComponent />', () => {
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

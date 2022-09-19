import { ReactElement, useCallback, useEffect, useMemo, isValidElement } from 'react';
import pickBy from 'lodash/pickBy';
import isFunction from 'lodash/isFunction';
import map from 'lodash/map';
import forEach from 'lodash/forEach';
import toArray from 'lodash/toArray';
import isUndefined from 'lodash/isUndefined';
import reduce from 'lodash/reduce';
import omitBy from 'lodash/omitBy';
import { getEventName, getDataPropName, mockComponentTestId, reactNodeTestId } from '../utils';

export type StubComponentProps = {
  uniqueName: string;
} & any;

export const StubComponent = ({ uniqueName, ...props }: StubComponentProps): ReactElement => {
  const functionProps = useMemo(() => pickBy(props, isFunction), [props]);

  const eventName = useCallback((eventKey: string): string => getEventName(uniqueName, eventKey), [uniqueName]);

  useEffect(() => {
    const functionEvents: [string, EventListener][] = map(functionProps, (prop, key) => [
      eventName(key),
      ((event: CustomEvent) => {
        prop(...toArray(event.detail?.params));
      }) as EventListener,
    ]);

    forEach(functionEvents, ([customType, customEventListener]) => {
      document.addEventListener(customType, customEventListener);
    });

    return () => {
      forEach(functionEvents, ([customType, customEventListener]) => {
        document.removeEventListener(customType, customEventListener);
      });
    };
  }, [functionProps, eventName]);

  const childrenProp = props.children;
  if (props.children) {
    delete props.children;
  }

  const dataProps = reduce(
    omitBy(omitBy(props, isFunction), isValidElement),
    (result, value, key) => {
      const dataProp = getDataPropName(key);

      if (isUndefined(value)) {
        return {
          ...result,
          [dataProp]: 'undefined',
        };
      }

      return {
        ...result,
        [dataProp]: JSON.stringify(value),
      };
    },
    {},
  );

  const reactNodeProps = useMemo(() => pickBy(props, isValidElement), [props]);

  return (
    <span data-testid={mockComponentTestId(uniqueName)} {...dataProps}>
      {map(reactNodeProps, (reactNode, propName) => (
        <span key={propName} data-testid={reactNodeTestId(uniqueName, propName)}>
          {reactNode}
        </span>
      ))}
      <span data-testid={reactNodeTestId(uniqueName, 'children')}>{childrenProp}</span>
    </span>
  );
};

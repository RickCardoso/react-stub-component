import { ReactElement, useCallback, useEffect, useMemo } from 'react';
import pickBy from 'lodash/pickBy';
import isFunction from 'lodash/isFunction';
import map from 'lodash/map';
import forEach from 'lodash/forEach';
import toArray from 'lodash/toArray';
import isUndefined from 'lodash/isUndefined';
import isNull from 'lodash/isNull';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import reduce from 'lodash/reduce';
import { getEventName, getDataPropName, mockComponentTestId } from '../utils';

export type MockComponentProps = {
  uniqueName: string;
} & any;

export const MockComponent = ({ uniqueName, ...props }: MockComponentProps): ReactElement => {
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

  const dataProps = reduce(
    props,
    (result, value, key) => {
      const dataProp = getDataPropName(key);

      if (key === 'children') {
        return result;
      }

      // if (isFunction(value)) {
      //   return {
      //     ...result,
      //     [dataProp]: key
      //   };
      // }
      //
      if (isUndefined(value)) {
        return {
          ...result,
          [dataProp]: 'undefined',
        };
      }
      //
      // if (isNull(value) || isObject(value) || isArray(value)) {
      //   return {
      //     ...result,
      //     [dataProp]: JSON.stringify(value)
      //   }
      // }
      //
      // return {
      //   ...result,
      //   [dataProp]: value.toString(),
      // }
      return {
        ...result,
        [dataProp]: JSON.stringify(value),
      };
    },
    {},
  );

  return (
    <span data-testid={mockComponentTestId(uniqueName)} {...dataProps}>
      {props.children}
    </span>
  );
};

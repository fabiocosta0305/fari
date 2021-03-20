import { useEffect, useRef, useState } from "react";

export function useLazyState<T>(props: {
  value: T;
  onChange(newValue: T): void;
  delay: number;
}) {
  const delay = props.delay;

  const [internalValue, setInternalValue] = useState(props.value);
  const timeout = useRef<any | undefined>(undefined);
  const willUpdate = useRef<boolean>(false);
  const latestOnChange = useRef(props.onChange);

  useEffect(
    function keepLatestOnChange() {
      latestOnChange.current = props.onChange;
    },
    [props.onChange]
  );

  useEffect(
    function syncStateFromProps() {
      if (!willUpdate.current) {
        setInternalValue(props.value);
      }
    },
    [props.value]
  );

  function setState(newValue: T) {
    willUpdate.current = true;
    setInternalValue(newValue);

    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      latestOnChange.current(newValue);
      willUpdate.current = false;
    }, delay);
  }

  return [internalValue, setState] as const;
}

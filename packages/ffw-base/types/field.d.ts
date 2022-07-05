import {Emitter} from 'mitt';
import Form from './form';
import {string} from 'yup';

declare class Field<TValue = string> {
  name: string;
  form: Form<Field<any>>;

  data: {
    value: TValue;
    error: string;
    touched: boolean;
    [name: string]: any;
  };

  emitter: Emitter<{
    value: TValue;
    error: string;
    touched: boolean;
    [name: string]: any;
  }>;

  get value(): TValue;
  set value(value: TValue);

  get error(): string;
  set error(error: string);

  get touched(): boolean;
  set touched(touched: boolean);

  setData(name: string, newData: TValue): void;
  setError(error: string): void;
  setTouched(touched: boolean): void;
  set(value: TValue): void;

  validate(): Promise<boolean>;
  subscribe(name: string, listener: (newData: TValue) => void): void;
  unsubscribe(name: string, listener: (newData: TValue) => void): void;
  onChange(event: {target: {value: string}}): void;
  onBlur(): void;
}

export default Field;

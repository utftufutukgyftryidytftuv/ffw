/**
 * @jest-environment jsdom
 */

import Field from './field.js';
import {jest, expect} from '@jest/globals';
import Form from './form.js';
import * as yup from 'yup';
import {waitAsync} from './utils.js';

const formMock = new Form({});

const ageFieldParams = {
  value: 42,
  name: 'age',
  form: formMock,
};

describe('field', () => {
  describe('init', () => {
    it('required params', () => {
      expect(
        new Field({
          name: 'age',
          form: formMock,
        })
      ).toMatchObject({
        value: '',
        name: 'age',
        error: '',
        touched: false,
      });
    });
    it('all params', () => {
      expect(
        new Field({
          value: 42,
          name: 'age',
          error: 'too young',
          touched: true,
          form: formMock,
        })
      ).toMatchObject({
        value: 42,
        name: 'age',
        error: 'too young',
        touched: true,
      });
    });
  });

  it('set()', async () => {
    const field = new Field(ageFieldParams);
    const listener = jest.fn();
    field.subscribe('value', listener);
    field.set(43);

    expect(field.value).toBe(43);
    await waitAsync();
    expect(listener.mock.calls.length).toBe(1);
    // @ts-ignore
    expect(listener.mock.calls[0][0]).toBe(43);
  });

  it('setError()', async () => {
    const field = new Field(ageFieldParams);
    const listener = jest.fn();
    field.subscribe('error', listener);
    field.setError('Wrong value');

    await waitAsync();
    expect(field.error).toBe('Wrong value');
    expect(listener.mock.calls.length).toBe(1);
    expect(listener.mock.calls[0][0]).toBe('Wrong value');
  });

  it('setTouched()', async () => {
    const field = new Field(ageFieldParams);
    const listener = jest.fn();
    field.subscribe('touched', listener);
    field.setTouched(true);

    await waitAsync();
    expect(field.touched).toBe(true);
    expect(listener.mock.calls.length).toBe(1);
    expect(listener.mock.calls[0][0]).toBe(true);
  });

  describe('validate()', () => {
    it('invalid', async () => {
      const form = new Form({
        initValues: {
          age: 'wrong',
        },
        validateSchema: yup.object({
          age: yup.number().required(),
        }),
      });
      const validateResult = await form.fields.age.validate();
      expect(form.fields.age.error.length).not.toBe(0);
      expect(validateResult).toBe(false);
    });
    it('valid', async () => {
      const form = new Form({
        initValues: {
          age: 42,
        },
        validateSchema: yup.object({
          age: yup.number().required(),
        }),
      });
      const validateResult = await form.fields.age.validate();
      expect(form.fields.age.error.length).toBe(0);
      expect(validateResult).toBe(true);
    });
    it('invalid -> valid', async () => {
      const form = new Form({
        initValues: {
          age: 'wrong',
        },
        validateSchema: yup.object({
          age: yup.number().required(),
        }),
      });
      await form.fields.age.validate();
      expect(form.fields.age.error.length).not.toBe(0);
      form.fields.age.set(43);
      await form.fields.age.validate();
      expect(form.fields.age.error).toBe('');
    });
  });

  describe('onBlur()', () => {
    it('set touched', async () => {
      const form = new Form({
        initValues: {
          age: 42,
        },
        validateSchema: yup.object({}),
      });
      const listener = jest.fn();
      form.fields.age.subscribe('touched', listener);

      form.fields.age.onBlur();
      expect(form.fields.age.touched).toBe(true);
      await waitAsync();
      expect(listener.mock.calls.length).toBe(1);
    });
    it('validateOnBlur = true', async () => {
      const form = new Form({
        initValues: {
          age: 'invalid',
        },
        validateSchema: yup.object({
          age: yup.number().required(),
        }),
      });
      form.fields.age.onBlur();
      await waitAsync();
      expect(form.fields.age.error).not.toBe('');
    });
    it('validateOnBlur = false', async () => {
      const form = new Form({
        initValues: {
          age: 'invalid',
        },
        validateSchema: yup.object({
          age: yup.number().required(),
        }),
        options: {
          validateOnBlur: false,
        },
      });
      form.fields.age.onBlur();
      await waitAsync();
      expect(form.fields.age.error).toBe('');
    });
  });

  describe('onChange()', () => {
    it('set value', async () => {
      const form = new Form({
        initValues: {
          age: '42',
        },
        validateSchema: yup.object({}),
      });
      const listener = jest.fn();
      form.fields.age.subscribe('value', listener);

      form.fields.age.onChange({
        target: {
          value: '43',
        },
      });
      await waitAsync();
      expect(form.fields.age.value).toBe('43');
      expect(listener.mock.calls.length).toBe(1);
    });

    it('validateOnChange = true', async () => {
      const form = new Form({
        options: {
          validateOnChange: true,
        },
        initValues: {
          age: 42,
        },
        validateSchema: yup.object({
          age: yup.number().required(),
        }),
      });
      form.fields.age.onChange({
        target: {
          value: 'invalid',
        },
      });
      await waitAsync();
      expect(form.fields.age.error).not.toBe('');
    });
    it('validateOnChange = false', async () => {
      const form = new Form({
        options: {
          validateOnChange: false,
        },
        initValues: {
          age: 42,
        },
        validateSchema: yup.object({
          age: yup.number().required(),
        }),
      });
      form.fields.age.onChange({
        target: {
          value: 'invalid',
        },
      });
      await waitAsync();
      expect(form.fields.age.error).toBe('');
    });
  });
  it('errorTouched', async () => {
    const form = new Form({
      initValues: {
        age: '42',
      },
      validateSchema: yup.object({
        age: yup.number().required(),
      }),
    });
    const field = form.fields.age;
    const listener = jest.fn();
    field.subscribe('errorTouched', listener);

    expect(field.errorTouched).toBe('');

    field.set('error text', false);

    expect(field.errorTouched).toBe('');
    expect(listener.mock.calls.length).toBe(0);

    field.setTouched(true);

    expect(field.errorTouched).toBe('');
    expect(listener.mock.calls.length).toBe(0);

    await field.validate();

    expect(field.errorTouched).not.toBe('');
    expect(listener.mock.calls.length).toBe(1);

    field.set('42');
    await field.validate();

    expect(field.errorTouched).toBe('');
    expect(listener.mock.calls.length).toBe(2);
  });
  it('emits', async () => {
    const form = new Form({
      initValues: {
        age: '42',
      },
      validateSchema: yup.object({
        age: yup.number().required(),
      }),
    });
    const field = form.f.age;
    // field.emitter.on('*', (...args) => {
    //   console.log('-----', 'args', args)
    // })
    const valueListener = jest.fn();
    const errorListener = jest.fn();
    const touchedListener = jest.fn();
    const errorTouchedListener = jest.fn();

    field.subscribe('value', valueListener);
    field.subscribe('error', errorListener);
    field.subscribe('touched', touchedListener);
    field.subscribe('errorTouched', errorTouchedListener);

    field.set('hehe');
    await waitAsync();
    expect(valueListener.mock.calls.length).toBe(1);
    expect(errorListener.mock.calls.length).toBe(1);
    expect(touchedListener.mock.calls.length).toBe(0);
    expect(errorTouchedListener.mock.calls.length).toBe(0);

    field.setError('hehe');
    await waitAsync();
    expect(valueListener.mock.calls.length).toBe(1);
    expect(errorListener.mock.calls.length).toBe(2);
    expect(touchedListener.mock.calls.length).toBe(0);
    expect(errorTouchedListener.mock.calls.length).toBe(0);

    field.setTouched(true);
    await waitAsync();

    expect(valueListener.mock.calls.length).toBe(1);
    expect(errorListener.mock.calls.length).toBe(2);
    expect(touchedListener.mock.calls.length).toBe(1);
    expect(errorTouchedListener.mock.calls.length).toBe(1);
  });
});

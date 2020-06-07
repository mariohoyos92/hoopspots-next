import isServer from './isServer';

export function checkDateInput() {
  if (!isServer()) {
    const input = document.createElement('input');
    input.setAttribute('type', 'date');

    const notADateValue = 'not-a-date';
    input.setAttribute('value', notADateValue);

    return input.value !== notADateValue;
  }
  return true;
}

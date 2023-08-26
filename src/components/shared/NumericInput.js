import React, { useRef } from 'react';
import { replaceAt } from '../../utils';
import _ from 'lodash';

function prependPaddingZero(num, accuracy = 2) {
  const sign = +num < 0 ? '-' : '';
  num = Math.abs(+num).toFixed(accuracy);
  if (num < 10) return `${sign}0${num}`;
  return `${sign}${num}`;
}

export const NumericInput = ({ accuracy, value, onValueChange, minValue, maxValue, ...props }) => {
  const inputRef = useRef();

  function applySelectionAt(event, val, caretPos) {
    if (isNaN(+caretPos)) caretPos = 0;
    caretPos = _.clamp(caretPos, 0, val.toString().length);
    setTimeout(() => event.target.setSelectionRange(caretPos, caretPos + 1));
  }

  function applyValueChange(event, val) {
    value = _.clamp(val, minValue, maxValue);
    event.target.value = value;
    onValueChange(event);
  }

  const handleKeyDown = (event) => {
    event.preventDefault();
    const key = event.code.toUpperCase();
    let val = prependPaddingZero(value, accuracy);
    let caretPos = event.target.selectionStart;
    const isNegative = val.startsWith('-');
    const negativism = isNegative ? -1 : 1;
    let extraLen = isNegative ? 2 : 2;
    extraLen += caretPos > val.indexOf('.') ? -1 : 0;
    const step = 10 ** ((val.length - caretPos - extraLen) - accuracy);

    if (key === 'ARROWUP') {
      if (caretPos === 0 && isNegative) caretPos++;
      val = +val + step;
      if (isNaN((val))) return;
      if (isNegative && val >= 0) caretPos--;
      val = prependPaddingZero(val, accuracy);
      applyValueChange(event, val);
      applySelectionAt(event, val, caretPos);

    } else if (key === 'ARROWDOWN') {
      if (caretPos === 0 && isNegative) caretPos++;
      val = +val - step;
      if (isNaN((val))) return;
      if (!isNegative && val < 0) caretPos++;
      val = prependPaddingZero(val, accuracy);
      applyValueChange(event, val);
      applySelectionAt(event, val, caretPos);

    } else if (key === 'ARROWLEFT') {
      const increment = caretPos === val.indexOf('.') + 1 ? 2 : 1;
      applySelectionAt(event, val, caretPos - increment);

    } else if (key === 'ARROWRIGHT') {
      const increment = caretPos === val.indexOf('.') - 1 ? 2 : 1;
      applySelectionAt(event, val, caretPos + increment);

    } else if (key === 'BACKSPACE') {
      val = replaceAt(val, caretPos, 0);
      applyValueChange(event, val);
      applySelectionAt(event, val, caretPos);

    } else if (key === 'DELETE') {
      val = replaceAt(val, caretPos + 1, 0);
      applyValueChange(event, val);
      applySelectionAt(event, val, caretPos);

    } else {
      if (event.key === '-' || event.key === '+') {
        if (caretPos === 0) {
          val = Math.abs(+val);
          val = event.key === '-' ? -1 * val : val;
          applyValueChange(event, val);
          applySelectionAt(event, val, 0);
        }

      } else if (!isNaN(+event.key)) {
        if (caretPos === 0 && isNegative) caretPos++;
        const keyNum = +event.key;
        val = replaceAt(val, caretPos, keyNum);
        val = prependPaddingZero(val, accuracy);
        applyValueChange(event, val);
        applySelectionAt(event, val, caretPos);
      }
    }
  };

  function handleClickSelection(event) {
    let caretPos = event.target.selectionStart;
    if (caretPos === value.indexOf('.')) caretPos--;
    applySelectionAt(event, value, caretPos);
  }

  function handleChangeValue(event) {
    // const isBlurEvent = event.type === 'blur';
    event.preventDefault();
    onValueChange(event);
    applySelectionAt(event, event.target.selectionStart);

  }

  return (
    <input {...props}
           ref={inputRef}
           type='text'
           value={prependPaddingZero(value, accuracy)}
           title='Acceleration %'
           onKeyDown={handleKeyDown}
           onClick={handleClickSelection}
           onBlur={handleChangeValue}
           onChange={handleChangeValue} />
  );
};

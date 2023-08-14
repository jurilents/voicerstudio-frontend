import _ from 'lodash';

const colors = {
  blue: '#324F85',
  violet: '#552F73',
  red: '#66262D',
  magenta: '#7A3259',
  teal: '#1e5b55',
  forest: '#2C572D',
  yellow: '#6c5d0f',
  dirt: '#5e341a',
};

const colorsCopy = { ...colors };

colors.randomColor = () => _.sample(Object.values(colorsCopy));
colors.list = Object.entries(colorsCopy);

export default colors;

import _ from 'lodash';

const colors = {
  blue: '#324F85',
  violet: '#552F73',
  red: '#7e2630',
  magenta: '#792955',
  teal: '#1e5b55',
  forest: '#255726',
  yellow: '#8d7400',
  dirt: '#5e341a',
};

const colorsCopy = { ...colors };

colors.randomColor = () => _.sample(Object.values(colorsCopy));
colors.list = Object.entries(colorsCopy);

export default colors;

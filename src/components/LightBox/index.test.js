import React from 'react';
import { Text } from 'react-native';
import LightBox from 'components/LightBox';
import renderer from 'react-test-renderer';

it('renders LightBox correctly', () => {
  const tree = renderer
    .create(<LightBox></LightBox>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
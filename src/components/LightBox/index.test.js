import React from 'react';
import { Text } from 'react-native';
import { LightBox } from './index';
import renderer from 'react-test-renderer';

jest.useFakeTimers();
jest.mock('NativeAnimatedHelper');

it('renders LightBox correctly', () => {
  const tree = renderer
    .create(
      <LightBox></LightBox>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
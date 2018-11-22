import React from 'react';
import { Text } from 'react-native';
import { LoadingIndicator, SmallLoadingIndicator } from 'components/SimpleComponents';
import renderer from 'react-test-renderer';

jest.useFakeTimers();
jest.mock('NativeAnimatedHelper');

it('renders LoadingIndicator correctly', () => {
  const tree = renderer
    .create(<LoadingIndicator></LoadingIndicator>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders SmallLoadingIndicator correctly', () => {
  const tree = renderer
    .create(<SmallLoadingIndicator></SmallLoadingIndicator>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
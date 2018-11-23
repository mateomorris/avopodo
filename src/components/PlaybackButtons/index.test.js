import React from 'react';
import { Text } from 'react-native';
import { PlaybackButtons } from './index';
import renderer from 'react-test-renderer';

jest.useFakeTimers();
jest.mock('NativeAnimatedHelper');

it('renders PlaybackButtons correctly', () => {
  const tree = renderer
    .create(
      <PlaybackButtons 
        color={'blue'}
        playbackStatus={true}
        buffering={true}
        testing={true}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
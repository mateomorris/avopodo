import React from 'react';
import { Text } from 'react-native';
import { PlaylistPicker } from './index';
import renderer from 'react-test-renderer';
import playlistIcons from 'assets/newPlaylistIcons'

jest.useFakeTimers();

it('renders PlaylistPicker correctly', () => {
  const tree = renderer
    .create(
      <PlaylistPicker 
        title={'Released when?'}
        label={'Within the past'}
        items={[
            {
                label: 'week',
                value: 'week'
            },
            {
                label: 'two weeks',
                value: 'two-weeks'
            },
            {
                label: 'month',
                value: 'month'
            },
            {
                label: 'eternity',
                value: 'eternity'
            }
        ]}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
import React from 'react';
import { Text } from 'react-native';
import PlaylistThumbnail from 'components/PlaylistThumbnail';
import renderer from 'react-test-renderer';
import playlistIcons from 'assets/newPlaylistIcons'

jest.useFakeTimers();

it('renders PlaylistThumbnail correctly', () => {
  const tree = renderer
    .create(
      <PlaylistThumbnail 
        icon={playlistIcons['basketball_field']}
        title={'Test Title'}
        duration={2000}
        episodes={[]}
        testing={true}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
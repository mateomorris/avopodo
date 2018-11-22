import React from 'react';
import { Text } from 'react-native';
import { ShowThumbnail } from './index';
import renderer from 'react-test-renderer';

it('renders ShowThumbnail correctly', () => {
  const tree = renderer
    .create(
        <ShowThumbnail 
            art={'https://d3sv2eduhewoas.cloudfront.net/channel/image/16c3788027f64c7e81a86e054da2c993.jpg'}
            color={'blue'}
        />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

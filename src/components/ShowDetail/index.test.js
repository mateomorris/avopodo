import React from 'react';
import { Text } from 'react-native';
import { ShowDetail } from './index';
import renderer from 'react-test-renderer';

it('renders ShowDetail correctly', () => {
  const tree = renderer
    .create(
        <ShowDetail 
          title={'Test Title'}
          image={'https://d3sv2eduhewoas.cloudfront.net/channel/image/4ffedff25d474163b1a8511a6a26b76a.jpg'}
          description={'This is the test description'}
          color={'blue'}
        />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

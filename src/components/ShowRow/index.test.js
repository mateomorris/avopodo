import React from 'react';
import { Text } from 'react-native';
import { ShowRow } from './index';
import renderer from 'react-test-renderer';

it('renders ShowRow correctly', () => {
  const tree = renderer
    .create(
        <ShowRow 
          index={0}
          item={{
            description: `The economy explained. Imagine you could call up a friend and say, "Meet me at the bar and tell me what's going on with the economy." Now imagine that's actually a fun evening.`,
            id: `8cb941141a7c434d945397cfd8b12e58`,
            image: `https://d3sv2eduhewoas.cloudfront.net/channel/image/4ffedff25d474163b1a8511a6a26b76a.jpg`,
            itunesId: 290783428,
            publisher: `NPR`,
            title: `Planet Money`
          }}
          subscribed={true}
        />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

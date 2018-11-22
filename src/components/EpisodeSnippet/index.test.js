import React from 'react';
import { Text } from 'react-native';
import { EpisodeSnippet } from './index';
import renderer from 'react-test-renderer';

jest.useFakeTimers();

it('renders EpisodeSnippet correctly', () => {
  const tree = renderer
    .create(
      <EpisodeSnippet
        data={{
          audio: `https://dts.podtrac.com/redirect.mp3/traffic.megaphone.fm/BUR5805288742.mp3`,
          description: `When Charlotte Bacon went to a temple in Bhutan, the place unlocked feelings in her that she hadn't truly realized were there. Her essay is read by Mira Sorvino ("StartUp").`,
          duration: 1233,
          id: "5796e7f1db2f4f8596a58008a6319e28",
          publishDate: 1542828691000,
          showColor: "#C5C4BF",
          showDescription: `Modern Love features top actors performing true stories of love, loss, and redemption. It has included performances by Kate Winslet, Uma Thurman, Angela Bassett, Jake Gyllenhaal, Sterling K. Brown, and more. A collaboration between WBUR and The New York Times.`,
          showId: "e636a8dbde3f488a9ba76607f0491376",
          showImage: `https://d3sv2eduhewoas.cloudfront.net/channel/image/e87fddda33fa436a82c53204306b2727.jpg`,
          showPublisher: "WBUR and The New York Times",
          showTitle: "Modern Love",
          showWebsite: `http://www.wbur.org/modernlove?utm_source=listennotes.com&utm_campaign=Listen+Notes&utm_medium=website`,
          title: `A Forgotten Prayer, Answered | With Mira Sorvino`
        }}
        testing={true}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
import React from 'react';
import { Text } from 'react-native';
import EpisodeRow from 'components/EpisodeRow';
import renderer from 'react-test-renderer';

jest.useFakeTimers();

it('renders EpisodeRow correctly', () => {
  const tree = renderer
    .create(
      <EpisodeRow
        info={{
          audio: "https://play.podtrac.com/npr-381444908/npr.mc.tritondigital.com/NPR_381444908/media/anon.npr-mp3/npr/fa/2018/11/20181112_fa_fawpodmon.mp3?orgId=1&d=2894&p=381444908&story=667026316&t=podcast&e=667026316&ft=pod&f=381444908",
          description: `Every surface, every bit of air, every bit of water in your home is alive," says scientist Rob Dunn. His new book, 'Never Home Alone,' examines the bacteria, fungi, viruses, parasites and insects we live with — from armpit bacteria to black mold in our walls. Book critic Maureen Corrigan reviews 'A Ladder to the Sky' by John Boyne. She calls it "maliciously witty, erudite and ingeniously constructed."`,
          duration: 2894,
          id: "7fc9602c63904d4ab7c52517e2597b2b",
          publishDate: 1542058248000,
          showColor: "#030404",
          showDescription: "Fresh Air from WHYY, the Peabody Award-winning weekday magazine of contemporary arts and issues, is one of public radio's most popular programs. Hosted by Terry Gross, the show features intimate conversations with today's biggest luminaries.",
          showId: "1df990c9c80a4a04ba11d744c6c0f199",
          showImage: "https://d3sv2eduhewoas.cloudfront.net/channel/image/26a169d975804765aad223e90463a259.jpg",
          showPublisher: "NPR",
          showTitle: "Fresh Air",
          showWebsite: "http://www.npr.org/programs/fresh-air/?utm_source=listennotes.com&utm_campaign=Listen+Notes&utm_medium=website",
          title: "With Bugs & Bacteria Living In Your Home, You're 'Never Home Alone'"
        }}
        finished={true}
        testing={true}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
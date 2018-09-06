export function getDominantColorfromArtwork (url) {
    return dispatch => {
        return fetch(`https://apicloud-colortag.p.mashape.com/tag-url.json?palette=simple&sort=weight&url=${url}`, 
        {
          headers: {
            'X-Mashape-Key' : 'xGqxpKDt1rmshDkDCHU7rUGMqWxqp1oEyY5jsnYTD6AGzqmQlb',
            'Accept': 'application/json',
        }})
        .then((response) => response.json())
        .then((responseJson) => {
            let color = responseJson.tags[0].color;
            console.log(`Retrieved color ${color} from ${url}`)
            return color;
        })
    }
}
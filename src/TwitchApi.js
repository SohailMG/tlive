export class TwitchAPI {
  constructor() {
    this.clientSecret = process.env.TWITCH_CLIENT_SECRET;
    this.clientId = process.env.TWITCH_CLIENT_ID;
    this.accessToken = "vmlqj02wp6usn5w6lys7hq5ysk7ybl";
  }

  async searchChannel(query) {
    try {
      // Make a request to the Search Channels endpoint using the query parameter
      const response = await fetch(
        `https://api.twitch.tv/helix/search/channels?query=${query}`,
        {
          params: {
            limit: 10,
          },
          headers: {
            "Client-ID": this.clientId,
            Authorization: "Bearer " + this.accessToken,
          },
        }
      );

      // Return the response data as a JSON object
      const results = await response.json();
      return results;
    } catch (error) {
      console.error(error);
    }
  }

  async getToken() {
    try {
      // Make a request to the OAuth Token endpoint to obtain an access token
      const response = await fetch("https://id.twitch.tv/oauth2/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `client_id=${this.clientId}&client_secret=${this.clientSecret}&grant_type=client_credentials`,
      });

      // Return the access token from the response data
      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error(error);
    }
  }

  async getSearch(query) {
    try {
      // Make a request to the Search endpoint using the query parameter and the access token
      const response = await fetch(
        `https://api.twitch.tv/helix/search?query=${query}`,
        {
          headers: {
            "Client-ID": this.clientId,
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );

      // Return the response data as a JSON object
      return response.json();
    } catch (error) {
      console.error(error);
    }
  }

  async getFollows(userId) {
    try {
      // Make a request to the Follows endpoint using the from_id parameter and the access token
      const response = await fetch(
        `https://api.twitch.tv/helix/users/follows?first=100&from_id=${userId}`,
        {
          headers: {
            "Client-ID": this.clientId,
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );

      // Return the response data as a JSON object
      return response.json();
    } catch (error) {
      console.error(error);
    }
  }

  async isLive({ channelName, userId }) {
    const streamsEndpoint = `https://api.twitch.tv/helix/streams?user_id=${userId}`;
    const channelEndpoint = `https://api.twitch.tv/helix/search/channels?query=${channelName}`;
    const requestUrl = userId ? streamsEndpoint : channelEndpoint;
    const response = await fetch(requestUrl, {
      headers: {
        "Client-Id": this.clientId,
        Authorization: "Bearer " + this.accessToken,
      },
    });
    const data = await response.json();
    if (!channelName) return data.data[0];
    return (
      data.data.filter(
        (ch) => ch.display_name.toLowerCase() === channelName.toLowerCase()
      )[0] ?? false
    );
  }

  async getVods(userId, pagination) {
    console.log(
      "GET: ",
      `https://api.twitch.tv/helix/videos?user_id=${userId}?first=20$`
    );
    try {
      const response = await fetch(
        `https://api.twitch.tv/helix/videos?user_id=${userId}?first=20${
          pagination ? "&after=" + pagination : ""
        }`,
        {
          headers: {
            "Client-Id": this.clientId,
            Authorization: "Bearer " + this.accessToken,
          },
        }
      );
      const results = await response.json();
      return results;
    } catch (error) {
      console.error(error);
    }
  }
}

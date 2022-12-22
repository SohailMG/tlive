chrome.storage.local.get("cachedList", function (items) {
  const { cachedList } = items;
  if (JSON.parse(cachedList).length > 0) {
    // checkLiveChannels(JSON.parse(cachedList));
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request.cachedList);
  chrome.storage.local.set({ cachedList: request.cachedList }, function () {
    console.log("Background => Saved cached list to local storage");
  });
  chrome.storage.local.get("cachedList", function (items) {
    console.log(items); // Outputs 'value2'
  });
});

// /////////////////////////////////////
// TWITCH API METHODS
// ////////////////////////////////////

const clientSecret = "jhoxxp7j1vkwdz7qqa0t5h5yfs20td";
const clientId = "glyuelrdyfb5jf5qejh4mwsucwrqhq";
const accessToken = "8uhzngjj8p88lo20achk8lm6rbo4p7";
const TWO_MINUTES = 2 * 60 * 1000;
async function checkLiveChannels(channelNames) {
  console.log("checking live channels...");
  const headers = { "Client-ID": "YOUR_CLIENT_ID" };
  const channelIds = await getChannelIds(channelNames, headers);

  for (const channelId of channelIds) {
    const response = await fetch(
      `https://api.twitch.tv/helix/streams?user_id=${channelId}`,
      { headers }
    );

    const data = await response.json();
    if (data.data.length > 0) {
      const stream = data.data[0];
      const startedAt = new Date(stream.started_at);
      const currentTime = new Date();
      if (currentTime - startedAt < TWO_MINUTES) {
        console.log(`${channelId} went live in the last 2 minutes!`);
      } else {
        console.log(`${channelId} went live in the last ${startedAt}`);
      }
    }
  }
}

async function getChannelIds(channelNames, headers) {
  const promises = channelNames.map(async (channelName) => {
    const response = await fetch(
      `https://api.twitch.tv/helix/users?login=${channelName}`,
      { headers }
    );

    const data = await response.json();
    if (data.data.length > 0) {
      return data.data[0].id;
    }
    return null;
  });

  return (await Promise.all(promises)).filter((id) => id != null);
}

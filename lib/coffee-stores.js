// ************ INITIALIZE UNSPLASH API ***************

import { createApi } from "unsplash-js";

// on your node server
const unsplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
  //...other fetch options
});

const getUrlForCoffeeStores = (latLong, limit, query) => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`;
};

const getListOfCoffeeStorePhotos = async () => {
  const photos = await unsplashApi.search.getPhotos({
    query: "nigeria gadget shop",
    page: 1,
    perPage: 40,
    orientation: "landscape",
  });

  const unsplashResults = photos.response.results;

  const photosResponse = unsplashResults.map((result) => {
    return result.urls.small;
  });

  return photosResponse;
};

export const fetchCoffeeStores = async (
  latLong = "6.524379,3.379206",
  limit = 6
) => {
  const photos = await getListOfCoffeeStorePhotos();

  const response = await fetch(
    getUrlForCoffeeStores(latLong, limit, "phone store"),
    {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
      },
    }
  );

  const data = await response.json();

  return data.results.map((item, index) => {
    return {
      ...item,
      imgUrl: photos[index],
    };
  });
};

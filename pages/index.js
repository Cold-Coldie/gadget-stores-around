import Head from "next/head";
import Image from "next/image";
//import { Inter } from "@next/font/google";

import styles from "../styles/Home.module.css";

import Banner from "../components/banner";
import HeroImage from "../public/static/hero-image.png";
import Card from "../components/card";
import { fetchCoffeeStores } from "../lib/coffee-stores";
import useTrackLocation from "../hooks/useTrackLocation";
import { useContext, useEffect, useState } from "react";
import { ACTION_TYPES, MainContext } from "../context/MainProvider";

//import coffeeStoresData from "../data/coffee-stores.json";

//const inter = Inter({ subsets: ["latin"] });

export async function getStaticProps(context) {
  const coffeeStores = await fetchCoffeeStores();

  return {
    props: { coffeeStores }, // will be passed to the page component as props
  };
}

export default function Home(props) {
  const { state: statee, dispatch } = useContext(MainContext);
  const { coffeeStores, latLong } = statee;

  const {
    handleTrackLocation,
    // latLong,
    locationErrorMessage,
    isFindingLocation,
  } = useTrackLocation();

  // const [coffeeStores, setCoffeeStores] = useState("");

  const handleOnBannerButtonClick = () => {
    handleTrackLocation();
  };

  useEffect(() => {
    if (latLong) {
      try {
        const fetchNearbyCoffeeStores = async () => {
          const fetchedCoffeeStores = await fetch(
            `/api/getCoffeeStoresByLocation?latLong=${latLong}&limit=30`
          );

          const coffeeStores = await fetchedCoffeeStores.json();

          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: { coffeeStores },
          });
        };

        fetchNearbyCoffeeStores();
      } catch (error) {
        console.log({ error });
      }
    }
  }, [latLong]);

  const { state } = useContext(MainContext);

  return (
    <>
      <Head>
        <title>Gadget Connoisseur</title>
        <meta name="description" content="View gadget stores around you." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner
          buttonText={isFindingLocation ? "Locating... " : "View stores nearby"}
          handleOnClick={handleOnBannerButtonClick}
        />
        <p>
          {locationErrorMessage &&
            ` Something went wrong: ${locationErrorMessage}`}
        </p>
        {/* <div className={styles.heroImage}>
          <Image
            src={HeroImage}
            alt={"coffee banner"}
            width={700}
            height={400}
            priority
          />
        </div> */}

        {coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Stores near me</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map((coffeeStore) => {
                return (
                  <Card
                    key={coffeeStore?.fsq_id}
                    href={`/coffee-store/${coffeeStore?.fsq_id}`}
                    name={coffeeStore?.name}
                    imageUrl={coffeeStore?.imgUrl}
                    className={styles.card}
                  />
                );
              })}
            </div>
          </div>
        )}

        {props.coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Lagos Stores</h2>
            <div className={styles.cardLayout}>
              {props.coffeeStores.map((coffeeStore) => {
                return (
                  <Card
                    key={coffeeStore?.fsq_id}
                    href={`/coffee-store/${coffeeStore?.fsq_id}`}
                    name={coffeeStore?.name}
                    imageUrl={coffeeStore?.imgUrl}
                    className={styles.card}
                  />
                );
              })}
            </div>
          </div>
        )}
      </main>
    </>
  );
}

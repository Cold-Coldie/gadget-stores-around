import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";

import CoffeeStoreData from "../../data/coffee-stores.json";

import styles from "../../styles/coffee-store.module.css";
import Image from "next/image";
import classNames from "classnames";
import { fetchCoffeeStores } from "../../lib/coffee-stores";
import { useContext, useEffect, useMemo, useState } from "react";
import { MainContext } from "../../context/MainProvider";
import useSWR from "swr";

export async function getStaticProps(staticProps) {
  const { params } = staticProps;

  const coffeeStores = await fetchCoffeeStores();

  const findCoffeeStoreById = coffeeStores.find((coffeeStore) => {
    return coffeeStore.fsq_id === params.id;
  });

  return {
    props: {
      coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {},
    },
  };
}

export async function getStaticPaths() {
  const coffeeStores = await fetchCoffeeStores();

  const paths = coffeeStores.map((coffeeStore) => {
    return { params: { id: coffeeStore.fsq_id } };
  });

  return {
    paths,
    fallback: true,
  };
}

const CoffeeStore = (props) => {
  const router = useRouter();
  const { id } = router.query;

  const { state } = useContext(MainContext);

  const [coffeeStoreFromDb, setCoffeeStoreFromDb] = useState({});
  const [vote, setVote] = useState(0);

  const findCoffeeStoreById = () => {
    return state.coffeeStores.find((item) => {
      return item.fsq_id === id;
    });
  };

  const destructureFrom = () => {
    if (props.coffeeStore) {
      if (Object.keys(props.coffeeStore).length > 1) {
        return { ...props.coffeeStore };
      } else {
        return { ...findCoffeeStoreById() };
      }
    }
  };

  useEffect(() => {
    setCoffeeStoreFromDb(destructureFrom());
  }, []);

  const fetcher = (url) => fetch(url).then((res) => res.json());

  const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);

  useEffect(() => {
    if (data && data.records && data.records.length > 0) {
      setCoffeeStoreFromDb({
        name: data.records[0].name,
        imgUrl: data.records[0].imageUrl,
        location: {
          formatted_address: data.records[0].address,
          location: data.records[0].region,
        },
        vote: data.records[0].vote,
      });

      setVote(data.records[0].vote);
    }
  }, [data]);

  const { name, imgUrl, location } = coffeeStoreFromDb;

  useEffect(() => {
    handleCreateCoffeeStore();
  }, [coffeeStoreFromDb]);

  const handleUpvoteButton = async () => {
    try {
      const data = {
        id,
      };

      const response = await fetch("/api/upVoteCoffeeStoreById", {
        method: "PUT", // or 'POST'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const dbCffeeStore = await response.json();

      if (
        dbCffeeStore &&
        dbCffeeStore.records &&
        dbCffeeStore.records.length > 0
      ) {
        setVote(vote + 1);
      }
    } catch (error) {
      console.error("Error upvoting coffee store", error);
    }
  };

  const handleCreateCoffeeStore = async () => {
    try {
      const data = {
        id,
        name,
        address: location?.formatted_address,
        region:
          location?.location || location?.region || location?.formatted_address,
        vote: 0,
        imageUrl: imgUrl,
      };

      const response = await fetch("/api/createCoffeeStore", {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const dbCffeeStore = await response.json();
    } catch (error) {
      console.error("Error creating coffee store", error);
    }
  };

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
      </Head>

      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href={"/"}>Back to home</Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            src={imgUrl && `${imgUrl.slice(0, -3)}900`}
            // src={imgUrl}
            width={600}
            height={360}
            className={styles.storeImg}
            alt={name}
            priority
          />
        </div>

        <div className={classNames("glass", styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image
              src={"/static/icons/places.svg"}
              width={24}
              height={24}
              alt={"location icon"}
            />
            <p className={styles.text}>{location?.formatted_address}</p>
          </div>

          <div className={styles.iconWrapper}>
            <Image
              src={"/static/icons/near-me.svg"}
              width={24}
              height={24}
              alt={"location icon"}
            />
            <p className={styles.text}>
              {location?.location ||
                location?.region ||
                location?.formatted_address}
            </p>
          </div>

          <div className={styles.iconWrapper}>
            <Image
              src={"/static/icons/star.svg"}
              width={24}
              height={24}
              alt={"star icon"}
            />
            <p className={styles.text}>{vote}</p>
          </div>

          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Upvote
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeStore;

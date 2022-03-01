import { useState, useEffect } from 'react';
import Head from 'next/head'
import Image from 'next/image'

import Layout from '@components/Layout';
import Container from '@components/Container';
import Button from '@components/Button';

import { search, mapImageResources, getFolders } from '../lib/cloudinary';

import images from '@data/images';
// import images from '../data/images';

import styles from '@styles/Home.module.scss'



// export default function Home({ images, nextCursor }) {
export default function Home({ images: defaultImages, nextCursor: defaultNextCursor, folders }) {
  // const [images, setImages] = useState(defaultImages);
  const [images, setImages] = useState([]);
  const [nextCursor, setNextCursor] = useState(defaultNextCursor);
  const [activeFolder, setActiveFolder] = useState('');

// console.log({images})
// console.log({nextCursor})
console.log({activeFolder})


// useEffect(() => {
//   (async function run() {
//     const results = await fetch('/api/search', {
//       method: 'POST',
//       body: JSON.stringify({
//         nextCursor
//       })
//     }).then(res => res.json());
//     console.log({results})
//   })()
// }, [])


async function handleLoadMore(e) {
  e.preventDefault();

  const results = await fetch('/api/search', {
    method: 'POST',
    body: JSON.stringify({
      nextCursor,
      expression: `folder="${activeFolder}" ` 
    })
  }).then(res => res.json());

  // const { resources, next_cursor: nextCursor } = results;
  const { resources, next_cursor: updatedNextCursor } = results;

  const images = mapImageResources(resources);

  setImages(prev => {
    return [
      ...prev,
      ...images
    ]
  });

  setNextCursor(updatedNextCursor);
};



function handleOnFolderClick(e) {
  const folderPath = e.target.dataset.folderPath;
  setActiveFolder(folderPath);
  setNextCursor(undefined);
  setImages([]);
};



useEffect(() => {
  (async function run() {
    const results = await fetch('/api/search', {
      method: 'POST',
      body: JSON.stringify({
        nextCursor,
        expression: `folder="${activeFolder}" ` 
      })
    }).then(res => res.json());
  
    // const { resources, next_cursor: nextCursor } = results;
    const { resources, next_cursor: updatedNextCursor } = results;
  
    const images = mapImageResources(resources);
  
    setImages(prev => {
      return [
        ...prev,
        ...images
      ]
    });
  
    setNextCursor(updatedNextCursor);
  })()
},[activeFolder])



function handleDeSelectFolder() {
  setActiveFolder('');
  setNextCursor(undefined);
  setImages([]);
};


  return (
    <Layout>
      <Head>
        <title>My Images</title>
        <meta name="description" content="All of my cool images." />
      </Head>

      <Container>
        <h1 className="sr-only">My Images</h1>


        <h2 className={styles.header}>Images</h2>

        <ul className={styles.images}>
          {images.map(image => {
            return (
              <li key={image.id}>
                <a href={image.link} rel="noreferrer">
                  <div className={styles.imageImage}>
                    <Image width={image.width} height={image.height} src={image.image} alt="" />
                  </div>
                  <h3 className={styles.imageTitle}>
                    { image.title }
                  </h3>
                </a>
              </li>
            )
          })}
        </ul>


        <h2 className={styles.header}>Folders</h2>

        <ul className={styles.folders} onClick={handleOnFolderClick}>
          {folders.map(folder => {
            return (
              <li key={folder.path}>
                <button data-folder-path={folder.path}>{folder.name}</button>
              </li>
            )
          })}
        </ul>

        <p>
          <Button onClick={handleDeSelectFolder}>Empty Folder</Button>
        </p>

        <p>
          <Button onClick={handleLoadMore}>Load More Results</Button>
        </p>
      </Container>
    </Layout>
  )
}


export async function getStaticProps() {
  // const results = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/resources/image`, {
  //   headers: {
  //     Authorization: `Basic ${Buffer.from(process.env.CLOUDINARY_API_KEY + ':' + process.env.CLOUDINARY_API_SECRET).toString('base64')  }`
  //   }
  // }).then(res => res.json());
  // console.log("results", results);
  
  // const results = await search();
  const results = await search({
    expression: 'folder="" ' 
  });

  const { resources, next_cursor: nextCursor } = results;

  // const images = resources.map(resource => {
  //   const { width, height } = resource;
  //   return {
  //     id: resource.asset_id,
  //     title: resource.public_id,
  //     image: resource.secure_url,
  //     width,
  //     height
  //   }
  // })
  const images = mapImageResources(resources);

  // const folders = await getFolders();
  // console.log("folders", folders)
  const { folders } = await getFolders();

  return {
    props: {
      images,
      nextCursor: nextCursor || false,   // if we have a nextCursor, or if we don't, it's value will be false (not get qan error) 
      folders
    }
  }
}
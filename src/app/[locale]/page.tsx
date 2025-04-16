'use client'
// import Button from './_components/button/Button'
// import ProductCard from './_components/productCard/ProductCard'
import VideoPlayer from './_components/video/video'
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import Out_team from './_components/home_components/Out_team'
import Our_client from './_components/home_components/Our_client'
// import { useRouter } from "@/i18n/routing";
import Banner from './_components/home_components/Banner'
import About from './_components/home_components/About'
import Blogs from './_components/home_components/Blogs'
import OurValues from './_components/home_components/OurValues';
import OurMarket from './_components/home_components/Our_Market';
import Spinner from './_components/spinner/Spinner';


const Home = () => {

    // const router = useRouter();

    

    useEffect(() => {
    AOS.init({
      disable: "mobile",
      once: true,       // Whether animation should happen only once
      mirror: false,    // Whether elements should animate out on scroll
    });


}, []);

  

  return (
    <>

      <Banner />

      <About />


      <Blogs />




      <div data-aos="flip-up" data-aos-duration="500" data-aos-delay="0" className='w-full mb-20 md:mb-32'>
        <VideoPlayer
          url="https://www.w3schools.com/html/mov_bbb.mp4"
          autoPlay={false}
        />
      </div>


      <OurValues />

      <OurMarket />

      <Out_team />

      <Our_client />

    </>
  )
}

export default Home
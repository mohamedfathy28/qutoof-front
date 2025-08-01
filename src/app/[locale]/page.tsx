"use client";
// import Button from './_components/button/Button'
// import ProductCard from './_components/productCard/ProductCard'
import VideoPlayer from "./_components/video/video";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import Out_team from "./_components/home_components/Out_team";
import Our_client from "./_components/home_components/Our_client";
// import { useRouter } from "@/i18n/routing";
import Banner from "./_components/home_components/Banner";
import About from "./_components/home_components/About";
import Blogs from "./_components/home_components/Blogs";
// import OurValues from './_components/home_components/OurValues';
import OurMarket from "./_components/home_components/Our_Market";
import { useConfigrationsContext } from "./_contexts/MainConfigContext";


import { useState } from "react";

const Home = () => {
	const { Configrations } = useConfigrationsContext();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		AOS.init({
			disable: "mobile",
			once: true,
			mirror: false,
		});
	}, []);

	// Hide spinner when Configrations is loaded and DOM is ready
	useEffect(() => {
		if (Configrations) {
			// Wait for next tick to ensure DOM is painted
			const timeout = setTimeout(() => setLoading(false), 300);
			return () => clearTimeout(timeout);
		}
	}, [Configrations]);

	return (
		<>
			{loading && (
				<div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#fff', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'opacity 0.3s' }}>
					<div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-500"></div>
				</div>
			)}
			<Banner />
			<About />
			<Blogs />
			<div
				data-aos='flip-up'
				data-aos-duration='500'
				data-aos-delay='0'
				className='w-full mb-20 md:mb-32'
			>
				<VideoPlayer
					url={Configrations?.home_videos || "#"}
					autoPlay={false}
					// thumbnail={"/fallback-image.jpg"}
					height='616px'
				/>
			</div>
			{/*<OurValues />*/}
			<OurMarket />
			<Out_team />
			<Our_client />
		</>
	);
};

export default Home;

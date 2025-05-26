import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "quttouf.com",
				port: "",
				pathname: "/**",
			},
		],
		qualities: [100],
	},
};

export default withNextIntl(nextConfig);

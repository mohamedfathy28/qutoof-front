import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
    images: {
        domains: ["quttouf.com"],
      },
};

export default withNextIntl(nextConfig);




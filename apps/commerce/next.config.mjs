/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@mgd/ui",
    "@mgd/types",
    "@mgd/widgets",
    "@mgd/company-state",
    "@mgd/design-system",
    "@mgd/business-brain",
    "@mgd/advisor"
  ]
};

export default nextConfig;

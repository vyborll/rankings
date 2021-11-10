import type { NextPage } from 'next';

import Layout from '@root/ui/components/Layout';

const Submit: NextPage = () => {
  return (
    <Layout>
      <div className="lg:max-w-3xl lg:mx-auto py-6 md:py-10 px-3 md:px-6 space-y-6">
        <div className="text-center">
          <span className="text-3xl font-bold mb-1 border-b border-green-950 pb-1">
            Submit a Project
          </span>
        </div>

        <div>
          <div>
            This form is only for your project to be listed on the{' '}
            <span className="font-bold">&quot;Upcoming NFT Drops&quot;</span> page. Your project
            will not get any rankings or extra services we provide.
          </div>
        </div>

        <div style={{ height: '100%' }}>
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSewWh0a6TgrP04pd448LEkhfhmgoiAlaU4RWeQHGglCfgHpHA/viewform?embedded=true"
            style={{ width: '100%', height: 2200 }}
            frameBorder="0"
            marginHeight={0}
            marginWidth={0}
          >
            Loading…
          </iframe>
        </div>
      </div>
    </Layout>
  );
};

export default Submit;

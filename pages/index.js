import { useState } from 'react';
import Head from 'next/head';
import SequenceTab from '../components/SequenceTab';
import TimeAwareTab from '../components/TimeAwareTab';
import CoinTossTab from '../components/CoinTossTab';
import PriceFeedTab from '../components/PriceFeedTab';

const tabs = [
  { id: 'sequence', name: 'Sequence', component: SequenceTab },
  { id: 'time-aware', name: 'Time-Aware', component: TimeAwareTab },
  { id: 'coin-toss', name: 'Coin Toss', component: CoinTossTab },
  { id: 'price-feed', name: 'Price Feed', component: PriceFeedTab },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('sequence');

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Livy Demo Site</title>
        <meta name="description" content="A four-tab demo showcasing Livy's JS SDK (presented by Celestia Labs)" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">Livy Demo Site</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Showcasing Livy's JS SDK</span>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Tab Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            {ActiveComponent && <ActiveComponent />}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-400">
              Presented by <span className="text-blue-400">Celestia Labs</span> | 
              Powered by <span className="text-blue-400">Livy SDK</span> | 
              Built with <span className="text-blue-400">Next.js</span> & <span className="text-blue-400">Tailwind CSS</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 
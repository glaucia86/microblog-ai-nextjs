import { HOMEPAGE_FEATURES } from '@/lib/data/features';
import { APP_CONFIG } from '@/lib/constants/app';
import CTAButton from './components/CTAButton';

export default function HomePage() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300'>
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}

const HeroSection = () => (
  <section className='px-4 pt-24 pb-20 mx-auto max-w-7xl sm:px-6 lg:px-8'>
    <div className='max-w-3xl mx-auto text-center space-y-8'>
      <h1 className='text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl'>
        <span className='block bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200'>
          Smart Microblog
        </span>
        <span className='block text-blue-600 dark:text-blue-500'>
          Generator & Insights
        </span>
      </h1>
      <p className='mx-auto max-w-2xl text-xl text-gray-500 dark:text-gray-300'>
        {APP_CONFIG.DESCRIPTION}. Maximize your reach with AI-optimized posts powered by GitHub Models.
      </p>
      <div className='mt-8'>
        <CTAButton href='/generate'>Get Started</CTAButton>
      </div>
    </div>
  </section>
);

const FeaturesSection = () => (
  <section className='py-16 bg-white dark:bg-gray-800 transition-colors duration-300'>
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      <div className='text-center'>
        <h2 className='text-3xl font-extrabold text-gray-900 dark:text-white'>
          Powerful Features
        </h2>
      </div>

      <div className='grid grid-cols-1 gap-8 md:grid-cols-3 mt-16'>
        {HOMEPAGE_FEATURES.map((feature, index) => {
          const IconComponent = feature.icon;
          
          return (
            <div
              key={index}
              className={`${feature.bgColor} rounded-2xl p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer`}
            >
              <div className='flex items-center gap-4 mb-4'>
                <div className={`rounded-lg bg-white dark:bg-gray-800 p-3 ${feature.iconColor}`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
                  {feature.title}
                </h3>
              </div>
              <p className='text-gray-600 dark:text-gray-300'>
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

const CTASection = () => (
  <section className='py-16 bg-gray-50 dark:bg-gray-900'>
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
      <h2 className='text-3xl font-extrabold text-gray-900 dark:text-white mb-8'>
        Ready to create impactful content?
      </h2>
      <CTAButton href='/generate'>Start For Free</CTAButton>
    </div>
  </section>
);
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Scan, Search, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-bg">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />
        
        {/* Floating orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-poketab-purple/10 blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="container mx-auto px-4 pt-20 pb-16 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left: Text content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">AI-Powered Detection</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              <span className="text-foreground">Your</span>{' '}
              <span className="text-primary neon-text">Futuristic</span>
              <br />
              <span className="text-foreground">Pokédex</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0"
            >
              Scan, identify, and collect Pokémon using cutting-edge AI technology. 
              Point your camera, discover new species, and build your ultimate collection.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link to="/scan">
                <Button variant="hero" size="xl" className="w-full sm:w-auto gap-3">
                  <Scan className="w-5 h-5" />
                  Start Scanning
                </Button>
              </Link>
              <Link to="/browse">
                <Button variant="outline" size="xl" className="w-full sm:w-auto gap-3">
                  <Search className="w-5 h-5" />
                  Browse Pokédex
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right: Hero visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex-1 relative"
          >
            <div className="relative w-full max-w-lg mx-auto">
              {/* Glowing ring */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="w-80 h-80 rounded-full border-2 border-primary/30"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div
                  className="absolute w-72 h-72 rounded-full border border-primary/20"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div
                  className="absolute w-64 h-64 rounded-full border border-poketab-purple/20"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                />
              </div>

              {/* Center scanner UI */}
              <div className="relative z-10 glass-card p-8 rounded-3xl scanner-pulse">
                <div className="aspect-square flex items-center justify-center relative">
                  {/* Scanner corners */}
                  <div className="absolute inset-4">
                    <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-primary rounded-tl-lg" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-primary rounded-tr-lg" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-primary rounded-bl-lg" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-primary rounded-br-lg" />
                  </div>

                  {/* Pokeball animation */}
                  <motion.div
                    className="w-32 h-32 rounded-full relative float"
                    style={{
                      background: 'linear-gradient(180deg, hsl(0, 72%, 51%) 0%, hsl(0, 72%, 51%) 48%, hsl(222, 47%, 6%) 48%, hsl(222, 47%, 6%) 52%, hsl(210, 40%, 98%) 52%, hsl(210, 40%, 98%) 100%)',
                      boxShadow: '0 0 40px hsl(var(--primary) / 0.3), inset 0 -20px 40px rgba(0,0,0,0.3)'
                    }}
                  >
                    {/* Center button */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-foreground border-4 border-background">
                      <motion.div 
                        className="absolute inset-1 rounded-full bg-primary"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                  </motion.div>

                  {/* Scanning line */}
                  <motion.div
                    className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
                    animate={{ top: ['20%', '80%', '20%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </div>

                <div className="text-center mt-4">
                  <p className="text-xs font-mono text-muted-foreground tracking-widest uppercase">
                    Ready to Scan
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Feature highlights */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20"
        >
          {[
            { icon: Scan, title: 'AI Detection', desc: 'Instant identification using TensorFlow.js' },
            { icon: Search, title: 'Full Pokédex', desc: 'Access data for all 1000+ Pokémon' },
            { icon: Shield, title: 'Your Collection', desc: 'Save and track your discoveries' },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="glass-card p-6 text-center group hover:border-primary/40 transition-colors"
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

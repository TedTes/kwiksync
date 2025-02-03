import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { api } from "../config";
import {
  ArrowRight,
  CheckCircle,
  Zap,
  BarChart2,
  Check,
  X,
  RefreshCw,
  LayoutDashboard,
  Play,
  Users,
} from "lucide-react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { PayPalPaymentForm, StripePaymentForm } from "../components/payment";
import { useUserStore } from "../store";
interface FeatureTab {
  id: string;
  title: string;
  image: string;
  description: string;
  icon: React.ElementType;
}

export const LandingPage = () => {
  const stripePromise = loadStripe("YOUR_PUBLISHABLE_KEY");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [pricingPlans, setPlans] = useState<IPricingPlans[]>([]);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "monthly"
  );
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [provider, setProvider] = useState("stripe");
  const [selectedPlan, setSelectedPlan] = useState<string>("starter");
  const [isPlanSelected, setIsPlanSelected] = useState(false);
  const { user } = useUserStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (user) navigate("/login");
    const handleScroll = () => {
      const totalScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = (window.scrollY / totalScroll) * 100;
      setScrollProgress(Math.min(currentProgress, 100));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    async function fetchPricingPlansData() {
      try {
        const response = await api.get(
          `/pricing-plans?billingCycle=${billingCycle}`
        );
        setPlans(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchPricingPlansData();
  }, [billingCycle]);
  const [videoUrl, setVideoUrl] = useState(
    "https://www.youtube.com/embed/YOUR_VIDEO_ID"
  );

  // Function to handle video sections
  const handleWatchSection = (section: string) => {
    switch (section) {
      case "quickTour":
        setVideoUrl("https://www.youtube.com/embed/YOUR_VIDEO_ID?start=0"); // Starts at 0 seconds
        break;
      case "features":
        setVideoUrl("https://www.youtube.com/embed/YOUR_VIDEO_ID?start=120"); // Starts at 2 minutes
        break;
      default:
        setVideoUrl("https://www.youtube.com/embed/YOUR_VIDEO_ID");
    }
    setIsVideoModalOpen(true);
  };

  const VideoModal = ({
    isOpen,
    onClose,
  }: {
    isOpen: boolean;
    onClose: () => void;
  }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-white rounded-xl overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/50 hover:bg-white/80 transition-colors"
          >
            <X size={24} className="text-gray-700" />
          </button>
          <iframe
            className="w-full aspect-video"
            src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    );
  };
  const handleWatchDemo = () => {
    setIsVideoModalOpen(true);
  };

  const featureTabs: FeatureTab[] = [
    {
      id: "overview",
      title: "Comprehensive Business Insights",
      image: "/images/overview3.jpg",
      description:
        "Gain real-time, actionable insights across all your sales channels with our advanced analytics dashboard.",
      icon: BarChart2,
    },
    {
      id: "inventory",
      title: "Intelligent Inventory Management",
      image: "/images/inventory.png",
      description:
        "Automate stock tracking, prevent stockouts, and optimize order fulfillment with smart inventory solutions.",
      icon: CheckCircle,
    },
    {
      id: "analytics",
      title: "Performance Optimization",
      image: "/images/analytics.png",
      description:
        "Deep dive into performance metrics, track engagement, and make data-driven decisions to accelerate growth.",
      icon: Zap,
    },
    {
      id: "platforms",
      title: "Seamless Multi-Platform Integration",
      image: "/images/platforms.png",
      description:
        "Effortlessly synchronize and manage multiple e-commerce platforms from a single, intuitive interface.",
      icon: ArrowRight,
    },
  ];

  const handleLogin = () => {
    navigate("/login");
  };
  const handleSelectedPricingPlanAction = (plan: string) => {
    setSelectedPlan(plan);
    setIsPlanSelected(true);
  };

  const handleProviderChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setProvider(event.target.value);
  };
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 h-1 bg-blue-600 z-50 transition-all duration-200"
        style={{ width: `${scrollProgress}%` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      {/* Navigation */}
      <nav className="fixed w-full bg-white shadow-md z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <span className="text-2xl font-bold text-blue-600">KwikSync</span>
              <div className="hidden md:flex space-x-6">
                <a
                  href="#features"
                  className="text-gray-600 hover:text-blue-600 transition"
                >
                  Features
                </a>
                <a
                  href="#pricing"
                  className="text-gray-600 hover:text-blue-600 transition"
                >
                  Pricing
                </a>
                <a
                  href="#demo"
                  className="text-gray-600 hover:text-blue-600 transition"
                >
                  Demo
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogin}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <span>Sign In</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-32 pb-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
              Elevate Your E-Commerce Strategy
            </h1>
            <p className="text-xl text-gray-600">
              Unify your sales channels, optimize inventory, and drive growth
              with KwikSync's intelligent business management platform.
            </p>
            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogin}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleWatchDemo}
                className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
              >
                Watch Demo
              </motion.button>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-xl shadow-2xl overflow-hidden"
          >
            <img
              src="/images/overview.png"
              alt="KwikSync Dashboard"
              className="w-full"
            />
          </motion.div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features, Simplified Management
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Designed for e-commerce entrepreneurs who demand more than just
              basic tools.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            {featureTabs.map((feature) => (
              <motion.div
                key={feature.id}
                whileHover={{ translateY: -10 }}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition"
              >
                <div className="flex items-center mb-6">
                  <feature.icon className="w-10 h-10 text-blue-600 mr-4" />
                  <h3 className="text-2xl font-bold">{feature.title}</h3>
                </div>
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="rounded-lg mb-6 shadow-md"
                />
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Flexible Pricing for Every Business
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Scale your e-commerce strategy with plans designed to grow with
              you
            </p>
          </div>

          {/* Billing Cycle Toggle */}
          <div className="flex justify-center mb-12">
            <div className="bg-gray-100 rounded-full p-1 flex items-center shadow-md">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-6 py-2 rounded-full transition ${
                  billingCycle === "monthly"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("annual")}
                className={`px-6 py-2 rounded-full transition ${
                  billingCycle === "annual"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                Annual <span className="text-green-500 ml-2">Save 15%</span>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan) => (
              <motion.div
                key={plan.name}
                whileHover={{ scale: 1.05 }}
                className={`bg-white rounded-xl shadow-lg p-8 flex flex-col relative overflow-hidden ${
                  plan.isMostPopular ? "border-2 border-blue-600" : ""
                }`}
              >
                {plan.isMostPopular && (
                  <div className="absolute top-0 left-0 right-0 bg-blue-600 text-white text-center py-2">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-4 mt-4">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-gray-600">
                    /{billingCycle === "monthly" ? "month" : "year"}
                  </span>
                </div>

                <button
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition mb-6"
                  onClick={handleSelectedPricingPlanAction.bind(
                    null,
                    plan.name
                  )}
                >
                  Choose {plan.name}
                </button>

                <div className="space-y-4">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  {pricingPlans[0].features.map((feature, index) => (
                    <div key={feature} className="flex items-center">
                      {index < pricingPlans[0].features.length ? (
                        <Check className="w-5 h-5 text-green-500 mr-3" />
                      ) : (
                        <X className="w-5 h-5 text-red-500 mr-3" />
                      )}
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
          {/* Demo Section */}
          <section id="demo" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  See KwikSync in Action
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Watch how KwikSync streamlines your e-commerce operations and
                  boosts efficiency.
                </p>
              </div>

              {/* Video Container */}
              <div className="relative max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl mb-16">
                <div
                  className="aspect-video bg-gray-900 relative cursor-pointer group"
                  onClick={() => setIsVideoModalOpen(true)}
                >
                  <img
                    src="/images/demo-thumbnail.jpg"
                    alt="Demo Video Thumbnail"
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-75 transition"
                  />
                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-20 h-20 bg-blue-600/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
                    >
                      <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-white border-b-[12px] border-b-transparent ml-1" />
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Feature Preview Cards */}
              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {/* Quick Product Tour */}
                <motion.div
                  whileHover={{ y: -8 }}
                  onClick={() => {
                    // Jump to specific demo section
                    setIsVideoModalOpen(true);
                  }}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Play className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    Quick Product Tour
                  </h3>
                  <p className="text-gray-600">
                    Watch a 2-minute overview of how KwikSync works with your
                    stores.
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className="text-blue-600 font-medium">
                      Watch 2 min tour →
                    </span>
                  </div>
                </motion.div>

                {/* Sample Dashboard */}
                <motion.div
                  whileHover={{ y: -8 }}
                  onClick={() => handleWatchSection("quickTour")}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <LayoutDashboard className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    Sample Dashboard
                  </h3>
                  <p className="text-gray-600">
                    Explore our interface with sample data - no login required.
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-green-100 text-green-600 text-sm rounded">
                        Interactive
                      </span>
                      <span className="text-green-600 font-medium">
                        View demo →
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Success Stories */}
                <motion.div
                  whileHover={{ y: -8 }}
                  onClick={() => window.open("/case-studies", "_blank")}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    Success Stories
                  </h3>
                  <p className="text-gray-600">
                    See how other businesses increased sales using KwikSync.
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <span className="text-purple-600 font-medium">
                        Read case studies →
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Bottom CTA */}
              <div className="text-center mt-12">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsVideoModalOpen(true)}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <span>Watch Full Demo</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </section>
          {/* Custom Solution */}
          <div className="mt-16 text-center bg-gray-100 rounded-xl shadow-lg p-12">
            <h3 className="text-3xl font-bold mb-4">Need a Custom Solution?</h3>
            <p className="text-xl text-gray-600 mb-8">
              Our team can create a tailored pricing plan that perfectly fits
              your unique business needs.
            </p>
            <button className="flex items-center space-x-2 mx-auto bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition">
              <span>Contact Sales</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
      {/* Call to Action */}
      <section className="bg-blue-600 py-20 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl mb-10 text-blue-100">
            Join thousands of successful entrepreneurs who've streamlined their
            operations with KwikSync.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogin}
            className="flex items-center space-x-3 mx-auto px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition"
          >
            <span className="text-lg font-semibold">Start Your Free Trial</span>
          </motion.button>
        </div>
      </section>
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />
      <div>
        {isPlanSelected && (
          <div>
            <label>
              Select Payment Provider:
              <select value={provider} onChange={handleProviderChange}>
                <option value="stripe">Stripe</option>
                <option value="paypal">PayPal</option>
              </select>
            </label>

            {provider === "stripe" && (
              <Elements stripe={stripePromise}>
                <StripePaymentForm plan={selectedPlan} />
              </Elements>
            )}
            {provider === "paypal" && <PayPalPaymentForm plan={selectedPlan} />}
          </div>
        )}
      </div>
    </div>
  );
};

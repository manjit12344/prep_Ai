import React from "react";
import { motion } from "framer-motion";
import { FEATURES } from "./landing.js";

export default function LandingFeatures() {
  // 1. Parent Container Variants: Controls the orchestration of child elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        // This causes the cards to reveal one after another automatically
        staggerChildren: 0.15, 
      },
    },
  };

  // 2. Child Card Variants: Dictates individual card animation paths
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 24 // Start slightly lower down the screen
    },
    visible: { 
      opacity: 1, 
      y: 0, // Float smoothly back up to its native layout position
      transition: { 
        duration: 0.5, 
        ease: "easeOut" 
      }
    },
  };

  return (
    // We swap standard divs with motion.div elements to wire up the animations
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      // margin: "-80px" acts as a protective buffer so the animation triggers cleanly after scrolling past the fold
      viewport={{ once: true, margin: "-80px" }}
      className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left max-w-5xl mx-auto pt-14 pb-20 px-6 border-t border-line"
    >
      {FEATURES.map((feature) => (
        <motion.div
          key={feature.label}
          variants={cardVariants}
          className="border border-line rounded-lg bg-card/50 p-6 backdrop-blur-sm"
        >
          {/* Feature Header */}
          <h3 className="font-mono text-sm text-main mb-3 font-semibold">
            {feature.label}
          </h3>

          {/* Feature Body Detail */}
          <p className="text-xs text-muted leading-relaxed font-mono">
            {feature.detail}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
}
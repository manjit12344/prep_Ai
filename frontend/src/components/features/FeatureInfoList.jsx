import React from "react";
import { motion } from "framer-motion";

const INFO_ITEMS = [
  {
    title: "Adaptive Questions",
    detail: "AI adjusts questions based on how you answer."
  },
  {
    title: "Score Feedback",
    detail: "Get instant scoring performance updates."
  },
  {
    title: "Safe Testing",
    detail: "Practice comfortably in an isolated sandbox."
  }
];

export default function FeatureInfoList() {
  // 1. Parent Orchestration: Coordinates the staggered reveal timings
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12, // The gap between each card's entry wave
      },
    },
  };

  // 2. Child Variants: Powers the left-to-right micro-slides
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      x: -20 // Starts 20px off to the left
    },
    visible: { 
      opacity: 1, 
      x: 0, // Slides smoothly to its exact native location
      transition: { 
        duration: 0.45, 
        ease: [0.16, 1, 0.3, 1] // High-end custom cubic-bezier ease-out curve
      }
    },
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 font-mono text-xs text-muted"
    >
      {INFO_ITEMS.map((item) => (
        <motion.div 
          key={item.title} 
          variants={cardVariants}
          className="border border-line p-4 rounded bg-card/20 backdrop-blur-[1px]"
        >
          <span className="text-main block mb-1">• {item.title}</span>
          {item.detail}
        </motion.div>
      ))}
    </motion.div>
  );
}
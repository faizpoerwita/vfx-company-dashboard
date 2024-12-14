import React from "react";
import { motion } from "framer-motion";

interface Person {
  id: number;
  name: string;
  designation: string;
  image: string;
}

export const AnimatedTooltip = ({
  items,
}: {
  items: Person[];
}) => {
  return (
    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 flex flex-row items-center justify-center">
      {items.map((person) => (
        <motion.div
          key={person.id}
          className="group relative"
          whileHover="hover"
          initial="rest"
          animate="rest"
        >
          <motion.div
            variants={{
              rest: { scale: 1 },
              hover: { scale: 1.1 },
            }}
            className="relative flex items-center justify-center"
          >
            <div className="flex text-sm items-center justify-center px-4 py-2 bg-black/80 text-white rounded-full">
              {person.name}
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

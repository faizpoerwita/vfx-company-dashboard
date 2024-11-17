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
    <div className="flex flex-row items-center justify-center gap-2 flex-wrap">
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
            <div className="flex items-center justify-center relative">
              <img
                src={person.image}
                className="h-14 w-14 rounded-full object-cover border-2 border-white group-hover:border-indigo-500 transition-all duration-300"
                alt={person.name}
              />
            </div>
          </motion.div>
          <motion.div
            variants={{
              rest: { opacity: 0, y: 10 },
              hover: { opacity: 1, y: 0 },
            }}
            className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white text-sm rounded-lg px-3 py-2 whitespace-nowrap z-50"
          >
            <div className="flex flex-col items-center gap-1">
              <p className="font-semibold">{person.name}</p>
              <p className="text-xs text-gray-300">{person.designation}</p>
            </div>
            <motion.div
              className="absolute -top-1 left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-black border-opacity-80"
              variants={{
                rest: { opacity: 0 },
                hover: { opacity: 1 },
              }}
            />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

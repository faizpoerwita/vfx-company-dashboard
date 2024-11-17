import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

export const ContainerScroll = ({
  users,
  titleComponent,
}: {
  users: {
    name: string;
    designation: string;
    image: string;
    badge?: string;
  }[];
  titleComponent: JSX.Element;
}) => {
  const containerRef = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const scaleDimensions = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

  return (
    <div
      className="h-[40rem] flex items-center justify-center relative p-20"
      ref={containerRef}
    >
      <div
        className="py-10 w-full relative"
        style={{
          perspective: "1000px",
        }}
      >
        <Header title={titleComponent} />
        <motion.div
          style={{
            scale: scaleDimensions,
            opacity: opacity,
          }}
          className="flex flex-wrap items-center justify-center gap-5 mt-8"
        >
          {users.map((user, idx) => (
            <motion.div
              key={`user-${idx}`}
              className="relative group"
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
                delay: idx * 0.1,
              }}
            >
              <div className="relative flex items-center justify-center">
                <img
                  src={user.image}
                  className="object-cover rounded-full h-16 w-16"
                  alt={user.name}
                />
                {user.badge && (
                  <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-neutral-950
                    ${user.badge === 'online' ? 'bg-green-500' :
                      user.badge === 'busy' ? 'bg-red-500' : 'bg-neutral-500'
                    }`}
                  />
                )}
              </div>
              <div className="mt-2 text-center">
                <h3 className="text-sm font-medium text-neutral-200">{user.name}</h3>
                <p className="text-xs text-neutral-400">{user.designation}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export const Header = ({ title }: { title: JSX.Element }) => {
  return (
    <div className="max-w-3xl mx-auto text-center">
      {title}
    </div>
  );
};

import { BackgroundGradient } from "@/components/ui/background-gradient";
import { Card } from "@/components/ui/card";
import { IconBrain, IconStars } from '@tabler/icons-react';

const matchedProjects = [
  {
    title: "3D Product Animation",
    description: "Looking for experienced 3D animator with product visualization skills",
    matchScore: 95,
    skills: ["3D Animation", "Product Viz", "Cinema 4D"]
  },
  {
    title: "VFX Compositing",
    description: "Need compositor for high-end commercial project",
    matchScore: 88,
    skills: ["Nuke", "Compositing", "Color Grading"]
  },
  {
    title: "Character Animation",
    description: "Seeking character animator for short film project",
    matchScore: 82,
    skills: ["Character Animation", "Maya", "Motion Capture"]
  }
];

export const AIMatchingSection = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <IconBrain className="w-6 h-6 text-purple-500" />
        <h2 className="text-2xl font-bold">AI Job Matching</h2>
      </div>
      
      <BackgroundGradient className="rounded-[22px] p-1 bg-zinc-900">
        <Card className="p-6 rounded-[20px]">
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {matchedProjects.map((project, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-zinc-800/50 hover:bg-zinc-800/70 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">{project.title}</h3>
                    <div className="flex items-center space-x-1">
                      <IconStars className="w-5 h-5 text-yellow-500" />
                      <span className="text-yellow-500">{project.matchScore}% Match</span>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-400"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </BackgroundGradient>
    </div>
  );
};

export default AIMatchingSection;

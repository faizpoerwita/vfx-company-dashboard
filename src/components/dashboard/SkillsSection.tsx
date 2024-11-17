import { BackgroundGradient } from "@/components/ui/background-gradient";
import { Card } from "@/components/ui/card";
import { IconTrendingUp, IconBook } from '@tabler/icons-react';
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";

const skillsData = [
  {
    title: "Advanced Lighting Techniques",
    description: "Master the art of 3D lighting for photorealistic renders",
    progress: 75,
    type: "In Progress",
    resources: ["Video Tutorial", "Practice Project", "Workshop"]
  },
  {
    title: "Character Rigging Masterclass",
    description: "Learn professional rigging workflows for animation",
    progress: 45,
    type: "Recommended",
    resources: ["Online Course", "Documentation", "Community Forum"]
  },
  {
    title: "Compositing with Nuke",
    description: "Advanced compositing techniques for VFX",
    progress: 90,
    type: "Almost Complete",
    resources: ["Practice Files", "Live Sessions", "Case Studies"]
  }
];

export const SkillsSection = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <IconBook className="w-6 h-6 text-cyan-500" />
        <h2 className="text-2xl font-bold">Skills Development</h2>
      </div>

      <BackgroundGradient className="rounded-[22px] p-1 bg-zinc-900">
        <Card className="p-6 rounded-[20px]">
          <div className="space-y-6">
            {skillsData.map((skill, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-zinc-800/50 hover:bg-zinc-800/70 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">{skill.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    skill.type === 'In Progress' ? 'bg-blue-500/20 text-blue-400' :
                    skill.type === 'Recommended' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {skill.type}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-3">{skill.description}</p>
                
                {/* Progress Bar */}
                <div className="relative w-full h-2 bg-zinc-700 rounded-full mb-4">
                  <div
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                    style={{ width: `${skill.progress}%` }}
                  />
                </div>

                {/* Resources */}
                <div className="flex flex-wrap gap-2">
                  {skill.resources.map((resource, resourceIndex) => (
                    <span
                      key={resourceIndex}
                      className="px-2 py-1 text-xs rounded-full bg-cyan-500/20 text-cyan-400"
                    >
                      {resource}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </BackgroundGradient>
    </div>
  );
};

export default SkillsSection;

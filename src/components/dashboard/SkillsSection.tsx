import { BackgroundGradient } from "@/components/ui/background-gradient";
import { Card } from "@/components/ui/card";
import { Skill } from "@/types/skills";

interface SkillsSectionProps {
  // Add any props you want to pass to the component
}

const skills: Skill[] = [
  {
    id: 1,
    name: "3D Modeling",
    proficiency: 85,
    category: "Technical",
    software: ["Maya", "Blender", "3ds Max"]
  },
  {
    id: 2,
    name: "Compositing",
    proficiency: 90,
    category: "Technical",
    software: ["Nuke", "After Effects"]
  },
  {
    id: 3,
    name: "Texturing",
    proficiency: 75,
    category: "Technical",
    software: ["Substance Painter", "Mari"]
  }
];

export const SkillsSection: React.FC<SkillsSectionProps> = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Skills Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill) => (
          <BackgroundGradient key={skill.id} className="rounded-[22px] p-1 bg-zinc-900">
            <Card className="p-4 rounded-[20px]">
              <div className="space-y-2">
                <h3 className="font-semibold">{skill.name}</h3>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-indigo-600 h-2.5 rounded-full"
                    style={{ width: `${skill.proficiency}%` }}
                  />
                </div>
                <p className="text-sm text-gray-400">{skill.category}</p>
                <div className="flex flex-wrap gap-2">
                  {skill.software.map((sw) => (
                    <span
                      key={sw}
                      className="px-2 py-1 text-xs bg-gray-800 rounded-full"
                    >
                      {sw}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          </BackgroundGradient>
        ))}
      </div>
    </div>
  );
};

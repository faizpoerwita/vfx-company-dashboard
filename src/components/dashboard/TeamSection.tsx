import { BackgroundGradient } from "@/components/ui/background-gradient";
import { Card } from "@/components/ui/card";
import { TeamMember } from "@/types/team";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  department: string;
  avatar: string;
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "VFX Supervisor",
    department: "Visual Effects",
    avatar: "/avatars/alex.jpg"
  },
  {
    id: 2,
    name: "Sarah Chen",
    role: "3D Artist",
    department: "Animation",
    avatar: "/avatars/sarah.jpg"
  },
  {
    id: 3,
    name: "Mike Rodriguez",
    role: "Compositor",
    department: "Compositing",
    avatar: "/avatars/mike.jpg"
  }
];

export const TeamSection: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Team Members</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teamMembers.map((member) => (
          <BackgroundGradient key={member.id} className="rounded-[22px] p-1 bg-zinc-900">
            <Card className="p-4 rounded-[20px]">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img 
                    src={member.avatar} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm text-gray-400">{member.role}</p>
                  <p className="text-xs text-gray-500">{member.department}</p>
                </div>
              </div>
            </Card>
          </BackgroundGradient>
        ))}
      </div>
    </div>
  );
};

export default TeamSection;

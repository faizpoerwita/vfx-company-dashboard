import { BackgroundGradient } from "@/components/ui/background-gradient";
import { Card } from "@/components/ui/card";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'online' | 'offline' | 'busy';
  currentProject: string;
}

const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Budi Santoso",
    role: "Lead VFX Artist",
    avatar: "https://i.pravatar.cc/150?u=1",
    status: 'online',
    currentProject: "Product Animation"
  },
  {
    id: "2",
    name: "Dewi Putri",
    role: "3D Modeler",
    avatar: "https://i.pravatar.cc/150?u=2",
    status: 'busy',
    currentProject: "Architectural Viz"
  },
  {
    id: "3",
    name: "Andi Wijaya",
    role: "Motion Designer",
    avatar: "https://i.pravatar.cc/150?u=3",
    status: 'offline',
    currentProject: "Brand Campaign"
  },
  {
    id: "4",
    name: "Sarah Chen",
    role: "Compositor",
    avatar: "https://i.pravatar.cc/150?u=4",
    status: 'online',
    currentProject: "VFX Short Film"
  }
];

export const TeamSection = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Team Members</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teamMembers.map((member) => (
          <BackgroundGradient key={member.id} className="rounded-[22px] p-1 bg-zinc-900">
            <Card className="p-6 rounded-[20px]">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <AnimatedTooltip
                    items={[{
                      id: member.id,
                      name: member.name,
                      designation: member.role,
                      image: member.avatar
                    }]}
                  />
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-zinc-900">
                    <div
                      className={`w-full h-full rounded-full ${
                        member.status === 'online'
                          ? 'bg-green-500'
                          : member.status === 'busy'
                          ? 'bg-red-500'
                          : 'bg-gray-500'
                      }`}
                    />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm text-gray-400">{member.role}</p>
                  <p className="text-xs text-gray-500 mt-1">Working on: {member.currentProject}</p>
                </div>
              </div>
            </Card>
          </BackgroundGradient>
        ))}
      </div>
    </div>
  );
}

export default TeamSection;

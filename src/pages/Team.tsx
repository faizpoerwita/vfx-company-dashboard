import { useState } from 'react';
import { MovingBorder } from "@/components/ui/moving-border";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { SearchBar } from "@/components/ui/search-bar";
import { SpotlightButton } from "@/components/ui/spotlight-button";
import { StatsCard } from "@/components/ui/stats-card";
import { cn } from "@/utils/cn";
import {
  IconUsers,
  IconUserPlus,
  IconStarFilled,
  IconAward,
  IconBriefcase,
  IconMail,
  IconPhone,
  IconBrandSlack,
  IconCalendar,
  IconChevronRight,
  IconFilter,
} from "@tabler/icons-react";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  specialization: string;
  experience: string;
  skills: string[];
  availability: 'Available' | 'In Project' | 'On Leave';
  avatar?: string;
  email?: string;
  phone?: string;
  slack?: string;
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: 'Alex Johnson',
    role: '3D Artist',
    specialization: 'Character Modeling',
    experience: '5 years',
    skills: ['Maya', 'ZBrush', 'Substance Painter'],
    availability: 'Available',
    email: 'alex.j@vfxcompany.com',
    phone: '+1 (555) 123-4567',
    slack: '@alexj',
  },
  {
    id: 2,
    name: 'Sarah Chen',
    role: 'VFX Compositor',
    specialization: 'Environment Effects',
    experience: '7 years',
    skills: ['Nuke', 'After Effects', 'Houdini'],
    availability: 'In Project',
    email: 'sarah.c@vfxcompany.com',
    phone: '+1 (555) 234-5678',
    slack: '@sarahc',
  },
  {
    id: 3,
    name: 'Mike Rodriguez',
    role: 'Technical Director',
    specialization: 'Pipeline Development',
    experience: '8 years',
    skills: ['Python', 'Pipeline Tools', 'Shotgun'],
    availability: 'In Project',
    email: 'mike.r@vfxcompany.com',
    phone: '+1 (555) 345-6789',
    slack: '@miker',
  },
  {
    id: 4,
    name: 'Emma Wilson',
    role: 'Animator',
    specialization: 'Character Animation',
    experience: '4 years',
    skills: ['Maya', 'MotionBuilder', 'Blender'],
    availability: 'Available',
    email: 'emma.w@vfxcompany.com',
    phone: '+1 (555) 456-7890',
    slack: '@emmaw',
  },
];

const TeamMemberCard = ({ member }: { member: TeamMember }) => {
  const availabilityColors = {
    'Available': 'text-green-500',
    'In Project': 'text-blue-500',
    'On Leave': 'text-yellow-500',
  };

  const generateInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <BackgroundGradient className="rounded-[22px] p-1 bg-black">
      <div className="bg-neutral-950 rounded-[20px] p-6 h-full">
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
            {member.avatar || generateInitials(member.name)}
          </div>
          <div className="flex-grow">
            <h3 className="text-lg font-semibold text-neutral-200">{member.name}</h3>
            <p className="text-sm text-neutral-400">{member.role}</p>
          </div>
          <span className={cn("text-sm font-medium", availabilityColors[member.availability])}>
            {member.availability}
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-neutral-400 mb-2">Specialization</p>
            <p className="text-neutral-200">{member.specialization}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-neutral-400 mb-2">Skills</p>
            <div className="flex flex-wrap gap-2">
              {member.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-1 text-xs rounded-full bg-neutral-900 text-neutral-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <IconMail className="w-4 h-4 text-neutral-500" />
              <span className="text-sm text-neutral-400">{member.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <IconBrandSlack className="w-4 h-4 text-neutral-500" />
              <span className="text-sm text-neutral-400">{member.slack}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
            <div className="flex items-center gap-2">
              <IconCalendar className="w-4 h-4 text-neutral-500" />
              <span className="text-sm text-neutral-400">{member.experience} exp.</span>
            </div>
            <button className="text-neutral-400 hover:text-neutral-200 transition-colors">
              <IconChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </BackgroundGradient>
  );
};

const Team = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [filterAvailability, setFilterAvailability] = useState('All');

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'All' || member.role === filterRole;
    const matchesAvailability = filterAvailability === 'All' || member.availability === filterAvailability;
    return matchesSearch && matchesRole && matchesAvailability;
  });

  const roles = ['All', ...new Set(teamMembers.map(member => member.role))];
  const availabilityOptions = ['All', 'Available', 'In Project', 'On Leave'];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col space-y-4">
        <MovingBorder duration={3000} className="self-start p-[1px]">
          <BackgroundGradient className="rounded-lg p-4 bg-black">
            <h1 className="text-2xl font-bold text-neutral-200">
              Team Management
            </h1>
          </BackgroundGradient>
        </MovingBorder>
        
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <SearchBar 
            onSearch={setSearchTerm}
            className="md:w-96" 
            placeholder="Search by name, role, or specialization..."
          />
          <SpotlightButton
            onClick={() => console.log('Add team member')}
            className="md:ml-auto"
          >
            <IconUserPlus className="h-4 w-4 mr-2" />
            Add Team Member
          </SpotlightButton>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Members"
          value={48}
          icon={<IconUsers className="h-5 w-5 text-neutral-500" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Available"
          value={15}
          icon={<IconUserPlus className="h-5 w-5 text-neutral-500" />}
          trend={{ value: 3, isPositive: true }}
        />
        <StatsCard
          title="Active Projects"
          value={24}
          icon={<IconBriefcase className="h-5 w-5 text-neutral-500" />}
          description="Across all teams"
        />
        <StatsCard
          title="Performance"
          value="96%"
          icon={<IconAward className="h-5 w-5 text-neutral-500" />}
          trend={{ value: 3, isPositive: true }}
        />
      </div>

      {/* Filters */}
      <BackgroundGradient className="rounded-xl p-1 bg-black">
        <div className="bg-neutral-950 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-neutral-400 mb-2">Role</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {roles.map((role) => (
                  <button
                    key={role}
                    onClick={() => setFilterRole(role)}
                    className={cn(
                      "p-2 rounded-lg text-sm font-medium transition-all",
                      "hover:scale-105 hover:bg-neutral-800/50",
                      filterRole === role
                        ? "bg-neutral-200 text-black shadow-lg"
                        : "text-neutral-400 hover:text-neutral-200"
                    )}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-neutral-400 mb-2">Availability</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {availabilityOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => setFilterAvailability(option)}
                    className={cn(
                      "p-2 rounded-lg text-sm font-medium transition-all",
                      "hover:scale-105 hover:bg-neutral-800/50",
                      filterAvailability === option
                        ? "bg-neutral-200 text-black shadow-lg"
                        : "text-neutral-400 hover:text-neutral-200"
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </BackgroundGradient>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredMembers.map((member) => (
          <TeamMemberCard key={member.id} member={member} />
        ))}
      </div>

      {/* Empty State */}
      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <IconUsers className="w-12 h-12 text-neutral-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-200 mb-2">No team members found</h3>
          <p className="text-neutral-400">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Department Overview */}
      <BackgroundGradient className="rounded-2xl bg-black p-6">
        <h2 className="text-xl font-semibold text-neutral-200 mb-4">Department Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "VFX Artists", count: 18 },
            { name: "Animators", count: 12 },
            { name: "Technical", count: 8 },
            { name: "Production", count: 10 },
          ].map((dept) => (
            <div key={dept.name} className="p-4 rounded-lg bg-neutral-900/50">
              <p className="text-sm text-neutral-400">{dept.name}</p>
              <p className="text-2xl font-bold text-neutral-200">{dept.count}</p>
            </div>
          ))}
        </div>
      </BackgroundGradient>
    </div>
  );
};

export default Team;

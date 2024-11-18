import { BackgroundGradient } from "@/components/ui/background-gradient";
import { Card } from "@/components/ui/card";
import { IconMessageCircle2, IconThumbUp, IconClock } from '@tabler/icons-react';

interface FeedbackItem {
  project: string;
  feedback: string;
  reviewer: string;
  role: string;
  date: string;
  rating: number;
}

const feedbackData: FeedbackItem[] = [
  {
    project: "Product Animation Campaign",
    feedback: "Excellent attention to detail in lighting and texturing",
    reviewer: "Sarah Chen",
    role: "Art Director",
    date: "2 days ago",
    rating: 5
  },
  {
    project: "Character Animation Series",
    feedback: "Great improvement in character movement fluidity",
    reviewer: "Mike Rodriguez",
    role: "Animation Lead",
    date: "1 week ago",
    rating: 4
  },
  {
    project: "VFX Integration",
    feedback: "Clean compositing work, seamless integration",
    reviewer: "David Kim",
    role: "VFX Supervisor",
    date: "2 weeks ago",
    rating: 5
  }
];

export const FeedbackSection = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <IconMessageCircle2 className="w-6 h-6 text-green-500" />
        <h2 className="text-2xl font-bold">Recent Feedback</h2>
      </div>

      <BackgroundGradient className="rounded-[22px] p-1 bg-zinc-900">
        <Card className="p-6 rounded-[20px]">
          <div className="space-y-6">
            {feedbackData.map((feedback, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-zinc-800/50 hover:bg-zinc-800/70 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">{feedback.project}</h3>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: feedback.rating }).map((_, i) => (
                      <IconThumbUp
                        key={i}
                        className="w-4 h-4 text-green-500"
                      />
                    ))}
                  </div>
                </div>
                
                <p className="text-gray-400 text-sm mb-3">"{feedback.feedback}"</p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                      {feedback.reviewer.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{feedback.reviewer}</p>
                      <p className="text-gray-500">{feedback.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-500">
                    <IconClock className="w-4 h-4 mr-1" />
                    {feedback.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </BackgroundGradient>
    </div>
  );
};

export default FeedbackSection;

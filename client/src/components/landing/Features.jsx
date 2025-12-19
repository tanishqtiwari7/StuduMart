import { Shield, MessageCircle, Calendar } from "lucide-react";
import { Card, CardContent } from "../ui/card";

const features = [
  {
    icon: <Shield className="h-8 w-8 text-[#0a0a38]" />,
    title: "Verified Students Only",
    description:
      "Only students with verified .edu emails can join. No scammers. No strangers. Just your campus community.",
  },
  {
    icon: <MessageCircle className="h-8 w-8 text-[#0a0a38]" />,
    title: "Easy & Safe Transactions",
    description:
      "List in 30 seconds. Message sellers instantly. Meet on campus safely with in-app chat and seller ratings.",
  },
  {
    icon: <Calendar className="h-8 w-8 text-[#0a0a38]" />,
    title: "Never Miss Campus Events",
    description:
      "Hackathons, club meetings, parties, and study groups—all in one place. RSVP and sync with your calendar.",
  },
];

const Features = () => {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

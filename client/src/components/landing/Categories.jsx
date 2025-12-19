import { Link } from "react-router-dom";
import { BookOpen, Laptop, Armchair, Ticket } from "lucide-react";
import { Card, CardContent } from "../ui/card";

const categories = [
  { id: "textbooks", name: "Textbooks", icon: BookOpen },
  { id: "electronics", name: "Electronics", icon: Laptop },
  { id: "furniture", name: "Furniture", icon: Armchair },
  { id: "tickets", name: "Tickets", icon: Ticket },
];

const Categories = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">
          Popular Categories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/marketplace?category=${cat.id}`}
              className="group"
            >
              <Card className="h-full border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200 hover:shadow-md transition-all duration-300">
                <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full">
                  <cat.icon className="h-10 w-10 text-[#0a0a38] mb-4 group-hover:scale-110 group-hover:text-[#0a0a38] transition-all duration-300" />
                  <span className="font-semibold text-lg text-slate-900 group-hover:text-[#0a0a38] transition-colors">
                    {cat.name}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;

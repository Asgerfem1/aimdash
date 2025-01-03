import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CategoryProgress } from "./CategoryProgress";
import { ConsistencyChart } from "./ConsistencyChart";
import { OverallProgress } from "./OverallProgress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export function AnalyticsPage() {
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const { data: goals } = useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filteredGoals = goals?.filter(goal => {
    if (priorityFilter !== "all" && goal.priority !== priorityFilter) return false;
    if (categoryFilter !== "all" && goal.category !== categoryFilter) return false;
    return true;
  }) || [];

  const categories = [...new Set(goals?.map(goal => goal.category) || [])];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Track your progress and stay motivated</p>
      </div>

      <div className="flex flex-wrap gap-4">
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="High">High Priority</SelectItem>
            <SelectItem value="Medium">Medium Priority</SelectItem>
            <SelectItem value="Low">Low Priority</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6">
        <OverallProgress goals={filteredGoals} />
        <CategoryProgress goals={filteredGoals} />
        <ConsistencyChart goals={filteredGoals} />
      </div>
    </div>
  );
}

'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { ContentItem } from '@/lib/types';
import { useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';

interface MonthlyActivityChartProps {
  watchedHistory: ContentItem[];
}

const chartConfig = {
  count: {
    label: 'Watched',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function MonthlyActivityChart({
  watchedHistory,
}: MonthlyActivityChartProps) {
  const chartData = useMemo(() => {
    if (!watchedHistory || watchedHistory.length === 0) {
      return [];
    }

    // Initialize counts for the last 12 months
    const now = new Date();
    const monthlyCounts: { [key: string]: { month: string, count: number } } = {};
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = format(d, 'yyyy-MM');
      monthlyCounts[monthKey] = { month: format(d, 'MMM'), count: 0 };
    }

    watchedHistory.forEach(item => {
      if ((item as any).watchedDate) {
        try {
          const watchedDate = parseISO((item as any).watchedDate);
          const monthKey = format(watchedDate, 'yyyy-MM');
          if (monthlyCounts[monthKey]) {
            monthlyCounts[monthKey].count++;
          }
        } catch (e) {
          // Ignore items with invalid dates
        }
      }
    });

    return Object.values(monthlyCounts);
  }, [watchedHistory]);
  
  const totalWatched = useMemo(() => chartData.reduce((acc, c) => acc + c.count, 0), [chartData]);


  if (chartData.length === 0 || totalWatched === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Activity</CardTitle>
          <CardDescription>Last 12 months</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-48">
          <p className="text-sm text-muted-foreground text-center">
            Watch some content to see your monthly activity.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, amount: 0.3 }}
    >
        <Card>
          <CardHeader>
            <CardTitle>Monthly Activity</CardTitle>
            <CardDescription>Last 12 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-52 w-full">
              <ResponsiveContainer>
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                      <linearGradient id="fillGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1}/>
                      </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/50"/>
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    fontSize={12}
                  />
                  <Tooltip
                    cursor={false}
                    content={<ChartTooltipContent 
                        indicator="dot"
                        labelClassName="font-bold text-foreground"
                        className="bg-background/80 backdrop-blur-sm" 
                        hideLabel
                    />}
                  />
                  <Bar dataKey="count" fill="url(#fillGradient)" radius={4} isAnimationActive/>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
    </motion.div>
  );
}
